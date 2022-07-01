import { useContext, useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Context from "../Helper/context";
import Txt from "./Txt";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
} from "react-native-reanimated";
import Touchable from "./Touchable";

const PopUpAlert = () => {
    const { Colors, alertInfo, setAlertInfo } = useContext(Context);
    const { height, width } = useWindowDimensions();
    const transitionYAnimationValue = useSharedValue(0);
    let c = 10;
    const [count, setCount] = useState(c);
    const [intervalId, setIntervalId] = useState(-1);

    const config = {
        duration: 500,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
    };

    const transformStyleAnimation = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withTiming(
                        transitionYAnimationValue.value,
                        config
                    ),
                },
            ],
        };
    });

    const startInterval = () => {
        const id = setInterval(() => {
            if(c <= 1) {
                clearInterval(id);
                setAlertInfo({type: "n", message: "", show: false})
            };
            c -= 1;
            setCount(c);
        }, 1000);
        setIntervalId(id);
    }

    useEffect(() => {
        if (alertInfo.show) {
            c = 10;
            setCount(c);
            transitionYAnimationValue.value = 0;
            if(intervalId !== -1) clearInterval(intervalId);
            startInterval()
        } else {
            transitionYAnimationValue.value = -150;
        }
    }, [alertInfo]);

    const styles = StyleSheet.create({
        alertBoxCont: {
            position: "relative",
        },
        alertBox: {
            position: "absolute",
            top: -height + 40,
            left: 10,
            width: width - 20,
            backgroundColor:
                alertInfo?.type === "n" ? Colors.colorTwo : Colors.colorRed,
            borderRadius: 10,
            overflow: 'hidden',
            transform: [{translateY: -150}]
        },
        txt: {
            fontSize: 16,
            marginLeft: 10,
            width: width - 100,
            color: Colors.colorThree
        },
        alertBoxInner: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 7,
            paddingHorizontal: 10,
        },
        timerTxt: {
            width: 20,
            textAlign: "center",
            color: Colors.colorThree
        }
    });

    const hideAlertBox = () => {
        setAlertInfo({ type: "n", message: "", show: false });
    };

    return (
        <View style={styles.alertBoxCont}>
            <Animated.View style={[styles.alertBox, transformStyleAnimation]}>
                <Touchable onPress={hideAlertBox}>
                    <View style={styles.alertBoxInner}>
                        <Ionicons name="alert-circle" size={32} color={Colors.colorThree} />
                        <Txt style={styles.txt}>{alertInfo?.message}</Txt>
                        <Txt style={styles.timerTxt}>{count}</Txt>
                    </View>
                </Touchable>
            </Animated.View>
        </View>
    );
};

export default PopUpAlert;
