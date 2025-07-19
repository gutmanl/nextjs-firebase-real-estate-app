import {PropertyStatus} from "@/types/propertyStatus";

export type Property  = {
    id?: string;
    address1: string;
    address2?: string;
    city: string;
    postcode: string;
    price: number;
    description: string;
    bedrooms: number;
    bathrooms: number;
    status: PropertyStatus;
    created?: Date;
    updated?: Date;
    images?: string[];
}