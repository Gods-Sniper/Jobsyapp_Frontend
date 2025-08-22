import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

export default function CreateJob() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryItems, setCategoryItems] = useState([
    { label: "House Cleaning", value: "House Cleaning" },
    { label: "Gardening", value: "Gardening" },
    { label: "Babysitting", value: "Babysitting" },
    { label: "Plumbing", value: "Plumbing" },
    { label: "Electrical Work", value: "Electrical Work" },
    { label: "Cooking", value: "Cooking" },
    { label: "Carpentry", value: "Carpentry" },
    { label: "Painting", value: "Painting" },
    { label: "Other", value: "Other" },
  ]);

  const [durationOpen, setDurationOpen] = useState(false);
  const [duration, setDuration] = useState("");
  const [durationItems, setDurationItems] = useState([
    { label: "1 Hour", value: "1 Hour" },
    { label: "2 Hours", value: "2 Hours" },
    { label: "4 Hours", value: "4 Hours" },
    { label: "1 day", value: "1 day" },
    { label: "2 days", value: "2 days" },
    { label: "1 week", value: "1 week" },
    { label: "1 month", value: "1 month" },
    { label: "3 month", value: "3 month" },
  ]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const onCategoryOpen = () => {
    setDurationOpen(false);
  };
  const onDurationOpen = () => {
    setCategoryOpen(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8F4FF" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Image
            source={require("../assets/images/logo2.png")}
            style={styles.logo}
          />
          <View style={styles.headerUser}>
            <View>
              <Text style={styles.byText}>By la_voisine_du_quartier</Text>
            </View>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>B</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.title}>Create New Job</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#000000ff"
          />

          
          <View style={{ zIndex: 2000 }}>
            <DropDownPicker
              open={categoryOpen}
              value={category}
              items={categoryItems}
              setOpen={setCategoryOpen}
              setValue={setCategory}
              setItems={setCategoryItems}
              placeholder="Category"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onOpen={onCategoryOpen}
              listMode="SCROLLVIEW"
              zIndex={2000}
              zIndexInverse={1000}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#000000ff"
          />

          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor="#000000ff"
          />

          
          <View style={{ zIndex: 1000 }}>
            <DropDownPicker
              open={durationOpen}
              value={duration}
              items={durationItems}
              setOpen={setDurationOpen}
              setValue={setDuration}
              setItems={setDurationItems}
              placeholder="Duration"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              onOpen={onDurationOpen}
              listMode="SCROLLVIEW"
              zIndex={1000}
              zIndexInverse={2000}
            />
          </View>

          <Text style={styles.descLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.descInput]}
            placeholder="Give a brief description about the job services you are ptovdeing"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            placeholderTextColor="#BDBDBD"
          />

          <TouchableOpacity style={styles.createBtn}>
            <Text style={styles.createBtnText}>Create</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color="#40189D" />
            <Text style={styles.navTextActive}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="hand-left-outline" size={24} color="#BDBDBD" />
            <Text style={styles.navText}>Interviews</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="#BDBDBD"
            />
            <Text style={styles.navText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="#BDBDBD" />
            <Text style={styles.navText}>Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F4FF" },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8,
    backgroundColor: "#E6E0FF",
    justifyContent: "space-between",
  },
  logo: {
    width: "37%",
    height: 46,
    borderRadius: 25,
  },
  headerUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  byText: {
    color: "#000000ff",
    fontSize: 13,
    marginBottom: 2,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: "#033a24ff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  avatarText: {
    color: "#ffffffff",
    fontWeight: "bold",
    fontSize: 25,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#40189D",
    marginTop: 18,
    marginBottom: 18,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 14,
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    color: "#000000ff",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 0,
    width: "90%",
    minHeight: 56,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginHorizontal: 20,
    borderWidth: 0,
    elevation: 3,
  },
  descLabel: {
    marginLeft: 28,
    color: "#000000ff",
    marginBottom: 4,
    fontSize: 15,
  },
  descInput: {
    minHeight: 10,
    textAlignVertical: "top",
  },
  createBtn: {
    backgroundColor: "#40189D",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginHorizontal: 60,
    marginTop: 18,
    marginBottom: 30,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
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
    color: "#BDBDBD",
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 12,
    color: "#40189D",
    marginTop: 2,
    fontWeight: "bold",
  },
});
