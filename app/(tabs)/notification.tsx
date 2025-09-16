import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type Notification = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  status: string;
  type?: string;
  job?: any;
  from?: any;
};

export default function NotificationScreen() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(
          "http://192.168.100.150:4000/api/notification/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const sorted = (data.notifications || data).sort(
          (a: Notification, b: Notification) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifs(sorted);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await Promise.all(
        notifs
          .filter((n) => n.status === "unread")
          .map((n) =>
            fetch(
              `http://192.168.100.150:4000/api/notification/${n._id}/read`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              }
            )
          )
      );
      setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (error) {
      alert("Failed to mark all as read.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await fetch("http://192.168.100.150:4000/api/notification/all", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs([]);
    } catch (error) {
      alert("Failed to delete all notifications.");
    }
  };

  const markAsRead = async (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n._id === id ? { ...n, unread: false } : n))
    );
  };

  const handleNotifPress = (notif: Notification) => {
    console.log("Notification pressed:", notif);
    if (notif.status) markAsRead(notif._id);

    if (notif.type === "application_request" && notif.job && notif.from) {
      // Navigate to job/application detail
      router.push({
        pathname: "/job-application-details",
        params: {
          jobId: notif.job._id,
          applicantId: notif.from,
          notifId: notif._id,
        },
      });
    } else {
      // fallback → open modal with message
      setSelectedNotif(notif);
      setDetailsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/logo2.png")}
          style={styles.logo}
        />
        <Ionicons name="notifications" size={28} color="#40189D" />
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleMarkAllAsRead}
        >
          <Ionicons name="checkmark-done-outline" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Mark all as read</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtnDelete}
          onPress={handleDeleteAll}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Delete all</Text>
        </TouchableOpacity>
      </View>
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
        <ScrollView>
          {notifs.map((notif) => (
            <TouchableOpacity
              key={notif._id}
              style={notif.status ? styles.cardUnread : styles.card}
              onPress={() => handleNotifPress(notif)}
              activeOpacity={0.8}
            >
              <View style={styles.cardRow}>
                {notif.status && <View style={styles.dotUnread} />}
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.cardTitle,
                      notif.status && { fontWeight: "bold", color: "#40189D" },
                    ]}
                  >
                    {notif.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardMsg,
                      notif.status && { color: "#40189D" },
                    ]}
                  >
                    {notif.message}
                  </Text>
                </View>
                <MaterialIcons
                  name="access-time"
                  size={16}
                  color={notif.status ? "#40189D" : "#BDBDBD"}
                  style={{ marginLeft: 8 }}
                />
                <Text
                  style={notif.status ? styles.cardTimeUnread : styles.cardTime}
                >
                  {new Date(notif.createdAt).toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Details Modal */}
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
  logo: {
    width: 110,
    height: 50,
    resizeMode: "contain",
  },
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
    backgroundColor: "#401",
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 14,
    color: "#fff",
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
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dotUnread: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#40189D",
    marginRight: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  cardMsg: {
    fontSize: 15,
    marginVertical: 2,
  },
  cardTimeUnread: {
    color: "#40189D",
    fontSize: 13,
    marginLeft: 4,
  },
  cardTime: {
    color: "#BDBDBD",
    fontSize: 13,
    marginLeft: 4,
  },
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
  detailSection: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#F8F4FF",
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#40189D",
    marginBottom: 4,
    fontSize: 15,
  },
  detailText: {
    fontSize: 15,
    color: "#181818",
    marginBottom: 2,
  },
  closeModalBtn: {
    alignSelf: "center",
    marginTop: 18,
    backgroundColor: "#40189D",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  closeModalText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
