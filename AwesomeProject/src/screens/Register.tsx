import axios from "axios"
import { useEffect, useState } from "react"
import { Image, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { baseUrl } from "../utils/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/userContext";



const Register = ({ navigation, route }: any) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();

    const { type } = route?.params
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [age, setAge] = useState(null)
    const [gender, setGender] = useState('')
    const [city, setCity] = useState('')
    const [userState, setUserState] = useState('')
    const [userCnic, setUserCnic] = useState('')
    const [familyId, setFamilyId] = useState("")
    const [elderRelation, setElderRelation] = useState("")
    const [userAddress, setUserAddress] = useState('')
    const [userJob, setUserJob] = useState('')
    const [userCharges, setUserCharges] = useState(null)
    const [recentPhoto, setRecentPhoto] = useState('')
    const [userPhoto, setUserPhoto] = useState('')
    const [degreeImage, setDegreeImage] = useState('')
    const [currentStep, setCurrentStep] = useState(1)
    const [showError, setShowError] = useState('')
    const [error, setError] = useState('')
    const [displayPassword, setDisplayPassword] = useState(true)
    const [formError, setFormError] = useState('')
    const [services, setServices] = useState()
    const [userServices, setUserServices] = useState([])
    const [emailError, setEmailError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [cnicError, setCnicError] = useState(false)

    const getServices = async() => {
        await axios.get(`${baseUrl}/api/services`).then((res) => {
            setServices(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getServices()
    },[])


    const isFormValid = () => {
        if(currentStep == 1) {
            if(firstName?.length == 0){
                setShowError('First Name is required')
            } else if(lastName?.length == 0){ 
                setShowError('Last Name is required')
            } else if(phone?.length == 0){
                setShowError('Phone Number is required')
            } else if(email?.length == 0 || !validateEmail(email)){
                setShowError('Email is invalid')
            } else if(password?.length < 8){
                setShowError('Password must be at least 8 characters')
            } else {
                setCurrentStep(currentStep + 1)
                setShowError('')
            }
        } else if (currentStep == 2) {
            if(age < 17) {
                setShowError('Age must be at least 18')
            } else if (gender?.length == 0) {
                setShowError('Gender is required')
            } else if (city?.length == 0) {
                setShowError('City is required')
            } else if (userCnic?.length < 12 ){
                setShowError('CNIC must be 13 characters')
            } else if (userState?.length == 0) {
                setShowError('State is required')
            } else if (userAddress?.length == 0) {
                setShowError('Address is required')
            } else if (currentStep < 3 && type != 'helper') {
                handleSubmit()
                setShowError('')
                console.log("ABCD")
            } else {
                console.log("ELSE")
                setCurrentStep(currentStep + 1)
            }
        } else {
            console.log("HEY", userCharges)
            if(userJob?.length == 0) {
                setShowError('Job is required')
            } else if (userCharges ==  null) {
                setShowError('Charges must be greater than 0')
            } else {
                handleSubmit()
            }
        }
       
    }


    const handleImage = async (type) => {
        let result = await launchImageLibrary({
            selectionLimit: 1
        });
        if (result?.assets?.length > 0) {
            let imagesWithStatus = result?.assets?.map(asset => ({
                ...asset,
                status: 'uploading',
                fileType: 'image'
            }));
            if (type == 'recent') {
                setRecentPhoto(imagesWithStatus)
            } else if (type == 'user') {
                setUserPhoto(imagesWithStatus)
            } else {
                setDegreeImage(imagesWithStatus)
            }
        }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append('first_name', firstName)
        formData.append('last_name', lastName)
        formData.append('email', email)
        formData.append('phone_number', phone)
        formData.append('password', password)
        formData.append('age', age)
        formData.append('gender', gender?.toLowerCase())
        formData.append('city', city)
        formData.append('state', userState)
        formData.append('cnic', userCnic)
        formData.append('address', userAddress)
        formData.append('user_type', type)
        if(familyId) {
            formData.append('elder_id',familyId)
        }
        if(userJob) {
            formData.append('job', userJob ? userJob : null)
        } 
        if(userCharges) {
            formData.append('hourly_charges', userCharges ? userCharges : null)
        }

        if (userServices?.length > 0 && type == 'helper') {
            userServices.forEach(service => {
                formData.append('services[]', service?.id);
            });
        }
 
        if (type == 'helper') {
            if(recentPhoto[0]?.fileName) {
                formData.append('recent_photo', {
                    name: recentPhoto[0]?.fileName,
                    type: recentPhoto[0]?.type,
                    uri: Platform.OS == 'android' ? recentPhoto[0]?.uri : recentPhoto[0]?.uri?.replace('file://', '')
                })
            }

            if(userPhoto[0]?.fileName) {
                formData.append('cnic_photo', {
                    name: userPhoto[0]?.fileName,
                    type: userPhoto[0]?.type,
                    uri: Platform.OS == 'android' ? userPhoto[0]?.uri : userPhoto[0]?.uri?.replace('file://', '')
                })
            }

            if(degreeImage[0]?.fileName) {
                formData.append('highest_qualification_document', {
                    name: degreeImage[0]?.fileName,
                    type: degreeImage[0]?.type,
                    uri: Platform.OS == 'android' ? degreeImage[0]?.uri : degreeImage[0]?.uri?.replace('file://', '')
                })
            }


        }

        await axios({
            method:'POST',
            url:`${baseUrl}/api/register`,
            timeout:1000000,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data:formData
        }).then(async (res) => {
            await AsyncStorage.setItem('user', res.data?.data?.user_id?.toString());
            await AsyncStorage.setItem('user_details', JSON.stringify(res.data?.user));
            setUserDetails(res.data?.user)
            setUserId(res.data?.data?.user_id)
            setTimeout(() => {
                navigation.navigate('Dashboard')
            },1000)
            setShowError('')
        }).catch(err => {
            console.log(err?.response?.data?.message)
            setError(err?.response?.data?.message)
        })
    }

    const renderUserForm = () => {
        if (currentStep == 1) {
            return (
                <View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '45%' }}>
                            <TextInput value={firstName} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="First Name" onChangeText={(e) => {
                                setFirstName(e)
                            }} />
                            <View style={{ marginRight: 8 }}>
                                <AntDesign name="user" size={18} color={Colors.primary} />
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '45%' }}>
                            <TextInput value={lastName} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Last Name" onChangeText={(e) => {
                                setLastName(e)
                            }} />
                            <View style={{ marginRight: 8 }}>
                                <AntDesign name="user" size={18} color={Colors.primary} />
                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <TextInput value={phone} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Phone" keyboardType="numeric" onChangeText={(e) => {
                            setPhone(e)
                            if(e?.length >= 0 && e?.length <= 10) {
                                setPhoneError(true)
                            } else {
                                setPhoneError(false)
                            }
                        }} />
                        <View style={{ marginRight: 8 }}>
                            <AntDesign name="phone" size={18} color={Colors.primary} />
                        </View>
                    </View>
                    {
                        phoneError && (
                            <View style={{marginTop:4}}>
                                <Text style={{fontFamily:Fonts.Font_Semi_Bold, color:'red'}}>Phone is required</Text>
                            </View>
                        )
                    }
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <TextInput value={email} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Email" onChangeText={(e) => {
                            setEmail(e)
                            if(!validateEmail(e)) {
                                setEmailError(true)
                            } else {
                                setEmailError(false)
                            }
                        }} />
                        <View style={{ marginRight: 8 }}>
                            <AntDesign name="mail" size={18} color={Colors.primary} />
                        </View>
                    </View>
                    {
                        emailError && (
                            <View style={{marginTop:4}}>
                                <Text style={{fontFamily:Fonts.Font_Semi_Bold, color:'red'}}>Email is required</Text>
                            </View>
                        )
                    }
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <TextInput value={password} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Password" secureTextEntry={displayPassword} onChangeText={(e) => {
                            setPassword(e)
                            if(e?.length < 8) {
                                setPasswordError(true)
                            } else {
                                setPasswordError(false)
                            }
                        }} />
                        <TouchableOpacity onPress={() => {
                            setDisplayPassword(!displayPassword)
                        }} style={{ marginRight: 8 }}>
                            <AntDesign name="key" size={18} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {
                        passwordError && (
                            <View style={{marginTop:4}}>
                                <Text style={{fontFamily:Fonts.Font_Semi_Bold, color:'red'}}>Password should be 8 characters</Text>
                            </View>
                        )
                    }

                    <View style={{ marginTop: 48 }}>
                        <TouchableOpacity onPress={() => {
                            isFormValid()
                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, height: 48, borderRadius: 8 }}>
                            <Text style={{ fontSize: 18, color: 'white', fontFamily: Fonts.Font_Semi_Bold }}>Next</Text>
                        </TouchableOpacity>
                        {
                            showError && (
                                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                                    <Text style={{ color: 'red', textAlign: 'center' }}>{showError}</Text>
                                </View>
                            )
                        }
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('Login')
                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary }}>Already Have An Account? <Text style={{ color: Colors.primary, fontFamily: Fonts.Font_Bold }}>Login</Text></Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )
        } else if (currentStep == 2) {
            return (
                <View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '45%' }}>
                            <TextInput value={age?.toString()} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="25" keyboardType="numeric" onChangeText={(e) => {
                                setAge(e)
                            }} />
                            <View style={{ marginRight: 8 }}>
                                <AntDesign name="user" size={18} color={Colors.primary} />
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '45%' }}>
                            <TextInput value={gender} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Gender" onChangeText={(e) => {
                                setGender(e)
                            }} />
                            <View style={{ marginRight: 8 }}>
                                <AntDesign name="user" size={18} color={Colors.primary} />
                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <TextInput value={userCnic} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="CNIC" keyboardType="numeric" onChangeText={(e) => {
                            setUserCnic(e)
                            if(e?.length != 13) {
                                setCnicError(true)
                            } else {
                                setCnicError(false)
                            }
                        }} />
                        <View style={{ marginRight: 8 }}>
                            <AntDesign name="idcard" size={18} color={Colors.primary} />
                        </View>
                    </View>
                    {
                        cnicError && (
                            <View style={{marginTop:4}}>
                                <Text style={{fontFamily:Fonts.Font_Semi_Bold, color:'red'}}>CNIC should be 13 characters</Text>
                            </View>
                        )
                    }
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '45%' }}>
                            <TextInput value={city} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="City" onChangeText={(e) => {
                                setCity(e)
                            }} />
                            <View style={{ marginRight: 8 }}>
                                <AntDesign name="home" size={18} color={Colors.primary} />
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '45%' }}>
                            <TextInput value={userState} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="State" onChangeText={(e) => {
                                setUserState(e)
                            }} />
                            <View style={{ marginRight: 8 }}>
                                <AntDesign name="home" size={18} color={Colors.primary} />
                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <TextInput value={userAddress} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Address" onChangeText={(e) => {
                            setUserAddress(e)
                        }} />
                        <View style={{ marginRight: 8 }}>
                            <Entypo name="location-pin" size={18} color={Colors.primary} />
                        </View>
                    </View>
                    {
                        type == 'family' && (
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                                <TextInput style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} value={familyId} placeholder="Elder ID" onChangeText={(e) => {
                                    setFamilyId(e)
                                }} />
                                <View style={{ marginRight: 8 }}>
                                    <AntDesign name="adduser" size={18} color={Colors.primary} />
                                </View>
                            </View>
                        )
                    }
                    {
                        type == 'family' && (
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                                <TextInput style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} value={elderRelation} placeholder="Relation To Elder" onChangeText={(e) => {
                                    setElderRelation(e)
                                }} />
                                <View style={{ marginRight: 8 }}>
                                    <AntDesign name="adduser" size={18} color={Colors.primary} />
                                </View>
                            </View>
                        )
                    }
                    <View style={{ marginTop: 48 }}>
                        <TouchableOpacity onPress={() => {
                            isFormValid()
                            
                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, height: 48, borderRadius: 8 }}>
                            <Text style={{ fontSize: 18, color: 'white', fontFamily: Fonts.Font_Semi_Bold }}>{currentStep == 2 ? 'Submit' : 'Next'}</Text>
                        </TouchableOpacity>
                        {
                            showError && (
                                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                                    <Text style={{ color: 'red', textAlign: 'center' }}>{showError}</Text>
                                </View>
                            )
                        }
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary, color: 'red' }}>{error?.toString()}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('Login')
                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary }}>Already Have An Account? <Text style={{ color: Colors.primary, fontFamily: Fonts.Font_Bold }}>Login</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else if (currentStep == 3 && type == 'helper') {
            return (
                <View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <TextInput value={userJob} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Current Job" onChangeText={(e) => {
                            setUserJob(e)
                        }} />
                        <View style={{ marginRight: 8 }}>
                            <Entypo name="user" size={18} color={Colors.primary} />
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderBottomWidth: 1, borderBottomColor: Colors.primary }}>
                        <TextInput value={userCharges?.toString()} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Hourly Charges" keyboardType="numeric" onChangeText={(e) => {
                            setUserCharges(e)
                        }} />
                        <View style={{ marginRight: 8 }}>
                            <Entypo name="calendar" size={18} color={Colors.primary} />
                        </View>
                    </View>
                    {
                        services?.length > 0 && (
                            <View style={{ display: 'flex', marginTop: 24 }}>
                                <View>
                                    <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 18 }}>Your Prefered Services</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 12 }}>
                                    {services?.map((v, i) => {
                                        const isSelected = userServices?.some(s => s.id === v.id); // Assuming 'id' is unique

                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => {
                                                    let updatedServices = [...userServices];
                                                    if (isSelected) {
                                                        updatedServices = updatedServices.filter(s => s.id !== v.id);
                                                    } else {
                                                        updatedServices.push(v);
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
                                        );
                                    })}
                                </View>
                            </View>

                        )
                    }
                    <TouchableOpacity onPress={() => {
                        handleImage('recent')
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderWidth: 1, borderBottomColor: Colors.primary, padding: 16, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>{recentPhoto[0]?.fileName ? recentPhoto[0]?.fileName : 'Recent Photo'}</Text>
                        <AntDesign name="user" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        handleImage('user')
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderWidth: 1, borderBottomColor: Colors.primary, padding: 16, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>{userPhoto[0]?.fileName ? userPhoto[0]?.fileName : 'CNIC Photo'}</Text>
                        <AntDesign name="user" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        handleImage('education')
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, borderWidth: 1, borderBottomColor: Colors.primary, padding: 16, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18 }}>{degreeImage[0]?.fileName ? degreeImage[0]?.fileName : 'Educational Certificate'}</Text>
                        <AntDesign name="user" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 48 }}>
                        <TouchableOpacity onPress={() => {
                            isFormValid()
                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, height: 48, borderRadius: 8 }}>
                            <Text style={{ fontSize: 18, color: 'white', fontFamily: Fonts.Font_Semi_Bold }}>Submit</Text>
                        </TouchableOpacity>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary, color: 'red' }}>{error?.toString()}</Text>
                        </View>
                        {
                            showError && (
                                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                                    <Text style={{ color: 'red', textAlign: 'center' }}>{showError}</Text>
                                </View>
                            )
                        }
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('Login')
                        }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                            <Text style={{ fontFamily: Fonts.Font_Primary }}>Already Have An Account? <Text style={{ color: Colors.primary, fontFamily: Fonts.Font_Bold }}>Login</Text></Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            )
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <TouchableOpacity onPress={() => {
                    if (currentStep == 1) {
                        navigation.pop()
                    } else if (currentStep > 1 && currentStep < 4) {
                        setCurrentStep(currentStep - 1)
                    }
                }} style={{ marginLeft: 24, marginTop: 24 }}>
                    <AntDesign name="arrowleft" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
                    <Text style={{ fontSize: 28, fontFamily: Fonts.Font_Primary }}>Welcome</Text>
                    <Text style={{ fontSize: 28, fontFamily: Fonts.Font_Primary }}>to <Text style={{ color: Colors.primary, fontFamily: Fonts.Font_Bold }}>GeriCare</Text></Text>
                </View>
                <View style={{ margin: 24 }}>
                    <View style={{ marginTop: 16 }}>
                        <Text style={{ fontSize: 18, color: Colors.primary, fontFamily: Fonts.Font_Bold }}>Step {currentStep} - {type == 'elder' ? 'Elder' : type == 'helper' ? 'Helper' : 'Family Member'} Registration</Text>
                    </View>
                    {renderUserForm()}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default Register