import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import { API_BASE_URL } from "./config";

export default function UpdateJob() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // Dropdowns
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryItems, setCategoryItems] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [durationOpen, setDurationOpen] = useState(false);
  const [duration, setDuration] = useState("");
  const durationItems = [
    { label: "1 Hour", value: "1 Hour" },
    { label: "2 Hours", value: "2 Hours" },
    { label: "4 Hours", value: "4 Hours" },
    { label: "1 day", value: "1 day" },
    { label: "2 days", value: "2 days" },
    { label: "1 week", value: "1 week" },
    { label: "1 month", value: "1 month" },
    { label: "3 months", value: "3 months" },
  ];

  const [jobTypeOpen, setJobTypeOpen] = useState(false);
  const [jobType, setJobType] = useState("");
  const jobTypeItems = [
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Instant", value: "Instant" },
  ];

  // Form fields
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState(""); // Location as string

  // Errors
  const [errors, setErrors] = useState<any>({});

  // Load logged user
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        // Optional: store logged user if needed
      }
    };
    loadUser();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch(`${API_BASE_URL}/category/`);
        const data = await res.json();
        const items = data.data.map((cat: any) => ({
          label: cat.name,
          value: cat._id,
        }));
        setCategoryItems(items);
      } catch {
        Toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const job = data.job || data;

        setTitle(job.title || "");
        setDescription(job.description || "");
        setSalary(job.salary ? String(job.salary) : "");
        setDuration(job.duration || "");
        setJobType(job.jobType || "");
        setCategory(job.category?._id || job.category || "");
        setAddress(typeof job.address === "string" ? job.address : ""); // always string
      } catch {
        Alert.alert("Error", "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const clearError = (field: string) =>
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));

  const validateForm = () => {
    const newErrors: any = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!category) newErrors.category = "Category is required";
    if (!salary.trim()) newErrors.salary = "Salary is required";
    if (!duration.trim()) newErrors.duration = "Duration is required";
    if (!jobType.trim()) newErrors.jobType = "Job type is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!address.trim()) newErrors.address = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm())
      return Alert.alert(
        "Validation Error",
        "Please fill all fields correctly."
      );

    const token = await AsyncStorage.getItem("token");

    const body = {
      title,
      category,
      salary: Number(salary),
      duration,
      jobType,
      description,
      address, // always string
    };

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        Toast.success("Job updated successfully!");
        router.push("/my-jobs");
      } else {
        console.log("UPDATE RESPONSE:", data);
        Toast.error(data.message || "Failed to update job.");
      }
    } catch {
      Toast.error("Failed to update job.");
    }
  };

  if (loading)
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#40189D" />
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8F4FF" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Update Job</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          onFocus={() => clearError("title")}
        />
        {errors.title && <Text style={styles.error}>{errors.title}</Text>}

        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={categoryOpen}
            value={category}
            items={categoryItems}
            setOpen={setCategoryOpen}
            setValue={setCategory}
            setItems={setCategoryItems}
            placeholder={loadingCategories ? "Loading..." : "Category"}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            onOpen={() => {
              setDurationOpen(false);
              setJobTypeOpen(false);
            }}
            zIndex={3000}
          />
          {errors.category && (
            <Text style={styles.error}>{errors.category}</Text>
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={address}
          onChangeText={(text) => {
            setAddress(text);
            clearError("location");
          }}
        />
        {errors.location && <Text style={styles.error}>{errors.location}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Salary"
          value={salary}
          onChangeText={setSalary}
          keyboardType="numeric"
          onFocus={() => clearError("salary")}
        />
        {errors.salary && <Text style={styles.error}>{errors.salary}</Text>}

        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={durationOpen}
            value={duration}
            items={durationItems}
            setOpen={setDurationOpen}
            setValue={setDuration}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            onOpen={() => {
              setCategoryOpen(false);
              setJobTypeOpen(false);
            }}
            zIndex={2000}
          />
          {errors.duration && (
            <Text style={styles.error}>{errors.duration}</Text>
          )}
        </View>

        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={jobTypeOpen}
            value={jobType}
            items={jobTypeItems}
            setOpen={setJobTypeOpen}
            setValue={setJobType}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            onOpen={() => {
              setCategoryOpen(false);
              setDurationOpen(false);
            }}
            zIndex={1000}
          />
          {errors.jobType && <Text style={styles.error}>{errors.jobType}</Text>}
        </View>

        <TextInput
          style={[styles.input, styles.descInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          onFocus={() => clearError("description")}
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description}</Text>
        )}

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Text style={styles.updateBtnText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#F8F4FF", paddingVertical: 20 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#40189D",
    marginBottom: 18,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    color: "#181818",
    borderWidth: 1,
    borderColor: "#E6E6FA",
  },
  dropdownWrapper: { marginHorizontal: 20, marginBottom: 12, zIndex: 100 },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E6FA",
    paddingHorizontal: 16,
    minHeight: 54,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E6FA",
    marginTop: 2,
    zIndex: 1000,
  },
  descInput: { minHeight: 100, textAlignVertical: "top" },
  updateBtn: {
    backgroundColor: "#40189D",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginHorizontal: 60,
    marginTop: 18,
    marginBottom: 30,
  },
  updateBtnText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  error: { color: "red", fontSize: 14, marginLeft: 20, marginBottom: 8 },
});
