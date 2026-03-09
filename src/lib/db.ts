import { Pool, neonConfig } from '@neondatabase/serverless';

// Use HTTP instead of WebSockets for better compatibility in environments with proxy/firewall issues
neonConfig.fetchConnection = true;

const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
    console.warn('VITE_DATABASE_URL is not defined in environment variables. Database connection will likely fail.');
}

export const pool = new Pool({
    connectionString: connectionString || '',
});

export const dbRequest = async <T = any>(query: string, params: any[] = []): Promise<T[]> => {
    try {
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

export const initSchema = async () => {
    if (!connectionString) return;

    try {
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
    } catch (error) {
        console.error('Failed to initialize schema:', error);
    }
};
