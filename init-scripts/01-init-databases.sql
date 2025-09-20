-- Initialize databases for Piggogest
CREATE DATABASE n8n;
CREATE DATABASE piggogest_core;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE n8n TO postgres;
GRANT ALL PRIVILEGES ON DATABASE piggogest_core TO postgres;