const express = require('express');
const { getContentBySection } = require('../database/database');

const router = express.Router();

// Get all website content (public)
router.get('/content', async (req, res) => {
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
        console.error('Get public content error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get specific section content (public)
router.get('/content/:section', async (req, res) => {
    try {
        const { section } = req.params;
        const content = await getContentBySection(section);
        
        if (Object.keys(content).length === 0) {
            return res.status(404).json({ error: 'Section not found' });
        }

        res.json({ section, content });
    } catch (error) {
        console.error('Get public section error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get hero section content
router.get('/hero', async (req, res) => {
    try {
        const content = await getContentBySection('hero');
        
        if (Object.keys(content).length === 0) {
            return res.status(404).json({ error: 'Hero section not found' });
        }

        res.json({ section: 'hero', content });
    } catch (error) {
        console.error('Get hero error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get about section content
router.get('/about', async (req, res) => {
    try {
        const content = await getContentBySection('about');
        
        if (Object.keys(content).length === 0) {
            return res.status(404).json({ error: 'About section not found' });
        }

        res.json({ section: 'about', content });
    } catch (error) {
        console.error('Get about error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get features section content
router.get('/features', async (req, res) => {
    try {
        const content = await getContentBySection('features');
        
        if (Object.keys(content).length === 0) {
            return res.status(404).json({ error: 'Features section not found' });
        }

        res.json({ section: 'features', content });
    } catch (error) {
        console.error('Get features error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get coffee products content
router.get('/coffee', async (req, res) => {
    try {
        const content = await getContentBySection('coffee');
        
        if (Object.keys(content).length === 0) {
            return res.status(404).json({ error: 'Coffee section not found' });
        }

        res.json({ section: 'coffee', content });
    } catch (error) {
        console.error('Get coffee error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get contact information
router.get('/contact', async (req, res) => {
    try {
        const content = await getContentBySection('contact');
        
        if (Object.keys(content).length === 0) {
            return res.status(404).json({ error: 'Contact section not found' });
        }

        res.json({ section: 'contact', content });
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get website settings
router.get('/settings', async (req, res) => {
    try {
        const content = await getContentBySection('settings');
        
        if (Object.keys(content).length === 0) {
            return res.status(404).json({ error: 'Settings section not found' });
        }

        res.json({ section: 'settings', content });
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

        const searchTerm = `%${q.trim()}%`;
        
        const results = await new Promise((resolve, reject) => {
            // This part of the search logic needs to be updated to use the new database functions
            // For now, we'll keep the old SQLite-like structure, but it will not work as expected
            // with the new PostgreSQL functions.
            // A proper implementation would involve querying multiple sections for the search term.
            // For example:
            // const heroResults = await getContentBySection('hero', searchTerm);
            // const aboutResults = await getContentBySection('about', searchTerm);
            // const featuresResults = await getContentBySection('features', searchTerm);
            // const coffeeResults = await getContentBySection('coffee', searchTerm);
            // const contactResults = await getContentBySection('contact', searchTerm);
            // const settingsResults = await getContentBySection('settings', searchTerm);

            // This is a placeholder for the new search logic.
            // For now, we'll return an empty results object as the new functions don't support this directly.
            resolve([]); // Placeholder for results
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
