import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import axios from "axios"
import { baseUrl } from "../utils/baseUrl"
import { useUser } from "../context/userContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState } from "react"
import AntDesign from 'react-native-vector-icons/AntDesign';

const DeleteAccount = ({ navigation }) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [phoneError, setPhoneError] = useState('')

    const getFormattedPhoneForBackend = () => {
        return `0${phone}`;
    };

    const handleSubmit = async () => {
        const formattedPhone = getFormattedPhoneForBackend();

        const formData = new FormData()
        formData.append('phone_number', formattedPhone)
        formData.append('password', password)

        await axios.post(`${baseUrl}/api/login`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(async (res) => {
            deleteAccount()

        }).catch(err => {
            console.log(err)
            setError(err.response.data.message ? err.response.data.message : 'Incorrect Details')
        })

    }


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
    const disableBtn = () => {
        if (phoneError?.length > 0) {
            return true
        }
    }

    const validatePhone = (input: string) => {
        setPhone(input);
        const phoneRegex = /^3[0-9]{9}$/; // Must start with 3 and be 10 digits
        if (!phoneRegex.test(input)) {
            setPhoneError('Enter a valid Pakistani number, start with eg. 3331234567');
        } else {
            setPhoneError('');
        }
    };

    const isFormValid = () => {

    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin:16 }}>
                        <TouchableOpacity onPress={() => {
                            navigation.pop()
                        }} style={{ marginRight: 16 }}>
                            <AntDesign name="left" size={16} color={Colors.primary} />

                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Confirm your details</Text>
                        </View>
                    </View>

            <View style={{ margin: 16 }}>
                <View style={{ display: 'flex', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary }}>+92</Text>
                            </View>
                            <TextInput keyboardType="numeric" style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 17, fontFamily: Fonts.Font_Primary, width: '80%', marginTop: 2 }} placeholder="333xxxxxx" onChangeText={(e) => {
                                // setPhone(e)
                                validatePhone(e)
                            }} />
                        </View>
                </View>
                <View style={{ display: 'flex', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                    <Text style={{ fontFamily: Fonts.Font_Primary }}>Password</Text>
                    <TextInput value={password} secureTextEntry={true} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Password" onChangeText={(e) => {
                        setPassword(e)
                    }} />
                </View>

                <TouchableOpacity disabled={disableBtn()} onPress={() => {
                                            // navigation.navigate('Dashboard')
                                            if (phone.length < 10) {
                                                setError('Phone Number Is Required')
                                            } else if (!(password?.length > 0)) {
                                                setError('Password Is Required')
                                            } else {
                                                handleSubmit()
                                            }
                                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: disableBtn() ? 'grey' : Colors.primary, height: 48, borderRadius: 8, marginTop:24 }}>
                                            <Text style={{ fontSize: 18, color: 'white', fontFamily: Fonts.Font_Semi_Bold }}>Delete</Text>
                                        </TouchableOpacity>

                                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary, color: 'red', textAlign: 'center' }}>{phoneError?.toString()}</Text>
                        </View>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary, color: 'red', textAlign: 'center' }}>{error?.toString()}</Text>
                        </View>

            </View>
        </SafeAreaView>
    )
}


export default DeleteAccount