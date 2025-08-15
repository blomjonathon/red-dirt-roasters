const express = require('express');
const { getDb } = require('../database/database');

const router = express.Router();

// Get all website content (public)
router.get('/content', async (req, res) => {
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

        res.json({ content: organizedContent });
    } catch (error) {
        console.error('Get public content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get specific section content (public)
router.get('/content/:section', async (req, res) => {
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
        console.error('Get public section error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get hero section content
router.get('/hero', async (req, res) => {
    try {
        const db = getDb();
        const content = await new Promise((resolve, reject) => {
            db.all(
                'SELECT field, value FROM website_content WHERE section = "hero" ORDER BY field',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        const heroContent = {};
        content.forEach(item => {
            heroContent[item.field] = item.value;
        });

        res.json({ section: 'hero', content: heroContent });
    } catch (error) {
        console.error('Get hero error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get about section content
router.get('/about', async (req, res) => {
    try {
        const db = getDb();
        const content = await new Promise((resolve, reject) => {
            db.all(
                'SELECT field, value FROM website_content WHERE section = "about" ORDER BY field',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        const aboutContent = {};
        content.forEach(item => {
            aboutContent[item.field] = item.value;
        });

        res.json({ section: 'about', content: aboutContent });
    } catch (error) {
        console.error('Get about error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get features section content
router.get('/features', async (req, res) => {
    try {
        const db = getDb();
        const content = await new Promise((resolve, reject) => {
            db.all(
                'SELECT field, value FROM website_content WHERE section = "features" ORDER BY field',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        const featuresContent = {};
        content.forEach(item => {
            featuresContent[item.field] = item.value;
        });

        res.json({ section: 'features', content: featuresContent });
    } catch (error) {
        console.error('Get features error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get coffee products content
router.get('/coffee', async (req, res) => {
    try {
        const db = getDb();
        const content = await new Promise((resolve, reject) => {
            db.all(
                'SELECT field, value FROM website_content WHERE section = "coffee" ORDER BY field',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        const coffeeContent = {};
        content.forEach(item => {
            coffeeContent[item.field] = item.value;
        });

        res.json({ section: 'coffee', content: coffeeContent });
    } catch (error) {
        console.error('Get coffee error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get contact information
router.get('/contact', async (req, res) => {
    try {
        const db = getDb();
        const content = await new Promise((resolve, reject) => {
            db.all(
                'SELECT field, value FROM website_content WHERE section = "contact" ORDER BY field',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        const contactContent = {};
        content.forEach(item => {
            contactContent[item.field] = item.value;
        });

        res.json({ section: 'contact', content: contactContent });
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get website settings
router.get('/settings', async (req, res) => {
    try {
        const db = getDb();
        const content = await new Promise((resolve, reject) => {
            db.all(
                'SELECT field, value FROM website_content WHERE section = "settings" ORDER BY field',
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        const settingsContent = {};
        content.forEach(item => {
            settingsContent[item.field] = item.value;
        });

        res.json({ section: 'settings', content: settingsContent });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search content across all sections
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
        }

        const db = getDb();
        const searchTerm = `%${q.trim()}%`;
        
        const results = await new Promise((resolve, reject) => {
            db.all(
                'SELECT section, field, value FROM website_content WHERE value LIKE ? ORDER BY section, field',
                [searchTerm],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        // Group results by section
        const groupedResults = {};
        results.forEach(item => {
            if (!groupedResults[item.section]) {
                groupedResults[item.section] = [];
            }
            groupedResults[item.section].push({
                field: item.field,
                value: item.value
            });
        });

        res.json({
            query: q,
            results: groupedResults,
            totalResults: results.length
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
