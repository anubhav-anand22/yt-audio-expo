import React, { useContext, useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    useWindowDimensions,
    FlatList,
    Image,
    ScrollView,
    RefreshControl
} from "react-native";
import Context from "../Helper/context";
import { Ionicons } from "@expo/vector-icons";
import Txt from "../Components/Txt";
import Btn from "../Components/Btn";
import { useNavigation } from "@react-navigation/native";
import { baseURL } from "../CONST";
import Touchable from "../Components/Touchable";
import { resolveYtUrl } from "../Helper/resolveYtUrl";
import axios from "axios";
import * as SecureStore from 'expo-secure-store'

const HomeScreen = () => {
    const { Colors, userInfo, setAlertInfo, setUserInfo, setLoaderInfo } = useContext(Context);
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [searchInfo, setSearchInfo] = useState("");
    const [isReloading, setIsReloading] = useState(false);

    const loadUser = async() => {
        try {
            if(!userInfo?.token) return;
            setIsReloading(true);
            const res = await axios({url: `${baseURL}/api/user/get-user-by-token`, method: "GET", headers: {
                "Authorization": `Bearer ${userInfo?.token}`
            }});
            setUserInfo(res.data);
            await SecureStore.setItemAsync('USER_INFO', JSON.stringify(res.data))
            setIsReloading(false);
        } catch (e) {
            setIsReloading(false);
            setAlertInfo({show: true, message: "Something went wrong while reloading user!", type: 'a'});
        }
    }

    const styles = StyleSheet.create({
        textInputCont: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 5,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: Colors.colorTwo,
            width: width - 20,
            marginHorizontal: 10,
            marginTop: 10,
        },
        textInput: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            width: width - 72,
        },
        searchIcon: {
            backgroundColor: Colors.colorTwo,
            height: 38,
            width: 42,
            alignItems: "center",
            justifyContent: "center",
        },
        noUserCont: {
            width,
            height: height - 140,
            alignItems: "center",
            justifyContent: "center",
        },
        noUserContTxt: {
            fontSize: 20,
            fontWeight: "400",
        },
        likedItemCont: {
            marginTop: 20,
        },
        likedItemTxt: {
            fontSize: 16,
            fontWeight: "400",
            marginLeft: 10,
            backgroundColor: Colors.colorTwo,
            padding: 7,
            borderRadius: 10,
            width: 120,
            color: Colors.colorThree
        },
        likedItemContCont: {
            paddingTop: 10,
        },
    });

    const onSearchHandler = () => {
        try {
            if (searchInfo === "") return;
            const info = resolveYtUrl(searchInfo);
            if (info.list || info.v) {
                setSearchInfo("");
                navigation.navigate("player", { info });
            } else {
                setAlertInfo({
                    type: "n",
                    message: "Error: not a correct url!",
                    show: true,
                });
            }
        } catch (e) {
            setAlertInfo({
                type: "a",
                message: "Something went wrong while searching!",
                show: true,
            });
        }
    };

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isReloading} onRefresh={loadUser} />}>
            <View style={{paddingBottom: 120}}>
            <View style={styles.textInputCont}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Search video or playlist"
                    value={searchInfo}
                    onChangeText={setSearchInfo}
                />
                <Touchable onPress={onSearchHandler}>
                    <View style={styles.searchIcon}>
                        <Ionicons
                            name="search"
                            size={26}
                            color={Colors.colorThree}
                        />
                    </View>
                </Touchable>
            </View>
            {userInfo?.token ? (
                <View style={styles.likedItemContCont}>
                    <View style={styles.likedItemCont}>
                        <Txt style={styles.likedItemTxt}>Liked Videos</Txt>
                        <FlatList
                            horizontal
                            data={userInfo?.liked?.video}
                            keyExtractor={(e) => e}
                            renderItem={(e) => (
                                <Item
                                    url={`https://i.ytimg.com/vi/${e.item}/hqdefault.jpg`}
                                    onPress={() => navigation.navigate("player", { info: {v: e.item} })}
                                    
                                />
                            )}
                        />
                    </View>
                    <View style={styles.likedItemCont}>
                        <Txt style={styles.likedItemTxt}>Liked Playlist</Txt>
                        <FlatList
                            horizontal
                            data={userInfo?.liked?.playlist}
                            keyExtractor={(e) => e}
                            renderItem={(e) => (
                                <Item
                                    url={`${baseURL}/api/get-img-link-from-playlist-id/${e.item}`}
                                    onPress={() => navigation.navigate("player", { info: {list: e.item} })}
                                />
                            )}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.noUserCont}>
                    <Txt style={styles.noUserContTxt}>Not logged in</Txt>
                    <Btn
                        marginTop={7}
                        txt="Log in"
                        onPress={() =>
                            navigation.navigate("auth", { type: "Log in" })
                        }
                    />
                </View>
            )}
        </View>
        </ScrollView>
    );
};

const Item = ({url, onPress}) => {
    const {width} = useWindowDimensions();
    return (
        <Touchable onPress={onPress}>
            <View
            style={{
                margin: 10,
            }}
        >
            <Image
                style={{ width: width - 50, height: (width - 50) * 0.6 }}
                source={{ uri: url, method: "GET" }}
            />
        </View>
        </Touchable>
    );
};

export default HomeScreen;
