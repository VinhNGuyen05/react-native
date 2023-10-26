import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../screens/Home';
import { Detail } from '../screens/Detail';
import { Favorite } from '../screens/Favorite';
import Icon from 'react-native-vector-icons/FontAwesome';

//Bottom navigator
// const Tab = createBottomTabNavigator();
// function MyTabs() {
//     return (
//         <Tab.Navigator>
//             <Tab.Screen name="Home" component={Home} options={{
//                 title: 'Home',
//                 headerStyle: {
//                     backgroundColor: '#152534',
//                 },
//                 headerTitleStyle: {
//                     color: '#ffffff'
//                 }
//                 // tabBarIcon: ({ color }) => <Icon name="search" size={wp('7%')} color={color} />, headerShown: false
//             }} />
//             <Tab.Screen name="Favorite" component={Favorite} options={{
//                 title: 'Favorite',
//                 headerStyle: {
//                     backgroundColor: '#152534',
//                 },
//                 headerTitleStyle: {
//                     color: '#ffffff'
//                 }
//                 // tabBarIcon: ({ color }) => <Icon name="search" size={wp('7%')} color={color} />, headerShown: false
//             }} />
//         </Tab.Navigator>
//     );
// }

const Stack = createNativeStackNavigator();
const MainStackNavigator = () => {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="HomePage" component={MyTabs} options={{ headerShown: false }} /> */}
            <Stack.Screen name="Home" component={Home} options={{
                title: 'Home',
                headerStyle: {
                    backgroundColor: '#152534',
                },
                headerTitleStyle: {
                    color: '#ffffff'
                }
            }} />
            <Stack.Screen name="Detail" component={Detail} options={{
                title: 'Detail',
                headerStyle: {
                    backgroundColor: '#152534',
                },
                headerTitleStyle: {
                    color: '#ffffff'
                }
            }} />
            <Stack.Screen name="Favorite" component={Favorite} options={{
                title: 'Favorite',
                headerStyle: {
                    backgroundColor: '#152534',
                },
                headerTitleStyle: {
                    color: '#ffffff'
                }
            }} />
        </Stack.Navigator>
    );
};

export default MainStackNavigator;
