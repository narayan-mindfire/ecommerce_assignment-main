import { PermissionsAndroid } from "react-native";
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

const requestUserPermission = async () => {
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log("Notification permission granted");
  } else {
    console.log("Notification permission revoked");
  }
};

const getToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log(`FCM Token: ${token}`);
  } catch (error) {
    console.log(`Failed to get FCM token, ${error}`);
  }
};

const onMessageReceived = async (remoteMessage : any) => {
  console.log("Foreground Message Received:", remoteMessage);
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || "New Notification",
    body: remoteMessage.notification?.body || "You have a new message",
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
    },
  });
};

export const useNotification = () => {
  useEffect(() => {
    requestUserPermission();
    getToken();
    const unsubscribe = messaging().onMessage(onMessageReceived);
    return () => unsubscribe(); 
  }, []);
};
