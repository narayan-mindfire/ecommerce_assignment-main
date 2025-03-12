import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { useTheme } from "@react-navigation/native";
import { ProfileParams } from "../../TypesDefined/NavTypes";
import { RootState, useAppSelector } from "../../redux/store";
import axios from "axios";
const Profile: FC<ProfileParams> = () => {
  const fetchPeople = async () => {
    try {
      const { data } = await axios.get(
        "https://api.github.com/users/narayan071"
      );
      console.log("User data:", JSON.parse(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const { colors } = useTheme();
  const userData = useAppSelector((state: RootState) => state.auth.user);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={
          userData
            ? { uri: userData?.image }
            : require("../../assets/images/defaultprofile.png")
        }
        style={styles.profileImage}
      />
      <Text style={[styles.name, { color: colors.text }]}>
        {userData?.username}
      </Text>
      <Text style={[styles.name, { color: colors.text }]}>
        {userData?.firstName} {userData?.lastName}
      </Text>
      <Text style={[styles.email, { color: colors.text }]}>
        {userData?.email}
      </Text>
      <TouchableOpacity
        style={{ height: 30, width: 60, margin: 20, backgroundColor: "pink" }}
        onPress={() => fetchPeople()}
      >
        <Text>request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
