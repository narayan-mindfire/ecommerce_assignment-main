import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ThemeState {
  mode: "light" | "dark" | "auto"; 
}
const initialState: ThemeState = {
  mode: "auto", 
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<"light" | "dark" | "auto">) => {state.mode = action.payload}
  },
});
export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;