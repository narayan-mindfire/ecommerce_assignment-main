import { Alert, PermissionsAndroid } from "react-native";
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import { navigate } from "../navigation/navigationService";
import { RootState, useAppSelector } from "../redux/store";

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

const onMessageReceived = async (remoteMessage: any) => {
  console.log("Foreground Message Received:", remoteMessage);
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || "New Notification",
    body: remoteMessage.notification?.body || "You have a new message",
    data: remoteMessage.data,
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
    },
  });
};


const handleNavigationOnPress = ({ type, detail }: any, token: string | null) => {
  switch (type) {
    case EventType.DISMISSED:
      console.log("User dismissed notification", detail.notification);
      break;

    case EventType.PRESS:
      const screen = detail.notification?.data?.screen || detail.data?.screen;
      const productId = detail.notification?.data?.productId;
      console.log("received productId : ", productId)
      console.log(".")
      console.log(".")
      console.log(".")
      console.log(".")
      console.log(detail);
      if (token === null) {
        console.log("token is null")
        console.log("sending alert ")
        alert("hey login required")
        return;
      }
      console.log("the screen navigating to: ", screen)
      if(screen){
        try {
          navigate(screen)
        } catch (error) {
          console.log("cannot navigate to screen: ", screen)
        }
      }

  }
};

const handleBackgroundNotification = async (notification: any, token: string | null) => {
  console.log("Background message received:", notification);

  const screen = notification?.data?.screen;
  const productId = notification?.data?.productId;  
  console.log("received productId : ", productId)
  if(token) console.log("token is there")
  if (!token) {
    Alert.alert("Login Required", "You need to login first to access this page.");
    return;
  }

  if(screen){
    try {
      navigate(screen)
    } catch (error) {
      console.log("cannot navigate to screen: ", screen)
    }
  }
};

export const useNotification = () => {
  // const token = useAppSelector((store: RootState) => store.auth.token);
  // console.log("auth token: ", token)
  const token = "narayan"
  useEffect(() => {
    requestUserPermission();
    getToken();

    const unsubscribeForegroundMessage = messaging().onMessage(onMessageReceived);
    const unsubscribeForegroundEvent = notifee.onForegroundEvent((event) => handleNavigationOnPress(event, token));
    const unsubscribeBackground = messaging().onNotificationOpenedApp((notification) =>
      handleBackgroundNotification(notification, token)
    );

    return () => {
      unsubscribeForegroundMessage();
      unsubscribeForegroundEvent();
      unsubscribeBackground();
    };
  }, [token]);
};
