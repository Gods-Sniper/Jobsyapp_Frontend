import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { API_BASE_URL } from "../config";

export default function AccountScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const fetchUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (!userData) return;
    const userObj = JSON.parse(userData);

    // Fetch CV
    let cvFileName = "";
    let cvUrl = "";
    try {
      const cvRes = await fetch(`${API_BASE_URL}/users/${userObj._id}/cv`);
      const cvData = await cvRes.json();
      cvFileName = cvData?.cvFileName || "";
      cvUrl = cvData?.cvUrl || "";
    } catch {}

    // Fetch stats
    let jobsPosted = 0;
    let jobsHired = 0;
    let jobsRejected = 0;
    let applications = 0;

    if (userObj.role === "jobprovider") {
      // Fetch jobs posted
      const jobsRes = await fetch(`${API_BASE_URL}/jobs/user/${userObj._id}`);
      const jobsData = await jobsRes.json();
      jobsPosted = jobsData?.jobs?.length || 0;
      applications = jobsData?.jobs?.reduce(
        (acc: any, job: { applications: string | any[] }) =>
          acc + (job.applications?.length || 0),
        0
      );
    } else if (userObj.role === "jobseeker") {
      // Fetch applications
      const appsRes = await fetch(
        `${API_BASE_URL}/applications/user/${userObj._id}`
      );
      const appsData = await appsRes.json();
      jobsHired =
        appsData?.applications?.filter(
          (app: { status: string }) => app.status === "hired"
        ).length || 0;
      jobsRejected =
        appsData?.applications?.filter(
          (app: { status: string }) => app.status === "rejected"
        ).length || 0;
      applications = appsData?.applications?.length || 0;
    }

    setUser({
      ...userObj,
      cvFileName,
      cvUrl,
      jobsPosted,
      jobsHired,
      jobsRejected,
      applications,
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleOpenCV = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user?.id}/cv`);
      if (!response.ok) throw new Error("CV not found");
      const data = await response.json();
      if (data?.cvUrl) {
        Linking.openURL(data.cvUrl);
      } else {
        alert("No CV uploaded.");
      }
    } catch (error) {
      alert("Failed to fetch CV.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBg}>
        <View style={styles.headerRow}>
          <Ionicons name="ellipsis-vertical" size={26} color="#fff" />
        </View>
        <View style={styles.avatarWrapper}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>
              {user?.username?.[0]?.toUpperCase() ||
                user?.name?.[0]?.toUpperCase() ||
                "U"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>
          {user?.username || user?.name || "Unknown User"}
        </Text>
        <Text style={styles.role}>{user?.role || "No role"}</Text>
        {/* <Text style={styles.bio}>
          {user?.bio ||
            "No bio available. Update your profile to add more information."}
        </Text> */}
        <Text style={styles.infoText}>Email: {user?.email || "No email"}</Text>
        <Text style={styles.infoText}>Phone: {user?.phone || "No phone"}</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="call-outline" size={28} color="#40189D" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="mail-outline" size={28} color="#40189D" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="location-outline" size={28} color="#40189D" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.resumeCard}
          onPress={() => {
            if (user?.cvUrl) {
              Linking.openURL(user.cvUrl);
            } else {
              alert("No CV uploaded.");
            }
          }}
        >
          <View>
            <Text style={styles.resumeTitle}>Resume</Text>
            <Text style={styles.resumeFile}>
              {user?.cv || "No resume uploaded"}
            </Text>
          </View>
          <Ionicons
            name="document-text-outline"
            size={32}
            color="#fff"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>

        <View style={styles.statsRow}>
          {user?.role === "jobprovider" ? (
            <>
              <View style={styles.statCardPurple}>
                <Text style={styles.statNumber}>{user?.postedBy || "null"}</Text>
                <Text style={styles.statLabel}>Jobs Posted</Text>
                <Ionicons
                  name="briefcase"
                  size={60}
                  color="#fff"
                  style={styles.statBgIcon}
                />
              </View>
              <View style={styles.statCardBlue}>
                <Text style={styles.statNumber}>{user?.applications || "null"}</Text>
                <Text style={styles.statLabel}>Applications</Text>
                <Ionicons
                  name="send"
                  size={60}
                  color="#fff"
                  style={styles.statBgIcon}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.statCardPurple}>
                <Text style={styles.statNumber}>{user?.jobsHired || 0}</Text>
                <Text style={styles.statLabel}>Jobs Hired</Text>
                <Ionicons
                  name="briefcase"
                  size={60}
                  color="#fff"
                  style={styles.statBgIcon}
                />
              </View>
              <View style={styles.statCardBlue}>
                <Text style={styles.statNumber}>{user?.jobsRejected || 0}</Text>
                <Text style={styles.statLabel}>Jobs Rejected</Text>
                <Ionicons
                  name="close-circle"
                  size={60}
                  color="#fff"
                  style={styles.statBgIcon}
                />
              </View>
            </>
          )}
        </View>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
            router.dismissTo("/(auth)/login");
          }}
          style={styles.logoutBtn}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F4FF" },
  headerBg: {
    marginTop: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 10,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.7,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#40189D",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 18,
    marginBottom: 18,
    elevation: 2,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
  },
  avatarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -50,
    alignItems: "center",
    zIndex: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#40189D",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 80,
  },
  content: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 24,
  },
  name: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#181818",
    marginTop: 8,
  },
  role: {
    fontSize: 25,
    color: "#BDBDBD",
    marginTop: 2,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    marginBottom: 18,
  },
  infoText: {
    fontSize: 20,
    color: "#181818",
    marginBottom: 20,
    textAlign: "center",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
  },
  iconBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: "#40189D",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resumeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#40189D",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginTop: 8,
    marginBottom: 18,
    width: "100%",
    elevation: 2,
  },
  resumeTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  resumeFile: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  statCardPurple: {
    backgroundColor: "#40189D",
    borderRadius: 18,
    padding: 18,
    width: "48%",
    position: "relative",
    overflow: "hidden",
  },
  statCardBlue: {
    backgroundColor: "#3ED6FF",
    borderRadius: 18,
    padding: 18,
    width: "48%",
    position: "relative",
    overflow: "hidden",
  },
  statNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 2,
  },
  statLabel: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 2,
  },
  statBgIcon: {
    position: "absolute",
    bottom: -10,
    right: -10,
    opacity: 0.13,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 64,
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 10,
    marginTop: 18,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 12, color: "#BDBDBD", marginTop: 2 },
  navTextActive: {
    fontSize: 12,
    color: "#40189D",
    marginTop: 2,
    fontWeight: "bold",
  },
});



