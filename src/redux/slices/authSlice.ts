import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Alert } from "react-native";
const LOGIN_API = "https://dummyjson.com/auth/login";

interface UserData {
  accessToken: string;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  image: string;
  lastName: string;
  refreshToken: string;
  username: string;
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
};
export const authenticateUser = createAsyncThunk(
  "auth/authenticateUser",
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(LOGIN_API, { username, password });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      console.log("logged out in redux successful")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.user = action.payload;
        state.token = action.payload.accessToken;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.error = (action.payload as string) || "An error occurred";
        Alert.alert("Login Failed", state.error);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
