import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/userContext";



const HelperDetails = ({ navigation, route }) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();
    const { helper, service } = route?.params
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState(0);
    // const [userId, setUserId] = useState(null)
    const [openDate, setOpenDate] = useState(false)
    const [selectedHour, setSelectedHour] = useState(route?.params?.service_hour ? route?.params?.service_hour : 2)
    const [address, setAddress] = useState(route?.params?.address ? route?.params?.address : userDetails?.address ? userDetails?.address : '')
    const serviceHours = [2, 3, 4, 5, 6, 7, 8]
    const [error, setError] = useState('')

    console.log(route?.params)


    function getAvailableTimes(selectedDate) {
        // Get current time and current date
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.toDateString(); // Format to compare only date (ignores time)

        // Parse the selected date (assuming it's a Date object)
        const selectedDateObj = new Date(selectedDate);
        const selectedDay = selectedDateObj.toDateString(); // Format to compare only date (ignores time)

        // Available times for today and for any other day
        const availableTimes = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
            "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
            "22:00", "23:00", "00:00"];

        // If the selected date is today
        if (selectedDay === currentDay) {
            // Start from the next available hour
            const nextAvailableHour = currentHour + 1;

            // Filter available times to only include those that are after the current time
            const availableForToday = availableTimes.filter(time => {
                const hour = parseInt(time.split(':')[0]);
                return hour >= nextAvailableHour;
            });

            return availableForToday;
        }

        // If the selected date is not today, return times from 8 AM to midnight
        const availableForOtherDays = [
            "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
            "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
            "22:00", "23:00", "00:00"
        ];

        return availableForOtherDays;
    }



    const generateCalendarData = () => {
        const today = new Date();
        const calendarData = [];


        const getOrdinal = (day) => {
            if (day > 3 && day < 21) return "th";
            switch (day % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        };

        const getShortDayName = (date) => {
            const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
            return days[date.getDay()];
        };

        const getMonthName = (date) => {
            const months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ];
            return months[date.getMonth()];
        };

        for (let i = 0; i < 10; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            const day = getShortDayName(currentDate);
            const date = currentDate.getDate() + getOrdinal(currentDate.getDate()) + " " + getMonthName(currentDate);
            const availableTimes = getAvailableTimes(currentDate);

            calendarData.push({
                day,
                date,
                times: availableTimes,
                formatDate: currentDate
            });
        }

        return calendarData;
    };

    const calendarData = generateCalendarData();


    const formatDateForRequest = (dateString) => {
        console.log(dateString)
        const today = new Date(dateString);
        const currentDate = new Date(today);
        // currentDate.setDate(today.getDate() + selectedDate);

        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        console.log(`${day}/${month}/${year}`)

        return `${day}/${month}/${year}`;
    };


    const getDate = () => {
        if(route?.params?.edit) {
            // const result = calendarData?.findIndex(entry => {
            //     const entryDate = entry?.formatDate?.toDateString().split("T")[0]
            //     return entryDate === new Date(route?.params?.date)?.toDateString()
            // });
            const result = calendarData.findIndex(entry => {
                const entryDate = entry.formatDate?.toISOString().split("T")[0]; // e.g. "2025-04-24"
                return entryDate === route?.params?.date; // also "2025-04-24"
            });
            const timeWithoutSeconds = route?.params?.time?.split(":").slice(0, 2).join(":");
            const timeIndex = calendarData[result]?.times?.indexOf(`${timeWithoutSeconds}`)
            setSelectedDate(result)
            setSelectedTime(timeIndex)
        }
        
     }

     const updateRequest = async() => {
        const formData = new FormData()
        formData.append('request_id', route?.params?.id)
        formData.append('helper_id', helper?.id)
        formData.append('elder_id', userDetails?.user_type == 'family' ? userDetails?.elder_id : userId)
        formData.append('elder_address', address)
        formData.append('service_id', service?.id)
        formData.append('date', formatDateForRequest(calendarData[selectedDate]?.formatDate))
        formData.append('time', calendarData[selectedDate]?.times[selectedTime])
        formData.append('price', (selectedHour * helper?.hourly_charges) + 50)
        formData.append('service_hour', selectedHour)

        await axios.post(`${baseUrl}/api/request/edit`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data)
            navigation.navigate("BookingConfirmation")
        }).catch(err => {
            console.log(err.response)
            setError(err?.response?.data?.message)
        })
     }

    useEffect(() => {
        getDate()
    },[])

    const createRequest = async () => {
        const formData = new FormData()
        formData.append('helper_id', helper?.id)
        formData.append('elder_id', userDetails?.user_type == 'family' ? userDetails?.elder_id : userId)
        formData.append('elder_address', address)
        formData.append('service_id', service?.id)
        formData.append('date', formatDateForRequest(calendarData[selectedDate]?.formatDate))
        formData.append('time', calendarData[selectedDate]?.times[selectedTime])
        formData.append('price', (selectedHour * helper?.hourly_charges) + 50)
        formData.append('service_hour', selectedHour)

        await axios.post(`${baseUrl}/api/create-request`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data)
            navigation.navigate("BookingConfirmation")
        }).catch(err => {
            console.log(err.response)
            setError(err?.response?.data?.message)
        })
    }




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
            <ScrollView>
                <View style={{ margin: 16 }}>
                    <TouchableOpacity onPress={() => {
                        navigation.pop()
                    }} style={{ marginRight: 16 }}>
                        <AntDesign name="left" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <View style={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                            style={{ width: 80, height: 80, objectFit: 'contain' }}
                            source={helper?.recent_photo ? { uri: `${baseUrl}/storage/${helper?.recent_photo}` } : require('../assets/avatar.png')}
                        />
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 18, color: Colors.primary }}>{helper?.first_name} {helper?.last_name}</Text>
                        <Text style={{ fontFamily: Fonts.Font_Primary }}>Medical Assistance (5 years exp)</Text>
                        <Text style={{ fontFamily: Fonts.Font_Primary }}>Total Experience: 5 Years</Text>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Fee: {helper?.hourly_charges} PKR/HR</Text>
                    </View>
                    <View style={{ marginTop: 16, backgroundColor: 'white', padding: 16, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Address</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '100%', marginTop: 8 }}>
                            <TextInput value={address} style={{ backgroundColor: 'white', height: 48, fontWeight: '500', fontSize: 18, fontFamily: Fonts.Font_Primary, width: '80%' }} placeholder="Address" onChangeText={(e) => {
                                setAddress(e)
                            }} />
                            <View style={{ marginRight: 8 }}>
                                <AntDesign name="home" size={18} color={Colors.primary} />
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 16, backgroundColor: 'white', padding: 16, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Select Number Of Service Hours You Need</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                serviceHours?.map((v, i) => (
                                    <TouchableOpacity onPress={() => {
                                        setSelectedHour(v)
                                    }} key={i} style={{
                                        marginTop: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 16, borderColor: Colors.primary,
                                        borderRadius: 8,
                                        borderWidth: selectedHour === v ? 1 : 0,
                                        padding: 16
                                    }}>
                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 18 }}>{v}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </View>

                    <View style={{ marginTop: 16, backgroundColor: 'white', padding: 16, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Time and Date</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                                {calendarData.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedDate(index)}
                                    >
                                        <View
                                            style={{
                                                marginRight: 16,
                                                borderColor: Colors.primary,
                                                borderRadius: 8,
                                                borderWidth: selectedDate === index ? 1 : 0,
                                                padding: 16
                                            }}
                                        >
                                            <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 16 }}>{item.day}</Text>
                                            <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 16 }}>{item.date}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Time Slots Row */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                                {calendarData[selectedDate]?.times.map((time, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedTime(index)}
                                    >
                                        <View
                                            style={{
                                                marginRight: 16,
                                                borderColor: Colors.primary,
                                                borderRadius: 8,
                                                borderWidth: selectedTime === index ? 1 : 0,
                                                padding: 16
                                            }}
                                        >
                                            <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 16 }}>{time}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{ marginTop: 16, backgroundColor: 'white', padding: 16, borderRadius: 8 }}>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Booking Summary</Text>
                        <View style={{ marginTop: 16 }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: Fonts.Font_Primary }}>Service</Text>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>{service?.name}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Primary }}>Date</Text>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>{calendarData[selectedDate]?.date}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Primary }}>Time</Text>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>{calendarData[selectedDate]?.times[selectedTime]}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Primary }}>Total Hours</Text>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>{selectedHour} Hours</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Primary }}>Platform Fee</Text>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>50 PKR</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                <Text style={{ fontFamily: Fonts.Font_Primary }}>Total Amount</Text>
                                <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>{(selectedHour * helper?.hourly_charges) + 50} PKR</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 24 }}>
                        <TouchableOpacity
                            onPress={() => {
                                if(address.length == 0) {
                                    setError('Address is invalid')
                                } else {
                                    setError('')
                                    if(route?.params?.edit) {
                                        updateRequest()
                                    } else {
                                        createRequest()
                                    }
                                }
                               
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
                    <View style={{marginTop:8}}>
                        <Text style={{fontFamily:Fonts.Font_Primary, color: 'red', textAlign:'center'}}>{error}</Text>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HelperDetails