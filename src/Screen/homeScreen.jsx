import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Btn from '../Components/Btn';
import Txt from '../Components/Txt';

const HomeScreen = () => {
    return (
        <View>
            <Txt>Helloooo</Txt>
            <Btn txt='hello' />
        </View>
    )
};

export default HomeScreen