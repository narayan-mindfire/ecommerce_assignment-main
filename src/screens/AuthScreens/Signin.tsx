import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
} from "react-native";
import React, { useContext, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { SigninParams } from "../../TypesDefined/NavTypes";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { authenticateUser } from "../../redux/slices/authSlice";
const Welcome: React.FC<SigninParams> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const { dark, colors } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const signInHelpr = async () => {
    console.log("setting things in diapatch - signing");
    try {
      await dispatch(authenticateUser({ username, password }));
    } catch (error) {
      console.log(`couldn't sign the user in: ${error}`);
    }
    console.log(`user ${authState.user?.firstName} is stored in redux`);
  };
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={dark ? "light-content" : "dark-content"}
      />
      <Text style={[styles.header, { color: colors.text }]}>Sign in</Text>
      <View style={styles.inpBox}>
        <TextInput
          style={[
            styles.inp,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="Username"
          placeholderTextColor={colors.text}
          value={username}
          onChangeText={(val) => setUsername(val)}
        />
        <TextInput
          style={[
            styles.inp,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="Password"
          placeholderTextColor={colors.text}
          onChangeText={(pas) => setPassword(pas)}
        />
        <TouchableOpacity
          style={[
            styles.btn,
            styles.btncnt,
            { backgroundColor: colors.primary },
          ]}
          onPress={() => signInHelpr()}
        >
          <Text style={[styles.btntxtcnt]}>Continue</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: colors.text }}>
          Don't have an account ?{" "}
          <Text style={{ fontWeight: "700" }}>Create one</Text>
        </Text>
      </View>
      <View style={styles.inpBox}>
        <TouchableOpacity
          style={[styles.btn, styles.btnopt, { backgroundColor: colors.card }]}
        >
          <View>
            <Image
              style={styles.logo}
              source={require("../../assets/images/Group.png")}
              resizeMode="contain"
              tintColor={colors.text}
            />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.btntxtoth, { color: colors.text }]}>
              Continue With Apple
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btn,
            styles.btnopt,
            ,
            { backgroundColor: colors.card },
          ]}
        >
          <Image
            style={styles.logo}
            source={require("../../assets/images/Google.png")}
            resizeMode="contain"
          />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.btntxtoth, { color: colors.text }]}>
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnopt, { backgroundColor: colors.card }]}
        >
          <Image
            style={styles.logo}
            source={require("../../assets/images/Facebook.png")}
            resizeMode="contain"
          />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.btntxtoth, { color: colors.text }]}>
              Continue with Facebook
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    padding: 20,
    paddingTop: 50,
    marginHorizontal: "auto",
    height: "100%",
  },
  header: {
    marginTop: 80,
    fontSize: 32,
    fontWeight: 700,
    fontFamily: "Circular Std",
    lineHeight: 34.5,
  },
  inpBox: {
    marginTop: 20,
    width: "100%",
    height: 201,
    marginHorizontal: "auto",
    flexDirection: "column",
  },
  inp: {
    height: 56,
    width: "100%",
    borderRadius: 7,
    padding: 20,
    marginVertical: 5,
  },
  btn: {
    height: 49,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
    paddingHorizontal: 25,
  },
  btncnt: {
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnopt: {
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 5,
  },
  btntxtcnt: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 16,
  },
  btntxtoth: {
    fontWeight: "500",
    fontSize: 16,
  },
  logo: {
    height: 20,
    width: 24.59,
  },
});
