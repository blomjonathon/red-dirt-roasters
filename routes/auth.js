const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { 
    getUserByEmail, 
    updateUserLastLogin, 
    recordLoginAttempt, 
    getRecentLoginAttempts,
    createSession,
    deleteSession
} = require('../database/database');

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware to check if user is authenticated
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Login endpoint
router.post('/login', loginLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 })
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check for recent failed login attempts
        const recentAttempts = await getRecentLoginAttempts(email, 15);

        if (recentAttempts >= 5) {
            return res.status(429).json({ 
                error: 'Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.' 
            });
        }

        // Get user from database
        const user = await getUserByEmail(email);

        if (!user) {
            await recordLoginAttempt(email, req.ip, false);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            await recordLoginAttempt(email, req.ip, false);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update last login
        await updateUserLastLogin(user.id);

        // Record successful login
        await recordLoginAttempt(email, req.ip, true);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // In a more advanced setup, you might want to blacklist the token
        // For now, we'll just return success (client should delete the token)
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password endpoint
router.post('/change-password', authenticateToken, [
    body('currentPassword').isLength({ min: 1 }),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;
        const db = getDb();

        // Get current user
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE id = ?',
                [req.user.userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password in database
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET password_hash = ? WHERE id = ?',
                [newPasswordHash, req.user.userId],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id, email, role, created_at, last_login FROM users WHERE id = ?',
                [req.user.userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user info error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Record login attempt
async function recordLoginAttempt(email, ipAddress, success) {
    const db = getDb();
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, ?)',
            [email, ipAddress, success],
            function(err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

module.exports = router;
