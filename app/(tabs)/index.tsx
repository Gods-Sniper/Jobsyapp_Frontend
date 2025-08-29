import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

const jobs = [
  {
    id: 1,
    user: "la_voisine_du_quartier",
    time: "46mins ago",
    status: "Pending",
    title: "Couller la  dale de 30m² chocho, avec koki à l’appui",
    price: "3k – 5k XAF/jour",
    days: "2 jours",
    priceColor: "#3ED598",
    statusColor: "#E6F0FF",
    statusTextColor: "#6C8EFF",
    icon: "checkmark-circle",
    iconBg: "#F3F0FF",
    iconColor: "#40189D",
  },
  {
    id: 2,
    user: "maa_chann",
    time: "3h ago",
    status: "Negotiating",
    title: "Vider la poubelle de Ma’a Chan cette semaine",
    price: "2k XAF/jour",
    days: "5 jours",
    priceColor: "#3ED598",
    statusColor: "#FFF6E6",
    statusTextColor: "#FFB200",
    icon: "checkmark-circle",
    iconBg: "#F3F0FF",
    iconColor: "#40189D",
  },

  {
    id: 3,
    user: "maa_chantale",
    time: "3h ago",
    status: "Negotiating",
    title: "Vider la poubelle de Ma’a Chan cette semaine",
    price: "2k XAF/jour",
    days: "5 jours",
    priceColor: "#3ED598",
    statusColor: "#FFF6E6",
    statusTextColor: "#FFB200",
    icon: "checkmark-circle",
    iconBg: "#F3F0FF",
    iconColor: "#40189D",
  },

  {
    id: 4,
    user: "maa_chocolate",
    time: "3h ago",
    status: "Negotiating",
    title: "Vider la poubelle de Ma’a Chan cette semaine",
    price: "2k XAF/jour",
    days: "5 jours",
    priceColor: "#3ED598",
    statusColor: "#FFF6E6",
    statusTextColor: "#FFB200",
    icon: "checkmark-circle",
    iconBg: "#F3F0FF",
    iconColor: "#40189D",
  },
];

export const Home = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.helloText}>
            Yo, <Text style={styles.helloName}>Jojo</Text>
          </Text>
          <Text style={styles.helloSub}>Paul Messi, Yaoundé</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>J</Text>
          </View>
        </View>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Type</Text>
          <Text style={styles.filterValue}>Chocho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Status</Text>
          <Text style={styles.filterValue}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Proximity</Text>
          <Text style={styles.filterValue}>Near me</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Published</Text>
          <Text style={styles.filterValue}>Recent</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {jobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobCard}
            onPress={() =>
              router.push({
                pathname: "/jobdetails",
                params: { jobId: job.id },
              })
            }
          >
            <View style={styles.jobHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {job.user[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.jobUser}>By {job.user}</Text>
                <Text style={styles.jobTime}>{job.time}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: job.statusColor },
                ]}
              >
                <Text
                  style={[styles.statusText, { color: job.statusTextColor }]}
                >
                  {job.status}
                </Text>
              </View>
            </View>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={styles.jobInfoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="pricetag" size={18} color={job.priceColor} />
                <Text style={[styles.infoText, { color: job.priceColor }]}>
                  {job.price}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={18} color="#40189D" />
                <Text style={[styles.infoText, { color: "#40189D" }]}>
                  {job.days}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#F8F4FF",
    paddingTop: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  helloText: {
    fontSize: 18,
    color: "#000000ff",
    fontWeight: "bold",
  },

  helloName: {
    color: "#40189D",
    fontWeight: "bold",
  },

  helloSub: {
    fontSize: 13,
    color: "#000000ff",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#40189D",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },

  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 9,
  },
  filterBtn: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 2,
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: 90,
  },

  filterText: {
    fontSize: 10,
    color: "#000000ff",
  },

  filterValue: {
    fontSize: 13,
    color: "#40189D",
    fontWeight: "bold",
  },

  jobCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#40189D",
    fontWeight: "bold",
    fontSize: 16,
  },

  jobUser: {
    fontSize: 12,
    color: "#000000ff",
    fontWeight: "bold",
  },

  jobTime: {
    fontSize: 11,
    color: "#000000ff",
  },

  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000ff",
    marginBottom: 10,
  },

  jobInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },

  infoText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "bold",
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

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    color: "#000000ff",
    marginTop: 2,
  },

  navTextActive: {
    fontSize: 12,
    color: "#40189D",
    marginTop: 2,
    fontWeight: "bold",
  },
});
