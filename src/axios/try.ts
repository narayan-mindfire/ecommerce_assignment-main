import axios from "axios";
import crashlytics from "@react-native-firebase/crashlytics";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      crashlytics().log("API Error: " + JSON.stringify(error.response.data));
      crashlytics().recordError(
        new Error(`API Error: ${error.response.status} - ${error.response.statusText}`)
      );
    } else if (error.request) {
      crashlytics().log("Network Error: No response from server");
      crashlytics().recordError(new Error("Network Error: No response received"));
    } else {
      crashlytics().log("Unknown API Error: " + error.message);
      crashlytics().recordError(new Error("Unknown API Error: " + error.message));
    }

    return Promise.reject(error);
  }
);

export default api;
