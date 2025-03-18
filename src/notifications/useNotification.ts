import { PermissionsAndroid } from "react-native";
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import { navigate } from "../navigation/navigationService";

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

const handleNavigationOnPress = ({ type, detail } : any) => {
  switch (type) {
    case EventType.DISMISSED:
      console.log('User dismissed notification', detail.notification);
      break;
      case EventType.PRESS:
        navigate("Welcome")
        console.log('User pressed notification', detail.notification);
        break;
      }
    }

    const handleBackgroundNotification = async (remoteMessage : any) => {
        console.log("background message received")
        navigate("Explore");
    }

export const useNotification = () => {
  useEffect(() => {
    requestUserPermission();
    getToken();
    const unsubscribe = messaging().onMessage(onMessageReceived);
    const unsubscribe2 = notifee.onForegroundEvent(handleNavigationOnPress);
    const unsubscribebackgroudn = messaging().onNotificationOpenedApp(handleBackgroundNotification)
    return () =>{
      unsubscribe2()
      unsubscribe()}; 
    }, []);
};
