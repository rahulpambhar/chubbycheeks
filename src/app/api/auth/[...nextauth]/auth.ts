import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { compareSync } from "bcrypt";
import prisma from "../../../../../prisma/prismaClient";

const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/',
    },
    session: {
        strategy: "jwt",
        maxAge: 86400, // 1 days
    },
  
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: { label: "mobile", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                const user: any = await prisma.user.findFirst({ where: { mobile: credentials?.mobile } });

                try {
                    if (!user) {
                        throw new Error("signin.user_not_found");
                    }

                    if (user.isBlocked) {
                        throw new Error("Denied.title");
                    }
                    const result = compareSync(credentials?.password, user?.password);

                    if (!result) {
                        throw new Error("Incorrect password!");
                    }

                    else {
                        return user
                    }
                } catch (error: any) {
                    throw new Error(error.message);
                }

            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async session({ session, token, }) {

            return { ...session, user: token };
        },
        async jwt({ token, user }: any): Promise<any> {
            const userInfo = await prisma?.user?.findFirst({
                where: {
                    email: token.email
                }
            })

            if (!userInfo) {
                token.id = user!.id
                return token
            }
            return {
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                isAdmin: userInfo.isAdmin,
                gender: userInfo.gender,
                address: userInfo.address,
                city: userInfo.city,
                country: userInfo.country,
                pincode: userInfo.pincode
            }
        },

    }
};

export default authOptions
