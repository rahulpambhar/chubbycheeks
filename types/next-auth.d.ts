import NextAuth, { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            id?: string;
            name?: string | null | undefined;
            address?: string;
            email: string;
            is_admin?: boolean;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id?: string;
        address?: string;
        is_admin?: boolean;
    }
}