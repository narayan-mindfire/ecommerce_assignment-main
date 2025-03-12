import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API = axios.create({
    baseURL: 'https://dummyjson.com',
})
API.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        } catch (error) {
            console.log("Error fetching token:", error);
        }
        return config;
    },
    (error) => {
        console.log(`Error occurred in request: ${error}`);
        return Promise.reject(error);
    }
);
export const getCurUser = async() => {
        try {
            console.log("getCurUser is called")
            const response = await API.get("/auth/me")
            if(response.data){
                await AsyncStorage.setItem("userData", JSON.stringify(response.data))
                const unuserData = await (AsyncStorage.getItem("userData"))
            }
        } catch (error) {
            console.log(`received error : ${error}`)
        }
}


export default getCurUser