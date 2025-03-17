import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { ExploreParams } from "../TypesDefined/NavTypes";
import { useTheme } from "@react-navigation/native";
import notifee from "@notifee/react-native";
const Explore: FC<ExploreParams> = ({ navigation }) => {
  async function onDisplayNotification() {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
    await notifee.displayNotification({
      title: "Notification Title",
      body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',

      android: {
        channelId,
        actions: [
          {
            title: "<b>Dance</b> &#128111;",
            pressAction: { id: "dance" },
          },
          {
            title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
            pressAction: { id: "cry" },
          },
        ],
      },
    });
  }
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>Explore</Text>
      <TouchableOpacity onPress={onDisplayNotification}>
        <Text style={{ color: colors.text, margin: 30 }}>get notified</Text>
      </TouchableOpacity>
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
