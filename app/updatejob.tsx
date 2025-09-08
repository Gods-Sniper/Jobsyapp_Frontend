import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UpdateJob() {
  const { jobId } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          `http://192.168.100.150:4000/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const j = data.job || data;
        setJob(j);
        setTitle(j.title || "");
        setDescription(j.description || "");
        setSalary(j.salary ? String(j.salary) : "");
        setDuration(j.duration || "");
        setCategory(j.category?.name || j.category || "");
        setLocation(j.location?.address || j.location || "");
        setJobType(j.jobType || "");
      } catch (error) {
        Alert.alert("Error", "Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const body = {
        title,
        description,
        salary: Number(salary),
        duration,
        category,
        location,
        jobType,
      };
      const response = await fetch(
        `http://192.168.100.150:4000/api/jobs/${jobId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Job updated successfully!");
        router.push("/my-jobs");
      } else {
        Alert.alert("Error", data.message || "Failed to update job.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update job.");
    }
  };

  if (loading) {
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
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Job</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Salary"
        value={salary}
        onChangeText={setSalary}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Duration"
        value={duration}
        onChangeText={setDuration}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Job Type"
        value={jobType}
        onChangeText={setJobType}
      />
      <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
        <Text style={styles.updateBtnText}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#F8F4FF", padding: 20 },
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
    paddingHorizontal: 10,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    color: "#000",
  },
  updateBtn: {
    backgroundColor: "#40189D",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 18,
    marginBottom: 30,
  },
  updateBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
  },
});
