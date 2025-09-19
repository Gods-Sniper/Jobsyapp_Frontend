import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../config";

type Notification = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  status: "read" | "unread";
  type?: string;
  job?: any;
  from?: any;
};

export default function NotificationScreen() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const router = useRouter();


  const loadReadNotifs = async (): Promise<string[]> => {
    try {
      const saved = await AsyncStorage.getItem("readNotifs");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load read notifs", e);
      return [];
    }
  };

  
  const saveReadNotifs = async (readIds: string[]) => {
    try {
      await AsyncStorage.setItem("readNotifs", JSON.stringify(readIds));
    } catch (e) {
      console.error("Failed to save read notifs", e);
    }
  };

 
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/notification/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

     
      const sorted = (data.notifications || data).sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      
      const readIds = await loadReadNotifs();
      const updated = sorted.map((n: Notification) =>
        readIds.includes(n._id) ? { ...n, status: "read" } : n
      );

      setNotifs(updated);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

 
  const markAsRead = async (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n._id === id ? { ...n, status: "read" } : n))
    );

    const readIds = await loadReadNotifs();
    if (!readIds.includes(id)) {
      readIds.push(id);
      await saveReadNotifs(readIds);
    }

    try {
      const token = await AsyncStorage.getItem("token");
      await fetch(`${API_BASE_URL}/notification/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error("Failed to update notification on server", e);
    }
  };

  const handleNotifPress = (notif: Notification) => {
    if (notif.status === "unread") markAsRead(notif._id);

    if (notif.type === "application_request" && notif.job && notif.from) {
      router.push({
        pathname: "/job-application-details",
        params: {
          jobId: notif.job._id,
          applicantId: notif.from,
          notifId: notif._id,
        },
      });
    } else {
      setSelectedNotif(notif);
      setDetailsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/logo2.png")}
          style={styles.logo}
        />
        <Ionicons name="notifications" size={28} color="#40189D" />
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={async () => {
            const readIds = notifs.map((n) => n._id);
            await saveReadNotifs(readIds);
            setNotifs((prev) => prev.map((n) => ({ ...n, status: "read" })));
          }}
        >
          <Ionicons name="checkmark-done-outline" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Mark all as read</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnDelete}
          onPress={async () => {
            const token = await AsyncStorage.getItem("token");
            await fetch(`${API_BASE_URL}/notification/${notifs}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            setNotifs([]);
            await saveReadNotifs([]);
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Delete all</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications list */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#40189D"
          style={{ marginTop: 40 }}
        />
      ) : notifs.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40, color: "#40189D" }}>
          No notifications found.
        </Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchNotifications();
              }}
              colors={["#40189D"]}
            />
          }
        >
          {notifs.map((notif) => (
            <TouchableOpacity
              key={notif._id}
              style={
                notif.status === "unread" ? styles.cardUnread : styles.card
              }
              onPress={() => handleNotifPress(notif)}
              activeOpacity={0.8}
            >
              <View style={styles.cardRow}>
                {notif.status === "unread" && <View style={styles.dotUnread} />}
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.cardTitle,
                      notif.status === "unread" && {
                        fontWeight: "bold",
                        color: "#40189D",
                      },
                    ]}
                  >
                    {notif.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardMsg,
                      notif.status === "unread" && { color: "#40189D" },
                    ]}
                  >
                    {notif.message}
                  </Text>
                </View>
                <MaterialIcons
                  name="access-time"
                  size={16}
                  color={notif.status === "unread" ? "#40189D" : "#BDBDBD"}
                  style={{ marginLeft: 8 }}
                />
                <Text
                  style={
                    notif.status === "unread"
                      ? styles.cardTimeUnread
                      : styles.cardTime
                  }
                >
                  {new Date(notif.createdAt).toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Notification details modal */}
      <Modal
        visible={detailsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailsVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {selectedNotif?.title || "Notification"}
            </Text>
            <Text style={styles.modalMsg}>
              {selectedNotif?.message || "No message available."}
            </Text>
            <Text style={styles.cardTime}>
              {selectedNotif
                ? new Date(selectedNotif.createdAt).toLocaleString()
                : ""}
            </Text>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setDetailsVisible(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F4FF", paddingTop: 80 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 18,
    marginBottom: 10,
  },
  logo: { width: 110, height: 50, resizeMode: "contain" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 10,
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#40189D",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  actionBtnDelete: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5A5A",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 6,
  },
  cardUnread: {
    backgroundColor: "#EDE0FF",
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 14,
    shadowColor: "#40189D",
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 14,
    shadowColor: "#40189D",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  dotUnread: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#40189D",
    marginRight: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2,
    color: "#181818",
  },
  cardMsg: { fontSize: 15, marginVertical: 2 },
  cardTimeUnread: { color: "#40189D", fontSize: 13, marginLeft: 4 },
  cardTime: { color: "#BDBDBD", fontSize: 13, marginLeft: 4 },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    width: "90%",
    elevation: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#40189D",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMsg: {
    fontSize: 16,
    color: "#181818",
    marginBottom: 12,
    textAlign: "center",
  },
  closeModalBtn: {
    alignSelf: "center",
    marginTop: 18,
    backgroundColor: "#40189D",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  closeModalText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
