import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";
import { Elsie_Swash_Caps } from "next/font/google";

const { auth } = NextAuth(authConfig);

const ROLE_ROUTES = {
    admin: ["/admin", "/admin/employee", "/admin/photos", "/admin/project", "/admin/project/create", "/admin/project/[id]/edit", "/admin/schedule", "/admin/schedule/create"],
    employee: ["/home", "/dashboard", "/home", "/myhours", "/sharephoto"],
};
export default auth(async (req: NextAuthRequest) => {
    const user = req.auth?.user;
    const pathname = req.nextUrl.pathname;

    type Role = "admin" | "employee";
    const role = user?.userType as Role;

    const allowed = ROLE_ROUTES[role]?.some((route) =>
        pathname.startsWith(route)
    );



    if (!allowed) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    // if (pathname.startsWith("/myhours") || pathname.startsWith("/workhistory")) {
    //     if (!user) {
    //         return NextResponse.redirect(new URL("/login", req.url));
    //     }

    //     if (user.userType !== "employee") {
    //         return NextResponse.redirect(
    //             new URL("/home", req.url)
    //         );
    //     }
    // }

    // if (pathname.startsWith("/admin")) {
    //     if (!user) {
    //         return NextResponse.redirect(new URL("/login", req.url));
    //     }

    //     if (user.userType !== "admin") {
    //         return NextResponse.redirect(
    //             new URL("/home", req.url)
    //         );
    //     }


    // }



    return NextResponse.next();
});

export const config = {
    matcher: ["/home", "/dashboard/:path*", "/workhistory", "/myhours", "/admin", "/admin/schedule", "/admin/schedule/create", "/admin/project", "/admin/project/:path*" ],
};

