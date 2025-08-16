// Database Configuration for Red Dirt Roasters
// This file handles database connection settings

// Load environment variables
require('dotenv').config();

const dbConfig = {
    // Database connection settings
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'red_dirt_roasters',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    
    // Connection pool settings
    max: parseInt(process.env.DB_MAX_CONNECTIONS) || 20,
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000,
    
    // SSL settings
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Build connection string
const buildConnectionString = () => {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    
    if (process.env.POSTGRES_URL) {
        return process.env.POSTGRES_URL;
    }
    
    // Build from individual components
    const { user, password, host, port, database } = dbConfig;
    if (password) {
        return `postgresql://${user}:${password}@${host}:${port}/${database}`;
    } else {
        return `postgresql://${user}@${host}:${port}/${database}`;
    }
};

// Get connection string
const getConnectionString = () => {
    return buildConnectionString();
};

// Get pool configuration
const getPoolConfig = () => {
    return {
        connectionString: getConnectionString(),
        ...dbConfig
    };
};

// Validate configuration
const validateConfig = () => {
    const connectionString = getConnectionString();
    
    if (!connectionString) {
        throw new Error('No database connection string available');
    }
    
    console.log('✅ Database configuration validated');
    console.log(`📊 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`🗄️  Database: ${dbConfig.database}`);
    console.log(`👤 User: ${dbConfig.user}`);
    
    return true;
};

module.exports = {
    dbConfig,
    getConnectionString,
    getPoolConfig,
    validateConfig
};
