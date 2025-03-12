import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { ExploreParams } from "../TypesDefined/NavTypes";
import { useTheme } from "@react-navigation/native";

const Explore: FC<ExploreParams> = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>Explore</Text>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
