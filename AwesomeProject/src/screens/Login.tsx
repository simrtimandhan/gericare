import axios from "axios"
import { useEffect, useState } from "react"
import { Dimensions, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, Fonts } from "../utils/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from "../utils/baseUrl";
import { useUser } from "../context/userContext";
import { getAudio } from "../utils/audio";


const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState()
    const [error, setError] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [displayPassword, setDisplayPassword] = useState(true)
    // const [userId, setUserId] = useState(null)

    const validatePhone = (input: string) => {
        setPhone(input);
        const phoneRegex = /^3[0-9]{9}$/; // Must start with 3 and be 10 digits
        if (!phoneRegex.test(input)) {
            setPhoneError('Enter a valid Pakistani number, start with eg. 3331234567');
        } else {
            setPhoneError('');
        }
    };

    const getFormattedPhoneForBackend = () => {
        return `0${phone}`;
    };

    const disableBtn = () => {
        if (phoneError?.length > 0) {
            return true
        }
    }

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
            setUser(res?.data?.user)
            await AsyncStorage.setItem('user', res.data?.user?.id?.toString());
            await AsyncStorage.setItem('user_details', JSON.stringify(res.data?.user));
            setUserDetails(res.data?.user)
            setUserId(res.data?.user?.id)
            if (res?.data?.user?.status == 'inactive') {
                setError('User is disabled. Kindly Contact Support')
            } else {
                setTimeout(() => {
                    navigation.navigate('Dashboard')
                }, 1000)
                setError('')
            }
        }).catch(err => {
            console.log(err)
            setError(err.response.data.message ? err.response.data.message : 'Incorrect Phone or Password')
        })

    }

    const getData = async() => {
        let id = await AsyncStorage.getItem('user')
        setUserId(id)
        if(id) {
            navigation.navigate('Dashboard')
        }
    }

    useEffect(() => {
        getData()
    },[])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={{ marginLeft: 24, marginTop: 24 }}>
                    <AntDesign name="arrowleft" size={18} color={Colors.primary} />
                </View>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: width - 200, height: height - 600, objectFit: 'contain' }} source={require('../assets/logo.png')} />
                    
                   <TouchableOpacity onPress={() => {
                        getAudio('ہماری درخواست میں خوش آمدید۔')
                    }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 48 }}>
                        <Text style={{ fontSize: 28, fontFamily: Fonts.Font_Primary }}>Welcome</Text>
                        <Text style={{ fontSize: 28, fontFamily: Fonts.Font_Primary }}>to <Text style={{ color: Colors.primary, fontFamily: Fonts.Font_Bold }}>GeriCare</Text></Text>
                    </TouchableOpacity>
                </View>
                <View style={{ margin: 24 }}>
                    <TouchableOpacity onPress={() => {
                        getAudio('براہ کرم اپنا فون نمبر اور پاس ورڈ درج کریں۔')
                    }}>
                        <Text style={{ fontSize: 24, color: Colors.primary, fontFamily: Fonts.Font_Bold }}>Login</Text>
                    </TouchableOpacity>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: 'black' }}>
                       <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary }}>+92</Text>
                            </View>
                            <TextInput keyboardType="numeric" style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 17, fontFamily: Fonts.Font_Primary, width: '80%', marginTop: 2 }} placeholder="333xxxxxx" onChangeText={(e) => {
                                // setPhone(e)
                                validatePhone(e)
                            }} />
                        </View>
                        <View style={{ marginRight: 8 }}>
                            <AntDesign name="phone" size={18} color={Colors.primary} />
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: 'black' }}>
                        <TextInput style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Password" secureTextEntry={displayPassword} onChangeText={(e) => {
                            setPassword(e)
                        }} />
                        <TouchableOpacity onPress={() => {
                            setDisplayPassword(!displayPassword)
                        }} style={{ marginRight: 8 }}>
                            <AntDesign name="key" size={18} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 24 }}>
                        <TouchableOpacity disabled={disableBtn()}  onPress={() => {
                            // navigation.navigate('Dashboard')
                            if (phone.length < 10) {
                                setError('Phone Number Is Required')
                            } else if (!(password?.length > 0)) {
                                setError('Password Is Required')
                            } else {
                                handleSubmit()
                            }
                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: disableBtn() ? 'grey' : Colors.primary, height: 48, borderRadius: 8 }}>
                            <Text style={{ fontSize: 18, color: 'white', fontFamily: Fonts.Font_Semi_Bold }}>Login</Text>
                        </TouchableOpacity>
                                                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary, color: 'red', textAlign: 'center' }}>{phoneError?.toString()}</Text>
                        </View>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary, color: 'red' }}>{error?.toString()}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('UserScreen')
                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary }}>Don't Have An Account? <Text style={{ color: Colors.primary, fontFamily: Fonts.Font_Bold }}>Register</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default Login