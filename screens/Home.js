import React, { useState, useEffect } from 'react'
// @ts-ignore
import { SafeAreaView, View, Text, Button, Image, StyleSheet, Dimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import heart from '../assets/icon/heart.png'
import heart2 from '../assets/icon/heart-2.png'
import star from '../assets/icon/star.png'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native';
import { Categories } from '../db'

export const Home = ({ navigation }) => {
    const isFocused = useIsFocused()
    const [topList, setTopList] = useState([])
    const [keyword, setKeyWord] = useState('All')
    const [orchid, setOrchid] = useState([])
    const [favorite, setFavorite] = useState([])
    const [category, setCategory] = useState([])

    //async storage
    //get item
    const getLocal = async () => {
        try {
            const favoriteList = await AsyncStorage.getItem('favoriteList')
            setFavorite(favoriteList === null ? [] : JSON.parse(favoriteList))
        } catch (error) {
        }
    }

    useEffect(() => {
        getLocal()
    }, [isFocused])

    useEffect(() => {
        setKeyWord('All')
    }, [isFocused])

    //set item
    useEffect(() => {
        (async () => {
            try {
                await AsyncStorage.setItem('favoriteList', JSON.stringify(favorite))
            } catch (error) {
            }
        })()
    }, [favorite])

    //carousel
    useEffect(() => {
        const updatedTopList = []
        Categories.forEach((category) => {
            category.items.forEach((item) => {
                if (item.isTopOfTheWeek === true) {
                    updatedTopList.push(item)
                }
            });
        });
        setTopList(updatedTopList)
    }, [])

    const renderCarousel = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('Detail', { item })
            }}
                style={styles.carouselItem}>
                <Image source={{
                    uri: item.image,
                }} style={styles.carouselImage} />
                <Text style={styles.carouselTitleFirst}>#TOP OF THE WEEK</Text>
                <Text style={styles.carouselTitleSecond}>TOP ORCHID</Text>
                <Text style={styles.carouselTitleLast}>Discover new orchid</Text>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        const updatedCategory = []
        updatedCategory.push('All')
        Categories.forEach((category) => {
            updatedCategory.push(category.name)
        });
        setCategory(updatedCategory)
    }, [])

    // Update renderCategory
    const renderCategory = (item) => {
        return (
            <TouchableOpacity
                style={item === keyword ? styles.activeButton : styles.button}
                onPress={() => {
                    if (keyword === item) {
                        setKeyWord('All');
                    } else {
                        setKeyWord(item);
                    }
                }}>
                <Text style={item === keyword ? styles.activeText : styles.text}>
                    <Text>
                        {item}
                    </Text>
                </Text>
            </TouchableOpacity>
        );
    };


    // Update the orchid list useEffect
    useEffect(() => {
        const updatedOrchid = [];
        if (keyword !== 'All') {
            Categories.filter((item) => {
                if (item.name === keyword) {
                    item.items.forEach((item) => {
                        updatedOrchid.push(item);
                    });
                }
            });
        } else {
            Categories.forEach((category) => {
                category.items.forEach((item) => {
                    updatedOrchid.push(item);
                });
            });
        }
        setOrchid(updatedOrchid);
    }, [keyword]);

    const renderOrchidItem = ({ item }) => {
        const isFavorited = favorite.some(fav => fav.name === item.name)

        const toggleFavorite = () => {
            if (isFavorited) {
                const updatedFavorites = favorite.filter(fav => fav.name !== item.name);
                setFavorite(updatedFavorites);
            } else {
                setFavorite([...favorite, item]);
            }
        }

        return (
            <TouchableOpacity
                style={styles.cardItem}
                onPress={() => {
                    navigation.navigate('Detail', { item })
                }}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <TouchableOpacity
                    onPress={toggleFavorite}
                    style={{ position: 'absolute', right: 10, top: 10 }} >
                    <Image source={isFavorited ? heart2 : heart} style={{ height: 30, width: 30 }} />
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

    }

    return (
        <View style={styles.container}>
            <View style={styles.carouselContainer}>
                <Carousel
                    data={topList}
                    renderItem={renderCarousel}
                    sliderWidth={Dimensions.get('screen').width}
                    itemWidth={Dimensions.get('screen').width}
                    autoplay={true}
                    autoplayInterval={5000}
                    loop={true}
                />
            </View>

            <View style={styles.orchidDetailLine}>
                {category.map((item, index) => (
                    <View key={index}>{renderCategory(item)}</View>
                ))}
            </View>

            <View style={styles.orchidDetailLine}>
                <Text style={styles.cardTitle}>Orchid List</Text>
                <Button
                    title="Favorite List"
                    onPress={() => navigation.navigate('Favorite')}
                    color="#C0E862"
                />
            </View>
            <ScrollView style={styles.cardContainer}>
                <View>
                    <FlatList
                        data={orchid}
                        renderItem={renderOrchidItem}
                        keyExtractor={(item) => item.name}
                        numColumns={2}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    //carousel
    carouselContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    carouselItem: {
        width: '100%',
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
    },
    carouselTitleFirst: {
        position: 'absolute',
        left: 20,
        top: 40,
        fontWeight: 'bold',
        color: '#C0E862',
    },
    carouselTitleSecond: {
        position: 'absolute',
        left: 20,
        top: 60,
        fontSize: 30,
        fontWeight: 'bold',
        color: '#C0E862',
    },
    carouselTitleLast: {
        position: 'absolute',
        left: 20,
        top: 100,
        color: '#C0E862',
    },
    //orchid list
    cardTitle: {
        marginLeft: 10,
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
        marginBottom: wp('1.5%'),
        color: '#A1A1A1'
    },

    orchidDetailLine: {
        marginBottom: hp('1.5%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    //button
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 4,
        // elevation: 3,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#000000',
    },
    activeButton: {
        backgroundColor: '#C0E862', // Example of styling for the active category
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 4,
        // elevation: 3,
    },
    activeText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#FFFFFF', // Example of styling for the text in the active category
    },
});