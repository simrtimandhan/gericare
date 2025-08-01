import { Image, Linking, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import { useEffect, useState } from "react"
import { baseUrl } from "../utils/baseUrl"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useUser } from "../context/userContext"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const ElderBookings = ({navigation}) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();

    // const [userId, setUserId] = useState(null)
    const [elderRequest, setElderRequest] = useState(null)



    // const getUserData = async () => {
    //     let id = await AsyncStorage.getItem('user')
    //     setUserId(id)
    //     getElderRequest(id)
    // }

    const getElderRequest = async () => {
        await axios({
            method: 'GET',
            url: `${baseUrl}/api/elder/requests/${userDetails?.user_type == 'family' ? userDetails?.elder_id : userId}`,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            setElderRequest(res.data?.data?.requests)
        }).catch(err => {
            console.log(err.response)
        })
    }

    const checkRequestStatus = async(id) => {
        await axios.get(`${baseUrl}/api/request/status/${id}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            
            console.log(res.data, 'STATUS')
            navigation.navigate('BookingDetails', {
                data:res?.data
            })

        }).catch(err => {
            console.log(err.response)
        })
    }

    useEffect(() => {
        getElderRequest()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ margin: 16 }}>
                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Bookings</Text>
            </View>
            <ScrollView>
                <View style={{ margin: 16 }}>
                    {
                        elderRequest && elderRequest.map((request, index) => {
                            return (
                                 <View key={index} style={{ display: 'flex', marginTop: 24, borderColor: Colors.primary, borderWidth: 1, borderRadius: 8, padding: 16, position: 'relative' }}>
                                                                {
                                                                    request?.request_status == 'pending' && (
                                                                        <>
                                                                            <View style={{ position: 'absolute', top: 10, right: 40, width: 20, zIndex: 999999999 }}>
                                                                                <TouchableOpacity onPress={() => {
                                                                                    cancelRequest(request?.request_id)
                                                                                }} >
                                                                                    <MaterialIcons name="cancel" size={20} color={'red'} />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                            <View style={{ position: 'absolute', top: 10, right: 10, width: 20, zIndex: 999999999 }}>
                                                                                <TouchableOpacity onPress={() => {
                                                                                    console.log(request,'REQUEST')
                                                                                    // cancelRequest(request?.request_id)
                                                                                    navigation.navigate('HelperDetails', {
                                                                                        id: request?.request_id,
                                                                                        helper: request?.helper,
                                                                                        service: request?.service,
                                                                                        date: request?.date,
                                                                                        time: request?.time,
                                                                                        price: request?.price,
                                                                                        address: request?.elder_address,
                                                                                        edit: true,
                                                                                    })
                                                                                }} >
                                                                                    <MaterialIcons name="edit" size={20} color={'black'} />
                                                                                </TouchableOpacity>
                                                                            </View>
                                                                        </>
                                
                                                                    )
                                                                }
                                                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                    <Image style={{ width: 80, height: 80, objectFit: 'contain' }} source={request?.helper?.recent_photo ? { uri: `${baseUrl}/storage/${request?.helper?.recent_photo}` } : require('../assets/avatar.png')} />
                                                                    <View style={{ marginLeft: 16 }}>
                                                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 18 }}>{request?.helper?.first_name} {request?.helper?.last_name}</Text>
                                                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Activity: {request?.service?.service_name}</Text>
                                                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Date: {request?.date}</Text>
                                                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Time: {request?.time}</Text>
                                                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Price: {request?.price} PKR</Text>
                                                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Service Hours: {request?.service_hour}</Text>
                                                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14, textTransform: 'capitalize' }}>Status: {request?.request_status}</Text>
                                                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', width: '85%' }}>
                                                                            <TouchableOpacity onPress={() => {
                                                                                Linking.openURL(`https://wa.me/${request?.helper?.phone_number}`);
                                                                            }} style={{ marginRight: 8 }}>
                                                                                <AntDesign name="mail" size={18} color={Colors.primary} />
                                                                            </TouchableOpacity>
                                                                            <TouchableOpacity onPress={() => {
                                                                                Linking.openURL(`https://wa.me/${request?.helper?.phone_number}`);
                                                                            }}>
                                                                                <AntDesign name="phone" size={18} color={Colors.primary} />
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                {
                                                                    request?.request_status == 'ongoing' && (
                                                                        <TouchableOpacity onPress={() => {
                                                                            checkRequestStatus(request?.request_id)
                                                                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, marginTop: 12, height: 48, borderRadius: 8 }}>
                                                                            <Text style={{ color: 'white', fontFamily: Fonts.Font_Semi_Bold }}>View Ongoing Booking</Text>
                                                                        </TouchableOpacity>
                                                                    )
                                                                }
                                                                {/* {
                                                                    request?.request_status == 'completed' && (
                                                                        <TouchableOpacity onPress={() => {
                                                                            checkRequestStatus(request?.request_id)
                                                                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, marginTop: 12, height: 48, borderRadius: 8 }}>
                                                                            <Text style={{ color: 'white', fontFamily: Fonts.Font_Semi_Bold }}>Rate Booking</Text>
                                                                        </TouchableOpacity>
                                                                    )
                                                                } */}
                                                            </View>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default ElderBookings