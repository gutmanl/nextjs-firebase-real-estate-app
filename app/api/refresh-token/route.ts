import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {apiKey} from "@/firebase/client";

export const GET = async (req: NextRequest) => {
    const path = req.nextUrl.searchParams.get("redirect")

    if(!path) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("firebaseAuthRefreshToken")?.value;

    try {
        const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({grant_type: "refresh_token", refresh_token: refreshToken})
        });

        const json = await response.json();
        const newToken = json.id_token;

        cookieStore.set("firebaseAuthToken", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production"
        })

        return NextResponse.redirect(new URL(path, req.url));
    }
    catch(e) {
        console.log(e);
        return NextResponse.redirect(new URL("/", req.url));
    }
};