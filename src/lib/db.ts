import { neon, neonConfig, Pool } from '@neondatabase/serverless';

// Ensure we use HTTP in the browser to avoid WebSocket connection failures (wss://localhost/v2)
// The neon() function natively uses HTTP/fetch.
const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString || connectionString === 'undefined') {
    console.error(
        'CRITICAL: VITE_DATABASE_URL is missing. Please check your GitHub Secrets and workflow mapping.'
    );
}

// Internal function to check if URL is valid
const isUrlValid = (url: string | undefined): url is string => !!(url && url.startsWith('postgres'));

// For simple queries, use the 'neon' function (HTTP)
const sql = isUrlValid(connectionString) ? neon(connectionString) : null;

// For schema initialization (Dials with multiple queries), we can still use Pool
// but we'll try to use the 'neon' function for most things to be safe.
export const dbRequest = async <T = any>(query: string, params: any[] = []): Promise<T[]> => {
    if (!sql) {
        throw new Error('Database connection string is invalid or missing.');
    }

    try {
        const result = await sql(query, params);
        return result as T[];
    } catch (error: any) {
        console.error('Database query error:', error.message || error);
        throw error;
    }
};

export const initSchema = async () => {
    if (!isUrlValid(connectionString)) return;

    try {
        // For initialization, we'll use the standard pool as it handles multi-statement scripts better,
        // but we'll wrap it carefully.
        const pool = new Pool({ connectionString });
        const tables = await pool.query(`
      SELECT tablename FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `);

        if (tables.rows.length === 0) {
            console.log('Initializing schema...');
            await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS gratitude_entries (
            id SERIAL PRIMARY KEY,
            user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
            date TEXT NOT NULL,
            feeling TEXT,
            gratitudes JSONB NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_entries_user_id ON gratitude_entries(user_id);
      `);
            console.log('Schema initialized successfully.');
        }
        await pool.end();
    } catch (error: any) {
        console.error('Failed to initialize schema:', error.message || error);
    }
};
