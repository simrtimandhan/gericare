import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";


const Account = ({ navigation }) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();
    const [averageRating, setAverageRating] = useState(0)

    const getRating = async () => {
        await axios.get(`${baseUrl}/api/rating/helper/${userId}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(async (res) => {
            setAverageRating(res?.data?.average_rating)
        }).catch(err => {
            console.log(err.response)
        })
    }

    useEffect(() => {
        if(userDetails?.user_type == 'helper') {
             getRating()
        }
       
    }, [])
    // const [userId, setUserId] = useState(null)
    // const [userDetails, setUserDetails] = useState(null)


    // const getUserData = async () => {
    //     let id = await AsyncStorage.getItem('user')
    //     let userData = await AsyncStorage.getItem('user_details')
    //     setUserId(id)
    //     setUserDetails(JSON.parse(userData))
    // }

    const deleteAccount = async () => {
        await axios.post(`${baseUrl}/api/user/delete/${userId}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(async (res) => {
            await AsyncStorage.clear()
            navigation.navigate('Login')
        }).catch(err => {
            console.log(err.response)
        })
    }

    useEffect(() => {
        // getUserData()

    }, [])



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>

                <View style={{ margin: 16 }}>
                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Account</Text>
                </View>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: Colors.primary, width: 60, height: 60, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 24, fontFamily: Fonts.Font_Semi_Bold }}>{userDetails?.first_name?.slice(0, 1)}</Text>
                    </View>
                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 16, marginTop: 12 }}>{userDetails?.first_name} {userDetails?.last_name}</Text>
                                      {
                        userDetails?.user_type == 'elder' && (
                            <Text style={{fontFamily:Fonts.Font_Bold}}>Account Number: {userId}</Text>
                        )
                    }
                    {
                        userDetails?.user_type == 'helper' && averageRating > 0 && (
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                                <AntDesign name="star" color={'gold'} size={16} />
                                <View style={{ marginLeft: 8 }}>
                                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 16 }}>{averageRating}</Text>
                                </View>
                            </View>
                        )
                    }

                </View>
                                {
                    userDetails?.user_type == 'family' && (
                        <View style={{ marginTop: 16 }}>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('AddElder')
                            }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderRadius: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 16 }}>Add elder to your account</Text>
                                <AntDesign name="right" color={Colors.primary} size={16} />
                            </TouchableOpacity>
                        </View>
                    )
                }
                <View style={{ marginTop: 16 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('EditProfile')
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 16 }}>Edit Profile</Text>
                        <AntDesign name="right" color={Colors.primary} size={16} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 16 }}>
                    <TouchableOpacity onPress={() => {
                        // deleteAccount()
                         navigation.navigate('DeleteAccount')
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 16 }}>Delete Account</Text>
                        <AntDesign name="right" color={Colors.primary} size={16} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 16 }}>
                    <TouchableOpacity onPress={async () => {
                        await AsyncStorage.clear()
                        navigation.navigate('Login')
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 16 }}>Logout</Text>
                        <AntDesign name="right" color={Colors.primary} size={16} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default Account