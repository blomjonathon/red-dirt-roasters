#!/usr/bin/env node

/**
 * Database Initialization Script
 * Run this script to set up the database for the first time
 * Usage: node init-database.js
 */

require('dotenv').config();
const { initDatabase, insertDefaultContent } = require('./database/database');

async function main() {
    console.log('🚀 Initializing Red Dirt Roasters Database...\n');
    
    try {
        // Initialize database tables
        console.log('📊 Creating database tables...');
        await initDatabase();
        console.log('✅ Database tables created successfully\n');
        
        // Insert default content
        console.log('📝 Inserting default website content...');
        await insertDefaultContent();
        console.log('✅ Default content inserted successfully\n');
        
        console.log('🎉 Database initialization completed!');
        console.log('\n📋 Next steps:');
        console.log('1. Copy env.example to .env and update with your values');
        console.log('2. Run: npm install');
        console.log('3. Run: npm start');
        console.log('4. Access admin panel at: http://localhost:3000/admin.html');
        console.log('5. Default login: admin@reddirtroasters.com / admin123');
        console.log('\n⚠️  IMPORTANT: Change the default password immediately!');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

// Run the initialization
if (require.main === module) {
    main();
}
