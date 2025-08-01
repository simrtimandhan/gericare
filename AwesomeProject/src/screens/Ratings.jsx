import { Alert, KeyboardAvoidingView, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useState } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";

const maxStars = 5
const Ratings = ({ navigation, route }) => {
    const { userId, userDetails, setUserId, setUserDetails, setServiceTime, serviceTime } = useUser();
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [error, setError] = useState('')
    const [selectedRating, setSelectedRating] = useState('')
    const [ratingList, setRatingList] = useState([
        {
            id: 1,
            title: 'Good'
        },
        {
            id: 2,
            title: 'Average'
        },
        {
            id: 3,
            title: 'Excellent'
        },
        {
            id: 4,
            title: 'Bad'
        }
    ])

    const handleStarPress = (starIndex: any) => {
        setRating(starIndex + 1)
    };

    const renderStars = () => {
        let stars = [];
        for (let i = 0; i < maxStars; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
                    <AntDesign
                        name={i < rating ? 'star' : 'staro'} // 'star' for filled, 'staro' for empty
                        size={40}
                        color={i < rating ? 'gold' : '#d3d3d3'} // Color the star based on rating
                        style={{
                            marginHorizontal: 5,
                        }}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    const completeRequest = async() => {
        await axios.get(`${baseUrl}/api/request/completed/${route?.params?.data?.request?.request_id}`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data, 'Completed')
            setServiceTime(null)
            navigation.navigate('BookingComplete')
        }).catch(err => {
            console.log(err.response)
        })
    }

    const addRating = async() => {
        await axios.post(`${baseUrl}/api/rating/new`, {
            'helper_id':route?.params?.data?.request?.helper?.id,
            'request_id':route?.params?.data?.request?.request_id,
            'booking_id':route?.params?.data?.booking?.booking_id,
            'review':selectedRating,
            'rating':rating?.toString()
        },{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data, 'Completed')
            setServiceTime(null)
            navigation.navigate('BookingComplete')
        }).catch(err => {
            console.log(err.response)
        })
    }

    const handleSubmit = () => {
        Alert.alert('Payment Confirmation',
            `Did you recieve ${route?.params?.data?.request?.price} for completing the service?`,
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => completeRequest(),
                    style: 'default',
                },
            ],
        )
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ margin: 16 }}>
                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Booking Completed</Text>
                <View style={{ display: 'flex', borderWidth: 1, borderColor: '#d3d3d3', marginTop: 12, borderRadius: 4, padding: 16 }}>
                    <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 14 }}>Service Details</Text>
                    <View style={{ marginTop: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Meet at {route?.params?.data?.request?.elder_address}</Text>
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Appointment Type: {route?.params?.data?.request?.service?.service_name} Appointment</Text>
                        </View>
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Time: {route?.params?.data?.request?.service_hour} Hours</Text>
                        </View>
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Date: {route?.params?.data?.request?.date}</Text>
                        </View>
                        <View style={{ marginTop: 4 }}>
                            <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Total: {route?.params?.data?.request?.price} PKR</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 16, borderWidth: 1, borderColor: '#d3d3d3', borderRadius: 8, padding: 12 }}>
                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 24, color: Colors.primary }}>Payment</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 20 / 2, backgroundColor: 'black' }}>
                                <View style={{ width: 10, height: 10, borderRadius: 10 / 2, backgroundColor: 'white' }}></View>
                            </View>
                            <View style={{ marginLeft: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 14 }}>Pay By Cash</Text>
                            </View>
                        </View>
                        <View>
                            <AntDesign name="check" size={18} />
                        </View>
                    </View>
                </View>
                {
                    (userDetails?.user_type == 'elder' || userDetails?.user_type == 'family') ? (
                        <View>
                            <View style={{ marginTop: 16 }}>
                                <View>
                                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 24, color: Colors.primary }}>Ratings</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
                                    {renderStars()}
                                </View>
                                <View style={{ marginTop: 12 }}>
                                    {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '100%' }}>
                                        <TextInput value={review} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '100%' }} placeholder="Review" onChangeText={(e) => {
                                            setReview(e)
                                        }} />
                                    </View> */}
                                    <View style={{ display:'flex', flexDirection:'row', alignItems:'center', marginTop: 16 }}>
                                    {
                                        ratingList && ratingList?.map((v,i) => (
                                            <TouchableOpacity onPress={() => {
                                                setSelectedRating(v.title)
                                            }} style={{backgroundColor: v.title == selectedRating ? Colors.primary : 'white', borderRadius:8, marginRight:8, padding:12, borderColor:Colors.primary, borderWidth:1}}>
                                                <Text style={{color:v.title == selectedRating ? 'white' : Colors.primary, fontFamily:Fonts.Font_Semi_Bold, fontSize:14}}>{v.title}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                    {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '100%' }}>
                                        <TextInput value={review} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '100%' }} placeholder="Review" onChangeText={(e) => {
                                            setReview(e)
                                        }} />
                                    </View> */}
                                </View>

                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                if(rating == 0) {
                                    setError('Rating is Required')
                                } else if (selectedRating?.length == 0) {
                                    setError('Review is Required')
                                } else {
                                    addRating()
                                }
                            }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, marginTop: 24, height: 48, borderRadius: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 16, color: 'white' }}>Complete</Text>
                            </TouchableOpacity>
                            {
                                error && (
                                    <View style={{display:'flex', alignItems:'center', justifyContent:'center', marginTop:16}}>
                                        <Text style={{fontFamily:Fonts.Font_Semi_Bold, color:'red'}}>{error}</Text>
                                    </View>
                                )
                            }
                        </View>
                    ) : (
                        <View>
                            <TouchableOpacity onPress={() => {
                                handleSubmit()
                            }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, marginTop: 24, height: 48, borderRadius: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 16, color: 'white' }}>Confirm Payment</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

            </View>
        </SafeAreaView>
    )
}


export default Ratings