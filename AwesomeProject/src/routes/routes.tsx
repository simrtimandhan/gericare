import React, { useEffect, useReducer, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    NavigationContainer,
} from '@react-navigation/native';
import UserScreen from '../screens/UserScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import { Colors, Fonts } from '../utils/theme';
import { Platform, Text, View } from 'react-native';
import Home from '../screens/Home';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Booking from '../screens/Booking';
import HelperBooking from '../screens/HelperBooking';
import HelperDetails from '../screens/HelperDetails';
import Account from '../screens/Account';
import EditProfile from '../screens/EditProfile';
import BookingConfirmation from '../screens/BookingConfirmation';
import ElderBookings from '../screens/ElderBookings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HelperDashboard from '../screens/HelperDashboad';
import { useUser } from '../context/userContext';
import HelperPastBookings from '../screens/HelperPastBookings';
import BookingDetails from '../screens/BookingDetails';
import Ratings from '../screens/Ratings';
import BookingComplete from '../screens/BookingComplete';
import AddElder from '../screens/AddElder';
import HelperMap from '../screens/HelperMap';
import Tracking from '../screens/Tracking';
import DeleteAccount from '../screens/DeleteAccount';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const Routes = () => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();

    console.log(userId, 'USER', userDetails?.user_type)

    // const getUserData = async () => {
    //     let id = await AsyncStorage.getItem('user')
    //     let userData = await AsyncStorage.getItem('user_details')
    //     setUserId(id)
    //     setUserDetails(JSON.parse(userData))
    // }

    // useEffect(() => {
    //     getUserData()
    // }, [])


    const TabNavigation = () => {
        return (
            <Tab.Navigator
                initialRouteName={'Home'}
                screenOptions={({ route }) => ({
                    tabBarHideOnKeyboard: true,
                    tabBarInactiveTintColor: 'rgba(0,0,0,0.47)',
                    tabBarLabelStyle: [
                        {
                            fontSize: 14,
                            marginBottom: 20,
                            fontWeight: 'bold',
                            fontFamily: Fonts.Font_Semi_Bold
                        },
                    ],
                    tabBarStyle: [
                        {
                            display: 'flex',
                            backgroundColor: Colors.primary,
                            height: Platform.OS === 'android' ? 80 : 100,
                        },
                        null,
                    ],
                })}
            >
                <Tab.Screen
                    name={'Home'}
                    component={userDetails?.user_type != 'helper' ? Home : HelperDashboard}
                    options={{
                        headerShown: false,
                        tabBarLabel: ({ focused, color, size }) => {
                            return <Text style={{ fontFamily: focused ? Fonts.Font_Semi_Bold : Fonts.Font_Primary, color: 'white', fontSize: 12 }}>Home</Text>
                        },
                        tabBarLabelStyle: {
                            color: 'white'
                        },
                        tabBarIcon: ({ focused, color, size }) => {
                            return <AntDesign name="home" size={20} color={'white'} />
                        },
                    }}
                />
                {
                    userDetails?.user_type != 'helper' && (
                        <Tab.Screen
                            name={'Book'}
                            component={userDetails?.user_type == 'family' ? Tracking : Home}
                            options={{
                                headerShown: false,
                                tabBarLabel: ({ focused, color, size }) => {
                                    return <Text style={{ fontFamily: focused ? Fonts.Font_Semi_Bold : Fonts.Font_Primary, color: 'white', fontSize: 12 }}>{userDetails?.user_type == 'family' ? 'Track' : 'Explore'}</Text>
                                },
                                tabBarLabelStyle: {
                                    color: 'white'
                                },
                                tabBarIcon: ({ focused, color, size }) => {
                                    if(userDetails?.user_type == 'family') {
                                        return <Entypo name='location' size={20} color='white'/>
                                    } else {
                                        return <AntDesign name={"profile"} size={20} color={'white'} />
                                    }
                                },
                            }}
                        />
                    )

                }

                {
                    userDetails?.user_type != 'helper' && (
                        <Tab.Screen
                            name={'Add'}
                            component={Booking}
                            options={{
                                headerShown: false,
                                tabBarLabelStyle: {
                                    display: 'none',
                                },
                                tabBarIcon: ({ focused, color, size }) => {
                                    return (
                                        <View style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 60,
                                            height: 60,
                                            borderRadius: 60,
                                            backgroundColor: 'white',
                                            position: 'relative',
                                            marginBottom: 60,
                                        }}>
                                            <AntDesign name="pluscircle" size={40} color={Colors.primary} />
                                        </View>
                                    )
                                },
                            }}
                        />
                    )
                }

                <Tab.Screen
                    name={'Bookings'}
                    component={userDetails?.user_type == 'helper' ? HelperPastBookings : ElderBookings}
                    options={{
                        headerShown: false,
                        tabBarLabel: ({ focused, color, size }) => {
                            return <Text style={{ fontFamily: focused ? Fonts.Font_Semi_Bold : Fonts.Font_Primary, color: 'white', fontSize: 12 }}>Bookings</Text>
                        },
                        tabBarLabelStyle: {
                            color: 'white',
                        },
                        tabBarIcon: ({ focused, color, size }) => {
                            return <AntDesign name="calendar" size={20} color={'white'} />
                        },
                    }}
                />
                <Tab.Screen
                    name={'Account'}
                    component={Account}
                    options={{
                        headerShown: false,
                        tabBarLabel: ({ focused, color, size }) => {
                            return <Text style={{ fontFamily: focused ? Fonts.Font_Semi_Bold : Fonts.Font_Primary, color: 'white', fontSize: 12 }}>Account</Text>
                        },
                        tabBarLabelStyle: {
                            color: 'white',
                            fontSize: 24
                        },
                        tabBarIcon: ({ focused, color, size }) => {
                            return <AntDesign name="user" size={focused ? 24 : 20} color={'white'} />
                        },
                    }}
                />
            </Tab.Navigator>
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>

                {
                    !userId ? (
                        <>
                            <Stack.Screen name="Login" component={Login} />
                            <Stack.Screen name="UserScreen" component={UserScreen} />
                            <Stack.Screen name="Register" component={Register} />
                            <Stack.Screen name="Dashboard" component={TabNavigation} />

                        </>

                    ) : (
                        <>
                            <Stack.Screen name="Dashboard" component={TabNavigation} />
                            <Stack.Screen name="Booking" component={Booking} />
                            <Stack.Screen name="HelperBooking" component={HelperBooking} />
                            <Stack.Screen name="HelperDetails" component={HelperDetails} />
                            <Stack.Screen name="EditProfile" component={EditProfile} />
                            <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} />
                            <Stack.Screen name="ElderBookings" component={ElderBookings} />
                            <Stack.Screen name="Login" component={Login} />
                            <Stack.Screen name="Register" component={Register} />
                            <Stack.Screen name="UserScreen" component={UserScreen} />
                            <Stack.Screen name="BookingDetails" component={BookingDetails} />
                            <Stack.Screen name="Ratings" component={Ratings} />
                            <Stack.Screen name="BookingComplete" component={BookingComplete} />
   <Stack.Screen name="AddElder" component={AddElder} />
                            <Stack.Screen name="HelperMap" component={HelperMap} />
                            <Stack.Screen name="DeleteAccount" component={DeleteAccount} />

                        </>

                    )
                }

            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default Routes