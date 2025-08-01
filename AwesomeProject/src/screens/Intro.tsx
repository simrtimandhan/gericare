import LottieView from 'lottie-react-native';
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import SliderIntro from 'react-native-slider-intro';
import { Colors, Fonts } from '../utils/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';

const IntroSlide = ({ navigation }) => {
    const { width, height } = Dimensions.get('window');
    const deviceMaxHeight = Dimensions.get('screen').height;

    const slides = [
        {
            index: 1,
            title: 'Helping Elders Live Better Lives',
            text: 'We provide elders with the support they need through volunteer services, helping them live independently. With accessible tools and multi-language support, booking assistance has never been easier.',
            backgroundColor: '#F5F5F5',
            animationLink: require('../assets/animation_1.json')
        },
        {
            index: 2,
            title: 'Empowering Elders with Care',
            text: 'Our platform connects elders to trusted volunteers for everyday assistance. Simple, accessible, and designed to support independence with ease.',
            backgroundColor: '#F0F0F0',
            animationLink: require('../assets/animation_2.json')
        },
        {
            index: 3,
            title: 'Earn While Making a Difference',
            text: 'Volunteers can earn money by offering valuable services to elders in need. Flexible opportunities that let you give back while building meaningful connections.',
            backgroundColor: '#DCDCDC',
            animationLink: require('../assets/animation_3.json')
        },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <SliderIntro numberOfSlides={slides.length} fixDotBackgroundColor={'grey'} fixDotOpacity={0.5} animatedDotBackgroundColor={Colors.primary} renderNextButton={() => (
                <View style={{ marginLeft: 40 }}>
                    <AntDesign name="arrowright" size={20} color={Colors.primary} />
                </View>
            )} renderSkipButton={() => (
                <View style={{ marginRight: 28 }}>
                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, color: Colors.primary }}>SKIP</Text>
                </View>
            )} renderDoneButton={() => (
                <View style={{ marginLeft: 40 }}>
                    <AntDesign name="arrowright" size={20} color={Colors.primary} />
                </View>
            )} onSkip={() => {
                navigation.navigate('Login')
            }} onDone={() => {
                navigation.navigate('Login')
            }}>
                {
                    slides.map(v => (
                        <View key={v.index} style={{ width: width }}>
                            <View style={{ display: 'flex', alignItems: 'center', height: deviceMaxHeight }}>
                                <View style={{
                                    backgroundColor: '#FFFFFF',
                                }}>
                                    <LottieView source={v.animationLink} autoPlay loop style={{ height: 400, width: 400 }} />
                                </View>
                                <View style={{ margin: 16, height: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: Fonts.Font_Semi_Bold, fontSize: 24, marginTop: 24, textAlign: 'center', color: Colors.primary }}>{v.title}</Text>
                                    <View style={{ marginTop: 24 }}>
                                        <Text style={{ fontFamily: Fonts.Font_Primary, fontSize: 16, textAlign: 'center', lineHeight: 18 }}>{v.text}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </SliderIntro>
        </SafeAreaView>
    );
};

export default IntroSlide;
