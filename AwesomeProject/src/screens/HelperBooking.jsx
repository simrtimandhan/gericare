import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { useEffect, useState } from "react";



const HelperBooking = ({ navigation, route }) => {
    const { service } = route?.params
    const [helpers, setHelpers] = useState([])
    let bestMatch = helpers?.filter(x => x?.services?.includes(service?.id?.toString()))


    const getUserData = async () => {
        await axios.get(`${baseUrl}/api/user-helpers`).then((res) => {
            setHelpers(res?.data?.data?.users)
        }).catch(err => {
            console.log(err.response)
        }
        )
    }

    console.log(service, 'SERVICE')


    useEffect(() => {
        getUserData()
    }, [])


    const renderHelper = (helper, index) => {
        return (
            <View key={index} style={{ marginTop: 16, borderColor: Colors.primary, borderWidth: 1, borderRadius: 8, padding: 16, backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Image
                        style={{ width: 40, height: 40, objectFit: 'contain' }}
                        source={helper?.recent_photo ? { uri: `${baseUrl}/storage/${helper?.recent_photo}` } : require('../assets/avatar.png')}
                    />
                    <View style={{ marginLeft: 8, flex: 1 }}>
                        <Text style={{ color: Colors.primary, fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>
                            {helper?.first_name} {helper?.last_name}
                        </Text>
                        <Text style={{ fontFamily: Fonts.Font_Primary }}>Medical Assistance (5 years exp)</Text>
                        <View
                            style={{
                                backgroundColor: '#F5F5F5',
                                marginTop: 8,
                                borderRadius: 8,
                                padding: 16,
                                width: '100%'
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ marginRight: 16 }}>
                                    <Text style={{ fontFamily: Fonts.Font_Primary }}>Available Now</Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: 8
                                        }}
                                    >
                                        <AntDesign name="phone" size={16} />
                                        <AntDesign name="mail" size={16} />
                                    </View>
                                </View>
                                <View style={{ marginRight: 16 }}>
                                    <Text>|</Text>
                                </View>
                                <View style={{ marginRight: 16 }}>
                                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>{helper?.hourly_charges} PKR/HR</Text>
                                    <View style={{ marginTop: 8 }}>
                                        <Text style={{ fontFamily: Fonts.Font_Primary }}>Consultant Fee</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: 16 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('HelperDetails', {
                                            helper: helper,
                                            service: service
                                        })
                                    }}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: Colors.primary,
                                        height: 48,
                                        borderRadius: 8
                                    }}
                                >
                                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: 'white' }}>
                                        Book Appointment
                                    </Text>
                                </TouchableOpacity>


                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
            <ScrollView>
                <View style={{ margin: 16 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 16, marginTop: 24, borderRadius: 8, height: 80, backgroundColor: Colors.primary }}>
                        <TouchableOpacity onPress={() => {
                            navigation.pop()
                        }} style={{ marginRight: 16 }}>
                            <AntDesign name="left" size={16} color="white" />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>GeriCare Helper's</Text>
                    </View>
                    <View style={{ marginTop: 16 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 16 }}>{helpers?.length} Helper's found for Outdoor Activity</Text>
                    </View>
                    {
                        bestMatch && bestMatch?.length > 0 && (
                            <View style={{ marginTop: 16 }}>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>Best Match For {service?.service_name}</Text>
                            </View>

                        )
                    }
                    {
                        bestMatch && bestMatch?.map((val, ind) => (
                            renderHelper(val, ind)
                        ))
                    }
                    {
                        bestMatch && bestMatch?.length > 0 && (
                            <View style={{ marginTop: 16 }}>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>Other Results</Text>
                            </View>

                        )
                    }
                    {
                        helpers && helpers.map((helper, index) => {
                            return (
                                renderHelper(helper, index)
                            )
                        }
                        )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HelperBooking