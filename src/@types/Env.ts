declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development'
            PORT: number
            JWT_SECRET: string
            MONGO_CONNECTION_STRING: string
        }
    }
}

export {};
