import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function CreateJob() {
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Image 
            source={require("../assets/images/logo2.png")}
            style={styles.logo}
        >
        </Image>
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
          placeholderTextColor="#BDBDBD"
        />

        <View style={styles.pickerWrapper}>
          <Picker
            placeholder="Category"
            onValueChange={setCategory}
            style={styles.picker}
            dropdownIconColor="#40189D"
          >
            <Picker.Item label="Category" value="" color="#BDBDBD" />
            <Picker.Item label="House Cleaning" value="House Cleaning" />
            <Picker.Item label="Gardening" value="Gardening" />
            <Picker.Item label="Babysitting" value="Babysitting" />
            <Picker.Item label="Plumbing" value="Plumbing" />
            <Picker.Item label="Electrical Work" value="Electrical Work" />
            <Picker.Item label="Cooking" value="Cooking" />
            <Picker.Item label="Carpentry" value="Carpentry" />
            <Picker.Item label="Painting" value="Painting" />
            <Picker.Item label="Other" value="Other" />

          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#BDBDBD"
        />

        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor="#BDBDBD"
        />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={duration}
            onValueChange={setDuration}
            style={styles.picker}
            dropdownIconColor="#40189D"
          >
            <Picker.Item label="Duration" value="" color="#BDBDBD" />
            <Picker.Item label="1 day" value="1 day" />
            <Picker.Item label="2 days" value="2 days" />
            <Picker.Item label="1 week" value="1 week" />
            
          </Picker>
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
  logo:{
    width: "37%",
    height: 46,
    borderRadius: 25,   
  },
  headerUser: { 
    flexDirection: "row", 
    alignItems: "center" 
},
  byText: { 
    color: "#000000ff", 
    fontSize: 13, 
    marginBottom: 2 
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
    fontSize: 25 
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    color: "#181818",
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: "hidden",
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#181818",
    paddingHorizontal: 10,
  },
  descLabel: {
    marginLeft: 28,
    color: "#BDBDBD",
    fontWeight: "bold",
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
    justifyContent: "center" 
  },
  navText: { 
    fontSize: 12, 
    color: "#BDBDBD", 
    marginTop: 2 
},
  navTextActive: {
    fontSize: 12,
    color: "#40189D",
    marginTop: 2,
    fontWeight: "bold",
  },
});
