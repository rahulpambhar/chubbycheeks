import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { compareSync } from "bcrypt";
import prisma from "../../../../../prisma/prismaClient";
import { stat } from "fs";

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
                mobile: { label: "mobile", type: "text" },
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                const user: any = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { mobile: credentials?.mobile },
                            { email: credentials?.email }
                        ]
                    }
                });

                try {
                    if (!user) {
                        throw new Error("Wrong credentials!");
                    }

                    if (user.isBlocked) {
                        throw new Error("User is blocked contact support!");
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
                mobile: userInfo.mobile,
                country_code: userInfo.country_code,
                profile_pic: userInfo.profile_pic,
                email: userInfo.email,
                isAdmin: userInfo.isAdmin,
                gender: userInfo.gender,
                address: userInfo.address,
                city: userInfo.city,
                state: userInfo.state,
                country: userInfo.country,
                pincode: userInfo.pincode,

            }
        },

    }
};

export default authOptions
