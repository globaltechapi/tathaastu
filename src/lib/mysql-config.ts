// MySQL configuration
export const mysqlConfig = {
  host: import.meta.env.VITE_MYSQL_HOST || "localhost",
  user: import.meta.env.VITE_MYSQL_USER || "root",
  password: import.meta.env.VITE_MYSQL_PASSWORD || "",
  database: import.meta.env.VITE_MYSQL_DATABASE || "tathaastu",
};
