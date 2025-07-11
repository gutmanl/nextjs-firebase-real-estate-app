"use server"

import {Property} from "@/types/property";
import {auth, firestore} from "@/firebase/server";
import {propertyDataSchema} from "@/validation/propertySchema";

export const updateProperty = async (id: string, data: Property, authToken: string) => {
    const propertyData = data;
    const verifiedToken = await auth.verifyIdToken(authToken);

    if(!verifiedToken.admin) {
        return {
            error: true,
            message: "You are not authorized to perform this action"
        }
    }

    const validation = propertyDataSchema.safeParse(propertyData);
    if(!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occurred while saving the property"
        }
    }

   await firestore.collection("properties").doc(id).update(
        {
            ...propertyData,
            updated: new Date(),
        });

}