import {createContext, useState} from 'react';
import { colors } from '../CONST';

const Context = createContext();

export const Provider = ({children}) => {
    const [userInfo, setUserInfo] = useState({token: ""});
    const [alertInfo, setAlert] = useState({});
    const [loaderInfo, setLoaderInfo] = useState({show: false, message: ''});
    const [Colors, setColors] = useState(colors)

    const setAlertInfo = (obj) => {
        setAlert({
            ...obj,
            id: Math.random().toString()
        })
    }

    const value = {
        userInfo,
        setUserInfo,
        alertInfo,
        setAlertInfo,
        loaderInfo,
        setLoaderInfo,
        Colors,
        setColors
    }

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default Context;