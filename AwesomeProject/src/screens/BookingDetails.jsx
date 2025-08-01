import { Alert, Image, Linking, SafeAreaView, Text, TouchableOpacity, View, PermissionsAndroid, Platform } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useEffect, useState } from "react"
import { useUser } from "../context/userContext"
import axios from "axios"
import { baseUrl } from "../utils/baseUrl"
import Geolocation from 'react-native-geolocation-service';

const BookingDetails = ({ navigation, route }) => {
    const { userId, userDetails, setUserId, setUserDetails, serviceTime, setServiceTime } = useUser();
    const [timeRemaining, setTimeRemaining] = useState(serviceTime ? serviceTime : Number(route?.params?.data?.request?.service_hour) * 60 * 60); 
    const [timerActive, setTimerActive] = useState(true);
    const [ratingCompleted, setRatingCompleted] = useState(false)
    const [requestStatus, setRequestStatus] = useState('')

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                updateLocation(coords);
            },
            (error) => {
                console.log('Location error:', error.message);
                Alert.alert('Error', error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 10000,
                distanceFilter: 0,
                forceRequestLocation: true,
                showLocationDialog: true,
            }
        );
    };


    const updateLocation = async (location: any) => {
        await axios.post(`${baseUrl}/api/user/${userId}/update-location`, {
            latitude: location?.latitude,
            longitude: location?.longitude
        }, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res?.data, 'Location Updated')
        }).catch(err => {
            console.log(err.response)
        })

    }

    useEffect(() => {
        if (userDetails?.user_type !== 'elder') return;
        let interval

        (async () => {
            const hasPermission = await requestLocationPermission();
            if (hasPermission) {
                getCurrentLocation();

                interval = setInterval(() => {
                    getCurrentLocation();
                }, 10000);
            }
        })();

        // Cleanup on unmount
        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if(userDetails?.user_type == 'elder') {
            checkRatings(route?.params?.data?.request?.request_id)
            checkStatus()
        }
    },[])


    useEffect(() => {
        let interval;

        if (timerActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            clearInterval(interval)
            setTimerActive(false)
            console.log('The countdown has ended!');
        }

        return () => clearInterval(interval);
    }, [timerActive, timeRemaining]);

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;


    const endRequest = async() => {
        await axios.get(`${baseUrl}/api/request/start/${route?.params?.data?.request?.request_id}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data, 'Ended')
            setServiceTime(null)
            navigation.navigate('Ratings', {
                data:res?.data
            })
        }).catch(err => {
            console.log(err.response)
        })
    }

    const checkStatus = async() => {
        await axios.get(`${baseUrl}/api/request/status/${route?.params?.data?.request?.request_id}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            setRequestStatus(res?.data?.request?.request_status)
        }).catch(err => {
            console.log(err.response)
        })
    }


    const checkRequestStatus = async() => {
        await axios.get(`${baseUrl}/api/request/status/${route?.params?.data?.request?.request_id}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            if(res?.data?.request?.request_status != 'completed') {
                Alert.alert('Booking','The booking is still ongoing, If you wish to end this early. Kindly ask helper to end')
            } else {
                navigation.navigate('Ratings', {
                    data:res?.data
                })
            }
        }).catch(err => {
            console.log(err.response)
        })
    }

    const checkRatings = async(id) => {
        await axios.get(`${baseUrl}/api/rating/status/${id}`).then((res) => {
            console.log(res.data, 'Rating Status')
            if(res.data.rating) {
                setRatingCompleted(true)
            }
        }).catch(err => {
            console.log(err.response)
            setRatingCompleted(false)
        })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ margin: 16 }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        setServiceTime(timeRemaining)
                        navigation.pop()
                    }} style={{ marginRight: 16 }}>
                        <AntDesign name="left" size={16} color={Colors.primary} />

                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Booking Details</Text>
                    </View>
                </View>
                <View style={{ display: 'flex', borderWidth: 1, borderColor: '#d3d3d3', marginTop: 12, borderRadius: 4, padding: 16 }}>
                    <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Service Details</Text>
                    <View style={{ marginTop: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Meet at {route?.params?.data?.request?.elder_address}</Text>
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Appointment Type: {route?.params?.data?.request?.service?.service_name} Appointment</Text>
                        </View>
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Time: {route?.params?.data?.request?.service_hour} Hours</Text>
                        </View>
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Date: {route?.params?.data?.request?.date}</Text>
                        </View>
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Total: {route?.params?.data?.request?.price} PKR</Text>
                        </View>
                    </View>
                </View>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>{userDetails?.user_type == 'elder' ? 'Helper' : 'Elder'} Details</Text>
                </View>
                {
                    userDetails?.user_type == 'helper' ? (
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
                            <View style={{ marginRight: 16 }}>
                                <Image style={{ width: 60, height: 60, resizeMode: 'contain' }} source={require('../assets/avatar.png')} />
                            </View>
                            <View style={{ display: 'flex', alignItems: 'flex-start', marginTop: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>{route?.params?.data?.request?.elder?.first_name} {route?.params?.data?.request?.elder?.last_name}</Text>
                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>{route?.params?.data?.request?.elder?.phone_number}</Text>
                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>{route?.params?.data?.request?.elder?.email}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
                            <View style={{ marginRight: 16 }}>
                                <Image style={{ width: 60, height: 60, resizeMode: 'contain' }} source={require('../assets/avatar.png')} />
                            </View>
                            <View style={{ display: 'flex', alignItems: 'flex-start', marginTop: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>{route?.params?.data?.request?.helper?.first_name} {route?.params?.data?.request?.helper?.last_name}</Text>
                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>{route?.params?.data?.request?.helper?.phone_number}</Text>
                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>{route?.params?.data?.request?.helper?.email}</Text>
                            </View>
                        </View>
                    )
                }

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
                    <TouchableOpacity onPress={() => {
                        if (userDetails?.user_type == 'helper') {
                            Linking.openURL(`https://wa.me/${route?.params?.data?.request?.elder?.phone_number}`);
                        } else {
                            Linking.openURL(`https://wa.me/${route?.params?.data?.request?.helper?.phone_number}`);
                        }
                    }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d3d3d3', width: 40, height: 40, borderRadius: 40 / 2, marginRight: 12 }}>
                        <MaterialIcons name="phone" color={Colors.primary} size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (userDetails?.user_type == 'helper') {
                            Linking.openURL(`https://wa.me/${route?.params?.data?.request?.elder?.phone_number}`);
                        } else {
                            Linking.openURL(`https://wa.me/${route?.params?.data?.request?.helper?.phone_number}`);
                        }
                    }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d3d3d3', width: 40, height: 40, borderRadius: 40 / 2, marginRight: 12 }}>
                        <MaterialIcons name="mail" color={Colors.primary} size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Alert.alert('Emergency Contact', '', [
                            {
                                text: 'Police',
                                style: 'default',
                                onPress: () => {
                                     Linking.openURL('tel:15');
                                }
                            },
                            {
                                text: 'Ambulance',
                                style: 'default',
                                onPress: () => {
                                Linking.openURL('tel:922132413232');
                            },
                            },
                            {
                                   text: 'Cancel',
                                style: 'cancel',
                            }
                        ])
                    }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d3d3d3', width: 40, height: 40, borderRadius: 40 / 2, marginRight: 12 }}>
                        <MaterialIcons name="verified-user" color={Colors.primary} size={18} />
                    </TouchableOpacity>
                    <Text>(Quick Help - Emergency)</Text>
                </View>
                <View style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
                    <Text style={{ fontFamily: Fonts.Font_Primary, textAlign: 'center' }}>In case of emergency, Contact the emergency contact or support</Text>
                </View>
                {
                    userDetails?.user_type == 'helper' ? (
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>Time Remaining:
                            {String(hours).padStart(2, '0')}:
                            {String(minutes).padStart(2, '0')}:
                            {String(seconds).padStart(2, '0')}
                        </Text>
                    </View> 
                    ) : (
                        <View style={{display:'flex', alignItems:'center', justifyContent:'center', marginTop:16}}>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>{(requestStatus == 'completed' && !ratingCompleted ) ? 'Job has ended' :  'Job is in progress'}</Text>
                        </View>
                    )
                }
                <TouchableOpacity onPress={() => {
                    if (userDetails?.user_type == 'helper') {
                        if (timeRemaining > 0) {
                            Alert.alert('Booking', 'Are you sure you want to end this service before the completed time', [
                                {
                                    text: 'No',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => endRequest(),
                                    style: 'default',
                                },
                            ],)
                        } else {
                            endRequest()
                        }
                    } else {
                        checkRequestStatus()
                    }
                }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, marginTop: 24, height: 48, borderRadius: 8 }}>
                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 16, color: 'white' }}>{
                    userDetails?.user_type == 'helper' ?  'End Booking' 
                    : (requestStatus == 'completed' && !ratingCompleted) ? 'Rate Booking' : 
                    'Continue'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default BookingDetails