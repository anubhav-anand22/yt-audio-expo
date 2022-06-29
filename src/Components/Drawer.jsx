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

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const { width } = useWindowDimensions();
    const { Colors } = React.useContext(Context);

    const styles = StyleSheet.create({
        main: {
            padding: 10
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
            width: (width - width / 4) - 52
        },
        searchIcon: {
            backgroundColor: Colors.colorTwo,
            height: 38,
            width: 42,
            alignItems: "center",
            justifyContent: "center"
        },
    });

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.main}>
                <View style={styles.textInputCont}>
                    <TextInput style={styles.textInput} placeholder="Search video or playlist" />
                    <View style={styles.searchIcon}>
                        <Ionicons name="search" size={26} color={Colors.colorThree} />
                    </View>
                </View>
            </View>
        </DrawerContentScrollView>
    );
}

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
            }}
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
        </Drawer.Navigator>
    );
}

export default MyDrawer;
