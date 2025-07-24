"use server"

import {auth, firestore} from "@/firebase/server";
import {FieldValue} from "firebase-admin/firestore";

export const addFavouriteProperty = async (propertyId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if(!verifiedToken) {
        return {
            error: true,
            message: "You are not authorized to perform this action"
        }
    }

    await firestore.collection("favourites").doc(verifiedToken.uid).set({
        [propertyId]: true
    }, {
        merge: true
    });
}

export const removeFavouriteProperty = async (propertyId: string, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if (!verifiedToken) {
        return {
            error: true,
            message: "You are not authorized to perform this action"
        }
    }

    await firestore.collection("favourites").doc(verifiedToken.uid).update({
        [propertyId]: FieldValue.delete()
    });
}