import { useTheme } from "@react-navigation/native";
import { StyleSheet, View, TextInput, Image } from "react-native";

interface BarDimenstions {
  height: number;
  width: number;
}
export default function SearchBar({ height, width }: BarDimenstions) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { height, width, backgroundColor: colors.card },
      ]}
    >
      <Image
        source={require("../assets/icons/srch.png")}
        tintColor={colors.text}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input]}
        clearButtonMode="always"
        placeholder="Search"
        placeholderTextColor={colors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 100,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 35,
    height: "100%",
  },
  icon: {
    width: 20,
    height: 20,
    position: "absolute",
    left: 10,
  },
});
