import { Dimensions, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import Carousel from 'react-native-snap-carousel';
import { Colors, Fonts } from "../utils/theme";
import { useState } from "react";
import AntDesign from 'react-native-vector-icons/AntDesign';

const sliderWidth = Dimensions.get('window').width;
const itemWidth = Dimensions.get('window').width * 0.75;

const UserScreen = ({ navigation }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const users = [
        {
            id: 1,
            title: 'Elder',
            image: require('../assets/image2.jpg'),
        },
        {
            id: 2,
            title: 'Helper',
            image: require('../assets/image1.jpg'),


        },
        {
            id: 3,
            title: 'Family Member',
            image: require('../assets/image3.jpg'),

        }
    ]

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => {
                setSelectedIndex(index)
            }}>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: selectedIndex == index ? Colors.primary : '#d3d3d3', borderWidth: 1, padding: 16, borderRadius: 16 }}>
                    <Image style={{ width: 240, height: 400, objectFit: 'contain', borderRadius: 12 }} source={item.image} />
                    <View style={{ marginTop: 24 }}>
                        <Text style={{ color: 'black', fontSize: 24, fontFamily: Fonts.Font_Semi_Bold }}>{item.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ margin: 16 }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.pop()
                    }} style={{ marginRight: 16 }}>
                        <AntDesign name="left" size={16} color={Colors.primary} />

                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary, fontSize: 24 }}>Choose your profile</Text>
                    </View>
                </View>
            </View>
            <View style={{ display: 'flex', width: '100%', flex: 1 }}>
                <View style={{ margin: 16 }}>
                    <Carousel layout="default" data={users} renderItem={renderItem} sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideScale={0.95}
                        inactiveSlideOpacity={1}
                        onSnapToItem={(index) => {
                            setSelectedIndex(index)
                        }}
                    />
                </View>
            </View>
            <View style={{ margin: 24 }}>
                <TouchableOpacity onPress={() => {
                    if (selectedIndex == 0) {
                        navigation.navigate('Register', {
                            type: 'elder'
                        })
                    } else if (selectedIndex == 1) {
                        navigation.navigate('Register', {
                            type: 'helper'
                        })
                    } else {
                        navigation.navigate('Register', {
                            type: 'family'
                        })
                    }
                }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, height: 48, borderRadius: 8 }}>
                    <Text style={{ fontSize: 18, color: 'white', fontFamily: Fonts.Font_Semi_Bold }}>Next</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}


export default UserScreen