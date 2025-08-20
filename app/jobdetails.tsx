import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function JobDetail() {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>B</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#181818" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.userRow}>
          <View>
            <Text style={styles.byText}>By la_voisine_du_quartier </Text>
          </View>

          <View>
            <Text style={styles.timeText}>46mins ago</Text>
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
            <Text style={styles.title}>
              Couller la dale de 30m² chocho, avec koki à l’appui
            </Text>
          </View>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>House Cleaning</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet consectetur. Tincidunt velit ut enim quis
          iaculis nisl dignissim eget urna. Sed nisi tristique condimentum vitae
          turpis ac neque enim
        </Text>
        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#40189D" style={styles.infoIcon}
          />
          <Text style={styles.infoBold}>Yaounde, Ekoumdoum</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="pricetag" size={20} color="#3ED598" style={styles.infoIcon}
          />
          <Text style={[styles.infoBold, { color: "#3ED598" }]}>
            3k – 5k XAF/jour
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name="time"
            size={20}
            color="#40189D"
            style={styles.infoIcon}
          />
          <Text style={[styles.infoBold, { color: "#40189D" }]}>2 Days</Text>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Pending</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.applyBtnContainer}>
        <TouchableOpacity style={styles.applyBtn}>
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
