"use client"

import {Property} from "@/types/property";
import {propertySchema} from "@/validation/propertySchema";
import PropertyForm from "@/components/property-form";
import {SaveIcon} from "lucide-react";
import {auth, storage} from "@/firebase/client";
import {updateProperty} from "@/app/admin-dashboard/edit/[propertyId]/actions";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {deleteObject, ref, uploadBytesResumable, UploadTask} from "@firebase/storage";
import {savePropertyImages} from "@/app/admin-dashboard/actions";


export default function EditPropertyForm(property: Property) {
    const router = useRouter();
    const handleSubmit = async (data: z.infer<typeof propertySchema>) => {
        const token = await auth?.currentUser?.getIdToken();

        if(!token) {
            return;
        }

        console.log(data);

        const {images: newImages, ...rest} = data;

        const response = await updateProperty(property.id || "", rest, token);

        if(!!response?.error) {
            toast.error("Error!", {
                description: response.message
            });
            return;
        }

        const storageTasks: (UploadTask | Promise<void>)[] = [];
        const imagesToDelete = images?.filter(image => !newImages.find(newImage => image === newImage.url)) ?? [];

        imagesToDelete.forEach(image => {
            storageTasks.push(deleteObject(ref(storage, image)))
        })

        const paths: string[] = [];

        newImages.forEach((image, index) => {
            if(image.file) {
                const path = `properties/${property.id}/${Date.now()}-${index}-${image.file.name}`;
                paths.push(path);
                const storageRef = ref(storage, path);
                storageTasks.push(uploadBytesResumable(storageRef, image.file));
            } else {
                paths.push(image.url);
            }
        })

        await Promise.all(storageTasks);
        await savePropertyImages({propertyId: property.id ?? "", images: paths}, token)



        toast.success("Success!", {
            description: "Property updated"
        })
        router.push("/admin-dashboard");
    }

    const {images, ...rest} = property;

    const convertedImages = images?.map(image => ({
        id: image,
            url: image
    })) ?? [];

    const convertedProperty = {images: convertedImages, ...rest}

    return (
        <div>
            <PropertyForm handleSubmit={handleSubmit}
                          submitButtonLabel={
                <><SaveIcon />
                {"Save Property"}</>
                          } defaultValues={convertedProperty}/>
        </div>
    )
}