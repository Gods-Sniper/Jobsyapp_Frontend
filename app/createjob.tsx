import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ToastManager, { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateJob() {
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryItems, setCategoryItems] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [durationOpen, setDurationOpen] = useState(false);
  const [duration, setDuration] = useState("1 Hour");
  const [durationItems, setDurationItems] = useState([
    { label: "1 Hour", value: "1 Hour" },
    { label: "2 Hours", value: "2 Hours" },
    { label: "4 Hours", value: "4 Hours" },
    { label: "1 day", value: "1 day" },
    { label: "2 days", value: "2 days" },
    { label: "1 week", value: "1 week" },
    { label: "1 month", value: "1 month" },
    { label: "3 month", value: "3 month" },
  ]);

  const [title, setTitle] = useState("Building");
  const [location, setLocation] = useState("Yaounde, Cameroon");
  const [salary, setSalary] = useState("5000");
  const [description, setDescription] = useState("Here i am providing my services ...");
  const [jobTypeOpen, setJobTypeOpen] = useState(false);
  const [jobType, setJobType] = useState("Part-time");
  const [jobTypeItems, setJobTypeItems] = useState([
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Freelance", value: "Freelance" },
    { label: "Instant", value: "Instant" },
  ]);

  type Errors = {
    title?: string;
    category?: string;
    location?: string;
    salary?: string;
    duration?: string;
    jobType?: string;
    description?: string;
  };
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState("");

  // Load logged user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        console.log(storedUser, "stored user");

        if (storedUser) setLoggedUser(JSON.parse(storedUser));
      } catch (err) {
        console.log("Failed to load user:", err);
      }
    };
    loadUser();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch(
          "http://192.168.100.150:4000/api/category/"
        );
        const data = await response.json();
        const items = data.data.map((cat: any) => ({
          label: cat.name,
          value: cat.name,
          _id: cat._id,
        }));
        setCategoryItems(items);
      } catch (err) {
        console.log(err);
        Toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Dropdown handlers
  const onCategoryOpen = () => {
    setDurationOpen(false);
    setJobTypeOpen(false);
  };
  const onDurationOpen = () => {
    setCategoryOpen(false);
    setJobTypeOpen(false);
  };
  const onJobTypeOpen = () => {
    setCategoryOpen(false);
    setDurationOpen(false);
  };

  const clearError = (field: keyof Errors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!category.trim()) newErrors.category = "Category is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!salary.trim()) newErrors.salary = "Salary is required";
    if (!duration.trim()) newErrors.duration = "Duration is required";
    if (!jobType.trim()) newErrors.jobType = "Job type is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createJob = async () => {
    console.log(loggedUser, "logged user");
    if (!loggedUser?._id) {
      Toast.error("User not logged in.");
      return;
    }

    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill all fields correctly.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    const selectedCategoryId = categoryItems.find(
      (i) => i.value === category
    )?._id;

    try {
      const body = {
        title,
        category: selectedCategoryId,
        location,
        salary,
        duration,
        jobType,
        description
      };

      const response = await fetch("http://192.168.100.150:4000/api/jobs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const res = await response.json();
      if (res.status === "success") {
        Toast.success("Job created successfully!");
        // Reset form
        setTitle("");
        setLocation("");
        setCategory("");
        setSalary("");
        setDuration("");
        setJobType("");
        setDescription("");
        setErrors({});
      } else {
        Toast.error(res.message || "Failed to create job. Please try again.");
      }
    } catch (err: any) {
      Toast.error(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8F4FF" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.title}>Create New Job</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#000000ff"
            onFocus={() => clearError("title")}
          />
          {errors.title && <Text style={styles.error}>{errors.title}</Text>}

          <View style={{ zIndex: 2000 }}>
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
              onOpen={onCategoryOpen}
              listMode="SCROLLVIEW"
              zIndex={2000}
              zIndexInverse={1000}
              disabled={loadingCategories}
            />
          </View>
          {errors.category && (
            <Text style={styles.error}>{errors.category}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#000000ff"
            onFocus={() => clearError("location")}
          />
          {errors.location && (
            <Text style={styles.error}>{errors.location}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Salary"
            value={salary}
            onChangeText={setSalary}
            keyboardType="numeric"
            placeholderTextColor="#000000ff"
            onFocus={() => clearError("salary")}
          />
          {errors.salary && <Text style={styles.error}>{errors.salary}</Text>}

          <View style={{ zIndex: 1000 }}>
            <DropDownPicker
              open={durationOpen}
              value={duration}
              items={durationItems}
              setOpen={setDurationOpen}
              setValue={setDuration}
              setItems={setDurationItems}
              placeholder="Duration"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onOpen={onDurationOpen}
              listMode="SCROLLVIEW"
              zIndex={1000}
              zIndexInverse={2000}
            />
          </View>
          {errors.duration && (
            <Text style={styles.error}>{errors.duration}</Text>
          )}

          <View style={{ zIndex: 500 }}>
            <DropDownPicker
              open={jobTypeOpen}
              value={jobType}
              items={jobTypeItems}
              setOpen={setJobTypeOpen}
              setValue={setJobType}
              setItems={setJobTypeItems}
              placeholder="Job Type"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onOpen={onJobTypeOpen}
              listMode="SCROLLVIEW"
              zIndex={500}
              zIndexInverse={5000}
            />
          </View>
          {errors.jobType && <Text style={styles.error}>{errors.jobType}</Text>}

          <Text style={styles.descLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.descInput]}
            placeholder="Give a brief description about the job services you are providing"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            placeholderTextColor="#BDBDBD"
            onFocus={() => clearError("description")}
          />
          {errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}
          {error !== "" && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.createBtn} onPress={createJob}>
            <Text style={styles.createBtnText}>Create</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F4FF" },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#40189D",
    marginTop: 18,
    marginBottom: 18,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 14,
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    color: "#000000ff",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 0,
    width: "90%",
    minHeight: 56,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginHorizontal: 20,
    borderWidth: 0,
    elevation: 3,
  },
  descLabel: {
    marginLeft: 28,
    color: "#000000ff",
    marginBottom: 8,
    fontSize: 16,
  },
  descInput: {
    minHeight: 20,
    textAlignVertical: "top",
  },
  createBtn: {
    backgroundColor: "#40189D",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginHorizontal: 60,
    marginTop: 18,
    marginBottom: 30,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginLeft: 20,
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
});
