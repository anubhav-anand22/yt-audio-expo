import React, { useContext } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Btn from '../Components/Btn';
import Txt from '../Components/Txt';
import Context from '../Helper/context';

const HomeScreen = () => {
    const {setAlertInfo} = useContext(Context);

    return (
        <View>
            <Txt>Helloooo</Txt>
            <Btn txt='hello' onPress={() => {
                setAlertInfo({type: "n", message: "alsjal", show: true})
            }} />
        </View>
    )
};

export default HomeScreen