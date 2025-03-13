import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useCallback, useEffect } from "react";
import { WelcomeParams } from "../TypesDefined/NavTypes";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Welcome: FC<WelcomeParams> = ({ navigation }) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "691740424422-0lqh5fmsc9navf692oagkp5f3rs20hq5.apps.googleusercontent.com",
    });
  }, []);
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      console.log("has play service");
      const userInfo = await GoogleSignin.signIn();
      // console.log("signin function called");
      console.log("Google Sign-In Success:", userInfo);
      Alert.alert("Success", `Welcome, ${userInfo.user.name}!`);
    } catch (error) {
      console.log("Google Sign-In Error:", error);
      Alert.alert("Error", "Google Sign-In Failed.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Exit App", "Are you sure you want to exit the app?", [
          {
            text: "Cancle",
            onPress: () => null,
          },
          {
            text: "Yes",
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => backHandler.remove();
    }, [])
  );
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.headtext, { color: colors.text }]}>Welcome!</Text>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.card }]}
        onPress={() => navigation.push("Explore")}
      >
        <Text style={[styles.btntxt, { color: colors.text }]}>explore</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.card }]}
        onPress={() => navigation.push("Signin")}
      >
        <Text style={[styles.btntxt, { color: colors.text }]}>
          Authenticate
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.card }]}
        onPress={() => googleSignIn()}
      >
        <Text style={[styles.btntxt, { color: colors.text }]}>
          googleSignin
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  headtext: {
    fontSize: 32,
    fontWeight: "800",
  },
  btn: {
    height: 40,
    width: 100,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  btntxt: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
});
