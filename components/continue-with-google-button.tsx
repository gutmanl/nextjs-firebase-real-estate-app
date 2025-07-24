"use client"

import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/auth";
import {useRouter} from "next/navigation";

export default function ContinueWithGoogleButton() {
    const auth = useAuth();
    const router = useRouter();
    return (
        <Button onClick={async () => {
            try {
                await auth?.loginWithGoogle();
                router.refresh();
            }
            catch(_) {/* This is just to prevent a runtime error when the Google pop up is closed
             without a successful login*/}
        }}
        variant="outline" className="w-full">
            Continue with Google
        </Button>
    );
}
