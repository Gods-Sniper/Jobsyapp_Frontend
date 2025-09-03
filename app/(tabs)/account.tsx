import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountScreen() {
  const router = useRouter();
  const [user, setUser] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBg}>
        <View style={styles.headerRow}>
          <Ionicons name="ellipsis-vertical" size={26} color="#fff" />
        </View>
        <View style={styles.avatarWrapper}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>{user?.[0]?.toUpperCase()}</Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{user}</Text>
        <Text style={styles.role}>Programmer</Text>
        <Text style={styles.bio}>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu
        </Text>
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
        <View style={styles.resumeCard}>
          <View>
            <Text style={styles.resumeTitle}>My Resume</Text>
            <Text style={styles.resumeFile}>david_resume.pdf</Text>
          </View>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
        </View>
        <TouchableOpacity
          onPress={async () => {
            await deleteItemAsync("user");
            router.dismissTo("/(auth)/login");
          }}
          style={{ marginBottom: 18 }}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
        <View style={styles.statsRow}>
          <View style={styles.statCardPurple}>
            <Text style={styles.statNumber}>29</Text>
            <Text style={styles.statLabel}>Jobs Applied</Text>
            <Ionicons
              name="checkmark-circle-outline"
              size={60}
              color="#fff"
              style={styles.statBgIcon}
            />
          </View>
          <View style={styles.statCardBlue}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Interviews</Text>
            <Ionicons
              name="help-circle-outline"
              size={60}
              color="#fff"
              style={styles.statBgIcon}
            />
          </View>
        </View>
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
    borderRadius: 18,
    backgroundColor: "#40189D",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 200,
  },
  content: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#181818",
    marginTop: 8,
  },
  role: {
    fontSize: 16,
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
