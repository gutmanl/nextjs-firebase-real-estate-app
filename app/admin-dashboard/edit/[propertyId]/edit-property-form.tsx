"use client"

import {Property} from "@/types/property";
import {propertyDataSchema} from "@/validation/propertySchema";
import PropertyForm from "@/components/property-form";
import {SaveIcon} from "lucide-react";
import {auth} from "@/firebase/client";
import {updateProperty} from "@/app/admin-dashboard/edit/[propertyId]/actions";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {toast} from "sonner";


export default function EditPropertyForm(property: Property) {
    const router = useRouter();
    const handleSubmit = async (data: z.infer<typeof propertyDataSchema>) => {
        const token = await auth?.currentUser?.getIdToken();

        if(!token) {
            return;
        }

        console.log(data);

        await updateProperty(property.id || "", data, token);
        toast.success("Success!", {
            description: "Property updated"
        })
        router.push("/admin-dashboard");
    }
    return (
        <div>
            <PropertyForm handleSubmit={handleSubmit}
                          submitButtonLabel={
                <><SaveIcon />
                {"Save Property"}</>
                          } defaultValues={property}/>
        </div>
    )
}