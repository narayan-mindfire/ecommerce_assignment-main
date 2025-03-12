import { DrawerScreenProps } from "@react-navigation/drawer";
import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RootStackParamList = {
    Welcome : undefined,
    Explore: undefined,
    Signin : undefined,
    Signup: undefined,
    DrawNav : undefined,
    Profile: undefined
}
export type DrawerParamList = {
  DashBoard: undefined;
  Settings: undefined;
};
export type WelcomeParams = NativeStackScreenProps<RootStackParamList, 'Welcome'>
export type ExploreParams = NativeStackScreenProps<RootStackParamList, 'Explore'>
export type SigninParams = NativeStackScreenProps<RootStackParamList, 'Signin'>
export type SignupParams = NativeStackScreenProps<RootStackParamList, 'Signup'>
export type ProfileParams = NativeStackScreenProps<RootStackParamList, 'Profile'>

