import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from 'expo-permissions';

export const DownloadFile = ({ uri, name }) => {
    return new Promise(async (resolve, reject) => {
        await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        const { granted } = await MediaLibrary.getPermissionsAsync(true);
            if (!granted) {
                const { granted } =
                    await MediaLibrary.requestPermissionsAsync(true);
                if (!granted) throw new reject("Permission not granted");
            }

        let fileUri = FileSystem.documentDirectory + name + ".mp3";
        FileSystem.downloadAsync(uri, fileUri)
            .then(async ({ uri }) => {
                try {
                    saveFile(uri);
                    resolve(uri)
                } catch (e) {
                    reject(e);
                }
            })
            .catch((error) => {
                reject(error)
            });
    });
};

const saveFile = (fileUri) => {
    return new Promise(async (resolve, reject) => {
        try {
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync("YTA", asset, false).then(() =>
                resolve()
            );
        } catch (e) {
            reject(e);
        }
    });
};
