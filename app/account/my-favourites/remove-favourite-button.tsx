"use client"

import {Button} from "@/components/ui/button";
import {Trash2Icon} from "lucide-react";
import {removeFavouriteProperty} from "@/app/property-search/actions";
import {useAuth} from "@/context/auth";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function RemoveFavouriteButton({ propertyId }: { propertyId: string }) {
    const auth = useAuth();
    const router = useRouter();
    return (
        <Button variant={"outline"} onClick={async () => {
            const tokenResult = await auth?.currentUser?.getIdTokenResult();
            if (!tokenResult) return;

            await removeFavouriteProperty(propertyId, tokenResult.token)
            toast.success("Property removed from favourites");
            router.refresh();
            }
        }>
               <Trash2Icon />
        </Button>
    )
}