import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./config";

export default function JobDetail() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams();
  const [menuVisible, setMenuVisible] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const userObj = JSON.parse(userData);
          setRole(userObj.role || "");
          setUserId(userObj._id || userObj.id || "");
        }

        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setJob(data.job || data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleDeleteJob = async () => {
    setMenuVisible(false);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204 || response.status === 200) {
        Alert.alert("Success", "Job deleted successfully!", [
          { text: "OK", onPress: () => router.push("/my-jobs") },
        ]);
      } else {
        const data = await response.json();
        alert(data?.message || "Failed to delete job.");
      }
    } catch (error) {
      alert("Error deleting job.");
      console.error("Delete job error:", error);
    }
  };

  const handleUpdateJob = () => {
    setMenuVisible(false);
    router.push({ pathname: "/updatejob", params: { jobId } });
  };

  const handlepayment = () => {
    setMenuVisible(false);
    router.push({ pathname: "./paymentpage", params: { jobId } });
  };

  const handlemap = () => {
    setMenuVisible(false);
    router.push({ pathname: "./mapscreen" });
  };

  const handleViewApplicants = () => {
    setMenuVisible(false);
    router.push({ pathname: "/viewapplicants", params: { jobId } });
  };

  const handleApply = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/applications/${jobId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Applied successfully!", [
          { text: "OK", onPress: () => router.push("/my-applications") },
        ]);
      } else {
        alert(data.message || "Failed to apply for job.");
      }
    } catch (error) {
      alert("Error applying for job.");
      console.error("Apply job error:", error);
    }
  };

  const handleMarkAsDone = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobstatus: "completed" }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.log("Error response:", text);
        Alert.alert("Error", `Failed: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      setJob({ ...job, jobstatus: "completed" });
      Alert.alert("Success", "Job marked as Done!", [
        { text: "OK", onPress: () => router.push(`./paymentpage?jobId=${jobId}`) },
      ]);
    } catch (error) {
      console.error("Mark as done error:", error);
      Alert.alert("Error", "Network or server issue");
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

  if (!job) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Job not found.</Text>
      </View>
    );
  }

  const creator =
    job.postedBy?.name ||
    job.postedBy?.username ||
    job.postedBy?._id ||
    job.postedBy ||
    "Unknown";
  const avatarLetter = creator[0]?.toUpperCase() || "U";
  const isCreator =
    userId && (job.postedBy?._id === userId || job.postedBy === userId);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/account")}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
        </TouchableOpacity>

        {role === "jobprovider" && (
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={28} color="#181818" />
          </TouchableOpacity>
        )}

        {/* Menu Modal */}
        <Modal
          visible={menuVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.menuContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.menu}>
                  <TouchableOpacity
                    onPress={() => {
                      setMenuVisible(false);
                      router.push("/createjob");
                    }}
                  >
                    <Text style={styles.menuItem}>Create Job</Text>
                  </TouchableOpacity>
                  {isCreator && (
                    <>
                      <TouchableOpacity onPress={handleViewApplicants}>
                        <Text style={styles.menuItem}>View Applicants</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleDeleteJob}>
                        <Text style={styles.menuItem}>Delete Job</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleUpdateJob}>
                        <Text style={styles.menuItem}>Update Job</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handlepayment}>
                        <Text style={styles.menuItem}>Payment</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handlemap}>
                        <Text style={styles.menuItem}>View Map</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      {/* Job Content */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.userRow}>
          <Text style={styles.byText}>By {creator}</Text>
          <Text style={styles.timeText}>
            {job.createdAt
              ? (() => {
                  const now = new Date();
                  const created = new Date(job.createdAt);
                  const diffMs = now.getTime() - created.getTime();
                  const diffMins = Math.floor(diffMs / (1000 * 60));
                  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                  if (diffMins < 60) return `${diffMins} mins ago`;
                  if (diffHours < 24) return `${diffHours} hours ago`;
                  return `${diffDays} days ago`;
                })()
              : ""}
          </Text>
        </View>

        <Text style={styles.title}>{job.title}</Text>

        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {job.category?.name || job.category || "No Category"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{job.description}</Text>
        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons
            name="location"
            size={20}
            color="#40189D"
            style={styles.infoIcon}
          />
          <Text style={styles.infoBold}>{job.address || "No Location"}</Text>
          {job.address && (
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() =>
                router.push({
                  pathname: "./mapscreen",
                  params: {
                    address: job.address,
                    latitude: job.location?.coordinates?.[1],
                    longitude: job.location?.coordinates?.[0],
                  },
                })
              }
            >
              <Ionicons name="map" size={12} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="pricetag"
            size={20}
            color="#3ED598"
            style={styles.infoIcon}
          />
          <Text style={[styles.infoBold, { color: "#3ED598" }]}>
            {job.salary ? `${job.salary} XAF` : "No Salary"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="time"
            size={20}
            color="#40189D"
            style={styles.infoIcon}
          />
          <Text style={[styles.infoBold, { color: "#40189D" }]}>
            {job.duration || "No Duration"}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {job.jobstatus || "Pending"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      {role === "jobseeker" && job.jobstatus === "open" && (
        <View style={styles.applyBtnContainer}>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {role === "jobprovider" && job.jobstatus === "in-progress" && (
        <View style={styles.applyBtnContainer}>
          <TouchableOpacity style={styles.applyBtn} onPress={handleMarkAsDone}>
            <Text style={styles.applyBtnText}>Mark as Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F4FF" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  byText: { color: "#000000ff", fontSize: 16 },
  timeText: { color: "#40189D", fontSize: 14, fontStyle: "italic" },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#3ED59833",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#40189D", fontWeight: "bold", fontSize: 30 },
  menuContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  menu: {
    width: "60%",
    height: "100%",
    backgroundColor: "#ffffffdc",
    padding: 20,
    borderRadius: 10,
    marginTop: 90,
    alignSelf: "flex-end",
  },
  menuItem: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#181818",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#000000ff",
    marginBottom: 4,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  tag: {
    backgroundColor: "#E6E0FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginLeft: 10,
  },
  tagText: { color: "#40189D", fontWeight: "bold", fontSize: 20 },
  sectionTitle: {
    color: "#40189D",
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  description: {
    color: "#3a3a3aff",
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 10,
    paddingHorizontal: 16,
    textAlign: "justify",
  },
  divider: {
    height: 1,
    backgroundColor: "#000000ff",
    opacity: 0.7,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  infoIcon: { marginRight: 8 },
  infoBold: { fontWeight: "bold", color: "#000000ff", fontSize: 20 },
  statusRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    marginTop: 18,
  },
  statusBadge: {
    backgroundColor: "#E6F0FF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  statusBadgeText: { color: "#40189D", fontWeight: "bold", fontSize: 25 },
  applyBtnContainer: { padding: 16, backgroundColor: "#F8F4FF" },
  applyBtn: {
    backgroundColor: "#40189D",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  applyBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  mapBtn: {
    marginLeft: 10,
    backgroundColor: "#40189D",
    borderRadius: 50,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
