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
    } = useContext(Context);
    const [moreInfoBtnInfo, setMoreInfoBtnInfo] = useState({ show: false });
    const { width, height } = useWindowDimensions();

    const loadVideoData = async ({ id, shouldSetQue = false }) => {
        try {
            setLoaderInfo({ message: "Loading video data...", show: true });
            const res = await axios(`${baseURL}/api/video-info/${id}`);
            if (shouldSetQue) {
                setQue(res.data.related_videos);
            }
            setCurrentPlayerInfo({ show: true, info: res.data.videoDetails });
            setLoaderInfo({ show: false });
        } catch (e) {
            console.log(e);
            setAlertInfo({
                type: "a",
                message: "Something went wrong while loading data!",
                show: true,
            });
        }
    };

    const loadPlaylistInfoData = async ({ id }) => {
        try {
            console.log(id);
            setLoaderInfo({ message: "Loading list data...", show: true });
            const res = await axios(`${baseURL}/api/video-from-list/${id}`);
            setQue(res.data.items);
            loadVideoData({ id: res?.data?.items[0]?.id });
            setLoaderInfo({ show: false });
        } catch (e) {
            console.log(e);
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
        });

        if (params?.info?.v) {
            loadVideoData({ id: params?.info?.v, shouldSetQue: true });
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
                    />
                )}
            />
            <Modal visible={moreInfoBtnInfo?.show} transparent={true}>
                <Touchable onPress={() => setMoreInfoBtnInfo({ show: false })}>
                    <View style={styles.moreModalOuterView}>
                        <View>
                            <Btn txt="Play" marginTop={10} width={width - 20} />
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
                            <Btn
                                txt="Download"
                                marginTop={10}
                                width={width - 20}
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
            <Touchable>
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
