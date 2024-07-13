namespace NodeJS {
    interface ProcessEnv {
        MONGODB_URI: string;
        ADMIN_PRIVATE_KEY: string;
        ADMIN_ADDRESS: string;
        ADMIN_FEE: number;
        NEXTAUTH_URL: string;
        NEXTAUTH_SECRET: string;
    }
}