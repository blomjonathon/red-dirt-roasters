const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL connected successfully');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ PostgreSQL connection failed:', error);
        return false;
    }
}

// Initialize database tables
async function initDatabase() {
    try {
        const client = await pool.connect();
        
        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            )
        `);

        // Create website_content table
        await client.query(`
            CREATE TABLE IF NOT EXISTS website_content (
                id SERIAL PRIMARY KEY,
                section VARCHAR(100) NOT NULL,
                field VARCHAR(100) NOT NULL,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(section, field)
            )
        `);

        // Create sessions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                token_hash VARCHAR(255) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create login_attempts table
        await client.query(`
            CREATE TABLE IF NOT EXISTS login_attempts (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                ip_address INET,
                attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                success BOOLEAN DEFAULT FALSE
            )
        `);

        // Create indexes for better performance
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_website_content_section 
            ON website_content(section)
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_sessions_token 
            ON sessions(token_hash)
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_login_attempts_email_time 
            ON login_attempts(email, attempted_at)
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email 
            ON users(email)
        `);

        client.release();
        console.log('✅ PostgreSQL tables created successfully');
        
        // Create default admin user and content
        await createDefaultAdminUser();
        await insertDefaultContent();
        
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        throw error;
    }
}

// Create default admin user
async function createDefaultAdminUser() {
    try {
        const client = await pool.connect();
        
        // Check if admin user already exists
        const existingUser = await client.query(
            'SELECT id FROM users WHERE email = $1',
            [process.env.ADMIN_EMAIL || 'admin@reddirtroasters.com']
        );

        if (existingUser.rows.length === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(
                process.env.ADMIN_PASSWORD || 'admin123',
                parseInt(process.env.BCRYPT_ROUNDS) || 12
            );

            await client.query(
                'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
                [process.env.ADMIN_EMAIL || 'admin@reddirtroasters.com', hashedPassword, 'admin']
            );
            console.log('✅ Default admin user created');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        client.release();
    } catch (error) {
        console.error('❌ Failed to create admin user:', error);
        throw error;
    }
}

// Insert default website content
async function insertDefaultContent() {
    try {
        const client = await pool.connect();
        
        const defaultContent = [
            // Hero Section
            ['hero', 'heading', 'Artisan Coffee Roasting'],
            ['hero', 'subtitle', 'Small batch, handcrafted coffee roasted with passion in the heart of Oklahoma'],
            ['hero', 'button', 'Explore Our Coffee'],
            
            // About Section
            ['about', 'title', 'Our Story'],
            ['about', 'story1', 'Red Dirt Roasters began as a passion project in our garage, where we discovered the art of coffee roasting. What started with a small home roaster has grown into a beloved local business, serving the finest coffee to our community.'],
            ['about', 'story2', 'We source the highest quality green coffee beans from sustainable farms around the world and roast them in small batches to ensure perfect flavor development. Every batch is carefully monitored and tasted to meet our exacting standards.'],
            
            // Features
            ['features', 'feature1_title', 'Small Batch'],
            ['features', 'feature1_desc', 'We roast in small batches to ensure consistency and quality in every cup.'],
            ['features', 'feature2_title', 'Fresh Roasted'],
            ['features', 'feature2_desc', 'All our coffee is roasted fresh and shipped within 24 hours of roasting.'],
            ['features', 'feature3_title', 'Local Business'],
            ['features', 'feature3_desc', 'Proudly serving our community with personal attention and care.'],
            
            // Coffee Products
            ['coffee', 'light_roast_title', 'Light Roast'],
            ['coffee', 'light_roast_desc', 'Bright, crisp flavors with subtle acidity. Perfect for those who appreciate the natural character of the bean.'],
            ['coffee', 'light_roast_price', '$16.99'],
            ['coffee', 'medium_roast_title', 'Medium Roast'],
            ['coffee', 'medium_roast_desc', 'Balanced body with rich flavors. Our most popular roast, offering the perfect middle ground.'],
            ['coffee', 'medium_roast_price', '$17.99'],
            ['coffee', 'dark_roast_title', 'Dark Roast'],
            ['coffee', 'dark_roast_desc', 'Bold, full-bodied with deep chocolate notes. For those who love a strong, rich cup.'],
            ['coffee', 'dark_roast_price', '$18.99'],
            
            // Contact Information
            ['contact', 'address', '123 Coffee Street'],
            ['contact', 'city', 'Oklahoma City, OK 73102'],
            ['contact', 'phone', '(405) 555-0123'],
            ['contact', 'email', 'info@reddirtroasters.com'],
            ['contact', 'hours1', 'Monday - Friday: 7:00 AM - 6:00 PM'],
            ['contact', 'hours2', 'Saturday: 8:00 AM - 4:00 PM'],
            ['contact', 'hours3', 'Sunday: Closed'],
            
            // Settings
            ['settings', 'website_title', 'Red Dirt Roasters - Artisan Coffee Roasting'],
            ['settings', 'company_name', 'Red Dirt Roasters']
        ];

        for (const [section, field, value] of defaultContent) {
            await client.query(`
                INSERT INTO website_content (section, field, value) 
                VALUES ($1, $2, $3)
                ON CONFLICT (section, field) 
                DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
            `, [section, field, value]);
        }

        client.release();
        console.log('✅ Default content inserted successfully');
    } catch (error) {
        console.error('❌ Failed to insert default content:', error);
        throw error;
    }
}

// Helper function to get content by section
async function getContentBySection(section) {
    try {
        const client = await pool.connect();
        const result = await client.query(
            'SELECT field, value FROM website_content WHERE section = $1 ORDER BY field',
            [section]
        );
        client.release();
        
        const content = {};
        result.rows.forEach(row => {
            content[row.field] = row.value;
        });
        return content;
    } catch (error) {
        console.error(`❌ Failed to get ${section} content:`, error);
        throw error;
    }
}

// Helper function to update content
async function updateContent(section, updates) {
    try {
        const client = await pool.connect();
        let updatedCount = 0;
        
        for (const [field, value] of Object.entries(updates)) {
            const result = await client.query(`
                INSERT INTO website_content (section, field, value) 
                VALUES ($1, $2, $3)
                ON CONFLICT (section, field) 
                DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
                RETURNING id
            `, [section, field, value]);
            
            if (result.rows.length > 0) updatedCount++;
        }
        
        client.release();
        return updatedCount;
    } catch (error) {
        console.error(`❌ Failed to update ${section} content:`, error);
        throw error;
    }
}

// Close database connection pool
async function closePool() {
    await pool.end();
}

module.exports = {
    pool,
    initDatabase,
    createDefaultAdminUser,
    insertDefaultContent,
    getContentBySection,
    updateContent,
    testConnection,
    closePool
};