import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const messages = [
  {
    id: "1",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    time: "2m ago",
    status: "Read",
    avatar: require("../assets/images/Group 8.png"),
    online: true,
    bold: false,
  },
  {
    id: "2",
    name: "Claudia Surrr",
    message: "OK. Lorem ipsum dolor sect...",
    time: "2m ago",
    status: "Pending",
    avatar: require("../assets/images/Group 8.png"),
    online: true,
    bold: false,
  },
  {
    id: "3",
    name: "Rose Melati",
    message: "Lorem ipsum dolor",
    time: "2m ago",
    status: "",
    avatar: require("../assets/images/Group 8.png"),
    online: false,
    bold: true,
  },
  {
    id: "4",
    name: "Olivia James",
    message: "OK. Lorem ipsum dolor sect...",
    time: "2m ago",
    status: "Unread",
    avatar: require("../assets/images/Group 8.png"),
    online: false,
    bold: false,
  },
  {
    id: "5",
    name: "Daphne Putri",
    message: "OK. Lorem ipsum dolor sect...",
    time: "2m ago",
    status: "Unread",
    avatar: require("../assets/images/Group 8.png"),
    online: true,
    bold: false,
  },
  {
    id: "6",
    name: "David Mckanzie",
    message: "Lorem ipsum dolor sit, consect...",
    time: "2m ago",
    status: "Read",
    avatar: require("../assets/images/Group 8.png"),
    online: false,
    bold: false,
  },
  {
    id: "7",
    name: "Cindy Sinambela",
    message: "OK. Lorem ipsum dolor sect...",
    time: "2m ago",
    status: "",
    avatar: require("../assets/images/Group 8.png"),
    online: false,
    bold: false,
  },
  {
    id: "8",
    name: "Sinambela",
    message: "OK. Lorem ipsum dolor sect...",
    time: "2m ago",
    status: "",
    avatar: require("../assets/images/Group 8.png"),
    online: false,
    bold: false,
  },
  {
    id: "9",
    name: "Josue",
    message: "OK. Lorem ipsum dolor sect...",
    time: "2m ago",
    status: "",
    avatar: require("../assets/images/Group 8.png"),
    online: false,
    bold: false,
  },
  {
    id: "10",
    name: "Sniper",
    message: "OK. Lorem ipsum dolor sect...",
    time: "2m ago",
    status: "",
    avatar: require("../assets/images/Group 8.png"),
    online: false,
    bold: false,
  },
];

export default function MessagesScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.messageRow}>
      <View>
        <Image source={item.avatar} style={styles.avatar} />
        {item.online && <View style={styles.onlineDot} />}
        {item.name === "Rose Melati" && <View style={styles.purpleDot} />}
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={[
            styles.name,
            item.bold && { fontWeight: "bold", color: "#40189D" },
          ]}
        >
          {item.name}
        </Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.time}>{item.time}</Text>
        {item.status === "Read" && (
          <View style={styles.statusRow}>
            <Text style={styles.readText}>Read</Text>
            <MaterialIcons
              name="done"
              size={18}
              color="#40189D"
              style={{ marginLeft: 2 }}
            />
          </View>
        )}
        {item.status === "Unread" && (
          <View style={styles.statusRow}>
            <Text style={styles.unreadText}>Unread</Text>
            <MaterialIcons
              name="done"
              size={18}
              color="#BDBDBD"
              style={{ marginLeft: 2 }}
            />
          </View>
        )}
        {item.status === "Pending" && (
          <Text style={styles.pendingText}>Pending</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Messages</Text>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={22}
            color="#BDBDBD"
            style={{ marginLeft: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search message.."
            placeholderTextColor="#BDBDBD"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <FlatList
          data={messages.filter(
            (msg) =>
              msg.name.toLowerCase().includes(search.toLowerCase()) ||
              msg.message.toLowerCase().includes(search.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.newChatBtn}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
          <Text style={styles.newChatText}>New Chat</Text>
        </TouchableOpacity>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/Homepage")}>
            <Ionicons name="home" size={24} color="#BDBDBD" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.navItem}>
            <Ionicons name="hand-left-outline" size={24} color="#BDBDBD" />
            <Text style={styles.navText}>Interviews</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/messages")}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#40189D" />
            <Text style={styles.navTextActive}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/account")}>
            <Ionicons name="person-outline" size={24} color="#BDBDBD" />
            <Text style={styles.navText}>Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#181818",
    alignSelf: "center",
    marginTop: 18,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4FF",
    borderRadius: 24,
    marginHorizontal: 18,
    marginBottom: 10,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#181818",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F4FF",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3ED598",
    borderWidth: 2,
    borderColor: "#fff",
  },
  purpleDot: {
    position: "absolute",
    top: 0,
    left: -10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#40189D",
  },
  name: {
    fontSize: 16,
    color: "#181818",
  },
  messageText: {
    fontSize: 14,
    color: "#6B6B6B",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#BDBDBD",
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  readText: {
    color: "#40189D",
    fontSize: 13,
    marginRight: 2,
  },
  unreadText: {
    color: "#BDBDBD",
    fontSize: 13,
    marginRight: 2,
  },
  pendingText: {
    color: "#BDBDBD",
    fontSize: 13,
    marginTop: 2,
  },
  newChatBtn: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    backgroundColor: "#40189D",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 12,
    elevation: 4,
    zIndex: 10,
  },
  newChatText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 8,
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
