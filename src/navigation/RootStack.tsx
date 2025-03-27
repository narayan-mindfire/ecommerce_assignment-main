import React, { FC, useEffect, useRef, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import Welcome from "../screens/Welcome";
import Explore from "../screens/Explore";
import { RootStackParamList } from "../TypesDefined/NavTypes";
import Signin from "../screens/AuthScreens/Signin";
import DrawNav from "./Drawer";
import Profile from "../screens/userScreens/Profile";
import { RootState, useAppSelector } from "../redux/store";
import useAppTheme from "../hooks/useAppTheme";
import ProductDetails from "../screens/ProductScreens/ProductDetails";
import { useNotification } from "../notifications/useNotification";
import analytics from "@react-native-firebase/analytics";
import { Alert, Linking } from "react-native";

const RootNav = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ["myapp://"],
  config: {
    screens: {
      Home: "home",
      ProductDetails: "product/:id",
      SignIn: "signin",
    },
  },
};

const RootStack: FC = () => {
  const routeNameRef = useRef<string | null>(null);
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);
  const appTheme = useAppTheme();
  const token = useAppSelector((store: RootState) => store.auth.token);

  useNotification();
  const [pendingDeepLink, setPendingDeepLink] = useState<string | null>(null);

  useEffect(() => {
    const handleDeepLinks = (event: { url: string }) => {
      const { url } = event;
      console.log("URL Provided: ", url);
      try {
        const path = url.replace(/^myapp:\/\//, "");
        console.log("Extracted path: ", path);

        const pathParts = path.split("/");
        const productId = parseInt(pathParts[1] ?? "1", 10);

        console.log("Extracted product ID: ", productId);

        if (!token) {
          setPendingDeepLink(`product/${productId}`);
          Alert.alert("Login Needed!", "Please login first.");
        } else {
          console.log("Navigating to product with ID: ", productId);
          navigationRef.current?.navigate("ProductDetails", { id: productId });
        }
      } catch (error) {
        console.error("Error parsing URL:", error);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLinks);

    return () => {
      subscription.remove();
    };
  }, [token]);

  useEffect(() => {
    console.log(`token: ${token}`);
    if (token && pendingDeepLink) {
      console.log("Redirecting to pending deep link:", pendingDeepLink);
      navigationRef.current?.navigate("ProductDetails", {
        id: parseInt(pendingDeepLink.split("/")[1]),
      });
      setPendingDeepLink(null);
    }
  }, [token]);

  return (
    <NavigationContainer
      theme={appTheme}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current =
          navigationRef.current?.getCurrentRoute()?.name ?? null;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          navigationRef.current?.getCurrentRoute()?.name ?? null;

        if (previousRouteName !== currentRouteName && currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <RootNav.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <>
            <RootNav.Screen name="Welcome" component={Welcome} />
            <RootNav.Screen name="Explore" component={Explore} />
            <RootNav.Screen name="Signin" component={Signin} />
          </>
        ) : (
          <>
            <RootNav.Screen name="DrawNav" component={DrawNav} />
            <RootNav.Screen name="Profile" component={Profile} />
            <RootNav.Screen name="ProductDetails" component={ProductDetails} />
          </>
        )}
      </RootNav.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
