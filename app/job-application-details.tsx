import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { API_BASE_URL } from "./config";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ApplicationDetail() {
  const { notifId } = useLocalSearchParams();
  const router = useRouter();
  const [applicationDetails, setApplicationDetails] = useState<any>(null);
  const [applicantDetails, setApplicantDetails] = useState<any>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDetailsByNotif = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(
          `${API_BASE_URL}/notification/${notifId}/job-details/applicant-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch details");
        }

        if (!res.ok) {
          throw new Error("Failed to fetch details");
        }

        const data = await res.json();
        console.log(data);
        console.log(data.application._id);
        setApplicantDetails(data.applicant);
        setApplicationDetails(data.application);
        setJobDetails(data.job);
      } catch (e) {
        console.error("Failed to load details", e);
      } finally {
        setLoading(false);
      }
    };

    if (notifId) fetchDetailsByNotif();
  }, [notifId]);

  // Handle applicant decision
  const handleDecision = async (decision: "accept" | "reject") => {
    if (!applicantDetails?._id || !jobDetails?._id) return;
    setActionLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const status = decision === "accept" ? "hired" : "rejected";
      console.log(status);
      const res = await fetch(
        `${API_BASE_URL}/applications/${applicationDetails._id}/${status}/${jobDetails._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);

      if (!res.ok) {
        Alert.alert("Error", data?.message || "Failed to update application");
        return;
      }

      Alert.alert(
        "Success",
        `Applicant ${
          decision === "accept" ? "accepted" : "rejected"
        } successfully`
      );
      setTimeout(() => {
        router.push(`/my-applications`);
      }, 500);
    } catch (e) {
      Alert.alert(
        "Error",
        "Something went wrong while updating the application."
      );
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#40189D"
        style={{ marginTop: 50 }}
      />
    );
  }

  if (!applicantDetails || !jobDetails) {
    return (
      <Text style={{ marginTop: 50, textAlign: "center" }}>
        No details found
      </Text>
    );
  }
  // console.log(jobDetails, "<<< JOB DETAILS");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("../assets/images/logo2.png")}
          style={styles.logo}
        />
      </View>
      {/* Job Info Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Job Information</Text>
        <Text style={styles.title}> {jobDetails.title}</Text>
        <Text style={styles.body}>📍 Location: {jobDetails.address}</Text>
        <Text style={styles.body}>📂 Category: {jobDetails.category.name}</Text>
        <Text style={styles.body}>📝 Description:</Text>
        <Text style={styles.bodyMuted}>{jobDetails.description}</Text>
      </View>

      {/* Applicant Info Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Applicant Information</Text>
        <Text style={styles.body}>👤 Name: {applicantDetails.name}</Text>
        <Text style={styles.body}>📧 Email: {applicantDetails.email}</Text>
        {applicantDetails.phone && (
          <Text style={styles.body}>📞 Phone: {applicantDetails.phone}</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CAF50" }]}
          onPress={() => handleDecision("accept")}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>
            {actionLoading ? "Processing..." : "Accept Applicant"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#F44336" }]}
          onPress={() => handleDecision("reject")}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>
            {actionLoading ? "Processing..." : "Reject Applicant"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#40189D" }]}
          onPress={() => router.push(`/(tabs)/account`)}
        >
          <Text style={styles.buttonText}>Applicant information</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 16,
  },
  headerRow: {
    alignItems: "flex-end",
    marginHorizontal: 1,
    marginBottom: 10,
  },
  logo: {
    width: 110,
    height: 40,
    resizeMode: "contain",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#40189D",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  body: {
    fontSize: 20,
    marginBottom: 6,
    color: "#444",
  },
  bodyMuted: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  actions: {
    marginTop: 10,
    gap: 12,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
