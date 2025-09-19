import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../config";

export default function MyApplicationsScreen() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/applications/my`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data.data, "fetched applications");
        setApplications(data.data || data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    // Style application status
    let appStatusColor = "#3ED598";
    let appStatusText = item.status || "Pending";
    if (appStatusText.toLowerCase() === "accepted") appStatusColor = "#40189D";
    if (appStatusText.toLowerCase() === "rejected") appStatusColor = "#FF5A5A";
    if (appStatusText.toLowerCase() === "pending") appStatusColor = "#F9A826";
    console.log(item.job, "<<< ITEM JOB");

    // Style job status
    let jobStatusColor = "#40189D";
    let jobStatusText = item.job?.jobstatus || "Open";
    if (jobStatusText.toLowerCase() === "completed") jobStatusColor = "#3ED598";
    if (jobStatusText.toLowerCase() === "closed") jobStatusColor = "#FF5A5A";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/jobdetails",
            params: { jobId: item.job?._id || item.jobId },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Ionicons name="briefcase" size={28} color="#40189D" />
          <Text style={styles.cardTitle}>{item.job?.title || "Job"}</Text>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2} ellipsizeMode="tail">
          {item.job?.description || ""}
        </Text>
        <Text style={[styles.cardStatus, { color: appStatusColor }]}>
          Application Status: {appStatusText}
        </Text>
        <Text style={[styles.cardStatus, { color: jobStatusColor }]}>
          Job Status: {jobStatusText}
        </Text>
        <Text style={styles.cardDate}>
          Applied:{" "}
          {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>My Applications</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#40189D"
          style={{ marginTop: 40 }}
        />
      ) : applications.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Ionicons
            name="alert-circle"
            size={60}
            color="#40189D"
            style={{ marginBottom: 16 }}
          />
          <Text style={{ fontSize: 18, color: "#40189D", textAlign: "center" }}>
            You have not applied for any jobs yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  headerBar: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8,
    alignItems: "center",
    backgroundColor: "#F8F4FF",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#40189D",
    marginTop: 18,
    marginBottom: 18,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#40189D",
    marginLeft: 10,
  },
  cardDesc: {
    fontSize: 16,
    color: "#00000099",
    marginBottom: 10,
  },
  cardStatus: {
    fontSize: 15,
    color: "#3ED598",
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 13,
    color: "#BDBDBD",
    fontStyle: "italic",
  },
});
