import {createContext, useState} from 'react';
import { colors } from '../CONST';

const Context = createContext();

export const Provider = ({children}) => {
    const [userInfo, setUserInfo] = useState({token: ""});
    const [alertInfo, setAlertInfo] = useState({type: "n", message: "", show: false});
    const [loaderInfo, setLoaderInfo] = useState({show: false, message: ''});
    const [Colors, setColors] = useState(colors);
    const [thumnailQuality, setThumnailQuality] = useState('high');
    const [currentPlayerInfo, setCurrentPlayerInfo] = useState({show: true, info: {}});
    const [que, setQue] = useState([])

    const value = {
        userInfo,
        setUserInfo,
        alertInfo,
        setAlertInfo,
        loaderInfo,
        setLoaderInfo,
        Colors,
        setColors,
        thumnailQuality,
        setThumnailQuality,
        currentPlayerInfo,
        setCurrentPlayerInfo,
        que,
        setQue
    }

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default Context;