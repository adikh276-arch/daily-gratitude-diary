import { neon, neonConfig, Pool } from '@neondatabase/serverless';

// Essential for browser environments: uses HTTP/fetch instead of WebSockets.
neonConfig.fetchConnection = true;

const connectionString = import.meta.env.VITE_DATABASE_URL;

// Validation for Neon/Postgres connection string
const isUrlValid = (url: string | undefined): url is string => !!(url && url.startsWith('postgres'));

if (!isUrlValid(connectionString)) {
    console.warn('VITE_DATABASE_URL is not defined or invalid. Database features will be disabled.');
}

// HTTP query function
const sql = isUrlValid(connectionString) ? neon(connectionString) : null;

export const dbRequest = async <T = any>(query: string, params: any[] = []): Promise<T[]> => {
    if (!sql) {
        console.warn('dbRequest called but no database connection available.');
        return [];
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
        const pool = new Pool({ connectionString });
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
        await pool.end();
    } catch (error: any) {
        console.error('Failed to initialize schema:', error.message || error);
    }
};
