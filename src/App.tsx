import React from "react";
import RootStack from "./navigation/RootStack";
// import { ThemeProvider } from "./context/ThemeContext";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useNotification } from "./notifications/useNotification";
import SplashScreen from "./screens/SplashScreen";
export const App = () => {
  useNotification();
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <RootStack />
      </PersistGate>
    </Provider>
  );
};

export default App;
