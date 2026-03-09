import { neon, neonConfig } from '@neondatabase/serverless';

// Suppress browser security warning
neonConfig.disableWarningInBrowsers = true;

const connectionString = import.meta.env.VITE_DATABASE_URL;

const isUrlValid = (url: string | undefined): url is string =>
  !!(url && url.startsWith('postgres'));

if (!isUrlValid(connectionString)) {
  console.warn('VITE_DATABASE_URL is not defined. Database features disabled.');
}

// neon() uses HTTP — works in browsers.
const sql = isUrlValid(connectionString) ? neon(connectionString) : null;

// Generic query helper — returns rows as array
export const dbRequest = async <T = any>(query: string, params: any[] = []): Promise<T[]> => {
  if (!sql) {
    console.warn('dbRequest: sql client is not initialized');
    return [] as T[];
  }

  try {
    // We try multiple ways to call it to be safe across different versions of the driver
    let result: any;

    if (typeof (sql as any).query === 'function') {
      result = await (sql as any).query(query, params);
    } else {
      // Fallback to calling it directly if .query is not available
      result = await (sql as any)(query, params);
    }

    if (!result) {
      console.warn('dbRequest: result is empty from query:', query);
      return [] as T[];
    }

    const rows = Array.isArray(result) ? result : (result.rows || []);
    return rows as T[];
  } catch (error: any) {
    console.error('Database query error:', error.message || error);
    throw error;
  }
};

// Create tables using HTTP
export const initSchema = async () => {
  if (!sql) return;
  try {
    console.log('Initializing schema...');
    // Use individual statements
    await dbRequest(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await dbRequest(`
      CREATE TABLE IF NOT EXISTS gratitude_entries (
        id SERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        feeling TEXT,
        gratitudes JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await dbRequest(`
      CREATE INDEX IF NOT EXISTS idx_entries_user_id ON gratitude_entries(user_id)
    `);
    console.log('Schema ready.');
  } catch (error: any) {
    console.error('Failed to initialize schema:', error.message || error);
  }
};
