import "server-only";
import {PropertyStatus} from "@/types/propertyStatus";
import {firestore, getTotalPages} from "@/firebase/server";
import {Property} from "@/types/property";

type GetPropertiesOptions = {
    filters?: {
        minPrice?: number | null;
        maxPrice?: number | null;
        minBedrooms?: number | null;
        status?: PropertyStatus[] | null;
    },
    pagination?: {
        pageSize?: number;
        page?: number;
    }
}

export const getProperties = async (options?: GetPropertiesOptions) => {
    const page = options?.pagination?.page || 1;
    const pageSize = options?.pagination?.pageSize || 10;
    const { minPrice, maxPrice, minBedrooms, status } = options?.filters || {};

    let propertiesQuery = firestore.collection("properties")
        .orderBy("updated", "desc");
    if (minPrice !== null && minPrice !== undefined) {
        propertiesQuery = propertiesQuery.where("price", ">=", minPrice);
    }
    if (maxPrice !== null && maxPrice !== undefined) {
        propertiesQuery = propertiesQuery.where("price", "<=", maxPrice);
    }
    if (minBedrooms !== null && minBedrooms !== undefined) {
        propertiesQuery = propertiesQuery.where("bedrooms", ">=", minBedrooms);
    }
    if (status !== null && status !== undefined) {
        propertiesQuery = propertiesQuery.where("status", "in", status);
    }

    const totalPages = await getTotalPages(propertiesQuery, pageSize);

    const propertiesSnapshot = await propertiesQuery
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .get();

    const properties = propertiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Property));

    return { data: properties, totalPages }
}

export const getPropertyByID = async (id: string) => {
    const doc = await firestore.collection("properties").doc(id).get();
    const property = doc.data();
    return {
        id: doc.id,
        ...property
    } as Property;
}

export const getPropertiesByIDs = async (ids: string[]) => {
    if(!ids.length) return [];

    const propertiesSnapshot = await firestore.collection("properties")
        .where("__name__", "in", ids).get();
    return propertiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Property));
}
