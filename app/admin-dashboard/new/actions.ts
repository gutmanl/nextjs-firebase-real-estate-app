"use server"


import {auth, firestore} from "@/firebase/server";
import {propertyDataSchema} from "@/validation/propertySchema";
import {z} from "zod";

export const createProperty = async (data: {
    address1: string,
    address2?: string
    city: string,
    postcode: string,
    price: number,
    description: string,
    bedrooms: number,
    bathrooms: number,
    status: "draft" | "for-sale" | "withdrawn" | "sold",
}, authToken: string) => {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if(!verifiedToken.admin) {
        return {
            error: true,
            message: "You are not authorized to perform this action"
        }
    }

    const validation = propertyDataSchema.safeParse(data);
    if(!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0]?.message ?? "An error occurred while saving the property"
        }
    }

    const property = await firestore.collection("properties").add(
        {
            ...data,
            created: new Date(),
            updated: new Date(),
        });

    return {
        propertyId: property.id
    }
}
