import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userType: "admin"|"employee";
      name?: string | null;
      email?: string | null;
    }& DefaultSession["user"];
  }

  interface User {
    id: string;
    userType: "admin"|"employee";
  }

  interface JWT {
    id: string;
    userType: string;
  }
}
