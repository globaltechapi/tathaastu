-- MySQL Schema for Tathaastu Gift Registry Application

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS brand_ambassadors;
DROP TABLE IF EXISTS invitations;
DROP TABLE IF EXISTS registry_items;
DROP TABLE IF EXISTS registries;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  is_super_admin BOOLEAN DEFAULT FALSE,
  is_ambassador BOOLEAN DEFAULT FALSE,
  disabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Registries Table
CREATE TABLE registries (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  occasion VARCHAR(100),
  event_date DATE,
  is_public BOOLEAN DEFAULT TRUE,
  password VARCHAR(255),
  cover_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Registry Items Table
CREATE TABLE registry_items (
  id VARCHAR(36) PRIMARY KEY,
  registry_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  image_url TEXT,
  product_link TEXT,
  quantity INT DEFAULT 1,
  priority VARCHAR(50) DEFAULT 'Medium',
  note TEXT,
  platform VARCHAR(100),
  purchased BOOLEAN DEFAULT FALSE,
  purchased_by VARCHAR(36),
  purchased_at TIMESTAMP,
  purchaser_name VARCHAR(255),
  purchaser_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (registry_id) REFERENCES registries(id) ON DELETE CASCADE,
  FOREIGN KEY (purchased_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Invitations Table
CREATE TABLE invitations (
  id VARCHAR(36) PRIMARY KEY,
  registry_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  message TEXT,
  template_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (registry_id) REFERENCES registries(id) ON DELETE CASCADE
);

-- Brand Ambassadors Table
CREATE TABLE brand_ambassadors (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  tshirt_size VARCHAR(10),
  status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(255),
  kit_status VARCHAR(50) DEFAULT 'pending',
  joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Registry Activity View (for tracking activity)
CREATE VIEW registry_activity AS
SELECT
  ri.id AS item_id,
  r.id AS registry_id,
  r.user_id AS registry_owner_id,
  r.title AS registry_title,
  ri.name AS item_name,
  ri.price,
  ri.purchased,
  ri.purchased_by,
  ri.purchased_at,
  ri.purchaser_name,
  ri.purchaser_email,
  'purchase' AS activity_type,
  ri.created_at,
  ri.updated_at
FROM
  registry_items ri
JOIN
  registries r ON ri.registry_id = r.id
WHERE
  ri.purchased = TRUE;

-- Insert a default super admin user
INSERT INTO users (id, email, name, password_hash, is_super_admin, is_ambassador)
VALUES (
  UUID(),
  'superadmin@tathaastu.com',
  'Super Admin',
  '$2a$10$XHk/JBrQzFN2s9HvnWBEAO2XVQl.Ym3AQ.fPrZnGgbAkA7HsW2Dg2', -- Password: Tathaastu@2024
  TRUE,
  FALSE
)
ON DUPLICATE KEY UPDATE name = 'Super Admin';

-- Insert a demo user
INSERT INTO users (id, email, name, password_hash, is_super_admin, is_ambassador)
VALUES (
  UUID(),
  'demo@tathaastu.com',
  'Demo User',
  '$2a$10$XHk/JBrQzFN2s9HvnWBEAO2XVQl.Ym3AQ.fPrZnGgbAkA7HsW2Dg2', -- Password: Tathaastu@2024
  FALSE,
  FALSE
)
ON DUPLICATE KEY UPDATE name = 'Demo User';
