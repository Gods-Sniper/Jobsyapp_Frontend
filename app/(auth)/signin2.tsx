import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { setItem } from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

// Define the file type interface
interface FileType {
  name: string;
  uri: string;
  size: number;
  type: string;
}

type FileField = "nationalId" | "cv" | "judiciary";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SignIn2 = () => {
  const [files, setFiles] = useState<Record<FileField, FileType | null>>({
    nationalId: null,
    cv: null,
    judiciary: null,
  });

  const local = useLocalSearchParams();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<FileType | null>(null);

  type ErrorsType = Partial<Record<FileField, string>>;
  const [errors, setErrors] = useState<ErrorsType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const allowedFileTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const maxFileSize = 5 * 1024 * 1024;

  const requestMediaPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need media library permissions to make this work!"
        );
        return false;
      }
    }
    return true;
  };

  const openPreview = (file: FileType) => {
    setCurrentPreview(file);
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
    setCurrentPreview(null);
  };

  const pickFile = async (fileType: FileField) => {
    try {
     
      Alert.alert(
        "Select File Type",
        "Choose how you want to select your file",
        [
          {
            text: "Choose from Gallery",
            onPress: () => pickImage(fileType),
          },
          {
            text: "Browse Files",
            onPress: () => pickDocument(fileType),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to select file");
    }
  };

  const pickDocument = async (fileType: FileField) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedFileTypes,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleFileSelection(
          {
            name: result.assets[0].name,
            uri: result.assets[0].uri,
            mimeType: result.assets[0].mimeType,
            size: result.assets[0].size,
          },
          fileType
        );
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select document");
    }
  };

  const pickImage = async (fileType: FileField) => {
    try {
      const hasPermission = await requestMediaPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileResult = {
          type: "success" as const,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          uri: asset.uri,
          mimeType: asset.type || "image/jpeg",
          size: asset.fileSize || 0,
        };
        handleFileSelection(fileResult, fileType);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const handleFileSelection = (result: any, fileType: FileField) => {
    const { name, uri, mimeType, size } = result;

    if (size > maxFileSize) {
      Alert.alert("File too large", "Please select a file smaller than 5MB");
      return;
    }

    const fileData: FileType = {
      name,
      uri,
      size,
      type: mimeType,
    };

    setFiles((prev) => ({
      ...prev,
      [fileType]: fileData,
    }));

    // Clear any previous error for this field
    if (errors[fileType]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fileType];
        return newErrors;
      });
    }

    Alert.alert("Success", `${name} uploaded successfully!`);
  };

  const validateForm = () => {
    const newErrors: ErrorsType = {};

    if (!files.nationalId) {
      newErrors.nationalId = "National ID is required";
    }

    if (!files.cv) {
      newErrors.cv = "CV is required";
    }

    if (!files.judiciary) {
      newErrors.judiciary = "Judiciary document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setIsloading(true);
    if (validateForm()) {
    } else {
      Alert.alert("Validation Error", "Please upload all required documents");
    }
    const formData = new FormData();

    formData.append(
      "name",
      Array.isArray(local.name) ? local.name[0] : local.name ?? ""
    );
    formData.append(
      "phone",
      Array.isArray(local.phone) ? local.phone[0] : local.phone ?? ""
    );
    formData.append(
      "email",
      Array.isArray(local.email) ? local.email[0] : local.email ?? ""
    );
    formData.append(
      "password",
      Array.isArray(local.password) ? local.password[0] : local.password ?? ""
    );
    formData.append(
      "role",
      Array.isArray(local.role) ? local.role[0] : local.role ?? ""
    );

    if (files.nationalId) {
      formData.append("nationalId", {
        uri: files.nationalId.uri,
        name: files.nationalId.name,
        type: files.nationalId.type,
      } as any);
    }
    if (files.cv) {
      formData.append("cv", {
        uri: files.cv.uri,
        name: files.cv.name,
        type: files.cv.type,
      } as any);
    }

    if (files.judiciary) {
      formData.append("judiciary", {
        uri: files.judiciary.uri,
        name: files.judiciary.name,
        type: files.judiciary.type,
      } as any);
    }

    let body = formData;
    console.log("body", body);
    fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: body,
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("response data:", data);
        const { status, message } = data;

        if (status === "error") {
          Alert.alert("Ouups: ", message);
        } else {
          if (status === "success") {
            Alert.alert("Great !!: ", message);
            setFiles({ nationalId: null, cv: null, judiciary: null });
            if (data.token) {
              await AsyncStorage.setItem("token", data.token);
            } else {
              await AsyncStorage.removeItem("token");
            }
            if (data.user) {
              await AsyncStorage.setItem("user", JSON.stringify(data.user));
            }
            setTimeout(() => {
              router.push("/login");
            }, 1000);
          }
        }
      })

      .catch((error) => console.error("Error:", error))
      .finally(() => setIsloading(false));
  };

  const removeFile = (fileType: FileField) => {
    setFiles((prev) => ({
      ...prev,
      [fileType]: null,
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 bytes";
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return "insert-drive-file";
    if (mimeType.includes("pdf")) return "picture-as-pdf";
    if (mimeType.includes("image")) return "image";
    if (mimeType.includes("word")) return "description";
    return "insert-drive-file";
  };

  const isImageFile = (file: FileType | null) => {
    return file?.type?.includes("image");
  };

  const renderFilePreview = (file: FileType | null) => {
    if (!file) return null;

    if (isImageFile(file)) {
      return (
        <TouchableOpacity onPress={() => openPreview(file)}>
          <Image
            source={{ uri: file.uri }}
            style={styles.filePreviewImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => openPreview(file)}
          style={styles.filePreviewDocument}
        >
          <MaterialIcons
            name={getFileIcon(file.type)}
            size={40}
            color="#40189D"
          />
          <Text style={styles.filePreviewText} numberOfLines={1}>
            {file.name}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <Image
            source={require("../../assets/images/logo4.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Upload Necessary files</Text>
          <Text style={styles.subtitle}>
            National Identity card,{"\n"}
            Curriculum vitae, Judiciary....
          </Text>

          {/* National ID Upload */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>National ID Card*</Text>
            {files.nationalId ? (
              <View style={styles.fileContainer}>
                <View style={styles.fileInfo}>
                  {renderFilePreview(files.nationalId)}
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {files.nationalId.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {formatFileSize(files.nationalId.size)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFile("nationalId")}>
                  <MaterialIcons name="close" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.uploadBox,
                  errors.nationalId && styles.uploadBoxError,
                ]}
                onPress={() => pickFile("nationalId")}
              >
                <Text style={styles.uploadText}>+ Upload National ID</Text>
                <MaterialIcons name="file-upload" size={28} color="#40189D" />
              </TouchableOpacity>
            )}
            {errors.nationalId && (
              <Text style={styles.errorText}>{errors.nationalId}</Text>
            )}
          </View>

          {/* CV Upload */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>Curriculum Vitae*</Text>
            {files.cv ? (
              <View style={styles.fileContainer}>
                <View style={styles.fileInfo}>
                  {renderFilePreview(files.cv)}
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {files.cv.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {formatFileSize(files.cv.size)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFile("cv")}>
                  <MaterialIcons name="close" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.uploadBox, errors.cv && styles.uploadBoxError]}
                onPress={() => pickFile("cv")}
              >
                <Text style={styles.uploadText}>+ Upload CV</Text>
                <MaterialIcons name="file-upload" size={28} color="#40189D" />
              </TouchableOpacity>
            )}
            {errors.cv && <Text style={styles.errorText}>{errors.cv}</Text>}
          </View>

          {/* Judiciary Upload */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>Judiciary Document*</Text>
            {files.judiciary ? (
              <View style={styles.fileContainer}>
                <View style={styles.fileInfo}>
                  {renderFilePreview(files.judiciary)}
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {files.judiciary.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {formatFileSize(files.judiciary.size)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFile("judiciary")}>
                  <MaterialIcons name="close" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.uploadBox,
                  errors.judiciary && styles.uploadBoxError,
                ]}
                onPress={() => pickFile("judiciary")}
              >
                <Text style={styles.uploadText}>
                  + Upload Judiciary Document
                </Text>
                <MaterialIcons name="file-upload" size={28} color="#40189D" />
              </TouchableOpacity>
            )}
            {errors.judiciary && (
              <Text style={styles.errorText}>{errors.judiciary}</Text>
            )}
          </View>

          <Text style={styles.allowedFilesText}>
            Allowed file types: PDF, JPG, PNG, DOC, DOCX (Max 5MB each)
          </Text>

          <TouchableOpacity
            style={[
              styles.signupButton,
              isloading && styles.signupButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isloading}
          >
            <Text style={styles.signupButtonText}>
              {isloading ? "Signing up..." : "SIGN UP"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By tapping "Sign Up" you accept our{" "}
            <Text style={styles.termsLink}>terms</Text> and{" "}
            <Text style={styles.termsLink}>condition</Text>
          </Text>

          {/* <View style={styles.bottomLogoSection}>
            <Image
              source={require("../../assets/images/logo2.png")}
              style={styles.bottomLogo}
            />
          </View> */}
        </View>
      </View>

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closePreview}>
              <MaterialIcons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            {currentPreview && (
              <>
                {isImageFile(currentPreview) ? (
                  <Image
                    source={{ uri: currentPreview.uri }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.documentPreview}>
                    <MaterialIcons
                      name={getFileIcon(currentPreview.type)}
                      size={80}
                      color="#40189D"
                    />
                    <Text style={styles.documentName} numberOfLines={2}>
                      {currentPreview.name}
                    </Text>
                    <Text style={styles.documentSize}>
                      {formatFileSize(currentPreview.size)}
                    </Text>
                    <Text style={styles.documentType}>
                      {currentPreview.type}
                    </Text>
                  </View>
                )}
                <Text style={styles.previewFileName} numberOfLines={2}>
                  {currentPreview.name}
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F3FF",
    alignItems: "center",
    paddingTop: 20,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 90,
    height: 90,
  },
  formSection: {
    width: "100%",
    backgroundColor: "#F7F3FF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 32,
    paddingTop: 24,
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#505050",
    marginBottom: 24,
    textAlign: "center",
  },
  uploadSection: {
    width: "100%",
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#40189D",
    marginBottom: 8,
    marginLeft: 4,
  },
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#CFCFCF",
    paddingHorizontal: 18,
    paddingVertical: 16,
    width: "100%",
  },
  uploadBoxError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  uploadText: {
    color: "#CFCFCF",
    fontSize: 16,
    fontWeight: "bold",
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0EBFF",
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#40189D",
  },
  fileSize: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  filePreviewImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  filePreviewDocument: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#e8f4f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  filePreviewText: {
    fontSize: 8,
    color: "#40189D",
    textAlign: "center",
    marginTop: 2,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  allowedFilesText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 16,
    textAlign: "center",
    width: "100%",
  },
  signupButton: {
    backgroundColor: "#40189D",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 18,
    marginTop: 6,
    width: "100%",
  },
  signupButtonDisabled: {
    backgroundColor: "#A28DCE",
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  termsText: {
    color: "#505050",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },
  termsLink: {
    color: "#40189D",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  bottomLogoSection: {
    alignItems: "center",
    marginTop: 18,
    marginBottom: 10,
  },
  bottomLogo: {
    width: 150,
    height: 50,
  },
  // Preview Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  previewImage: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.6,
    borderRadius: 12,
  },
  documentPreview: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#F0EBFF",
    borderRadius: 12,
    marginVertical: 20,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#40189D",
    textAlign: "center",
    marginTop: 10,
    maxWidth: 250,
  },
  documentSize: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  documentType: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
    fontStyle: "italic",
  },
  previewFileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginTop: 15,
    maxWidth: "100%",
  },
});

export default SignIn2;
