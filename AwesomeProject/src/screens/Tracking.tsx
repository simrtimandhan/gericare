import { Image, Linking, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import AntDesign from 'react-native-vector-icons/AntDesign'


const Tracking = ({navigation}) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();
    const [elderRequest, setElderRequest] = useState([])
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getElderRequest()
        }, 2000);
    }, []);

    const getElderRequest = async () => {
        await axios({
            method: 'GET',
            url: `${baseUrl}/api/elder/requests/${userDetails?.user_type == 'family' ? userDetails?.elder_id : userId}`,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            setRefreshing(false)
            setElderRequest(res.data?.data?.requests)
        }).catch(err => {
            setRefreshing(false)
        })
    }

    useEffect(() => {
        getElderRequest()
    },[])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={{ margin: 16 }}>
                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Track Booking</Text>
                </View>
                <View>
                    {
                        elderRequest && elderRequest?.map((request, index) => (
                            <View style={{ margin: 16, borderColor: Colors.primary, borderWidth: 1, borderRadius: 8, padding: 12 }} key={index}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <Image style={{ width: 40, height: 40, objectFit: 'contain' }} source={request?.helper?.recent_photo ? { uri: `${baseUrl}/storage/${request?.helper?.recent_photo}` } : require('../assets/avatar.png')} />
                                    <View style={{ marginLeft: 16 }}>
                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 18 }}>{request?.helper?.first_name} {request?.helper?.last_name}</Text>
                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Activity: {request?.service?.service_name}</Text>
                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Date: {request?.date}</Text>
                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Time: {request?.time}</Text>
                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Price: {request?.price} PKR</Text>
                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Service Hours: {request?.service_hour}</Text>
                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14, textTransform: 'capitalize' }}>Status: {request?.request_status}</Text>
                                    </View>
                                </View>
                                {
                                    request?.request_status == 'ongoing' ? (
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('HelperMap')
                                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, marginTop: 12, padding: 12, borderRadius: 8 }}>
                                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 14, color: 'white' }}>Track</Text>
                                        </TouchableOpacity>
                                    ) : request?.request_status == 'cancelled' ? (
                                        <View style={{display:'flex', alignItems:'center', justifyContent:'center', marginTop:12}}>
                                            <Text style={{fontFamily:Fonts.Font_Semi_Bold, color:Colors.primary}}>Booking Cancelled</Text>
                                        </View>
                                    ) : request?.request_status == 'completed' ? (
                                        <View style={{display:'flex', alignItems:'center', justifyContent:'center', marginTop:12}}>
                                            <Text style={{fontFamily:Fonts.Font_Semi_Bold, color:Colors.primary}}>Booking Completed</Text>
                                        </View>
                                    ) : (
                                        <View style={{display:'flex', alignItems:'center', justifyContent:'center', marginTop:12}}>
                                            <Text style={{fontFamily:Fonts.Font_Semi_Bold, color:Colors.primary}}>Booking Not Started</Text>
                                        </View>
                                    )
                                }

                            </View>
                        ))
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Tracking