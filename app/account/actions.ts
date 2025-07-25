"use server"

import {cookies} from "next/headers";
import {auth, firestore} from "@/firebase/server";

export const deleteUserFavourites = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value;

    if(!token) {
        return;
    }
    try {
        const verifiedToken = await auth.verifyIdToken(token);
        if(!verifiedToken) {
            return;
        }

        await firestore.collection("favourites").doc(verifiedToken.uid).delete();
    }
    catch (e) {
        console.error(e);
    }
}