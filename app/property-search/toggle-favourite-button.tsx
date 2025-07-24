"use client"

import { useAuth } from "@/context/auth";
import {HeartIcon} from "lucide-react";
import {addFavouriteProperty, removeFavouriteProperty} from "@/app/property-search/actions";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function ToggleFavouriteButton({propertyId, isFavourite}: {propertyId: string, isFavourite: boolean}) {
    const auth = useAuth();
    const router = useRouter();
    return <button className="z-10 absolute top-0 right-0 p-2 bg-white rounded-bl-lg" onClick={async () => {
        const tokenResult = await auth?.currentUser?.getIdTokenResult();
        if(!tokenResult) {
            router.push("/login");
            return;
        }

        if(isFavourite) {
            await removeFavouriteProperty(propertyId, tokenResult.token);
            toast.success("Removed from favourites");
        }
        else {
            await addFavouriteProperty(propertyId, tokenResult.token);
            toast.success("Added to favourites");
        }

        router.refresh();
    }}>
        <HeartIcon className="text-black" fill={isFavourite ? "#db2777" : "white"}/>
    </button>
}