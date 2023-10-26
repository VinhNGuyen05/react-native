import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, Button, Image, StyleSheet, Dimensions, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native';
import heart2 from '../assets/icon/heart-2.png'
import star from '../assets/icon/star.png'
import trash from '../assets/icon/trash.png'

export const Favorite = ({ navigation }) => {
    const isFocused = useIsFocused()
    // const navigation = useNavigation();
    const [favorite, setFavorite] = useState([])
    const [reload, setReload] = useState(true)

    //get
    useEffect(() => {
        (async () => {
            try {
                const favoriteList = await AsyncStorage.getItem('favoriteList')
                setFavorite(favoriteList === null ? [] : JSON.parse(favoriteList))
            } catch (error) {
            }
        })()
    }, [reload, isFocused])

    const removeItem = async (item) => {
        const updatedFavorites = favorite.filter(fav => fav.name !== item.name);
        await AsyncStorage.setItem('favoriteList', JSON.stringify(updatedFavorites))
        setReload(!reload)
    }

    const removeFavorite = async () => {
        let list = [];
        try {
            await AsyncStorage.setItem('favoriteList', JSON.stringify(list))
            setFavorite([])
        } catch (e) {
            // remove error
        }
    }

    const alertOption = () => {
        Alert.alert(
            'Warning',
            'Are you sure you want to delete all your favorites?',
            [
                {
                    text: 'YES',
                    onPress: () => removeFavorite(),
                    style: 'destructive',
                },
                {
                    text: 'NO',
                    onPress: () =>
                        console.log(),
                    style: 'cancel'
                },
            ],
        )
    }

    const renderOrchidItem = ({ item }) => (
        <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
                navigation.navigate('Detail', { item })
            }}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <TouchableOpacity
                onPress={() => {
                    removeItem(item)
                }}
                style={{ position: 'absolute', right: 10, top: 10 }} >
                <Image source={heart2} style={{ height: 30, width: 30 }} />
            </TouchableOpacity>
            <Text style={styles.cardOrigin}>{item.origin}</Text>
            <Text style={styles.cardName}>{item.name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginRight: 10, marginBottom: 15, marginTop: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={star} style={{ height: 15, width: 15 }} />
                    <Text style={{ marginLeft: 5 }}>{item.rating}</Text>
                </View>
                <Text>${item.price}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <View style={styles.orchidDetailLine}>
                <Text style={styles.cardTitle}>Favorite List</Text>
                <TouchableOpacity onPress={() => alertOption()}>
                    <Image source={trash} style={{ height: 30, width: 30, marginRight: 10 }} />
                </TouchableOpacity>
            </View>

            {favorite.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>No favorite items found!</Text>
                </View>
            ) : (
                <ScrollView style={styles.cardContainer}>
                    <View>
                        <FlatList
                            data={favorite}
                            renderItem={renderOrchidItem}
                            keyExtractor={item => item.name}
                            numColumns={2}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    //orchid list
    cardTitle: {
        marginLeft: 10,
        marginBottom: 20,
        fontSize: 30,
        fontWeight: 'bold'
    },
    cardContainer: {
        width: '100%',
    },
    cardItem: {
        width: '46%',
        marginLeft: 10,
        marginBottom: 20,
        backgroundColor: '#F4F4F4'
    },
    cardImage: {
        height: 150,
        width: '100%'
    },
    cardName: {
        fontSize: 20,
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: wp('0.5%'),
    },
    cardOrigin: {
        marginLeft: 10,
        fontSize: 12,
        fontWeight: '200',
        marginTop: wp('2%'),
        marginBottom: wp('2%'),
        color: '#A1A1A1'
    },

    orchidDetailLine: {
        marginTop: hp('2%'),
        marginBottom: hp('2%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});