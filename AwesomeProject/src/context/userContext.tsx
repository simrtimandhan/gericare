import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
     const [serviceTime, setServiceTime] = useState(null)

    const getUserData = async () => {
        let id = await AsyncStorage.getItem('user');
        let userData = await AsyncStorage.getItem('user_details');
        setUserId(id);
        setUserDetails(JSON.parse(userData));
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <UserContext.Provider value={{ userId, userDetails, setUserId, setUserDetails, setServiceTime, serviceTime }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
