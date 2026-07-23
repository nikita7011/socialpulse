import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: connectionString && connectionString.includes("localhost") 
    ? false 
    : { rejectUnauthorized: false } // Required for cloud databases like Supabase Postgres
});

export const query = (text, params) => {
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is missing!");
  }
  return pool.query(text, params);
};

export default pool;
