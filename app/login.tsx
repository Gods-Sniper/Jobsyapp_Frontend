import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("percy@gmail.com");
  const [password, setPassword] = useState("1234567890");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      // console.log("Please fill in both fields.");
      setError("⚠️ Please fill in both username and password.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("⚠️ Please enter a valid email address.");
      return;
    }
    setError("");

    let body = JSON.stringify({
      email: email,
      password: password,
    });
    fetch("http://192.168.100.150:4000/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        charset: "utf-8",
      },
      body: body,
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("response data:", data);
        const { status, message } = data;

        if (status === "error") {
          Alert.alert("Ouups: ", message);
        } else {
          if (status === "success") {
            Alert.alert("Great !!: ", message);
            setEmail("");
            setPassword("");
            setTimeout(() => {
              router.push("/Homepage");
            }, 1000);
          }
        }
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <Image
            source={require("../assets/images/logo4.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>JobSy</Text>
        </View>
        <View style={styles.formSection}>
          <Text style={styles.signInTitle}>Log In</Text>
          <Text style={styles.signInSubtitle}>
            Please sign in to your registered account
          </Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#40189D"
              value={email}
              onChangeText={setEmail}
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
          <View style={styles.resetRow}>
            <Text style={styles.resetText}>Forgot your password?</Text>
            <TouchableOpacity>
              <Text style={styles.resetLink}>Reset here</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.orSignIn}>Or sign in with</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../assets/images/iconGoogle.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../assets/images/Facebookimg.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => router.push("/signin")}
          >
            <Text style={styles.createAccountText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;

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
    width: 90,
    height: 90,
    marginBottom: 6,
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
    marginTop: 10,
    paddingHorizontal: 32,
    paddingTop: 24,
    flex: 1,
  },
  signInTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  signInSubtitle: {
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
    borderWidth: 1,
    borderColor: "#40189D",
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
  loginButton: {
    backgroundColor: "#40189D",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    marginTop: 6,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  resetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    justifyContent: "center",
  },
  resetText: {
    color: "#505050",
    fontSize: 14,
  },
  resetLink: {
    color: "#40189D",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 6,
    textDecorationLine: "underline",
  },
  orSignIn: {
    textAlign: "center",
    color: "#505050",
    fontSize: 15,
    marginBottom: 14,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 24,
  },
  socialButton: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    marginHorizontal: 8,
    shadowColor: "#40189D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  socialIcon: {
    width: 32,
    height: 32,
  },
  createAccountButton: {
    backgroundColor: "#ECE6F6",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  createAccountText: {
    color: "#40189D",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
