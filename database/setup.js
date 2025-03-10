const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function setupDatabase() {
  // Read environment variables or use defaults
  const host = process.env.MYSQL_HOST || "localhost";
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "tathaastu";

  try {
    // First connect without specifying a database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host,
      user,
      password,
    });

    console.log("Connected to MySQL server");

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
    console.log(`Database '${database}' created or already exists`);

    // Close the initial connection
    await connection.end();

    // Connect to the specific database
    const dbConnection = await mysql.createConnection({
      host,
      user,
      password,
      database,
    });

    console.log(`Connected to database '${database}'`);

    // Read the schema file
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split the schema into individual statements
    const statements = schema
      .split(";")
      .filter((statement) => statement.trim() !== "");

    // Execute each statement
    for (const statement of statements) {
      await dbConnection.query(statement + ";");
    }

    console.log("Database schema created successfully");

    // Close the connection
    await dbConnection.end();
    console.log("Database setup completed");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
