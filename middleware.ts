import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {decodeJwt} from "jose";

export async function middleware(request: NextRequest) {
    if(request.method === "POST") {
        return NextResponse.next();
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value;

    if(["/login", "/register", "/forgot-password"].some(path => request.nextUrl.pathname.startsWith(path))) {
        if(token) {
            return NextResponse.redirect(new URL("/", request.url))
        }
    }

    if(["/admin-dashboard", "/account"].some(path => request.nextUrl.pathname.startsWith(path))) {
        if(!token) {
            return NextResponse.redirect(new URL("/", request.url))
        }

    }
    if(["/property-search"].some(path => request.nextUrl.pathname.startsWith(path))) {
        if(!token) {
            return NextResponse.next()
        }
    }

    if(["/admin-dashboard", "/account", "/property-search"].some(path => request.nextUrl.pathname.startsWith(path))) {
        //We checked the token's existence in the blocks right above. The IDE just isn't smart enough
        //to recognize that
        const decodedToken = decodeJwt(token ?? "");

        if(decodedToken.exp && (decodedToken.exp - 300) * 1000 < Date.now()) {
            return NextResponse.redirect(new URL("/api/refresh-token?redirect=" +
                encodeURIComponent(request.nextUrl.pathname), request.url));
        }

        if(!decodedToken.admin && request.nextUrl.pathname.startsWith("/admin-dashboard")) {
            return NextResponse.redirect(new URL("/", request.url))
        }

        if(decodedToken.admin && request.nextUrl.pathname.startsWith("/account/my-favourites")) {
            return NextResponse.redirect(new URL("/", request.url))
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin-dashboard",
        "/admin-dashboard/:path*",
        "/login",
        "/register",
        "/account",
        "/account/:path*",
        "/property-search",
        "/forgot-password"
    ]
}
