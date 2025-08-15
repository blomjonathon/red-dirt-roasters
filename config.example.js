// Configuration Example File
// Copy this file to 'config.js' and update with your actual values
// Make sure to add 'config.js' to your .gitignore file

const config = {
    // Admin Panel Settings
    admin: {
        defaultPassword: 'CHANGE_THIS_PASSWORD', // Change this immediately!
        sessionTimeout: 3600000, // 1 hour in milliseconds
        maxLoginAttempts: 5,
        lockoutDuration: 900000 // 15 minutes in milliseconds
    },
    
    // Website Settings
    website: {
        title: 'Red Dirt Roasters - Artisan Coffee Roasting',
        companyName: 'Red Dirt Roasters',
        contactEmail: 'info@reddirtroasters.com',
        contactPhone: '(405) 555-0123'
    },
    
    // Security Settings
    security: {
        enableHTTPS: true,
        enableCSRF: true,
        enableRateLimiting: true
    },
    
    // Image Upload Settings
    uploads: {
        maxFileSize: 5242880, // 5MB in bytes
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxFiles: 10
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.config = config;
}
