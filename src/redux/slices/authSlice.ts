import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Alert } from "react-native";
import { googleSignIn, googleSignOut } from "@/src/services/auth/googleSignin";
import auth from "@react-native-firebase/auth";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";

const LOGIN_API = "https://dummyjson.com/auth/login";

interface UserData {
  accessToken?: string
  email?: string
  firstName?: string
  id: number | string
  image?: string
  lastName?: string
  username?: string
}


interface AuthState {
  user: UserData | null;
  token: string | undefined;
  error: string | null;
  authMethod: "password" | "google" | "facebook" | null;
}

const initialState: AuthState = {
  user: null,
  token: undefined,
  error: null,
  authMethod: null,
};

export const authenticateUser = createAsyncThunk<UserData, { username: string; password: string }>(
  "auth/authenticateUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(LOGIN_API, { username, password });
      return response.data as UserData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const authenticateWithGoogle = createAsyncThunk<UserData>(
  "auth/authenticateWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const userInfo = await googleSignIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.data?.idToken ?? null);

      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;

      return {
        accessToken: userInfo.data?.idToken || "",
        email: userInfo.data?.user.email,
        firstName: userInfo.data?.user.givenName || "",
        lastName: userInfo.data?.user.familyName || "",
        id: userInfo.data?.user.id || "",
        image: userInfo.data?.user.photo || "",
        username: userInfo.data?.user.name || "unknown username",
      };
    } catch (error) {
      return rejectWithValue("Google Sign-In Failed");
    }
  }
);

export const authenticateWithFacebook = createAsyncThunk<UserData>(
  "auth/authenticateWithFacebook",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Attempting Facebook login...");
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
      
      if (result.isCancelled) {
        return rejectWithValue("User cancelled the login process");
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        return rejectWithValue("Failed to obtain Facebook access token");
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      const userCredentials = await auth().signInWithCredential(facebookCredential);
      const userInfo = userCredentials.user;

      return {
        accessToken: data.accessToken,
        email: userInfo.email || "no mail",
        firstName: userInfo.displayName || "",
        lastName: "",
        id: userInfo.uid || "",
        image: userInfo.photoURL || "",
        username: userInfo.displayName || "unknown username",
      };
    } catch (error) {
      console.error("Facebook login error:", error);
      return rejectWithValue("Facebook Sign-In Failed");
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    if (state.auth.authMethod === "google") {
      await googleSignOut();
    }
    else if(state.auth.authMethod === "facebook"){
      try {
        await auth().signOut()
        LoginManager.logOut();
        console.log("User logged out");
      } catch (error) {
        console.error(error);
      }
    }
  }
);




const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.token = action.payload.accessToken;
        state.authMethod = "password"
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.error = (action.payload as string) || "An error occurred";
        Alert.alert("Login Failed", state.error);
      })
      .addCase(authenticateWithGoogle.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.token = action.payload.accessToken
        state.authMethod = "google"
      })
      .addCase(authenticateWithFacebook.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.token = action.payload.accessToken
        state.authMethod = "facebook"
      })
      .addCase(authenticateWithGoogle.rejected, (state, action) => {
        state.error = action.payload as string;
        Alert.alert("Google Sign-In Failed", state.error);
      })
      .addCase(authenticateWithFacebook.rejected, (state, action) => {
        state.error = action.payload as string;
        Alert.alert("Facebook Sign-In Failed", state.error);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = undefined;
        state.authMethod = null;
        Alert.alert("logged out", "logout was successful");
      })
  },
});

export default authSlice.reducer;
