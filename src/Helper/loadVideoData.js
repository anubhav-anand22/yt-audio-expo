import axios from "axios";
import { baseURL } from "../CONST";

export const loadVideoData = async ({ id, shouldSetQue = false, setLoaderInfo, setQue, setCurrentPlayerInfo, setAlertInfo }) => {
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