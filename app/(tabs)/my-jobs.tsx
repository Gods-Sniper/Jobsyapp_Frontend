import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../config";

type Job = {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  createdAt: string;
};

export default function MyJobsScreen() {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchMyJobs = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");
        let userId = "";
        let userRole = "";
        if (userData) {
          const userObj = JSON.parse(userData);
          userId = userObj._id || userObj.id;
          userRole = userObj.role || "";
          setRole(userRole);
        }

        if (userRole === "jobprovider") {
          const response = await fetch(
            `${API_BASE_URL}/jobs/provider?userId=${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          const sortedJobs = (data.jobs || data).sort(
            (
              a: { createdAt: string | number | Date },
              b: { createdAt: string | number | Date }
            ) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setJobs(sortedJobs);
        }
      } catch (error) {
        console.error("Failed to fetch my jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const renderItem = ({ item }: { item: Job }) => (
    <View style={styles.applicantRow}>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.message} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
        <Text style={styles.timeText}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() =>
              router.push({
                pathname: "/jobdetails",
                params: { jobId: item._id || item.id },
              })
            }
          >
            <Text style={styles.acceptText}>View</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.declineBtn}
            onPress={() => handleDeleteJob}
          >
            <Text style={styles.declineText}>Delete</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );

  const handleDeleteJob = async (jobId?: string) => {
    Alert.alert("Delete Job", "Are you sure you want to delete this job?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(
              `${API_BASE_URL}/jobs/${jobId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.ok) {
              setJobs((prev) =>
                prev.filter((job) => (job._id || job.id) !== jobId)
              );
              alert("Job deleted successfully!");
            } else {
              alert("Failed to delete job.");
            }
          } catch (error) {
            alert("Error deleting job.");
            console.error("Delete job error:", error);
          }
        },
      },
    ]);
  };

  if (role !== "jobprovider") {
    return (
      <SafeAreaView style={styles.safe}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MaterialCommunityIcons
            name="account-cancel"
            size={200}
            color="#40189D"
            style={{ marginBottom: 10 }}
          />
          <Text style={{ fontSize: 20, color: "#40189D", textAlign: "center" }}>
            Sorry !!!
          </Text>
          <Text style={{ fontSize: 20, color: "#40189D", textAlign: "center" }}>
            Only job providers can view this page.
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#888",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Please contact admin if you need provider access.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>My-Jobs</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={30} color="#181818" />
        </TouchableOpacity>

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
              <TouchableOpacity
                onPress={() => {
                  router.push("/viewapplicants");
                  setMenuVisible(false);
                }}
              >
                <Text style={styles.menuItem}> View Applicants</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteJob}>
                <Text style={styles.menuItem}> Delete Job</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push("/updatejob");
                  setMenuVisible(false);
                }}
              >
                <Text style={styles.menuItem}> Update Job</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeButton}>Close Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#40189D"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item._id || item.id || index.toString()
          }
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#40189D",
    marginTop: 18,
    marginBottom: 18,
    alignSelf: "center",
  },
  applicantRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F4FF",
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 4,
  },
  // avatar: {
  //   width: 64,
  //   height: 64,
  //   borderRadius: 32,
  // },
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
  name: {
    fontSize: 30,
    color: "#181818",
    fontWeight: "bold",
  },
  message: {
    fontSize: 20,
    color: "#6B6B6B",
    marginTop: 2,
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  acceptBtn: {
    backgroundColor: "#3ED59833",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginRight: 10,
  },
  acceptText: {
    color: "#3ED598",
    fontWeight: "bold",
    fontSize: 15,
  },
  declineBtn: {
    backgroundColor: "#FFBDBD",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  declineText: {
    color: "#FF5A5A",
    fontWeight: "bold",
    fontSize: 15,
  },
  timeText: {
    color: "#BDBDBD",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 4,
  },
});
