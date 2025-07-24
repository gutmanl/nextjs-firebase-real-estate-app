import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {decodeJwt} from "jose";

export async function middleware(request: NextRequest) {
    if(request.method === "POST") {
        return NextResponse.next();
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("firebaseAuthToken")?.value;

    if(["/login", "/register"].some(path => request.nextUrl.pathname.startsWith(path))) {
        if(token) {
            return NextResponse.redirect(new URL("/", request.url))

        }
    }

    if(request.nextUrl.pathname.startsWith("/admin-dashboard")) {
        if(!token) {
            return NextResponse.redirect(new URL("/", request.url))
        }

        const decodedToken = decodeJwt(token);

        if(decodedToken.exp && (decodedToken.exp - 300) * 1000 < Date.now()) {
            return NextResponse.redirect(new URL("/api/refresh-token?redirect=" +
                encodeURIComponent(request.nextUrl.pathname), request.url));
        }

        if(!decodedToken.admin) {
            return NextResponse.redirect(new URL("/", request.url))
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin-dashboard", "/admin-dashboard/:path*", "/login", "/register"
    ]
}
