import { SafeAreaView, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { Colors, Fonts } from "../utils/theme"
import { useState } from "react"
import AntDesign from 'react-native-vector-icons/AntDesign'
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { useUser } from "../context/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddElder = ({ navigation }) => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();
        const [elderId, setElderId] = useState(userDetails?.elder_id ? userDetails?.elder_id?.toString() :  '');
    const [elderType, setElderType] = useState(userDetails?.relation_to_elder ? userDetails?.relation_to_elder : '');
    const [errors, setErrors] = useState({ elderId: '', elderType: '' });
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        let hasError = false;
        const newErrors = { elderId: '', elderType: '' };

        if (!elderId.trim()) {
            newErrors.elderId = 'Elder ID is required';
            hasError = true;
        }

        if (!elderType.trim()) {
            newErrors.elderType = 'Relation to elder is required';
            hasError = true;
        }

        setErrors(newErrors);

        if (!hasError) {
            setLoading(true)
            const formData = new FormData()
            formData.append('elder_id', parseInt(elderId))
            formData.append('relation_to_elder', elderType)
            await axios.post(`${baseUrl}/api/user/${userId}/add-elder`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(async (res) => {
                setLoading(false)
                await AsyncStorage.setItem('user', res.data?.user?.id?.toString());
                await AsyncStorage.setItem('user_details', JSON.stringify(res.data?.user));
                setUserDetails(res.data?.user)
                setUserId(res.data?.user?.id)
                Alert.alert('Add Elder', 'Elder Details Added', [
                    {
                        text: 'Close',
                        style: 'cancel',
                        onPress: () => navigation.pop()
                    },
                ],)
            }).catch(err => {
                setLoading(false)
                const apiError = err?.response?.data;
                if (apiError?.message) {
                    setErrors({
                        elderId: apiError.message,
                        elderType: ''
                    });
                } else if (apiError?.errors) {
                    // If Laravel validation errors
                    setErrors({
                        elderId: apiError.errors.elder_id?.[0] || '',
                        elderType: apiError.errors.relation_to_elder?.[0] || ''
                    });
                } else {
                    // Fallback error
                    setErrors({
                        elderId: 'An unexpected error occurred.',
                        elderType: ''
                    });
                }
            });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ margin: 16 }}>
                <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Add Elder</Text>

                {/* Elder ID Field */}
                <View style={{ width: '100%', marginTop: 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '95%' }}>
                        <TextInput
                            value={elderId}
                            style={{
                                backgroundColor: 'white',
                                height: 48,
                                fontWeight: '500',
                                fontSize: 18,
                                fontFamily: Fonts.Font_Primary,
                                width: '80%'
                            }}
                            placeholder="Elder ID"
                            onChangeText={setElderId}
                        />
                        <View style={{ marginRight: 8 }}>
                            <AntDesign name="user" size={18} color={Colors.primary} />
                        </View>
                    </View>
                    {errors.elderId ? (
                        <Text style={{ color: 'red', marginTop: 4 }}>{errors.elderId}</Text>
                    ) : null}
                </View>

                {/* Relation to Elder Field */}
                <View style={{ width: '100%', marginTop: 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.primary, width: '95%' }}>
                        <TextInput
                            value={elderType}
                            style={{
                                backgroundColor: 'white',
                                height: 48,
                                fontWeight: '500',
                                fontSize: 18,
                                fontFamily: Fonts.Font_Primary,
                                width: '80%'
                            }}
                            placeholder="Relation to elder"
                            onChangeText={setElderType}
                        />
                        <View style={{ marginRight: 8 }}>
                            <AntDesign name="user" size={18} color={Colors.primary} />
                        </View>
                    </View>
                    {errors.elderType ? (
                        <Text style={{ color: 'red', marginTop: 4 }}>{errors.elderType}</Text>
                    ) : null}
                </View>

                <TouchableOpacity disabled={loading} onPress={handleSubmit} style={{ backgroundColor: Colors.primary, marginTop: 32, padding: 14, borderRadius: 8, alignItems: 'center' }}>
                    {
                        loading ? (
                            <ActivityIndicator color={Colors.primary} size={'small'} />
                        ) : (
                            <Text style={{ color: 'white', fontSize: 16, fontFamily: Fonts.Font_Semi_Bold }}>Submit</Text>
                        )
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AddElder;
