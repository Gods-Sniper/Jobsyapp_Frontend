// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { API_BASE_URL } from "./config";

// export default function PaymentPage() {
//   const { jobId, amount, applicantId } = useLocalSearchParams();
//   const router = useRouter();

//   const [cardNumber, setCardNumber] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [name, setName] = useState("");
//   const [senderNumber, setSenderNumber] = useState("");
//   const [receiverNumber, setReceiverNumber] = useState("");

//   const [jobTitle, setJobTitle] = useState("");
//   const [jobsalary, setJobSalary] = useState("");
//   const [applicantName, setApplicantName] = useState("");

//   useEffect(() => {
//     // Fetch job details
//     const fetchJob = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
//         const data = await res.json();
//         setJobTitle(data?.job.title || "nothing");
//         setJobSalary(data?.job?.salary ? `${data.job.salary} XAF` : "");
//       } catch {
//         setJobTitle("");
//         setJobSalary("");
//       }
//     };
//     // Fetch applicant details
//     const fetchApplicant = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/${applicantId}`);
//         const data = await res.json();
//         setApplicantName(data?.user?.name || "");
//       } catch {
//         setApplicantName("");
//       }
//     };
//     if (jobId) fetchJob();
//     if (applicantId) fetchApplicant();
//   }, [jobId, applicantId]);

//   const handlePayment = () => {
//     if (
//       !cardNumber ||
//       !expiry ||
//       !cvv ||
//       !name ||
//       !senderNumber ||
//       !receiverNumber
//     ) {
//       Alert.alert("Missing Info", "Please fill in all the fields.");
//       return;
//     }
//     // TODO: Integrate real payment API (Stripe/PayPal/etc.)
//     Alert.alert("Payment Successful", "", [
//       {
//         text: "OK",
//         onPress: () =>
//           router.replace(
//             `./success?jobId=${jobId}&amount=${amount}&applicantId=${applicantId}`
//           ),
//       },
//     ]);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Payment</Text>
//       <Text style={styles.subHeader}>
//         Complete your payment for{" "}
//         <Text style={styles.amount}>{jobTitle ? jobTitle : "Nothing"}</Text>
//       </Text>
//       <View style={styles.infoCard}>
//         <Text style={styles.infoText}>
//           <Text style={styles.infoLabel}>Applicant: </Text>
//           {applicantName || "Nothing"}
//         </Text>
//         <Text style={styles.infoText}>
//           <Text style={styles.infoLabel}>Salary: </Text>
//           {jobsalary || `${amount || "Nothing bro"} XAF`}
//         </Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.label}>Cardholder Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="John Doe"
//           value={name}
//           onChangeText={setName}
//         />

//         <Text style={styles.label}>Card Number</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="1234 5678 9012 3456"
//           keyboardType="numeric"
//           value={cardNumber}
//           onChangeText={setCardNumber}
//         />

//         <View style={styles.row}>
//           <View style={[styles.col, { marginRight: 10 }]}>
//             <Text style={styles.label}>Expiry Date</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="MM/YY"
//               value={expiry}
//               onChangeText={setExpiry}
//             />
//           </View>
//           <View style={styles.col}>
//             <Text style={styles.label}>CVV</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="***"
//               keyboardType="numeric"
//               secureTextEntry
//               value={cvv}
//               onChangeText={setCvv}
//             />
//           </View>
//         </View>

//         <Text style={styles.label}>Sender Phone Number</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Your phone number"
//           keyboardType="phone-pad"
//           value={senderNumber}
//           onChangeText={setSenderNumber}
//         />

//         <Text style={styles.label}>Receiver Phone Number</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Receiver's phone number"
//           keyboardType="phone-pad"
//           value={receiverNumber}
//           onChangeText={setReceiverNumber}
//         />

//         <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
//           <Ionicons name="card-outline" size={20} color="#fff" />
//           <Text style={styles.payButtonText}>
//             Pay {jobsalary || `${amount || "Nothing bro try again"} XAF`}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#f7f7f7",
//     flexGrow: 1,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 5,
//     color: "#333",
//   },
//   subHeader: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 20,
//   },
//   amount: {
//     color: "#2b8a3e",
//     fontWeight: "bold",
//   },
//   infoCard: {
//     backgroundColor: "#e9f5ee",
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 18,
//   },
//   infoText: {
//     fontSize: 16,
//     color: "#222",
//     marginBottom: 4,
//   },
//   infoLabel: {
//     fontWeight: "bold",
//     color: "#2b8a3e",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#555",
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 16,
//     backgroundColor: "#fafafa",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   col: {
//     flex: 1,
//   },
//   payButton: {
//     backgroundColor: "#2b8a3e",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 16,
//     borderRadius: 12,
//     marginTop: 10,
//   },
//   payButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//     marginLeft: 8,
//   },
// });

import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { API_BASE_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PaymentPage() {
  const { jobId, amount, applicantId } = useLocalSearchParams();
  const router = useRouter();

  const [senderNumber, setSenderNumber] = useState("");
  const [receiverNumber, setReceiverNumber] = useState("");
  const [status, setStatus] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [jobsalary, setJobSalary] = useState("");
  const [applicantName, setApplicantName] = useState("");

  useEffect(() => {
    // Fetch job details
    const fetchJob = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        // console.log(data.job);
        setJobTitle(data?.job?.title || "nothing");
        setJobSalary(data?.job?.salary ? `${data.job.salary} XAF` : "");
        setApplicantName(data?.job.assignedTo.name || {});
      } catch {
        setJobTitle("");
        setJobSalary("");
      }
    };
    // Fetch applicant details
    // const fetchApplicant = async () => {
    //   try {
    //     const res = await fetch(`${API_BASE_URL}/application/${applicantId}`);
    //     const data = await res.json();
    //     setApplicantName(data?.user?.name || "");
    //   } catch {
    //     setApplicantName("");
    //   }
    //   console.log(applicantId);
    // };
    if (jobId) fetchJob();
    // if (applicantId) fetchApplicant();
  }, [jobId, applicantId]);

  const handlePayment = async () => {
    if (!senderNumber || !receiverNumber) {
      Alert.alert("Missing Info", "Please fill in both phone numbers.");
      return;
    }
    console.log("hello");

    try {
      const res = await axios.post(`${API_BASE_URL}/payment/request`, {
        amount: jobsalary.replace(" XAF", "") || amount,
        from: senderNumber,
        to: receiverNumber,
        description: `Payment for job: ${jobTitle}`,
      });
      console.log(res.data);
      setStatus(`Payment Requested! Ref: ${res.data.reference}`);
      Alert.alert("Payment Successful", `Reference: ${res.data.reference}`, [
        {
          text: "OK",
          onPress: () =>
            router.replace(
              `./success?jobId=${jobId}&amount=${amount}&applicantId=${applicantId}`
            ),
        },
      ]);
    } catch (err) {
      setStatus("Payment Failed. Try again.");
      Alert.alert("Payment Failed", "Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Payment</Text>
      <Text style={styles.subHeader}>
        Complete your payment for{" "}
        <Text style={styles.amount}>{jobTitle || "Job"}</Text>
      </Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Applicant: </Text>
          {applicantName || "N/A"}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Salary: </Text>
          {jobsalary || `${amount || "0.00"} XAF`}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Sender Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Your phone number"
          keyboardType="phone-pad"
          value={senderNumber}
          onChangeText={setSenderNumber}
        />

        <Text style={styles.label}>Receiver Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Receiver's phone number"
          keyboardType="phone-pad"
          value={receiverNumber}
          onChangeText={setReceiverNumber}
        />

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Ionicons name="card-outline" size={20} color="#fff" />
          <Text style={styles.payButtonText}>
            Pay {jobsalary || `${amount || "0.00"} XAF`}
          </Text>
        </TouchableOpacity>
        {status ? <Text style={styles.status}>{status}</Text> : null}
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
  infoCard: {
    backgroundColor: "#e9f5ee",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  infoText: {
    fontSize: 16,
    color: "#222",
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#2b8a3e",
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
  status: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 16,
    color: "#2b8a3e",
    fontWeight: "bold",
  },
});
