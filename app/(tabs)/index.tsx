import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";

type Job = {
  id: string;
  user: string;
  duration: string;
  status: string;
  title: string;
  description: string;
  createdAt: string;
  salary: string;
  days: string;
};

export const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(null);
  const [typeItems, setTypeItems] = useState([
    { label: "Chocho", value: "chocho" },
    { label: "Cleaning", value: "cleaning" },
    { label: "Gardening", value: "gardening" },
  ]);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState(null);
  const [statusItems, setStatusItems] = useState([
    { label: "Pending", value: "pending" },
    { label: "Negotiating", value: "negotiating" },
    { label: "Completed", value: "completed" },
  ]);
  const [proximityOpen, setProximityOpen] = useState(false);
  const [proximityValue, setProximityValue] = useState(null);
  const [proximityItems, setProximityItems] = useState([
    { label: "Near me", value: "near" },
    { label: "Far", value: "far" },
  ]);
  const [publishedOpen, setPublishedOpen] = useState(false);
  const [publishedValue, setPublishedValue] = useState(null);
  const [publishedItems, setPublishedItems] = useState([
    { label: "Recent", value: "recent" },
    { label: "Old", value: "old" },
  ]);

  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) {
        try {
          const userObj = JSON.parse(data);
          setUser(userObj.username || userObj.name || "");
        } catch (e) {
          setUser("");
        }
      }
    });
  }, []);

  const fetchJobs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://192.168.100.150:4000/api/jobs/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      // console.log(data, "<<< JOBS DATA");

      const jobsArray = Array.isArray(data)
        ? data
        : data.jobs || data.data || [];
      const mappedJobs = jobsArray
        .map((job: any) => ({
          id: job._id || job.id,
          user:
            job.postedBy?.name ||
            job.postedBy?.username ||
            job.postedBy ||
            "Unknown",
          description: job.description,
          duration: job.duration,
          status: job.status,
          createdAt: job.createdAt,
          title: job.title,
          salary: job.salary,
          days: job.days,
        }))
        .sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date }
          ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setJobs(mappedJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.helloText}>
            Yo, <Text style={styles.helloName}> {user}</Text>
          </Text>
          <Text style={styles.helloSub}>Paul Messi, Yaoundé</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/account")}>
          <View style={styles.headerRight}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>{user?.[0]?.toUpperCase()}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <DropDownPicker
            open={typeOpen}
            value={typeValue}
            items={typeItems}
            setOpen={setTypeOpen}
            setValue={setTypeValue}
            setItems={setTypeItems}
            placeholder="Type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={4000}
            zIndexInverse={1000}
          />
        </View>
        <View style={{ flex: 1, marginRight: 6 }}>
          <DropDownPicker
            open={statusOpen}
            value={statusValue}
            items={statusItems}
            setOpen={setStatusOpen}
            setValue={setStatusValue}
            setItems={setStatusItems}
            placeholder="Status"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
            zIndexInverse={2000}
          />
        </View>
        <View style={{ flex: 1, marginRight: 6 }}>
          <DropDownPicker
            open={proximityOpen}
            value={proximityValue}
            items={proximityItems}
            setOpen={setProximityOpen}
            setValue={setProximityValue}
            setItems={setProximityItems}
            placeholder="Proximity"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={2000}
            zIndexInverse={3000}
          />
        </View>
        <View style={{ flex: 1 }}>
          <DropDownPicker
            open={publishedOpen}
            value={publishedValue}
            items={publishedItems}
            setOpen={setPublishedOpen}
            setValue={setPublishedValue}
            setItems={setPublishedItems}
            placeholder="Published"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
            zIndexInverse={4000}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {jobs.map((job) => (
          <TouchableOpacity
            key={job.id?.toString()}
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
                  {job.user?.[0]?.toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.jobUser}>By {job.user}</Text>
                <Text style={styles.jobTime}>
                  {job.createdAt
                    ? (() => {
                        const now = new Date();
                        const created = new Date(job.createdAt);
                        const diffMs = now.getTime() - created.getTime();
                        const diffMins = Math.floor(diffMs / (1000 * 60));
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffDays = Math.floor(
                          diffMs / (1000 * 60 * 60 * 24)
                        );
                        if (diffMins < 60) return `${diffMins} mins ago`;
                        if (diffHours < 24) return `${diffHours} hours ago`;
                        return `${diffDays} days ago`;
                      })()
                    : ""}
                </Text>
              </View>
              <View
                style={[styles.statusBadge, { backgroundColor: "#E6F0FF" }]}
              >
                <Text style={[styles.statusText, { color: "#6C8EFF" }]}>
                  {job.status || "OOO"}
                </Text>
              </View>
            </View>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text
              style={styles.description}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {job.description}
            </Text>
            <View style={styles.jobInfoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="pricetag" size={18} color="#3ED598" />
                <Text style={[styles.infoText, { color: "#3ED598" }]}>
                  {job.salary}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={18} color="#40189D" />
                <Text style={[styles.infoText, { color: "#40189D" }]}>
                  {job.duration}
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
    zIndex: 5000,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0,
    minHeight: 40,
    minWidth: 80,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0,
    elevation: 3,
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
    fontSize: 18,
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000ff",
    marginBottom: 10,
  },

  description: {
    fontSize: 20,
    color: "#00000099",
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
    fontSize: 20,
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
