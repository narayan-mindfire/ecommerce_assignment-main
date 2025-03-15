import {PermissionsAndroid} from 'react-native';
import { useEffect } from 'react';
import messaging, {getMessaging} from "@react-native-firebase/messaging"
const requestUserPermission = async() => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if(granted === PermissionsAndroid.RESULTS.GRANTED){
        console.log("notification permission granted")
    }else{
        console.log("notification permission revoked")
    }
}

const getToken = async() => {
    try {
        const token = await messaging().getToken()
        console.log(`FCM token: ${token}`)
    } catch (error) {
        console.log(`failed to get FCM token, ${error}`)
    }
}


export const useNotification = () => {
    useEffect(() => {
    requestUserPermission()
    getToken()
}, [])
}