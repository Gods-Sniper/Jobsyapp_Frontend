import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const applicants = [
  {
    id: "1",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
  {
    id: "2",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
  {
    id: "3",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
  {
    id: "4",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
  {
    id: "5",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
  {
    id: "6",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
  {
    id: "7",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
  {
    id: "8",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
  {
    id: "9",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
  {
    id: "10",
    name: "Gustauv Semalam",
    message: "Roger that sir, thankyou",
    avatar: require("../assets/images/Group 8.png"),
  },
];

export default function ApplicantsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.applicantRow}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.acceptBtn}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineBtn}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      
      <Text style={styles.title}>Applicants</Text>
      <FlatList
        data={applicants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
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
    backgroundColor: "#E6E0FF",
    justifyContent: "space-between",
  },
  headerUser: { flexDirection: "row", alignItems: "center" },
  byText: { color: "#BDBDBD", fontSize: 13, marginBottom: 2 },
  timeText: { color: "#BDBDBD", fontSize: 12, fontStyle: "italic" },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3ED59833",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  avatarText: { color: "#40189D", fontWeight: "bold", fontSize: 18 },
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
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F4FF",
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 4,
  },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },

  name: {
    fontSize: 18,
    color: "#181818",
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
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
});