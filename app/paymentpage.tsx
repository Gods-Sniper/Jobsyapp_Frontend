import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PaymentPage() {
  const { jobId, amount } = useLocalSearchParams(); // amount can be passed from previous screen
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const handlePayment = () => {
    if (!cardNumber || !expiry || !cvv || !name) {
      Alert.alert("Missing Info", "Please fill in all the fields.");
      return;
    }
    // TODO: Integrate real payment API (Stripe/PayPal/etc.)
    Alert.alert("Payment Successful", "", [
      {
        text: "OK",
        onPress: () =>
          router.replace(`./success?jobId=${jobId}&amount=${amount}`),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Payment</Text>
      <Text style={styles.subHeader}>
        Complete your payment for{" "}
        <Text style={styles.amount}>${amount || "0.00"}</Text>
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />

        <View style={styles.row}>
          <View style={[styles.col, { marginRight: 10 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={expiry}
              onChangeText={setExpiry}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="***"
              keyboardType="numeric"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Ionicons name="card-outline" size={20} color="#fff" />
          <Text style={styles.payButtonText}>Pay ${amount || "0.00"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subHeader: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  amount: {
    color: "#2b8a3e",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
  },
  payButton: {
    backgroundColor: "#2b8a3e",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
});
