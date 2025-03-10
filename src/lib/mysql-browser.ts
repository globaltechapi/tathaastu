// Browser-compatible mock for MySQL
// This file provides a browser-compatible implementation of the MySQL client

// Mock query function that simulates database operations
export async function query(sql: string, params: any[] = []) {
  console.log("Browser MySQL mock - SQL:", sql);
  console.log("Browser MySQL mock - Params:", params);

  // Return mock data based on the query type
  if (sql.toLowerCase().includes("select")) {
    return mockSelect(sql, params);
  } else if (sql.toLowerCase().includes("insert")) {
    return mockInsert(sql, params);
  } else if (sql.toLowerCase().includes("update")) {
    return mockUpdate(sql, params);
  } else if (sql.toLowerCase().includes("delete")) {
    return mockDelete(sql, params);
  }

  // Default response
  return { data: [], error: null };
}

// Mock SELECT queries
function mockSelect(sql: string, params: any[]) {
  // User authentication query
  if (sql.includes("SELECT") && sql.includes("FROM users WHERE email")) {
    const email = params[0];
    // Demo user for testing
    if (email === "demo@example.com") {
      return {
        data: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            email: "demo@example.com",
            name: "Demo User",
            password_hash:
              "$2a$10$XQtK.N9CXQ3XZlvXvpxo5.gN17UIq.WNbYUK1zURJY/ue4.xGWkeO", // hash for 'password123'
            is_super_admin: false,
            is_ambassador: false,
            created_at: new Date().toISOString(),
          },
        ],
        error: null,
      };
    }
    // Admin user
    if (email === "admin@example.com") {
      return {
        data: [
          {
            id: "123e4567-e89b-12d3-a456-426614174001",
            email: "admin@example.com",
            name: "Admin User",
            password_hash:
              "$2a$10$XQtK.N9CXQ3XZlvXvpxo5.gN17UIq.WNbYUK1zURJY/ue4.xGWkeO", // hash for 'password123'
            is_super_admin: true,
            is_ambassador: false,
            created_at: new Date().toISOString(),
          },
        ],
        error: null,
      };
    }
    // No user found
    return { data: [], error: null };
  }

  // Registry queries
  if (sql.includes("FROM registries")) {
    return {
      data: [
        {
          id: "123e4567-e89b-12d3-a456-426614174002",
          title: "Wedding Registry",
          description: "Our wedding registry",
          occasion: "Wedding",
          event_date: "2024-12-31",
          is_public: true,
          user_id: "123e4567-e89b-12d3-a456-426614174000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          owner_name: "Demo User",
          owner_email: "demo@example.com",
          item_count: 5,
          purchased_count: 2,
        },
      ],
      error: null,
    };
  }

  // Default empty response
  return { data: [], error: null };
}

// Mock INSERT queries
function mockInsert(sql: string, params: any[]) {
  return { data: { id: crypto.randomUUID() }, error: null };
}

// Mock UPDATE queries
function mockUpdate(sql: string, params: any[]) {
  return { data: { id: params[params.length - 1] }, error: null };
}

// Mock DELETE queries
function mockDelete(sql: string, params: any[]) {
  return { data: null, error: null };
}
