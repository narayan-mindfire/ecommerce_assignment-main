import React, { FC, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Welcome from "../screens/Welcome";
import Explore from "../screens/Explore";
import { RootStackParamList } from "../TypesDefined/NavTypes";
import Signin from "../screens/AuthScreens/Signin";
import DrawNav from "./Drawer";
import Profile from "../screens/userScreens/Profile";
import { RootState, useAppSelector } from "../redux/store";
import useAppTheme from "../hooks/useAppTheme";
const RootNav = createNativeStackNavigator<RootStackParamList>();

const RootStack: FC = () => {
  const appTheme = useAppTheme();
  const token = useAppSelector((store: RootState) => store.auth.token);
  useEffect(() => {
    console.log(`token: ${token}`);
  }, [token]);
  return (
    <NavigationContainer theme={appTheme}>
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
          </>
        )}
      </RootNav.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
