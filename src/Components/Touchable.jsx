import { TouchableOpacity, TouchableNativeFeedback, Platform } from "react-native";

const Touchable = (props) => {
    if(Platform.OS === 'android', Platform.Version >= 21) {
        return <TouchableNativeFeedback {...props} />
    } else {
        return <TouchableOpacity {...props} activeOpacity={0.5} />
    }
}

export default Touchable