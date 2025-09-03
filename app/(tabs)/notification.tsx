import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Notification = {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  unread: boolean;
};

export default function NotificationScreen() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Sort notifications by creation date (most recent first)
        const sorted = (data.notifications || data).sort(
          (a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) =>
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

  const markAsRead = async (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n._id === id ? { ...n, unread: false } : n))
    );
    
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/logo2.png")}
          style={styles.logo}
        />
        <Ionicons name="notifications" size={28} color="#40189D" />
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
        notifs.map((notif, idx) =>
          notif.unread ? (
            <View key={notif._id} style={styles.cardUnread}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.dotUnread} />
                <Text style={styles.cardTitle}>{notif.title}</Text>
              </View>
              <Text style={styles.cardMsg}>{notif.message}</Text>
              <View style={styles.cardFooter}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="access-time" size={16} color="#fff" />
                  <Text style={styles.cardTime}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => markAsRead(notif._id)}>
                  <Text style={styles.markRead}>Mark as read</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View key={notif._id} style={styles.card}>
              <Text style={styles.title}>{notif.title}</Text>
              <Text style={styles.msg}>{notif.message}</Text>
              <View style={styles.footer}>
                <MaterialIcons name="access-time" size={16} color="#BDBDBD" />
                <Text style={styles.time}>
                  {new Date(notif.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          )
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F4FF", paddingTop: 80 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 18,
    marginBottom: 20,
  },
  logo: {
    width: 110,
    height: 50,
    resizeMode: "contain",
  },
  cardUnread: {
    backgroundColor: "#40189D",
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 18,
    shadowColor: "#40189D",
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  dotUnread: {
    width: 20,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 350,
    marginBottom: 2,
  },
  cardMsg: {
    color: "#fff",
    fontSize: 15,
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cardTime: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 4,
  },
  markRead: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  card: {
    backgroundColor: "transparent",
    marginHorizontal: 18,
    marginBottom: 18,
    paddingVertical: 8,
    borderRadius: 18,
  },
  title: {
    color: "#181818",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 2,
  },
  msg: {
    color: "#6B6B6B",
    fontSize: 15,
    marginVertical: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  time: {
    color: "#BDBDBD",
    fontSize: 13,
    marginLeft: 4,
  },
});
