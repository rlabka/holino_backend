-- Initialize Holino Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (already created by POSTGRES_DB)
-- CREATE DATABASE IF NOT EXISTS holino_db;

-- Create user if it doesn't exist (already created by POSTGRES_USER)
-- CREATE USER IF NOT EXISTS holino_user WITH PASSWORD 'holino_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE holino_db TO holino_user;

-- Connect to the database
\c holino_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO holino_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO holino_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO holino_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO holino_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO holino_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Holino database initialized successfully!';
END $$;
