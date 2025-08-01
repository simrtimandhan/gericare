import { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
import messaging from "@react-native-firebase/messaging"
import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';
import { useUser } from '../context/userContext';

const requestUserPermission = async () => {
    const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (permission == PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification Permission")
    } else {
        console.log("Notification Android")
    }
}

const getToken = async (userId: any) => {
    try {
        const token = await messaging().getToken()
        console.log("Token", token)
        const payload = {
            user_id: userId,
            fcm_token: token
        }
        console.log(payload, 'PAYLOAD')
        await axios.post(`${baseUrl}/api/notification/update`, payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(async (res) => {
            console.log(res.data, 'Response from Token')
        }).catch(err => {
            console.log(err.response, 'ERR')
        })
    } catch (err) {
        console.log(err)
    }
}


export const useNotification = () => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();

    useEffect(() => {
        requestUserPermission()
        getToken(userId)
    }, [])
}