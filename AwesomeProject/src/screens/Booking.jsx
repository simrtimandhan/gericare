import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { useEffect, useState } from "react";



const Booking = ({ navigation }) => {
    const [services, setServices] = useState([])

    const getServices = async () => {
        await axios.get(`${baseUrl}/api/services`).then((res) => {
            console.log(res.data)
            setServices(res.data)
        }).catch(err => {
            console.log(err.response)
        })
    }

    useEffect(() => {
        getServices()
    }, [])



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={{ margin: 16 }}>
                    <View style={{ display: 'flex', justifyContent: 'center', marginTop: 24, borderRadius: 8, height: 80 }}>
                        <Text style={{ color: Colors.primary, fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>What service would you like to have?</Text>
                    </View>
                    {
                        services && services.map((service, index) => {
                            return (
                                <View key={index} style={{ marginTop: 16 }}>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('HelperBooking', {
                                            service: service
                                        })
                                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.primary, padding: 24, borderRadius: 8 }}>
                                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: 'white' }}>{service.service_name}</Text>
                                        <AntDesign name="right" color="white" />
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default Booking