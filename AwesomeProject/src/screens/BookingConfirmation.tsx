import { Image, Text, TouchableOpacity, View } from "react-native"
import { Colors, Fonts } from "../utils/theme"


const BookingConfirmation = ({ navigation }:any) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <Image style={{ width: 100, height: 100, objectFit: 'contain' }} source={require('../assets/success.gif')} />
                </View>
                <View style={{ marginTop: 24 }}>
                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 16, textAlign: 'center' }}>Your Request Has Been Sent. We will inform you once the helper accepts your request</Text>
                </View>
                <View style={{ width: '100%' }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Dashboard')
                        }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Colors.primary,
                            height: 48,
                            borderRadius: 8,
                            marginTop: 24,
                            margin: 16
                        }}
                    >
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: 'white' }}>
                            Dashboard
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}


export default BookingConfirmation