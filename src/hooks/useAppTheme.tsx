import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DarkTheme from "../Themes/dark";
import LightTheme from "../Themes/light";
import { useColorScheme } from "react-native";
const useAppTheme = () => {
  const { mode } = useSelector((state: RootState) => state.theme);
  const scheme = useColorScheme();
  if ((mode === "auto" && scheme === "dark") || mode === "dark") {
    return DarkTheme;
  }
  return LightTheme;
};

export default useAppTheme;
