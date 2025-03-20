import { Alert, PermissionsAndroid } from "react-native";
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType, AuthorizationStatus} from "@notifee/react-native";
import { navigate } from "../navigation/navigationService";
import { RootState, useAppSelector } from "../redux/store";

const requestUserPermission = async () => {
  const granted = await notifee.requestPermission();
  if (granted.authorizationStatus === AuthorizationStatus.DENIED) {
    console.log('User denied permissions request');
  } else if (granted.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    console.log('User granted permissions request');
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
interface payloadType {
  screen : string,
  productId: number
}
const handlePayloadNavigation = (payload :payloadType ) => {
  if(payload){
    if(payload.screen === "ProductDetails"){
      try {
        console.log(payload.screen)
        console.log(payload.productId, typeof(payload.productId))
        navigate(payload.screen,{id: payload.productId})
      } catch (error) {
        console.log("cannot navigate to screen: ", screen)
      } 
    }
    else if(payload.screen === "Settings"){
      try {
        navigate(payload.screen)
      } catch (error) {
        console.log("cannot navigate to screen: ", screen)
      } 
    }
    else if(payload.screen === "Profile"){
      try {
        navigate(payload.screen)
      } catch (error) {
        console.log("cannot navigate to screen: ", screen)
      } 
    }
  }
  else navigate("DashBoard")
}

const handleNavigationOnPress = ({ type, detail }: any, token: string | undefined) => {
  console.log("running handlenavigation on press function")
  switch (type) {
    case EventType.DISMISSED:
      console.log("User dismissed notification", detail.notification);
      break;
    case EventType.PRESS:
      console.log("notification pressed")
      if (token === undefined) {
        console.log("token is undefined")
        setTimeout(() => {
          Alert.alert("Login Required", "You need to log in first to access this page.");
        }, 1000); 
        return;
      }
      let payload = undefined
      if(detail.notification.data.payload){
          payload = JSON.parse(detail.notification?.data?.payload);
      }
      handlePayloadNavigation(payload)
  }
};

const handleBackgroundNotification = async (notification: any, token: string | undefined) => {
  let payload = undefined
  if (!token) {
    setTimeout(() => {
      Alert.alert("Login Required", "You need to log in first to access this page.");
    }, 1000); 
    return;
  }
  if(notification.data.payload){
      payload = JSON.parse(notification?.data?.payload);
  }
  handlePayloadNavigation(payload)
};

export const useNotification = () => {
  const token = useAppSelector((store: RootState) => store.auth.token);
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
