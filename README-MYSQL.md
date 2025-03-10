# Tathaastu Gift Registry - MySQL Setup Guide

## Overview

This document provides instructions for setting up and using MySQL with the Tathaastu Gift Registry application instead of Supabase.

## Prerequisites

- MySQL Server (5.7+ or 8.0+ recommended)
- Node.js (16+ recommended)
- npm or yarn

## Setup Instructions

### 1. Install MySQL

If you don't have MySQL installed, download and install it from the [official MySQL website](https://dev.mysql.com/downloads/).

### 2. Create a Database

You can create the database manually or use our setup script:

```bash
node database/setup.js
```

This script will:
- Create a database named 'tathaastu' (if it doesn't exist)
- Create all necessary tables
- Set up initial data including a default super admin user

### 3. Configure Environment Variables

Copy the example environment file and update it with your MySQL credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your MySQL connection details:

```
VITE_MYSQL_HOST=localhost
VITE_MYSQL_USER=your_mysql_username
VITE_MYSQL_PASSWORD=your_mysql_password
VITE_MYSQL_DATABASE=tathaastu
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Development Server

```bash
npm run dev
```

## Default Super Admin Account

The setup script creates a default super admin account:

- Email: superadmin@tathaastu.com
- Password: Tathaastu@2024

## Switching Between MySQL and Supabase

To switch between MySQL and Supabase implementations:

1. In your code, import from either the standard services or the MySQL versions:

```javascript
// For MySQL
import { useAuth } from "@/lib/auth-mysql";
import { query } from "@/lib/mysql";

// For Supabase
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
```

2. Update your imports in components that use database services.

## Database Schema

The MySQL schema includes the following tables:

- `users` - User accounts and authentication
- `registries` - Gift registries
- `registry_items` - Items within registries
- `invitations` - Registry invitations
- `brand_ambassadors` - Brand ambassador accounts

See `database/schema.sql` for the complete schema definition.

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify your MySQL server is running
2. Check your credentials in the .env file
3. Ensure your MySQL user has appropriate permissions

### Schema Updates

If you need to update the schema:

1. Modify the `database/schema.sql` file
2. Run the setup script again or manually apply your changes

## Security Considerations

- The MySQL password is stored in the .env file, which should never be committed to version control
- In production, use a strong password and consider using environment variables managed by your hosting provider
- Consider implementing connection pooling for better performance in production
