import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import Context from "../Helper/context";
import Touchable from "./Touchable";
import Txt from "./Txt";

const Btn = ({
    onPress = () => {},
    upCap = true,
    txt = "",
    width = 100,
    radius = 3,
    txtStyle = {},
    elevation=10,
    btnOuterOuterStyle={}
}) => {
    const { Colors } = useContext(Context);

    const styles = StyleSheet.create({
        btn: {
            width,
            borderRadius: radius,
            backgroundColor: Colors.colorOne,
            padding: 10,
        },
        btnOuter: {
            width,
            borderRadius: radius,
            overflow: "hidden",
        },
        txt: {
            width: "100%",
            textAlign: "center",
            color: Colors.colorThree,
            fontWeight: "500",
            ...txtStyle,
        },
        btnOuterOuter: {
            elevation,
            shadowColor: "#000000",
            backgroundColor: "#00000000",
            width,
            borderRadius: radius,
            ...btnOuterOuterStyle,
        },
    });

    return (
        <View style={styles.btnOuterOuter}>
            <View style={styles.btnOuter}>
                <Touchable onPress={onPress}>
                    <View style={styles.btn}>
                        <Txt style={styles.txt}>
                            {upCap ? txt.toUpperCase() : txt}
                        </Txt>
                    </View>
                </Touchable>
            </View>
        </View>
    );
};

export default Btn;
