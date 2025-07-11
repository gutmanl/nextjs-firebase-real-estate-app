"use client"

import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/auth";
import {useRouter} from "next/navigation";

export default function ContinueWithGoogleButton() {
    const auth = useAuth();
    const router = useRouter();
    return (
        <Button onClick={async () => {
            await auth?.loginWithGoogle();
            router.refresh();
        }}
        variant="default" className="w-full">
            Continue with Google
        </Button>
    );
}
