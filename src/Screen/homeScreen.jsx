import React, { useContext, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    useWindowDimensions,
    FlatList,
    Image,
} from "react-native";
import Context from "../Helper/context";
import { Ionicons } from "@expo/vector-icons";
import Txt from "../Components/Txt";
import Btn from "../Components/Btn";
import { useNavigation } from "@react-navigation/native";
import { baseURL } from "../CONST";
import Touchable from "../Components/Touchable";
import { resolveYtUrl } from "../Helper/resolveYtUrl";

const HomeScreen = () => {
    const { Colors, userInfo, setAlertInfo } = useContext(Context);
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const [searchInfo, setSearchInfo] = useState("");

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
        },
        likedItemContCont: {
            paddingTop: 10,
        },
    });

    const onSearchHandler = () => {
        try {
            if (searchInfo === "") return;
            const info = resolveYtUrl(searchInfo);
            console.log(info);
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
            console.log(e);
            setAlertInfo({
                type: "a",
                message: "Something went wrong while searching!",
                show: true,
            });
        }
    };

    return (
        <View>
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
    );
};

const Item = (props) => {
    console.log(props);
    return (
        <View
            style={{
                margin: 10,
            }}
        >
            <Image
                style={{ width: 200, height: 120 }}
                source={{ uri: props.url, method: "GET" }}
            />
        </View>
    );
};

export default HomeScreen;
