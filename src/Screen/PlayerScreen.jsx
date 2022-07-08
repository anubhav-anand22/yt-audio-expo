import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import Txt from "../Components/Txt";
import { baseURL } from "../CONST";
import Context from "../Helper/context";
import { Ionicons } from "@expo/vector-icons";
import Touchable from "../Components/Touchable";
import Btn from "../Components/Btn";
import { loadVideoData } from "../Helper/loadVideoData";
import * as SecureStore from "expo-secure-store";
import { DownloadFile } from "../Helper/DownloadFile";
import { clearText } from "../Helper/ClearText";

const PlayerScreen = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const {
        setAlertInfo,
        setLoaderInfo,
        thumnailQuality,
        Colors,
        setCurrentPlayerInfo,
        que,
        setQue,
        userInfo,
        setUserInfo,
    } = useContext(Context);
    const [moreInfoBtnInfo, setMoreInfoBtnInfo] = useState({ show: false });
    const { width, height } = useWindowDimensions();

    const likeHandler = async (type) => {
        if (!userInfo?.token)
            return navigation.navigate("auth", { type: "Log in" });
        setLoaderInfo({ show: true });
        const data = {
            liked: {
                playlist:
                    type === "l"
                        ? [...userInfo.liked.playlist, params.info.list]
                        : userInfo.liked.playlist.filter(
                              (e) => e !== params.info.list
                          ),
                video: userInfo.liked.video,
            },
        };
        const res = await axios({
            url: `${baseURL}/api/user/update-user`,
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
            data,
        });
        setUserInfo(res.data);
        await SecureStore.setItemAsync("USER_INFO", JSON.stringify(res.data));
        setLoaderInfo({ Show: false });
    };

    const loadPlaylistInfoData = async ({ id }) => {
        try {
            setLoaderInfo({ message: "Loading list data...", show: true });
            const res = await axios(`${baseURL}/api/video-from-list/${id}`);
            setQue(res.data.items);
            loadVideoData({
                id: res?.data?.items[0]?.id,
                setAlertInfo,
                setCurrentPlayerInfo,
                setLoaderInfo,
                setQue,
            });
            setLoaderInfo({ show: false });
        } catch (e) {
            setAlertInfo({
                type: "a",
                message: "Something went wrong while loading data!",
                show: true,
            });
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: params?.info?.v ? "Yt video" : "Yt Playlist",
            headerRight: () => {
                if (params?.info?.list) {
                    return userInfo?.liked?.playlist?.includes(
                        params?.info?.list
                    ) ? (
                        <Ionicons
                            name="heart"
                            size={32}
                            color={Colors.colorThree}
                            style={{ marginRight: 10 }}
                            onPress={() => likeHandler("u")}
                        />
                    ) : (
                        <Ionicons
                            name="heart-outline"
                            size={32}
                            color={Colors.colorThree}
                            style={{ marginRight: 10 }}
                            onPress={() => likeHandler("l")}
                        />
                    );
                } else {
                    return [];
                }
            },
        });
    }, [params.info, userInfo]);

    useEffect(() => {
        if (params?.info?.v) {
            loadVideoData({
                id: params?.info?.v,
                shouldSetQue: true,
                setAlertInfo,
                setCurrentPlayerInfo,
                setLoaderInfo,
                setQue,
            });
        } else if (params?.info?.list) {
            loadPlaylistInfoData({ id: params.info.list });
        }
    }, [params.info]);

    const styles = StyleSheet.create({
        moreModalOuterView: {
            width,
            height,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
        },
    });

    const loadItem = async (id) => {
        await loadVideoData({
            id,
            setAlertInfo,
            setCurrentPlayerInfo,
            setLoaderInfo,
            setQue,
        });
    };

    return (
        <View>
            <FlatList
                keyExtractor={(e) => e.id}
                data={que}
                renderItem={(e) => (
                    <Item
                        thumnailQuality={thumnailQuality}
                        info={e.item}
                        last={e.index === que.length - 1}
                        Colors={Colors}
                        setMoreInfoBtnInfo={setMoreInfoBtnInfo}
                        index={e.index}
                        loadItem={loadItem}
                    />
                )}
            />
            <Modal visible={moreInfoBtnInfo?.show} transparent={true}>
                <Touchable onPress={() => setMoreInfoBtnInfo({ show: false })}>
                    <View style={styles.moreModalOuterView}>
                        <View>
                            <Btn
                                txt="Play"
                                marginTop={10}
                                width={width - 20}
                                onPress={() =>
                                    loadItem(moreInfoBtnInfo.info.id)
                                }
                            />
                            <Btn
                                txt="Remove from que"
                                marginTop={10}
                                width={width - 20}
                                onPress={() => {
                                    que.splice(moreInfoBtnInfo.index, 1);
                                    setQue(que);
                                    setMoreInfoBtnInfo({ show: false });
                                }}
                            />
                            {params?.info?.list && (
                                <Btn
                                    txt="Open related"
                                    marginTop={10}
                                    width={width - 20}
                                    onPress={() => {
                                        navigation.navigate("player", {
                                            info: {
                                                v: moreInfoBtnInfo.info.id,
                                            },
                                        });
                                        setMoreInfoBtnInfo({ show: false });
                                    }}
                                />
                            )}
                            <Btn
                                txt="Download"
                                marginTop={10}
                                width={width - 20}
                                onPress={() => {
                                    setMoreInfoBtnInfo({show: false})
                                    const name = clearText(
                                        moreInfoBtnInfo.info.title + Math.random() + new Date().getTime()
                                    )
                                    setAlertInfo({show: true, message: `Started downloading ${name}...`, type: "n"})
                                    DownloadFile({
                                        uri: `${baseURL}/api/audio/${moreInfoBtnInfo.info.id}`,
                                        name,
                                    })
                                    .then(() => {
                                        setAlertInfo({show: true, message: `Finished downloading ${name}`, type: "n"})
                                    }).catch((e) => {
                                        setAlertInfo({show: true, message: `Something went wrong while downloading ${name}!`, type: "n"})
                                    });
                                }}
                            />
                        </View>
                    </View>
                </Touchable>
            </Modal>
        </View>
    );
};

const Item = ({
    info,
    last,
    thumnailQuality,
    Colors,
    setMoreInfoBtnInfo,
    index,
    loadItem,
}) => {
    const { width } = useWindowDimensions();

    const thumbnail =
        info.thumbnails[
            thumnailQuality === "high" ? info.thumbnails.length - 1 : 0
        ];

    const styles = StyleSheet.create({
        main: {
            width: width - 20,
            minHeight: 100,
            backgroundColor: Colors.colorTwo,
            marginTop: 10,
            marginHorizontal: 10,
            marginBottom: last ? 10 : 0,
            borderRadius: 10,
            overflow: "hidden",
        },
        infoCont: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        textCont: {
            width: width - 100,
            padding: 7,
        },
        moreIconCont: {
            width: 32,
            height: 32,
            justifyContent: "center",
            alignItems: "center",
        },
        moreIconContCont: {
            borderRadius: 16,
            overflow: "hidden",
            width: 32,
            height: 32,
            marginTop: 7,
        },
        txt: {
            color: Colors.colorThree,
        },
    });

    return (
        <View style={{ borderRadius: 10, overflow: "hidden" }}>
            <Touchable onPress={() => loadItem(info.id)}>
                <View style={styles.main}>
                    <View>
                        <Image
                            style={{
                                width: width - 20,
                                height: (width - 20) * 0.6,
                            }}
                            source={{ uri: thumbnail.url }}
                        />
                    </View>
                    <View style={styles.infoCont}>
                        <View style={styles.textCont}>
                            <Txt style={styles.txt}>{info?.title}</Txt>
                            <Txt style={styles.txt}>{info?.authorName}</Txt>
                        </View>
                        <View style={styles.moreIconContCont}>
                            <Touchable
                                onPress={() =>
                                    setMoreInfoBtnInfo({
                                        show: true,
                                        info,
                                        index,
                                    })
                                }
                            >
                                <View style={styles.moreIconCont}>
                                    <Ionicons
                                        name="ellipsis-vertical"
                                        size={24}
                                        color={Colors.colorThree}
                                    />
                                </View>
                            </Touchable>
                        </View>
                    </View>
                </View>
            </Touchable>
        </View>
    );
};

export default PlayerScreen;
