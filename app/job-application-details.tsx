import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function ApplicationDetail() {
  const { notifId } = useLocalSearchParams(); //  only notifId now
  const [applicantDetails, setapplicantDetails] = useState<any>(null);
  const [jobdetails, setjobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailsByNotif = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(
          `http://192.168.100.150:4000/api/notification/${notifId}/job-details/applicant-details`,
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

        const data = await res.json();
        setapplicantDetails(data.applicant);
        setjobDetails(data.job);
      } catch (e) {
        console.error("Failed to load details", e);
      } finally {
        setLoading(false);
      }
    };

    if (notifId) fetchDetailsByNotif();
  }, [notifId]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#40189D"
        style={{ marginTop: 50 }}
      />
    );
  }

  if (!applicantDetails || !jobdetails) {
    return (
      <Text style={{ marginTop: 50, textAlign: "center" }}>
        No details found
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{jobdetails.title}</Text>
      <Text style={styles.subtitle}>Applicant: {applicantDetails.name}</Text>
      <Text style={styles.body}>Email: {applicantDetails.email}</Text>
      <Text>Job Details</Text>

      <Text style={styles.body}>Location: {jobdetails.title}</Text>
      <Text style={styles.body}>Category: {jobdetails.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#40189D",
    marginBottom: 10,
  },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  body: { fontSize: 16, marginBottom: 4 },
});
