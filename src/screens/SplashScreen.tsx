import { StyleSheet, Text, View } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={[styles.headtext, { color: "#fff" }]}>
        clot! splash screen
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#000",
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
