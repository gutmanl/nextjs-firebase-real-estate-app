"use client"

import {z} from "zod";
import PropertyForm from "@/components/property-form";
import {propertyDataSchema} from "@/validation/propertySchema";
import {PlusCircleIcon} from "lucide-react";
import {useAuth} from "@/context/auth";
import {saveNewProperty} from "@/app/admin-dashboard/new/actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";


export default function NewPropertyForm() {
    const auth = useAuth();
    const router = useRouter();
    const handleSubmit = async (data: z.infer<typeof propertyDataSchema>) => {
        const token = await auth?.currentUser?.getIdToken();

        if(!token) {
            return;
        }

        const response = await saveNewProperty({
            ...data, token})

        if(!!response.error) {
            toast.error("Error!", {
                description: response.error
            });
            return;
        }

        toast.success("Success!", {
            description: "Property created"
        });

        router.push("/admin-dashboard");
    }
    return (
        <div>
            <PropertyForm handleSubmit={handleSubmit} submitButtonLabel={<><PlusCircleIcon />Create Property</>} />
        </div>
    )
}
