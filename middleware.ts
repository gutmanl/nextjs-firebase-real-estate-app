import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {decodeJwt} from "jose";

export async function middleware(request: NextRequest) {
    if(request.method === "POST") {
        return NextResponse.next();
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value;

    if(request.nextUrl.pathname.startsWith("/login")) {
        if(token) {
            return NextResponse.redirect(new URL("/", request.url))

        }
    }

    if(request.nextUrl.pathname.startsWith("/admin-dashboard")) {
        if(!token) {
            return NextResponse.redirect(new URL("/", request.url))
        }

        const decodedToken = decodeJwt(token);
        if(!decodedToken.admin) {
            return NextResponse.redirect(new URL("/", request.url))
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin-dashboard", "/admin-dashboard/:path*", "/login"
    ]
}
