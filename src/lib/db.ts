import { neon, neonConfig } from '@neondatabase/serverless';

// Suppress browser security warning
neonConfig.disableWarningInBrowsers = true;

const connectionString = import.meta.env.VITE_DATABASE_URL;

const isUrlValid = (url: string | undefined): url is string =>
    !!(url && url.startsWith('postgres'));

if (!isUrlValid(connectionString)) {
    console.warn('VITE_DATABASE_URL is not defined. Database features disabled.');
}

// neon() uses HTTP — works in browsers. This is the ONLY driver we use.
const sql = isUrlValid(connectionString) ? neon(connectionString) : null;

// Generic query helper — returns rows as array
export const dbRequest = async <T = any>(query: string, params: any[] = []): Promise<T[]> => {
    if (!sql) return [];
    try {
        // sql.query() is the correct API for parameterized queries
        const result = await (sql as any).query(query, params);
        // neon returns rows as a plain array
        return (Array.isArray(result) ? result : result.rows ?? []) as T[];
    } catch (error: any) {
        console.error('Database query error:', error.message || error);
        throw error;
    }
};

// Create tables using HTTP (neon tagged templates for multi-statement DDL)
export const initSchema = async () => {
    if (!sql) return;
    try {
        // Use individual statements — neon HTTP supports single statements per call
        await (sql as any).query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        await (sql as any).query(`
      CREATE TABLE IF NOT EXISTS gratitude_entries (
        id SERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        feeling TEXT,
        gratitudes JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
        await (sql as any).query(`
      CREATE INDEX IF NOT EXISTS idx_entries_user_id ON gratitude_entries(user_id)
    `);
        console.log('Schema ready.');
    } catch (error: any) {
        console.error('Failed to initialize schema:', error.message || error);
    }
};
