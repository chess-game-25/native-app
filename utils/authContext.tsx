import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
    token: string | null;
    isReady: boolean;
    logIn: (phoneNumber : string, otp : string)=>void
    logOut: ()=>void
}

const AuthStorageKey = 'authState';

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



    const logIn = (phoneNumber: string, otp: string) => {
        // TODO: Perform Login and get token 
        setToken('some-auth-token');
        storeAuthState({ token: 'some-auth-token' });
        router.replace('/home');
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