import { NavigationContainer } from "@react-navigation/native";
import Drawer from "./Components/Drawer";
import FullScreenLoader from "./Components/FullScreenLoader";
import PopUpAlert from "./Components/popUpAlert";

const Navigation = () => {
    return (
        <NavigationContainer>
            <FullScreenLoader />
            <Drawer />
            <PopUpAlert />
        </NavigationContainer>
    );
};

export default Navigation;
