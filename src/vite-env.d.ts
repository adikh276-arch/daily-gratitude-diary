/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DATABASE_URL: string;
    readonly VITE_NEON_PROJECT_ID: string;
    readonly VITE_NEON_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
