import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      userType: string;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    id: string;
    userType: string;
  }

  interface JWT {
    id: string;
    userType: string;
  }
}
