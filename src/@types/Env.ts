declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development'
            PORT: Number
            JWT_SECRET: string
            MONGO_CONNECTION_STRING: string
        }
    }
}

export {};
