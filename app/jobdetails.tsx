import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function JobDetail() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams();
  const [menuVisible, setMenuVisible] = React.useState(false);
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
        const response = await fetch(
          `http://192.168.100.150:4000/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
      const response = await fetch(
        `http://192.168.100.150:4000/api/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Job deleted successfully!");
        router.push("/my-jobs");
      } else {
        alert(data.message || "Failed to delete job.");
      }
    } catch (error) {
      alert("Error deleting job.");
      console.error("Delete job error:", error);
    }
  };

  const handleUpdateJob = () => {
    setMenuVisible(false);
    router.push({
      pathname: "/updatejob",
      params: { jobId },
    });
  };

  const handleViewApplicants = () => {
    setMenuVisible(false);
    router.push({
      pathname: "/viewapplicants",
      params: { jobId },
    });
  };

  const handleApply = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://192.168.100.150:4000/api/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data, "<<< APPLY RESPONSE");
      if (response.ok) {
        alert("Applied successfully!");
        router.push("/my-applications");
      } else {
        alert(data.message || "Failed to apply for job.");

      }
    } catch (error) {
      alert("Error applying for job.");
      console.error("Apply job error:", error);
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
      <View style={styles.topBar}>
        <TouchableOpacity>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            padding: 10,
          }}
        >
          {role === "jobprovider" && (
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={28} color="#181818" />
            </TouchableOpacity>
          )}
          <Modal
            visible={menuVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <View style={styles.menu}>
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(false);
                    router.push("/createjob");
                  }}
                >
                  <Text style={styles.menuItem}> Create Job</Text>
                </TouchableOpacity>
                {isCreator && (
                  <>
                    <TouchableOpacity onPress={handleViewApplicants}>
                      <Text style={styles.menuItem}> View Applicants</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteJob}>
                      <Text style={styles.menuItem}> Delete Job</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpdateJob}>
                      <Text style={styles.menuItem}> Update Job</Text>
                    </TouchableOpacity>
                  </>
                )}
                {/* <TouchableOpacity onPress={() => setMenuVisible(false)}>
                  <Text style={styles.closeButton}>Close Menu</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.userRow}>
          <View>
            <Text style={styles.byText}>By {creator}</Text>
          </View>
          <View>
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
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{job.title}</Text>
          </View>
        </View>

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
          <Text style={styles.infoBold}>
            {job.location ? job.location.type : "No Location Type"}
          </Text>
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
              {job.status || "Pending"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.applyBtnContainer}>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4FF",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: "#F8F4FF",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  byText: {
    color: "#000000ff",
    fontSize: 16,
    marginBottom: 2,
  },
  timeText: {
    color: "#40189D",
    fontSize: 14,
    fontStyle: "italic",
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#3ED59833",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#40189D",
    fontWeight: "bold",
    fontSize: 30,
  },
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
    marginBottom: 10,
    marginTop: 10,
    marginVertical: 10,
    color: "#181818",
  },
  closeButton: {
    marginTop: 20,
    color: "red",
    fontSize: 20,
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

  tagText: {
    color: "#40189D",
    fontWeight: "bold",
    fontSize: 20,
  },

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
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    color: "#000000ff",
    fontSize: 20,
    fontWeight: "bold",
  },
  infoBold: {
    fontWeight: "bold",
    color: "#000000ff",
    fontSize: 20,
  },

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
  statusBadgeText: {
    color: "#40189D",
    fontWeight: "bold",
    fontSize: 25,
  },
  applyBtnContainer: {
    padding: 16,
    backgroundColor: "#F8F4FF",
  },
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
});
