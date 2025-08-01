import { Alert, Image, Linking, SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useUser } from "../context/userContext"

const HelperPastBookings = ({navigation}) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();
    // const [userId, setUserId] = useState(null)
    // const [userDetails, setUserDetails] = useState(null)
    const [heleperRequest, setHelperRequest] = useState([])
    const [loading, setLoading] = useState(false)

    const getLocation = () => {
        const url = `https://www.google.com/maps/search/${encodeURIComponent('Frere town')}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    // Open the URL
                    Linking.openURL(url);
                } else {
                    // Alert if the URL can't be opened
                    Alert.alert('Error', 'Unable to open Google Maps');
                }
            })
            .catch((err) => {
                console.error('Error opening Google Maps:', err);
            });
    }



    // const getUserData = async () => {
    //     let id = await AsyncStorage.getItem('user')
    //     let userData = await AsyncStorage.getItem('user_details')
    //     setUserDetails(JSON.parse(userData))
    //     setUserId(id)
    //     getHelperRequest(id)

    // }

    const getHelperRequest = async () => {
        await axios({
            method: 'GET',
            url: `${baseUrl}/api/helper/requests/${userId}`,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data?.data?.requests)
            setHelperRequest(res.data?.data?.requests)
        }).catch(err => {
            // console.log(err.response)
        })
    }

    const startRequest = async (id) => {
        setLoading(true)
        await axios.get(`${baseUrl}/api/request/start/${id}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data, 'On Going')
            setLoading(false)
            navigation.navigate('BookingDetails', {
                data:res?.data
            })
            getHelperRequest()
        }).catch(err => {
            console.log(err.response)
            setLoading(false)
        })
    }

    const acceptRequest = async (id) => {
        await axios.get(`${baseUrl}/api/request/accept/${id}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data)
            getHelperRequest(userId)
        }).catch(err => {
            console.log(err.response)
        })
    }

    const cancelRequest = async (id) => {
        await axios.get(`${baseUrl}/api/request/cancel/${id}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data)
            getHelperRequest(userId)
        }).catch(err => {
            console.log(err.response)
        })
    }

    useEffect(() => {
        // getUserData()
        getHelperRequest()
    }, [])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView>
            <View style={{ margin: 24 }}>
                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Bookings</Text>
               
                {
                    heleperRequest && heleperRequest?.length == 0 ? (
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
                            <Text style={{ color: 'black', fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>No Upcoming Appointments</Text>
                        </View>
                    ) : (
                        <View style={{ marginTop: 24 }}>
                        </View>
                    )

                }


                {
                    heleperRequest && heleperRequest?.map((request, index) => {
                        return (
                            <View key={index} style={{ marginTop: 12, borderColor: Colors.primary, borderWidth: 1, borderRadius: 8, padding: 16 }}>
                                                            {
                                                                request?.request_status == 'accepted' && (
                                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                        <TouchableOpacity onPress={() => {
                                                                            cancelRequest(request?.request_id)
                                                                        }} style={{ marginRight: 8 }}>
                                                                            <MaterialIcons name="cancel" size={20} color={'red'} />
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity style={{ marginRight: 8 }} onPress={() => {
                                                                            Linking.openURL(`https://wa.me/${request?.elder?.phone_number}`);
                                                                        }}>
                                                                            <AntDesign name="phone" size={18} color={Colors.primary} />
                                                                        </TouchableOpacity>
                                                                     
                                                                    </View>
                                                                )
                                                            }
                            
                                                            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, padding: 8, borderRadius: 8, marginTop: 12 }}>
                                                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 16, color: 'white' }}>Activity: {request?.service?.service_name}</Text>
                                                            </View>
                                                            <View style={{ marginTop: 12 }}>
                                                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 16 }}>Full Name: <Text>{request?.elder?.first_name} {request?.elder?.last_name}</Text></Text>
                                                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 16 }}>Address: {request?.elder_address}</Text>
                                                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 16 }}>Time: {request?.time}</Text>
                                                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 16 }}>Date: {request?.date}</Text>
                                                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 16 }}>Total Price: {request?.price} (50 Platform Fee Included)</Text>
                                                                {
                                                                        request?.request_status == 'pending' ? (
                                                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                                                                                <TouchableOpacity onPress={() => {
                                                                                    acceptRequest(request?.request_id)
                                                                                }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', padding: 12, borderRadius: 8, width: '45%' }}>
                                                                                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 14, color: 'white' }}>Accept</Text>
                                                                                </TouchableOpacity>
                                                                                <TouchableOpacity onPress={() => {
                                                                                    cancelRequest(request?.request_id)
                                                                                }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'red', padding: 12, borderRadius: 8, width: '45%' }}>
                                                                                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 14, color: 'white' }}>Reject</Text>
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        ) : request?.request_status == 'accepted' || request?.request_status == 'ongoing' ? (
                                                                            <View>
                                                                                <View style={{ marginTop: 16 }}>
                                                                                    <TouchableOpacity onPress={() => {
                                                                                        startRequest(request?.request_id)
                                                                                        // navigation.navigate('BookingDetails')
                                                                                    }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, padding: 12, borderRadius: 8, width: '100%' }}>
                                                                                        {
                                                                                            loading ? (
                                                                                                <ActivityIndicator color={'white'}/>
                                                                                            ) : (
                                                                                                <Text style={{ color: 'white', fontFamily: Fonts.Font_Semi_Bold }}>{request?.request_status == 'ongoing' ? 'Resume' : 'Start Booking'}</Text>
                                                                                            )
                                                                                        } 
                                                                                    </TouchableOpacity>
                                                                                </View>
                                                                            </View>
                                                                        ) : (
                                                                            <></>
                                                                        )
                                                                    }
                                                            </View>
                            
                                                        </View>
                        )
                    }
                    )
                }
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default HelperPastBookings