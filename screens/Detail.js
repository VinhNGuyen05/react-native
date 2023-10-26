import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import heart from '../assets/icon/heart.png';
import heart2 from '../assets/icon/heart-2.png';

export const Detail = ({ navigation, route }) => {
    const [value, setValue] = useState(route.params && route.params ? route.params : '');
    const [favorite, setFavorite] = useState([]);
    const isFocused = useIsFocused();

    const getLocal = useCallback(async () => {
        try {
            const favoriteList = await AsyncStorage.getItem('favoriteList');
            setFavorite(favoriteList ? JSON.parse(favoriteList) : []);
        } catch (error) {
            console.error('Error retrieving data: ', error);
        }
    }, []);

    const updateLocal = useCallback(async (updatedFavorites) => {
        try {
            await AsyncStorage.setItem('favoriteList', JSON.stringify(updatedFavorites));
        } catch (error) {
            console.error('Error storing data: ', error);
        }
    }, []);

    useEffect(() => {
        getLocal();
    }, [getLocal, isFocused]);

    const toggleFavorite = () => {
        const isFavorited = favorite.some((fav) => fav.name === value.item.name);

        if (isFavorited) {
            const updatedFavorites = favorite.filter((fav) => fav.name !== value.item.name);
            setFavorite(updatedFavorites);
            updateLocal(updatedFavorites);
        } else {
            const updatedFavorites = [...favorite, value.item];
            setFavorite(updatedFavorites);
            updateLocal(updatedFavorites);
        }
    };

    return (
        <ScrollView>
            <Image source={{
                uri: value.item.image
            }} style={styles.orchidImage} />
            <Text style={styles.orchidName}>{value.item.name}</Text>
            <TouchableOpacity onPress={toggleFavorite} style={{ position: 'absolute', right: 20, top: 20 }}>
                <Image source={favorite.some((fav) => fav.name === value.item.name) ? heart2 : heart} style={{ height: 40, width: 40 }} />
            </TouchableOpacity>
            <View style={styles.orchidPriceContainer}>
                <View>
                    <Text style={styles.orchidPriceTitle}>Total Price</Text>
                    <Text style={styles.orchidPrice}>${value.item.price}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => alert('This feature is under developing')}>
                    <Text style={styles.text}>Deal Price</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.orchidDetailContainer}>
                <Text style={styles.orchidDetailTitle}>About Orchid</Text>
                <View style={styles.orchidDetailLine}>
                    <View style={styles.orchidDetailItem}>
                        <Text style={{ color: '#A1A1A1', }}>Origin:   </Text>
                        <Text style={{ fontWeight: '500' }}>{value.item.origin}</Text>
                    </View>
                    <View style={styles.orchidDetailItem}>
                        <Text style={{ color: '#A1A1A1', }}>Color:   </Text>
                        <Text style={{ fontWeight: '500' }}>{value.item.color}</Text>
                    </View>
                </View>

                <View style={styles.orchidDetailLine}>
                    <View style={styles.orchidDetailItem}>
                        <Text style={{ color: '#A1A1A1', }}>Weight:   </Text>
                        <Text style={{ fontWeight: '500' }}>{value.item.weight}</Text>
                    </View>
                    <View style={styles.orchidDetailItem}>
                        <Text style={{ color: '#A1A1A1', }}>Bonus:   </Text>
                        <Text style={{ fontWeight: '500' }}>{value.item.bonus}</Text>
                    </View>
                </View>

                <View>
                    <Text style={{ color: '#A1A1A1', marginBottom: hp('0.5%') }}>Description:   </Text>
                    <Text style={{ fontWeight: '500' }}>{value.item.description}</Text>
                </View>
            </View>

            <Button
                title="Go to Favorite"
                onPress={() => navigation.navigate('Favorite')}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    //orchid
    orchidImage: {
        width: wp('100%'),
        height: hp('40%'),
        marginBottom: hp('3%')
    },
    orchidName: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: hp('3%')
    },
    orchidPriceContainer: {
        marginHorizontal: 30,
        marginBottom: hp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    orchidPriceTitle: {
        color: '#A1A1A1',
        marginBottom: hp('0.5%')
    },
    orchidPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#C0E862'
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 4,
        // elevation: 3,
        backgroundColor: '#152534',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    //orchid detail
    orchidDetailContainer: {
        marginHorizontal: 30,
        marginBottom: hp('3%'),
    },
    orchidDetailTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#C0E862',
        marginBottom: hp('3%'),
    },
    orchidDetailLine: {
        marginBottom: hp('2%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    orchidDetailItem: {
        // marginBottom: hp('3%'),
        flexDirection: 'row',
    },
    orchidDetailItemTitle: {
        fontSize: 20,
        marginBottom: hp('3%')
    },
});
