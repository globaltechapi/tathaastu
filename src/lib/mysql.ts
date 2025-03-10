import mysql from "mysql2/promise";

// Create a connection pool
const pool = mysql.createPool({
  host: import.meta.env.VITE_MYSQL_HOST || "localhost",
  user: import.meta.env.VITE_MYSQL_USER || "root",
  password: import.meta.env.VITE_MYSQL_PASSWORD || "",
  database: import.meta.env.VITE_MYSQL_DATABASE || "tathaastu",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to execute queries
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return { data: results, error: null };
  } catch (error) {
    console.error("Database query error:", error);
    return { data: null, error };
  }
}

// Export the pool for direct access if needed
export { pool };
