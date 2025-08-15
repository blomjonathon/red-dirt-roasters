const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = process.env.DB_PATH || './database/red-dirt-roasters.db';

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
const fs = require('fs');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Initialize database tables
async function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table for admin authentication
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    role TEXT DEFAULT 'admin',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME,
                    is_active BOOLEAN DEFAULT 1
                )
            `);

            // Website content table
            db.run(`
                CREATE TABLE IF NOT EXISTS website_content (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    section TEXT NOT NULL,
                    field TEXT NOT NULL,
                    value TEXT,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(section, field)
                )
            `);

            // Sessions table for JWT blacklisting (optional)
            db.run(`
                CREATE TABLE IF NOT EXISTS sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    token_hash TEXT NOT NULL,
                    expires_at DATETIME NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `);

            // Login attempts table for security
            db.run(`
                CREATE TABLE IF NOT EXISTS login_attempts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    ip_address TEXT,
                    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    success BOOLEAN DEFAULT 0
                )
            `);

            // Create indexes for better performance
            db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_website_content_section ON website_content(section)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email)`);

            // Insert default admin user if none exists
            db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row.count === 0) {
                    createDefaultAdminUser()
                        .then(() => resolve())
                        .catch(reject);
                } else {
                    resolve();
                }
            });
        });
    });
}

// Create default admin user
async function createDefaultAdminUser() {
    const email = process.env.ADMIN_EMAIL || 'admin@reddirtroasters.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === 'admin123') {
        console.warn('⚠️  WARNING: Using default password. Please change it immediately!');
    }

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, passwordHash, 'admin'],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`✅ Default admin user created: ${email}`);
                    resolve();
                }
            }
        );
    });
}

// Insert default website content
async function insertDefaultContent() {
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

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const stmt = db.prepare('INSERT OR IGNORE INTO website_content (section, field, value) VALUES (?, ?, ?)');
            
            defaultContent.forEach(([section, field, value]) => {
                stmt.run(section, field, value);
            });
            
            stmt.finalize((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ Default website content inserted');
                    resolve();
                }
            });
        });
    });
}

// Database utility functions
function getDb() {
    return db;
}

function closeDb() {
    return new Promise((resolve) => {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            }
            resolve();
        });
    });
}

module.exports = {
    initDatabase,
    insertDefaultContent,
    getDb,
    closeDb
};
