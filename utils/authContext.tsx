import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import Toast from "react-native-toast-message";

type AuthState = {
    token: string | null;
    isReady: boolean;
    logIn: (phoneNumber : string, otp : string)=>void
    logOut: ()=>void
}

const AuthStorageKey = 'authState';

const BACKEND_URL = `http://${process.env.EXPO_PUBLIC_BACKEND_SERVER_IP}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`;

// Need to hide splash screen once the request from the server is complete
SplashScreen.preventAutoHideAsync();


export const AuthContext = createContext<AuthState>({
    token: null,
    isReady: false, // For the token 
    logIn: () => {},
    logOut: () => {}
});

export function AuthProvider({ children }: PropsWithChildren){
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    const storeAuthState = async (newState : { token: string | null }) => {
        try{
            const jsonValue = JSON.stringify(newState);
            await AsyncStorage.setItem(AuthStorageKey, jsonValue);
        }catch(err){
            console.log('Error storing auth state:', err);
        }
    };

    useEffect(()=>{
        const getAuthFromStorage = async ()=>{
            try{
                const authState = await AsyncStorage.getItem(AuthStorageKey);
                if(authState){
                    const auth = JSON.parse(authState);
                    setToken(auth.token);
                }
            }catch(err){
                console.log('Error getting auth state from storage:', err);
            }
            setIsReady(true);
        }
        getAuthFromStorage();
    }, []);

    const logIn = async (phoneNumber: string, otp: string) => {
        try{
            const response = await axios.post(`${BACKEND_URL}/api/auth/login`, { phoneNumber, otp });
            if(response.data.success){
                setToken(response.data.token);
                storeAuthState({ token: response.data.token });
                Toast.show({
                    type: "appSuccess",
                    text1: "Success",
                    text2: "Logged in successfully",
                    position: "top",
                    visibilityTime: 4000,
                })
                router.replace('/home');
            }
        }catch(err){
            Toast.show({
                type:"appError",
                text1: "Error",
                text2: "Failed to log in",
                position: "top",
                visibilityTime: 4000,
            })
        }
    };

    const logOut = () => {
        setToken(null);
        storeAuthState({ token: null });
        router.replace('/login');
    };

    return (<AuthContext.Provider value={{
        token,
        isReady,
        logIn,
        logOut
    }}>
        {children}
    </AuthContext.Provider>);
}