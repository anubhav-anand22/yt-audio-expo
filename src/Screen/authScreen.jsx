import {
    StyleSheet,
    View,
    useWindowDimensions,
    ScrollView,
    Keyboard,
    TextInput,
    TouchableWithoutFeedback,
} from "react-native";
import Txt from "../Components/Txt";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import Context from "../Helper/context";
import Btn from "../Components/Btn";
import Touchable from "../Components/Touchable";

const AuthScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();
    const { type } = params;
    const { width, height } = useWindowDimensions();
    const { Colors } = useContext(Context);

    const [Height, setHeight] = useState(height);

    useEffect(() => {
        navigation.setOptions({
            title: type,
        });
    }, [type]);

    useEffect(() => {
        const id1 = Keyboard.addListener("keyboardDidShow", (e) => {
            setHeight(height - e.endCoordinates.height);
        });
        const id2 = Keyboard.addListener("keyboardDidHide", (e) => {
            setHeight(height);
        });
        return () => {
            id1.remove();
            id2.remove();
        };
    }, []);

    const styles = StyleSheet.create({
        outer: {
            width,
            height: Height - 80,
            justifyContent: "center",
            alignItems: "center",
        },
        inner: {
            padding: 20,
            backgroundColor: Colors.colorTwo,
            borderRadius: 15,
            width: Math.min(width - width / 6, width - 30),
        },
        input: {
            backgroundColor: Colors.colorThree,
            marginTop: 10,
            borderRadius: 10,
            padding: 7,
            fontSize: 16,
        },
        textBtn: {
            marginTop: 10,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold'
        }
    });

    return (
        <ScrollView>
            <View style={styles.outer}>
                <View style={styles.inner}>
                    <Txt style={styles.title}>{type}</Txt>
                    <TextInput style={styles.input} placeholder="Name" />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        textContentType="password"
                        secureTextEntry={true}
                    />
                    <Btn txt={type} marginTop={30} width="100%" />
                    <View style={styles.textBtn}>
                        <TouchableWithoutFeedback onPress={() => {
                            if(type === "Log in") {
                                navigation.navigate('auth', {type: 'Sign up'})
                            } else {
                                navigation.navigate('auth', {type: 'Log in'})
                            }
                        }}>
                            <Txt>
                                {type === "Log in"
                                    ? "Don't have an account, sign up"
                                    : "Already have an account, log in"}
                            </Txt>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default AuthScreen;
