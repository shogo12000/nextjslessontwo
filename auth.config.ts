
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
 
import postgres from "postgres";
import bcrypt from "bcrypt";

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export const authConfig = {
    pages: {
        signIn: "/login",
    },


    providers: [
        Credentials({
            async authorize(credentials) {
                const email = credentials.email as string;
                const password = credentials.password as string;
 
                if (!email || !password) return null;

                // const result = loginUser(email);
                const result = await sql`
                    SELECT id, name, email, password, usertype
                    FROM users.usertb
                    WHERE email = ${email}
                    LIMIT 1
                `;

                if (result.count === 0) return null;

                const dbUser = result[0];

                const isValid = await bcrypt.compare(password, dbUser.password);
                if (!isValid) return null;

                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    userType: dbUser.usertype,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",      // JWT baseado em cookie
        maxAge: 60 * 60,       // 5 minutos em segundos
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
            const isOnHome = nextUrl.pathname.startsWith("/home");
            const isMyHours = nextUrl.pathname.startsWith("/myhours");

            if (isOnDashboard || isOnHome || isMyHours) {
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