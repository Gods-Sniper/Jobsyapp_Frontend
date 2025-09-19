import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessPage() {
  const router = useRouter();
  const { jobId, amount } = useLocalSearchParams();

  const goHome = () => {
    router.replace("/(tabs)/notification");
  };

  return (
    <View style={styles.container}>
      {/* Check Icon */}
      <View style={styles.iconWrapper}>
        <Ionicons name="checkmark-circle" size={120} color="#2b8a3e" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Payment Successful!</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Thank you for your payment of{" "}
        <Text style={styles.amount}>${amount || "0.00"}</Text>
      </Text>

      {/* Job Reference */}
      {jobId && (
        <Text style={styles.jobRef}>
          Job Reference: <Text style={styles.jobId}>{jobId}</Text>
        </Text>
      )}

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton} onPress={goHome}>
        <Text style={styles.doneButtonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconWrapper: {
    marginBottom: 30,
    backgroundColor: "#e6f5ea",
    padding: 25,
    borderRadius: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  amount: {
    fontWeight: "700",
    color: "#2b8a3e",
  },
  jobRef: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  jobId: {
    fontWeight: "600",
    color: "#444",
  },
  doneButton: {
    backgroundColor: "#2b8a3e",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
