import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

GoogleSignin.configure({
  webClientId: "691740424422-0lqh5fmsc9navf692oagkp5f3rs20hq5.apps.googleusercontent.com",
});

export const googleSignIn = async () => {
  try {
    console.log("google sign in called")
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert("Cancelled", "Google sign-in was cancelled.");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      Alert.alert("Sign-In In Progress", "Google sign-in is already in progress.");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert("Error", "Google Play Services not available.");
    } else {
      Alert.alert("Error", "Google Sign-In Failed.");
    }
    throw error;
  }
};

export const googleSignOut = async () => {
  try {
    await GoogleSignin.signOut();
    console.log("User signed out from Google");
  } catch (error) {
    console.error(error);
  }
};
