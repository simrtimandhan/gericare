import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    Text,
    Linking,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';
import { useUser } from '../context/userContext';
import { Fonts } from '../utils/theme';

const HelperMap = () => {
    const { userId, userDetails, setUserId, setUserDetails } = useUser();

    const [location, setLocation] = useState(null);
    const mapRef = useRef<MapView | null>(null);
    const [mapKey, setMapKey] = useState(0);
    const [isMapReady, setIsMapReady] = useState(false);
    const [showMarker, setShowMarker] = useState(false)


    const getLocation = async () => {
        await axios.get(`${baseUrl}/api/user/${userDetails?.elder_id}/get-location`, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res.data?.data, 'DATA')
            const coords = {
                latitude: Number(res.data?.data?.latitude),
                longitude: Number(res.data?.data?.longitude)
            };
            mapRef.current?.animateToRegion({
                ...coords,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
            setLocation({
                latitude: Number(res.data?.data?.latitude),
                longitude: Number(res.data?.data?.longitude)
            })

        }).catch(err => {
            console.log(err.response)
        })
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;

        (async () => {
            getLocation();
            interval = setInterval(() => {
                getLocation();
            }, 10000);
        })();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);


    useEffect(() => {
        if (isMapReady) {
            setTimeout(() => {
                setShowMarker(true)
            }, 2000)
        }
    }, [isMapReady]);


    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        'Need Help?',
                        'Choose an option below:',
                        [
                            { text: 'Call Ambulance', onPress: () => {
                                Linking.openURL('tel:922132413232');
                            } },
                            { text: 'Call Police', onPress: () => {
                                Linking.openURL('tel:15');
                            } },
                            { text: 'Cancel', style: 'cancel' },
                        ],
                        { cancelable: true }
                    );
                }}
                style={styles.helpButton}
            >
                <Text style={{ fontFamily: Fonts.Font_Semi_Bold }}>Help</Text>
            </TouchableOpacity>
            {location && (
                <MapView
                    ref={mapRef}
                    provider={"google"}
                    style={styles.map}
                    moveOnMarkerPress={true}
                    loadingEnabled={true}
                    loadingIndicatorColor="#666"
                    loadingBackgroundColor="#eee"
                    initialRegion={{
                        latitude: 24.8198,
                        longitude: 67.0307,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    onMapReady={() => setIsMapReady(true)}
                >
                    {showMarker && (
                        <Marker
                            tracksViewChanges={true}
                            coordinate={{
                                latitude: location?.latitude,
                                longitude: location?.longitude,
                            }}
                        >
                            <Image style={{ width: 20, height: 20 }} source={require('../assets/avatar.png')} />
                        </Marker>
                    )}
                </MapView>
            )}
        </View>

    );
};

export default HelperMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    helpButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius:8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        zIndex: 999,
    },
});
