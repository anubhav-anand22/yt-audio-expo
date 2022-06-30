import * as React from "react";
import { View, StyleSheet, useWindowDimensions, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
} from "@react-navigation/drawer";
import HomeScreen from "../Screen/homeScreen";
import Context from "../Helper/context";
import Btn from "./Btn";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
} from "react-native-reanimated";
import AuthScreen from "../Screen/authScreen";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const { width } = useWindowDimensions();
    const { Colors } = React.useContext(Context);

    const styles = StyleSheet.create({
        main: {
            padding: 10,
        },
        textInputCont: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 5,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: Colors.colorTwo,
        },
        textInput: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            width: width - width / 4 - 52,
        },
        searchIcon: {
            backgroundColor: Colors.colorTwo,
            height: 38,
            width: 42,
            alignItems: "center",
            justifyContent: "center",
        },
        authBtnCont: {
            marginVertical: 10,
        },
    });

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.main}>
                <View style={styles.textInputCont}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Search video or playlist"
                    />
                    <View style={styles.searchIcon}>
                        <Ionicons
                            name="search"
                            size={26}
                            color={Colors.colorThree}
                        />
                    </View>
                </View>
                <View style={styles.authBtnCont}>
                    <Btn
                        txt="Log in"
                        width={width - width / 4 - 10}
                        radius={19}
                        marginTop={10}
                        bg={Colors.colorTwo}
                        onPress={() => props.navigation.navigate("auth", {type: "Log in"})}
                    />
                    <Btn
                        txt="Sign up"
                        width={width - width / 4 - 10}
                        radius={19}
                        marginTop={10}
                        bg={Colors.colorTwo}
                        onPress={() => props.navigation.navigate("Home2", {type: "Sign up"})}
                    />
                </View>
                <Item
                    marginTop={20}
                    info={props}
                    to="Home1"
                    width={width - width / 4 - 10}
                    Colors={Colors}
                />
                <Item
                    marginTop={10}
                    info={props}
                    to="Home2"
                    width={width - width / 4 - 10}
                    Colors={Colors}
                />
                <Item
                marginTop={10}
                info={props}
                to="Home3"
                width={width - width / 4 - 10}
                Colors={Colors}
            />
            </View>
        </DrawerContentScrollView>
    );
}

const Item = ({ info, label = "", to, width, Colors, marginTop }) => {
    const cN = info?.state?.routeNames[info?.state?.index];
    const [currentName, setCurrentName] = React.useState('')
    const translateX = useSharedValue(22);
    const translateY = useSharedValue(-22);

    const config = {
        duration: 200,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
    };

    const style = useAnimatedStyle(() => {
        return {
            transform: [{rotate: '45deg'}, {translateX: withTiming(translateX.value, config)}, {translateY: withTiming(translateY.value, config)}]
        };
    });

    React.useEffect(() => {
        setCurrentName(cN)
    }, [cN])

    React.useEffect(() => {
        if(currentName === to) {
            translateX.value = 7;
            translateY.value = -7;
        } else {
            translateX.value = 22;
            translateY.value = -22;
        }
    }, [currentName])

    return (
        <View style={{ marginTop, position: "relative" }}>
            <Btn
                textAlign="auto"
                txt={label || to}
                width={width}
                bg={Colors.colorTwo}
                onPress={() => {
                    setCurrentName(to);
                    setTimeout(() => {
                        
                    info.navigation.navigate(to)
                    }, 100);
                }}
            />
            <View
                style={{
                    width: 22,
                    height: 39,
                    position: "absolute",
                    overflow: "hidden",
                    top: 0,
                    right: 0
                }}
            >
                <Animated.View style={[{
                    width: 38,
                    height: 38,
                    backgroundColor: Colors.colorOne,
                    transform: [{rotate: '45deg'}, {translateX: 22}, {translateY: -22}]
                }, style]}></Animated.View>
            </View>
        </View>
    );
};

function MyDrawer() {
    const { Colors } = React.useContext(Context);
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTintColor: Colors.colorThree,
                headerStyle: {
                    backgroundColor: Colors.colorOne,
                },
                drawerPosition: "right"
            }}
        >
            <Drawer.Screen name="Home1" component={HomeScreen} />
            <Drawer.Screen name="Home2" component={HomeScreen} />
            <Drawer.Screen name="Home3" component={HomeScreen} />
            <Drawer.Screen name="auth" component={AuthScreen} />
        </Drawer.Navigator>
    );
}

export default MyDrawer;
