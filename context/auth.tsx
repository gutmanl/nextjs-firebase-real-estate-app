"use client"

import {createContext, useContext, useEffect, useState} from "react";
import {ParsedToken, signInWithEmailAndPassword, User} from "@firebase/auth";
import {auth} from "@/firebase/client";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {removeToken, setToken} from "@/context/actions";

type AuthContextType = {
    currentUser: User | null;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    customClaims: ParsedToken | null;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} :{
    children: React.ReactNode

}) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user ?? null);

            if(user) {
                const tokenResult = await user.getIdTokenResult();
                const token = tokenResult.token;
                const refreshToken = user.refreshToken;
                const claims = tokenResult.claims;
                setCustomClaims(claims ?? null);
                if(token && refreshToken) {
                    await setToken({
                        token,
                        refreshToken
                    })
                }
            } else {
                await removeToken();
            }
        })
        return () => unsubscribe()
    }, [])

    const logout = () => {
        return auth.signOut();
    }

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }

    const loginWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    return (
        <AuthContext.Provider value={{
            currentUser,
            logout,
            loginWithGoogle,
            loginWithEmailAndPassword: loginWithEmail,
            customClaims
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
