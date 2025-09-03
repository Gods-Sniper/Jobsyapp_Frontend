import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

const SignIn = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const local = useLocalSearchParams();
  console.log(local.role);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[0-9]{8,15}$/;
    return phoneRegex.test(phone);
  };

  const handleContinue = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      setError("⚠️ All fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("⚠️ Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("⚠️ Password must be at least 6 characters long.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("⚠️ Please enter a valid phone number.");
      return;
    }
    setError("");
    
    router.push({
      pathname: "/signin2",
      params: {
        name: name,
        phone: phone,
        email: email,
        password: password,
        role: local.role,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <Image
            source={require("../../assets/images/logo4.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>JobSy</Text>
        </View>
        <View style={styles.formSection}>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>
            Please fill registration form below
          </Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Henry Kanwil"
              placeholderTextColor="#40189D"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="henrykanwil@mail.com"
              placeholderTextColor="#40189D"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#40189D"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Feather
                name={passwordVisible ? "eye" : "eye-off"}
                size={24}
                color="#40189D"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Phone Numbers"
              placeholderTextColor="#40189D"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          {error !== "" && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            By tapping “Sign Up” you accept our{" "}
            <Text style={styles.termsLink}>terms</Text> and{" "}
            <Text style={styles.termsLink}>condition</Text>
          </Text>
          <Text style={styles.haveAccountText}>Already have an account?</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F3FF",
    alignItems: "center",
    paddingTop: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#40189D",
    fontFamily: "Poppins bold-italic",
  },
  formSection: {
    width: "100%",
    backgroundColor: "#F7F3FF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 32,
    paddingTop: 35,
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#505050",
    marginBottom: 24,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    height: 52,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#40189D",
  },
  eyeIconContainer: {
    padding: 6,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: "#40189D",
  },
  continueButton: {
    backgroundColor: "#40189D",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 18,
    marginTop: 6,
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  termsText: {
    color: "#505050",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },
  termsLink: {
    color: "#40189D",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
  haveAccountText: {
    color: "#505050",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: "#ECE6F6",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#40189D",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
