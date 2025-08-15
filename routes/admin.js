const express = require('express');
const { body, validationResult } = require('express-validator');
const { getContentBySection, updateContent } = require('../database/database');

const router = express.Router();

// Middleware to check if user is authenticated
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Get all website content
router.get('/content', authenticateToken, async (req, res) => {
    try {
        // Get content for all sections
        const sections = ['hero', 'about', 'features', 'coffee', 'contact', 'settings'];
        const allContent = {};
        
        for (const section of sections) {
            try {
                const content = await getContentBySection(section);
                if (Object.keys(content).length > 0) {
                    allContent[section] = content;
                }
            } catch (error) {
                console.warn(`Failed to get ${section} content:`, error.message);
                // Continue with other sections
            }
        }

        res.json({ content: allContent });
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update website content
router.put('/content', authenticateToken, [
    body('content').isObject(),
    body('content.*').isObject()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content } = req.body;
        let totalUpdated = 0;

        // Update each section
        for (const [section, fields] of Object.entries(content)) {
            try {
                const updatedCount = await updateContent(section, fields);
                totalUpdated += updatedCount;
            } catch (error) {
                console.error(`Failed to update ${section}:`, error);
                // Continue with other sections
            }
        }

        res.json({ message: 'Content updated successfully', updatedCount: totalUpdated });
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update specific section
router.put('/content/:section', authenticateToken, [
    body().isObject()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { section } = req.params;
        const updates = req.body;
        const db = getDb();

        // Execute updates for the specific section
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                const stmt = db.prepare(
                    'INSERT OR REPLACE INTO website_content (section, field, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
                );

                Object.entries(updates).forEach(([field, value]) => {
                    stmt.run(section, field, value);
                });

                stmt.finalize((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });

        res.json({ message: `${section} section updated successfully` });
    } catch (error) {
        console.error('Update section error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get specific section content
router.get('/content/:section', authenticateToken, async (req, res) => {
    try {
        const { section } = req.params;
        const db = getDb();
        
        const content = await new Promise((resolve, reject) => {
            db.all(
                'SELECT field, value FROM website_content WHERE section = ? ORDER BY field',
                [section],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        // Organize content by fields
        const sectionContent = {};
        content.forEach(item => {
            sectionContent[item.field] = item.value;
        });

        res.json({ section, content: sectionContent });
    } catch (error) {
        console.error('Get section error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export website data
router.get('/export', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const content = await new Promise((resolve, reject) => {
            db.all(
                'SELECT section, field, value FROM website_content ORDER BY section, field',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        // Organize content by sections
        const organizedContent = {};
        content.forEach(item => {
            if (!organizedContent[item.section]) {
                organizedContent[item.section] = {};
            }
            organizedContent[item.section][item.field] = item.value;
        });

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0.0',
            content: organizedContent
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="red-dirt-roasters-data.json"');
        res.json(exportData);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Import website data
router.post('/import', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content || typeof content !== 'object') {
            return res.status(400).json({ error: 'Invalid import data format' });
        }

        const db = getDb();
        const updates = [];

        // Prepare all updates
        for (const [section, fields] of Object.entries(content)) {
            for (const [field, value] of Object.entries(fields)) {
                updates.push({ section, field, value });
            }
        }

        // Execute updates
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                const stmt = db.prepare(
                    'INSERT OR REPLACE INTO website_content (section, field, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
                );

                updates.forEach(({ section, field, value }) => {
                    stmt.run(section, field, value);
                });

                stmt.finalize((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });

        res.json({ 
            message: 'Data imported successfully', 
            importedCount: updates.length 
        });
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get admin dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        
        // Get content count by section
        const sectionStats = await new Promise((resolve, reject) => {
            db.all(
                'SELECT section, COUNT(*) as count FROM website_content GROUP BY section',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        // Get recent updates
        const recentUpdates = await new Promise((resolve, reject) => {
            db.all(
                'SELECT section, field, updated_at FROM website_content ORDER BY updated_at DESC LIMIT 10',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        // Get total content count
        const totalCount = await new Promise((resolve, reject) => {
            db.get(
                'SELECT COUNT(*) as count FROM website_content',
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                }
            );
        });

        res.json({
            stats: {
                totalContent: totalCount,
                sections: sectionStats
            },
            recentUpdates
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
