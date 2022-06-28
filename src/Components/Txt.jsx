import { useContext } from "react";
import { Text } from "react-native";
import Context from "../Helper/context";

const Txt = (props) => {
    const { Colors } = useContext(Context);
    return (
        <Text {...props} style={{ color: Colors.colorFour, ...props?.style }} />
    );
};

export default Txt;
