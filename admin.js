const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool, getContentBySection, updateContent } = require('../database/database');

const router = express.Router();

// Get all website content
router.get('/content', authenticateToken, async (req, res) => {
    try {
        const client = await pool.connect();
        
        const result = await client.query('SELECT section, field, value FROM website_content ORDER BY section, field');
        client.release();
        
        // Organize content by sections
        const content = {};
        result.rows.forEach(row => {
            if (!content[row.section]) {
                content[row.section] = {};
            }
            content[row.section][row.field] = row.value;
        });
        
        res.json({ content });
    } catch (error) {
        console.error('❌ Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
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
        
        for (const [section, fields] of Object.entries(content)) {
            const updatedCount = await updateContent(section, fields);
            totalUpdated += updatedCount;
        }
        
        res.json({ 
            message: 'Content updated successfully', 
            updatedCount: totalUpdated 
        });
    } catch (error) {
        console.error('❌ Error updating content:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// Get specific section content
router.get('/content/:section', authenticateToken, async (req, res) => {
    try {
        const { section } = req.params;
        const content = await getContentBySection(section);
        res.json({ section, content });
    } catch (error) {
        console.error(`❌ Error fetching ${section} content:`, error);
        res.status(500).json({ error: `Failed to fetch ${section} content` });
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
        
        const updatedCount = await updateContent(section, updates);
        
        res.json({ 
            message: `${section} section updated successfully`,
            updatedCount
        });
    } catch (error) {
        console.error(`❌ Error updating ${section} content:`, error);
        res.status(500).json({ error: `Failed to update ${section} content` });
    }
});

// Export website data
router.get('/export', authenticateToken, async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT section, field, value FROM website_content ORDER BY section, field');
        client.release();
        
        // Organize content by sections
        const content = {};
        result.rows.forEach(row => {
            if (!content[row.section]) {
                content[row.section] = {};
            }
            content[row.section][row.field] = row.value;
        });
        
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0.0',
            content: content
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="red-dirt-roasters-data.json"');
        res.json(exportData);
    } catch (error) {
        console.error('❌ Export error:', error);
        res.status(500).json({ error: 'Failed to export data' });
    }
});

// Import website data
router.post('/import', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content || typeof content !== 'object') {
            return res.status(400).json({ error: 'Invalid import data format' });
        }

        let totalImported = 0;
        
        for (const [section, fields] of Object.entries(content)) {
            const updatedCount = await updateContent(section, fields);
            totalImported += updatedCount;
        }
        
        res.json({ 
            message: 'Data imported successfully', 
            importedCount: totalImported 
        });
    } catch (error) {
        console.error('❌ Import error:', error);
        res.status(500).json({ error: 'Failed to import data' });
    }
});

// Get admin dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const client = await pool.connect();
        
        // Get content count by section
        const sectionStats = await client.query(`
            SELECT section, COUNT(*) as count 
            FROM website_content 
            GROUP BY section
        `);

        // Get recent updates
        const recentUpdates = await client.query(`
            SELECT section, field, updated_at 
            FROM website_content 
            ORDER BY updated_at DESC 
            LIMIT 10
        `);

        // Get total content count
        const totalCount = await client.query('SELECT COUNT(*) as count FROM website_content');
        
        client.release();

        res.json({
            stats: {
                totalContent: parseInt(totalCount.rows[0].count),
                sections: sectionStats.rows
            },
            recentUpdates: recentUpdates.rows
        });
    } catch (error) {
        console.error('❌ Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

module.exports = router;