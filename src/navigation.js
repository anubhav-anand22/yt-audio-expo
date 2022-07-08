import { NavigationContainer } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import Drawer from "./Components/Drawer";
import FullScreenLoader from "./Components/FullScreenLoader";
import PlayerComp from "./Components/PlayerComp";
import PopUpAlert from "./Components/popUpAlert";
import Context from "./Helper/context";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { baseURL } from "./CONST";

const Navigation = () => {
    const { setUserInfo } = useContext(Context);

    const loadUser = async () => {
        try {
            const oldUserDataJson = await SecureStore.getItemAsync("USER_INFO");
            const oldUserData = JSON.parse(oldUserDataJson);
            const currentTime = new Date().getTime();
            const oneDayInMs = 86400000;
            if (
                oldUserData?.updatedAt + oneDayInMs > currentTime &&
                oldUserData?.token
            ) {
                console.log("okkkk");
                const res = await axios({
                    url: `${baseURL}/api/user/get-user-by-token`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${oldUserData?.token}`,
                    },
                });
                setUserInfo(res.data);
                await SecureStore.setItemAsync(
                    "USER_INFO",
                    JSON.stringify(res.data)
                );
            }
        } catch (e) {}
    };

    useEffect(() => {
        loadUser();
    }, []);
    return (
        <NavigationContainer>
            <FullScreenLoader />
            <Drawer />
            <PopUpAlert />
            <PlayerComp />
        </NavigationContainer>
    );
};

export default Navigation;
