import { useContext, useEffect, useState } from "react";
import {
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
    Slider,
} from "react-native";
import Context from "../Helper/context";
import { Ionicons } from "@expo/vector-icons";
import Txt from "./Txt";
import { formatTime } from "../Helper/formatTime";
import { Audio } from "expo-av";
import { baseURL } from "../CONST";

const PlayerComp = () => {
    const { currentPlayerInfo, Colors, que } = useContext(Context);
    const { width } = useWindowDimensions();
    const [isPlaying, setPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [audio, setAudio] = useState();

    useEffect(() => {
        if (!currentPlayerInfo.show) setPlaying(false);
    }, [currentPlayerInfo.show]);

    useEffect(() => {
        if (!currentPlayerInfo?.info?.videoId) return;

        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false
        }).then(() => {
            Audio.Sound.createAsync({
                uri: `${baseURL}/api/audio/${currentPlayerInfo.info.videoId}`,
            }).then((e) => {
                setAudio(e.sound);
                e.sound.playAsync();
                e.sound._onPlaybackStatusUpdate = (f) => {
                    setDuration(f.durationMillis / 1000);
                    setCurrentTime(f.positionMillis / 1000);
                    if (f.isPlaying !== isPlaying) setPlaying(f.isPlaying);
                    if (f.didJustFinish) setPlaying(false);
                };
            });
        });
        return () => {
            audio?.unloadAsync();
        };
    }, [currentPlayerInfo?.info]);

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
        for(let i in arr){
            if(cb(arr[i])) return parseInt(i);
        }
        return -1
    }

    const next = () => {
        const index = IndexOf(que, (e => e.id === currentPlayerInfo.info.videoId));
        // if(index === -1){

        // }
    }

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
                    <Icon name="play-back" />
                    <Icon name="caret-back" />
                    {isPlaying ? (
                        <Icon
                            name="ios-pause"
                            onPress={() => {
                                setPlaying(false);
                                audio.pauseAsync();
                            }}
                        />
                    ) : (
                        <Icon
                            name="ios-play"
                            onPress={() => audio.playAsync()}
                        />
                    )}
                    <Icon name="caret-forward" onPress={next} />
                    <Icon name="play-forward" />
                    {isLiked ? (
                        <Icon name="heart" />
                    ) : (
                        <Icon name="heart-outline" />
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
                        {formatTime(currentTime)}
                    </Txt>
                    <Slider
                        minimumValue={0}
                        maximumValue={duration}
                        value={currentTime}
                        thumbTintColor={Colors.colorThree}
                        style={{ width: width - 85 }}
                        onSlidingComplete={(e) => {
                            audio?.setPositionAsync(e * 1000);
                        }}
                    />
                    <Txt style={{ fontSize: 12, color: Colors.colorThree }}>
                        {formatTime(duration)}
                    </Txt>
                </View>
            </View>
        </View>
    );
};

export default PlayerComp;
