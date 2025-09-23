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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "./config";

export default function CreateJob() {
  const router = useRouter();
  const [loggedUser, setLoggedUser] = useState<any>(null);

  // Dropdown states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryItems, setCategoryItems] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [durationOpen, setDurationOpen] = useState(false);
  const [duration, setDuration] = useState("1 week");
  const [durationItems] = useState([
    { label: "1 Hour", value: "1 Hour" },
    { label: "2 Hours", value: "2 Hours" },
    { label: "4 Hours", value: "4 Hours" },
    { label: "1 day", value: "1 day" },
    { label: "2 days", value: "2 days" },
    { label: "1 week", value: "1 week" },
    { label: "1 month", value: "1 month" },
    { label: "3 months", value: "3 months" },
  ]);

  const [jobTypeOpen, setJobTypeOpen] = useState(false);
  const [jobType, setJobType] = useState("Full-time");
  const [jobTypeItems] = useState([
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Instant", value: "Instant" },
  ]);

  // Form fields
  const [title, setTitle] = useState("Graphic Designer");
  const [salary, setSalary] = useState("50000");
  const [description, setDescription] = useState(
    "We are looking for a grapgic designer to build design website using for a small e-commerce shop"
  );
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState<any>({});

  // Location state
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load logged user
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setLoggedUser(JSON.parse(storedUser));
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
      } catch (err) {
        Toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch location suggestions
  const OPENCAGE_API_KEY = "6164b77487fe4cb0bf7eb4345e3b7ba0";
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!locationQuery.trim()) {
        setLocationSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            locationQuery
          )}&key=${OPENCAGE_API_KEY}&limit=5`
        );
        const data = await res.json();
        const suggestions = data.results.map((item: any) => item.formatted);
        setLocationSuggestions(suggestions);
      } catch {
        setLocationSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [locationQuery]);

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

  const clearError = (field: string) => {
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!category) newErrors.category = "Category is required";
    if (!salary.trim()) newErrors.salary = "Salary is required";
    if (!duration.trim()) newErrors.duration = "Duration is required";
    if (!jobType.trim()) newErrors.jobType = "Job type is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createJob = async () => {
    if (!loggedUser?._id) return Toast.error("User not logged in.");
    if (!validateForm())
      return Alert.alert(
        "Validation Error",
        "Please fill all fields correctly."
      );

    const token = await AsyncStorage.getItem("token");

    const body: any = {
      title,
      category,
      salary,
      duration,
      jobType,
      description,
      address: address || locationQuery,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.status === "success") {
        Toast.success("Job created successfully!");
        setTitle("");
        setAddress("");
        setCategory("");
        setSalary("");
        setDuration("");
        setJobType("");
        setDescription("");
        setErrors({});
        router.push("/(tabs)/my-jobs");
      } else {
        console.log(data, "----");

        Toast.error(data.message || "Failed to create job");
      }
    } catch (err: any) {
      Toast.error(err.message || "An error occurred");
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

          {/* Title */}
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            onFocus={() => clearError("title")}
          />
          {errors.title && <Text style={styles.error}>{errors.title}</Text>}

          {/* Category */}
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
              onOpen={onCategoryOpen}
              listMode="SCROLLVIEW"
              zIndex={3000}
            />
            {errors.category && (
              <Text style={styles.error}>{errors.category}</Text>
            )}
          </View>

          {/* Location input */}
          <View style={{ marginHorizontal: 20, marginBottom: 12 }}>
            <TextInput
              style={styles.input}
              placeholder="address"
              value={locationQuery}
              onChangeText={(text) => {
                setLocationQuery(text);
                setShowSuggestions(true);
                clearError("address");
              }}
              
            />
            {showSuggestions && locationSuggestions.length > 0 && (
              <View style={styles.suggestionBox}>
                {locationSuggestions.map((suggestion, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setLocationQuery(suggestion);
                      setAddress(suggestion);
                      setShowSuggestions(false);
                    }}
                    style={styles.suggestionItem}
                  >
                    <Text>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {errors.address && (
              <Text style={styles.error}>{errors.address}</Text>
            )}
          </View>

          {/* Salary */}
          <TextInput
            style={styles.input}
            placeholder="Salary"
            value={salary}
            onChangeText={setSalary}
            keyboardType="numeric"
            onFocus={() => clearError("salary")}
          />
          {errors.salary && <Text style={styles.error}>{errors.salary}</Text>}

          {/* Duration */}
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={durationOpen}
              value={duration}
              items={durationItems}
              setOpen={setDurationOpen}
              setValue={setDuration}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onOpen={onDurationOpen}
              listMode="SCROLLVIEW"
              zIndex={1000}
            />
            {errors.duration && (
              <Text style={styles.error}>{errors.duration}</Text>
            )}
          </View>

          {/* Job Type */}
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={jobTypeOpen}
              value={jobType}
              items={jobTypeItems}
              setOpen={setJobTypeOpen}
              setValue={setJobType}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onOpen={onJobTypeOpen}
              listMode="SCROLLVIEW"
              zIndex={3000}
            />
            {errors.jobType && (
              <Text style={styles.error}>{errors.jobType}</Text>
            )}
          </View>

          {/* Description */}
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#40189D",
    marginVertical: 18,
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
  descInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  dropdownWrapper: {
    marginHorizontal: 20,
    marginBottom: 12,
    zIndex: 100,
  },
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
    color: "#999999ff",
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
  createBtnText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  error: { color: "red", fontSize: 14, marginLeft: 20, marginBottom: 8 },
  suggestionBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6FA",
    marginTop: -8,
    marginBottom: 8,
    maxHeight: 150,
    overflow: "scroll",
    zIndex: 999,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
