# Red Dirt Roasters - Secure Admin Panel

A secure, database-driven admin panel for managing website content with SQL backend, JWT authentication, and comprehensive security features.

## 🚀 Features

- **Secure Authentication**: JWT-based login with bcrypt password hashing
- **SQL Database**: SQLite backend with organized content management
- **Security Features**: Rate limiting, brute force protection, CSRF protection
- **Content Management**: Easy editing of all website sections
- **Data Export/Import**: Backup and restore functionality
- **Responsive Design**: Modern admin interface

## 🛡️ Security Features

- **Password Security**: Bcrypt hashing with configurable salt rounds
- **JWT Authentication**: Secure token-based sessions
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Secure cross-origin requests
- **Helmet Security**: HTTP security headers

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment example file and update it with your values:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_PATH=./database/red-dirt-roasters.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-immediately
JWT_EXPIRES_IN=24h

# Admin User Configuration
ADMIN_EMAIL=admin@reddirtroasters.com
ADMIN_PASSWORD=your-secure-admin-password-change-this

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANT**: Change the `JWT_SECRET` and `ADMIN_PASSWORD` immediately!

### 3. Initialize Database

```bash
npm run init-db
```

This will:
- Create the SQLite database
- Set up all necessary tables
- Create the default admin user
- Insert default website content

### 4. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### 5. Access the Admin Panel

- **Admin Panel**: http://localhost:3000/admin.html
- **Main Website**: http://localhost:3000/index.html
- **API Health Check**: http://localhost:3000/api/health

## 🔐 Default Login

- **Email**: admin@reddirtroasters.com
- **Password**: admin123 (or what you set in .env)

**⚠️ CRITICAL**: Change this password immediately after first login!

## 📁 Project Structure

```
red-dirt-roasters/
├── database/
│   └── database.js          # Database initialization and utilities
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── admin.js            # Admin panel routes
│   └── website.js          # Public website routes
├── server.js               # Main Express server
├── init-database.js        # Database setup script
├── admin.html              # Admin panel interface
├── admin.js                # Admin panel JavaScript
├── admin.css               # Admin panel styles
├── index.html              # Main website
├── styles.css              # Main website styles
├── script.js               # Main website JavaScript
├── package.json            # Dependencies and scripts
├── env.example             # Environment configuration template
└── README.md               # This file
```

## 🗄️ Database Schema

### Users Table
- `id`: Primary key
- `email`: Admin email (unique)
- `password_hash`: Bcrypt hashed password
- `role`: User role (admin)
- `created_at`: Account creation timestamp
- `last_login`: Last login timestamp
- `is_active`: Account status

### Website Content Table
- `id`: Primary key
- `section`: Content section (hero, about, features, etc.)
- `field`: Field name within section
- `value`: Field value
- `updated_at`: Last update timestamp

### Sessions Table
- `id`: Primary key
- `user_id`: User reference
- `token_hash`: JWT token hash
- `expires_at`: Token expiration
- `created_at`: Session creation timestamp

### Login Attempts Table
- `id`: Primary key
- `email`: Attempted email
- `ip_address`: IP address
- `attempted_at`: Attempt timestamp
- `success`: Success status

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user info

### Admin Panel
- `GET /api/admin/content` - Get all website content
- `PUT /api/admin/content` - Update website content
- `GET /api/admin/content/:section` - Get specific section
- `PUT /api/admin/content/:section` - Update specific section
- `GET /api/admin/export` - Export website data
- `POST /api/admin/import` - Import website data
- `GET /api/admin/dashboard` - Get admin dashboard stats

### Public Website
- `GET /api/website/content` - Get all public content
- `GET /api/website/content/:section` - Get specific section
- `GET /api/website/hero` - Get hero section
- `GET /api/website/about` - Get about section
- `GET /api/website/features` - Get features section
- `GET /api/website/coffee` - Get coffee products
- `GET /api/website/contact` - Get contact information
- `GET /api/website/settings` - Get website settings
- `GET /api/website/search` - Search content

## 🚀 Production Deployment

### 1. Environment Variables
- Set `NODE_ENV=production`
- Use strong, unique `JWT_SECRET`
- Configure production database path
- Set appropriate CORS origins

### 2. Database
- Consider upgrading to MySQL/PostgreSQL for production
- Implement regular backups
- Monitor database performance

### 3. Security
- Use HTTPS in production
- Implement proper logging
- Set up monitoring and alerting
- Regular security updates

### 4. Process Management
- Use PM2 or similar process manager
- Set up reverse proxy (nginx/Apache)
- Configure SSL certificates

## 🔒 Security Best Practices

1. **Strong Passwords**: Use complex passwords and change regularly
2. **JWT Secret**: Use a long, random JWT secret
3. **Rate Limiting**: Adjust rate limits based on your needs
4. **HTTPS**: Always use HTTPS in production
5. **Regular Updates**: Keep dependencies updated
6. **Monitoring**: Monitor for suspicious activity
7. **Backups**: Regular database and content backups

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database path in .env
   - Ensure database directory exists
   - Run `npm run init-db`

2. **Login Issues**
   - Verify email/password in .env
   - Check database initialization
   - Clear browser localStorage

3. **Port Already in Use**
   - Change PORT in .env
   - Kill existing process on port 3000

4. **CORS Errors**
   - Check CORS configuration in server.js
   - Verify frontend URL matches allowed origins

### Logs

Check server console for detailed error messages and debugging information.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Verify configuration files
4. Check database connectivity

## 📄 License

MIT License - see LICENSE file for details.

## 🔄 Updates

- **v2.0.0**: Added SQL backend, JWT authentication, security features
- **v1.0.0**: Initial localStorage-based admin panel

---

**Happy Coffee Roasting! ☕**
