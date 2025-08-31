import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
    isLoggedIn: boolean;
    isReady: boolean;
    logIn: ()=>void
    logOut: ()=>void
}

const AuthStorageKey = 'authState';

SplashScreen.preventAutoHideAsync();

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    logIn: () => {},
    logOut: () => {}
});

export function AuthProvider({ children }: PropsWithChildren){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    const storeAuthState = async (newState : { isLoggedIn: boolean }) => {
        try{
            const jsonValue = JSON.stringify(newState);
            await AsyncStorage.setItem(AuthStorageKey, jsonValue);
        }catch(err){
            console.log('Error storing auth state:', err);
        }
    };

    useEffect(()=>{
        const getAuthFromStorage = async ()=>{
            // TODO: Get from the server
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try{
                const authState = await AsyncStorage.getItem(AuthStorageKey);
                if(authState){
                    const auth = JSON.parse(authState);
                    setIsLoggedIn(auth.isLoggedIn);
                }
            }catch(err){
                console.log('Error getting auth state from storage:', err);
            }
            setIsReady(true);
        }
        getAuthFromStorage();
    }, []);

    useEffect(()=>{
        if(isReady){
            SplashScreen.hideAsync();
        }
    },[isReady]);

    const logIn = () => {
        setIsLoggedIn(true);
        storeAuthState({ isLoggedIn: true });
        router.replace('/home');
    };

    const logOut = () => {
        setIsLoggedIn(false);
        storeAuthState({ isLoggedIn: false });
        router.replace('/login');
    };

    return (<AuthContext.Provider value={{
        isLoggedIn,
        isReady,
        logIn,
        logOut
    }}>
        {children}
    </AuthContext.Provider>);
}