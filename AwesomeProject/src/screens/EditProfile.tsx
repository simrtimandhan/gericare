import { useEffect, useState } from "react"
import { Image, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/baseUrl";
import { useUser } from "../context/userContext";
import { launchImageLibrary } from "react-native-image-picker";

const EditProfile = ({ navigation }) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [age, setAge] = useState(0)
    const [city, setCity] = useState('')
    const [userAddress, setUserAddress] = useState('')
    const [email, setEmail] = useState('')
    const [cnic, setCnic] = useState('')
    const [job, setJob] = useState('')
    const [hourlyCharges, setHourlyCharges] = useState(0)
    const [phone, setPhone] = useState('')
    const [services, setServices] = useState([])
    const [userServices, setUserServices] = useState([])
    const [recentPhoto, setRecentPhoto] = useState('')
    const [error, setError] = useState('')

    const handleImage = async () => {
        let result = await launchImageLibrary({
            selectionLimit: 1,
            mediaType: 'photo'
        });
        if (result?.assets && result?.assets?.length > 0) {
            let imagesWithStatus = result?.assets?.map(asset => ({
                ...asset,
                status: 'uploading',
                fileType: 'image'
            }));
            setRecentPhoto(imagesWithStatus)

        }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const getData = async () => {
        await axios.get(`${baseUrl}/api/user/${userId}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res?.data?.data?.user)
            setFirstName(res.data?.data?.user?.first_name)
            setLastName(res.data?.data?.user?.last_name)
            setAge(res.data?.data?.user?.age)
            setCity(res.data?.data?.user?.city)
            setUserAddress(res.data?.data?.user?.address)
            setHourlyCharges(res?.data?.data?.user?.hourly_charges)
            setEmail(res?.data?.data?.user?.email)
            setCnic(res?.data?.data?.user?.cnic)
            setPhone(res?.data?.data?.user?.phone_number)
            setJob(res?.data?.data?.user?.job)
            setRecentPhoto(res?.data?.data?.user?.recent_photo)
            setUserServices(JSON.parse(res?.data?.data?.user?.services))
        }).catch(err => {
            console.log(err.response)
        })
    }

    const getServices = async () => {
        await axios.get(`${baseUrl}/api/services`).then((res) => {
            console.log(res.data)
            setServices(res.data)
        }).catch(err => {
            console.log(err.response)
        })
    }


    const handleSubmit = async () => {
        setError('')
        const formData = new FormData()
        formData.append('first_name', firstName)
        formData.append('last_name', lastName)
        formData.append('city', city)
        formData.append('address', userAddress)
        formData.append('age', age)
        formData.append('email', email)
        formData.append('cnic', cnic)
        if (userDetails?.user_type == 'helper') {
            if (userServices?.length > 0) {
                userServices.forEach(service => {
                    formData.append('services[]', service);
                });
            }
            formData.append('hourly_charges', hourlyCharges)
            formData.append('job', job)
        }
        if (recentPhoto[0]?.fileName) {
            formData.append('recent_photo', {
                name: recentPhoto[0]?.fileName,
                type: recentPhoto[0]?.type,
                uri: Platform.OS == 'android' ? recentPhoto[0]?.uri : recentPhoto[0]?.uri?.replace('file://', '')
            })
        }

        await axios.post(`${baseUrl}/api/user/${userId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data)
            setError('User Edited Successfully')
        }).catch(err => {
            console.log(err?.response?.data)
            setError(err.response.data.message)
        })
    }

    useEffect(() => {
        getData()
        if (userDetails?.user_type == 'helper') {
            getServices()
        }
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={{ margin: 16 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            navigation.pop()
                        }} style={{ marginRight: 16 }}>
                            <AntDesign name="left" size={16} color={Colors.primary} />

                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Edit Profile</Text>
                        </View>
                    </View>

                    {
                        recentPhoto && (
                            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: 60, height: 60, objectFit: 'contain' }} source={{ uri: recentPhoto[0]?.uri ? recentPhoto[0]?.uri : `${baseUrl}/storage/${recentPhoto}` }} />
                            </View>
                        )
                    }
                    <TouchableOpacity onPress={() => {
                        handleImage()
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderWidth: 1, borderBottomColor: Colors.primary, padding: 16, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>{'Recent Photo'}</Text>
                        <AntDesign name="user" size={18} color={Colors.primary} />
                    </TouchableOpacity>

                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                        <View style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary }}>First Name</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '100%' }}>
                                <TextInput value={firstName} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="First Name" onChangeText={(e) => {
                                    setFirstName(e)
                                }} />
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary }}>Last Name</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '100%' }}>
                                <TextInput value={lastName} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Last Name" onChangeText={(e) => {
                                    setLastName(e)
                                }} />
                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                        <View style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary }}>Age</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '100%' }}>
                                <TextInput value={age?.toString()} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Age" onChangeText={(e) => {
                                    setAge(e)
                                }} />
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary }}>City</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '100%' }}>
                                <TextInput value={city} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="City" onChangeText={(e) => {
                                    setCity(e)
                                }} />
                            </View>
                        </View>

                    </View>

                    <View style={{ display: 'flex', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <Text style={{ fontFamily: Fonts.Font_Primary }}>Address</Text>
                        <TextInput value={userAddress} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Address" onChangeText={(e) => {
                            setUserAddress(e)
                        }} />
                    </View>
                    <View style={{ display: 'flex', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <Text style={{ fontFamily: Fonts.Font_Primary }}>Email</Text>
                        <TextInput value={email} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Email" onChangeText={(e) => {
                            setEmail(e)
                            validateEmail(e)
                        }} />
                    </View>
                    {
                        !validateEmail(email) ? (
                            <View>
                                <Text style={{fontFamily:Fonts.Font_Semi_Bold, color:'red'}}>Email should be in correct format</Text>
                            </View>
                        ) : (
                            <></>
                        )
                    }
                    <View style={{ display: 'flex', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <Text style={{ fontFamily: Fonts.Font_Primary }}>CNIC</Text>
                        <TextInput value={cnic} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="CNIC" onChangeText={(e) => {
                            setCnic(e)
                        }} />
                    </View>
                    <View style={{ display: 'flex', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <Text style={{ fontFamily: Fonts.Font_Primary }}>Phone Number</Text>
                        <TextInput editable={false} value={phone} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Phone Number" onChangeText={(e) => {
                            setPhone(e)
                        }} />
                    </View>

                    {
                        userDetails?.user_type == 'helper' && (
                            <View>
                                <View style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                                    <Text style={{ fontFamily: Fonts.Font_Primary }}>Hourly Charges</Text>
                                    <TextInput value={hourlyCharges?.toString()} keyboardType="number-pad" style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Hourly Charges" onChangeText={(e) => {
                                        setHourlyCharges(e)
                                    }} />
                                </View>
                                <View style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                                    <Text style={{ fontFamily: Fonts.Font_Primary }}>Current Job</Text>
                                    <TextInput value={job} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Current Job" onChangeText={(e) => {
                                        setJob(e)
                                    }} />
                                </View>
                                {
                                    services?.length > 0 && (
                                        <View>
                                            <View style={{ marginTop: 24 }}>
                                                <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 18 }}>Your Prefered Services</Text>
                                            </View>
                                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                                {
                                                    services && services.map((v, i) => {
                                                        const isSelected = userServices?.length > 0 && userServices?.some(s => s == v?.id);

                                                        return (
                                                            <TouchableOpacity
                                                                key={i}
                                                                onPress={() => {
                                                                    let updatedServices = [...userServices];
                                                                    if (isSelected) {
                                                                        updatedServices = updatedServices?.filter(s => s != v.id);
                                                                    } else {
                                                                        updatedServices.push(v?.id);
                                                                    }
                                                                    setUserServices(updatedServices);
                                                                }}
                                                                style={{
                                                                    borderWidth: 1,
                                                                    borderColor: isSelected ? Colors.primary : '#ccc',
                                                                    backgroundColor: isSelected ? Colors.primary : 'transparent',
                                                                    padding: 12,
                                                                    borderRadius: 8,
                                                                    marginRight: 8,
                                                                    marginBottom: 8
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontFamily: Fonts.Font_Primary,
                                                                        fontSize: 18,
                                                                        color: isSelected ? 'white' : '#000'
                                                                    }}
                                                                >
                                                                    {v?.service_name}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )
                                                    }

                                                    )
                                                }
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                        )
                    }

                    <View style={{ marginTop: 24 }}>
                        <TouchableOpacity
                        disabled={!validateEmail(email)}
                            onPress={() => {
                                handleSubmit()
                            }}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: !validateEmail(email) ? 'gray' : Colors.primary,
                                height: 48,
                                borderRadius: 8
                            }}
                        >
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: 'white' }}>
                                Edit Profile
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                        <Text style={{ fontFamily: Fonts.Font_Primary, color: 'red' }}>{error?.toString()}</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}


export default EditProfile