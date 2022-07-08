import { useContext, useEffect, useState } from "react";
import {
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from "react-native";
import Context from "../Helper/context";
import { Ionicons } from "@expo/vector-icons";
import Txt from "./Txt";
import { formatTime } from "../Helper/formatTime";
import { Audio } from "expo-av";
import { baseURL } from "../CONST";
import { loadVideoData } from "../Helper/loadVideoData";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Slider from "@react-native-community/slider";

const PlayerComp = () => {
    const {
        currentPlayerInfo,
        userInfo,
        setUserInfo,
        Colors,
        que,
        setCurrentPlayerInfo,
        setAlertInfo,
        setLoaderInfo,
        setQue,
    } = useContext(Context);
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const [isPlaying, setPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [audio, setAudio] = useState();
    const [rate, setRate] = useState(10);

    useEffect(() => {
        if (!currentPlayerInfo.show) setPlaying(false);
    }, [currentPlayerInfo.show]);

    useEffect(() => {
        if (
            userInfo?.liked?.video?.includes(currentPlayerInfo?.info?.videoId)
        ) {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
    }, [userInfo]);

    const loadAudio = async (url = "") => {
        await Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });

        const sound = new Audio.Sound();

        await sound.loadAsync(
            { uri: url },
            {
                isLooping: false,
                rate: rate / 10,
                volume: 1,
                shouldPlay: true,
            },
            false
        );

        sound._onPlaybackStatusUpdate = (f) => {
            setDuration(f.durationMillis / 1000);
            setCurrentTime(f.positionMillis / 1000);
            if (f.isPlaying !== isPlaying) setPlaying(f.isPlaying);
            if (f.didJustFinish) {
                setPlaying(false);
                next();
            }
        };

        setAudio(sound);
    };

    useEffect(() => {
        if (!currentPlayerInfo?.info?.videoId) return;

        loadAudio(`${baseURL}/api/audio/${currentPlayerInfo.info.videoId}`);

        // Audio.setAudioModeAsync({
        //     staysActiveInBackground: true,
        //     shouldDuckAndroid: true,
        //     playThroughEarpieceAndroid: false
        // }).then(() => {
        //     Audio.Sound.createAsync({
        //         uri: `${baseURL}/api/audio/${currentPlayerInfo.info.videoId}`,
        //     }).then((e) => {
        //         setAudio(e.sound);
        //         e.sound.playAsync();
        //         e.sound._onPlaybackStatusUpdate = (f) => {
        //             setDuration(f.durationMillis / 1000);
        //             setCurrentTime(f.positionMillis / 1000);
        //             if (f.isPlaying !== isPlaying) setPlaying(f.isPlaying);
        //             if (f.didJustFinish) {
        //                 setPlaying(false);
        //                 next();
        //             };
        //         };
        //     });
        // });
    }, [currentPlayerInfo]);

    useEffect(() => {
        return () => {
            audio?.unloadAsync && audio?.unloadAsync();
        };
    }, [audio]);

    const Icon = ({
        name,
        size = width / 10,
        color = Colors.colorThree,
        onPress = () => {},
    }) => {
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View
                    style={{
                        width: size,
                        height: size,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons name={name} size={size} color={color} />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const IndexOf = (arr = [], cb) => {
        for (let i in arr) {
            if (cb(arr[i])) return parseInt(i);
        }
        return -1;
    };

    const next = async () => {
        const index = IndexOf(
            que,
            (e) => e.id === currentPlayerInfo.info.videoId
        );
        const data =
            index === -1 || index + 1 === que.length ? que[0] : que[index + 1];
        await audio?.unloadAsync();
        await loadVideoData({
            id: data.id,
            setAlertInfo,
            setCurrentPlayerInfo,
            setLoaderInfo,
            setQue,
        });
    };

    const previous = async () => {
        const index = IndexOf(
            que,
            (e) => e.id === currentPlayerInfo.info.videoId
        );
        const data =
            index === -1 || index === 0 ? que[que.length - 1] : que[index - 1];
        await audio?.unloadAsync();
        await loadVideoData({
            id: data.id,
            setAlertInfo,
            setCurrentPlayerInfo,
            setLoaderInfo,
            setQue,
        });
    };

    const changeRate = (type = "d") => {
        let r = rate;
        if (type === "i") {
            r = r + 2 >= 50 ? 50 : r + 2;
        } else {
            r = r - 2 <= 0 ? 0 : r - 2;
        }
        setRate(r);
        r = r / 10;
        audio?.setRateAsync(r, true, "Medium");
        setAlertInfo({ type: "n", message: `Playback rate: ${r}`, show: true });
    };

    const likeHandler = async (type) => {
        if (!userInfo?.token)
            return navigation.navigate("auth", { type: "Log in" });
        setLoaderInfo({ show: true });
        const data = {
            liked: {
                playlist: userInfo.liked.playlist,
                video:
                    type === "l"
                        ? [
                              ...userInfo.liked.video,
                              currentPlayerInfo?.info?.videoId,
                          ]
                        : userInfo.liked.video.filter(
                              (e) => e !== currentPlayerInfo?.info?.videoId
                          ),
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
        setLoaderInfo({ show: false });
    };

    return (
        <View style={{ position: "relative" }}>
            <View
                style={{
                    position: "absolute",
                    width: width,
                    height: 90,
                    backgroundColor: Colors.colorOne,
                    top: currentPlayerInfo?.info?.videoId ? -100 : 100,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                    }}
                >
                    <Icon name="cloud-download" />
                    <Icon name="play-back" onPress={changeRate} />
                    <Icon name="caret-back" onPress={previous} />
                    {isPlaying ? (
                        <Icon
                            name="ios-pause"
                            onPress={() => {
                                setPlaying(false);
                                audio?.pauseAsync();
                            }}
                        />
                    ) : (
                        <Icon
                            name="ios-play"
                            onPress={() => audio?.playAsync()}
                        />
                    )}
                    <Icon name="caret-forward" onPress={next} />
                    <Icon name="play-forward" onPress={() => changeRate("i")} />
                    {isLiked ? (
                        <Icon name="heart" onPress={() => likeHandler("u")} />
                    ) : (
                        <Icon
                            name="heart-outline"
                            onPress={() => likeHandler("l")}
                        />
                    )}
                </View>
                <Txt
                    style={{
                        width: width - 20,
                        overflow: "hidden",
                        marginHorizontal: 10,
                        marginTop: 7,
                        height: 16,
                        color: Colors.colorThree,
                    }}
                >
                    {currentPlayerInfo?.info?.title}
                </Txt>
                <View
                    style={{
                        flexDirection: "row",
                        padding: 7,
                        justifyContent: "space-between",
                    }}
                >
                    <Txt style={{ fontSize: 12, color: Colors.colorThree }}>
                        {formatTime(currentTime || 0)}
                    </Txt>
                    <Slider
                        minimumValue={0}
                        maximumValue={duration || 0}
                        value={currentTime || 0}
                        thumbTintColor={Colors.colorThree}
                        style={{ width: width - 85 }}
                        onSlidingComplete={(e) => {
                            audio?.setPositionAsync(e * 1000);
                        }}
                    />
                    <Txt style={{ fontSize: 12, color: Colors.colorThree }}>
                        {formatTime(duration || 0)}
                    </Txt>
                </View>
            </View>
        </View>
    );
};

export default PlayerComp;
