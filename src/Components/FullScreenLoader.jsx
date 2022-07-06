import { useContext } from 'react';
import { ActivityIndicator, Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
import Context from '../Helper/context';
import Txt from './Txt';

const FullScreenLoader = () => {
    const {width, height} = useWindowDimensions();
    const {loaderInfo, Colors} = useContext(Context);

    const styles = StyleSheet.create({
        outer: {
            width,
            height: height,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: loaderInfo.bg || "rgba(0,0,0, 0.2)"
        },
        inner: {
            alignItems: "center",
        },
        txt: {
            marginTop: 10,
            fontSize: 16,
            backgroundColor: Colors.colorTwo,
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: 10,
            color: Colors.colorThree
        }
    })
    return (
        <Modal visible={loaderInfo?.show} transparent={true}>
            <View style={styles.outer}>
                <View style={styles.inner}>
                    <ActivityIndicator size={width / 6} color="red" />
                    {loaderInfo?.message !== '' && <Txt style={styles.txt}>{loaderInfo?.message}</Txt>}
                </View>
            </View>
        </Modal>
    )
};

export default FullScreenLoader