import React, { FC, useEffect, useRef } from "react";
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

const RootNav = createNativeStackNavigator<RootStackParamList>();

const RootStack: FC = () => {
  const routeNameRef = useRef<string | null>(null);
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);
  const appTheme = useAppTheme();
  const token = useAppSelector((store: RootState) => store.auth.token);

  useNotification();

  useEffect(() => {
    console.log(`token: ${token}`);
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
