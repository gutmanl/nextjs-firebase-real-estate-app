"use client"

import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/auth";

export default function ContinueWithGoogleButton() {
    const auth = useAuth();
    return (
        <Button onClick={() => {
            auth?.loginWithGoogle();
        }}
        variant="default" className="w-full">
            Continue with Google
        </Button>
    );
}
