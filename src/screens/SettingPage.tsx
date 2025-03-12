import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../redux/slices/ThemeSlice";
import { RootState, AppDispatch } from "../redux/store";

const SettingPage = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const themeState = useSelector((state: RootState) => state.theme);
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>Setting Page</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.getParent()?.navigate("Profile")}
      >
        <Text style={styles.btntxt}>Visit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => dispatch(changeTheme("dark"))}
      >
        <Text style={styles.btntxt}>
          Dark Mode : {themeState.mode === "dark" ? "true" : "false"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => dispatch(changeTheme("light"))}
      >
        <Text style={styles.btntxt}>
          Light Mode: {themeState.mode === "light" ? "true" : "false"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => dispatch(changeTheme("auto"))}
      >
        <Text style={styles.btntxt}>
          Auto Mode: {themeState.mode === "auto" ? "true" : "false"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    height: 40,
    width: 150,
    borderRadius: 20,
    backgroundColor: "#8E6CEF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  btntxt: {
    color: "#fff",
    fontWeight: "bold",
  },
});
