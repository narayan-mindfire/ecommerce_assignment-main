import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Alert } from "react-native";
import { googleSignIn, googleSignOut } from "@/src/services/auth/googleSignin";
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
  authMethod: "password" | "google" | null;
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
      return {
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

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    if (state.auth.authMethod === "google") {
      await googleSignOut();
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
        state.token = "herewithme"
        state.authMethod = "google"
      })
      .addCase(authenticateWithGoogle.rejected, (state, action) => {
        state.error = action.payload as string;
        Alert.alert("Google Sign-In Failed", state.error);
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
