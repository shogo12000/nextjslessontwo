
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
 

    providers: [
        Credentials({
            async authorize(credentials) {
                console.log("CREDENTIALS..............")
                console.log(credentials)
                const email = credentials.email as string;
                const password = credentials.password as string;

                // Aqui você valida no banco
                if (email === "test@test.com" && password === "123") {
                    return { id: "1", name: "Test User", email: "test@test.comx", userType: "manager" };
                }

                return null;
            },
        }),
    ],

    session: {
        strategy: "jwt",      // JWT baseado em cookie
        maxAge: 1 * 60,       // 5 minutos em segundos
    },

    secret: process.env.AUTH_SECRET,

    callbacks: {
        // Passa campos extras para o JWT
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.userType = (user as any).userType;
            }
            return token;
        },

        // Passa campos extras para o frontend
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.userType = token.userType as string;
            }
            return session;
        },

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

            console.log("isLoggedIn =xxxxxxxxxxxxxxxxx==", isLoggedIn, isOnDashboard)

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // bloqueia e redireciona pro login
            }


            if (isLoggedIn && nextUrl.pathname === "/login") {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        },
    },
} satisfies NextAuthConfig;