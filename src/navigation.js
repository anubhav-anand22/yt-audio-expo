import { NavigationContainer } from "@react-navigation/native";
import Drawer from "./Components/Drawer";
import FullScreenLoader from "./Components/FullScreenLoader";

const Navigation = () => {
    return (
        <NavigationContainer>
            <FullScreenLoader />
            <Drawer />
        </NavigationContainer>
    );
};

export default Navigation;
