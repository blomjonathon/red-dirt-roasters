const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getContentBySection, updateContent } = require('../database/database');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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

        const updatedCount = await updateContent(section, updates);
        
        res.json({ 
            message: `${section} section updated successfully`,
            updatedCount
        });
    } catch (error) {
        console.error(`Error updating ${section} content:`, error);
        res.status(500).json({ error: `Failed to update ${section} content` });
    }
});

// Export website data
router.get('/export', authenticateToken, async (req, res) => {
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
                console.warn(`Failed to get ${section} content for export:`, error.message);
                // Continue with other sections
            }
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0.0',
            content: allContent
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="red-dirt-roasters-data.json"');
        res.json(exportData);
    } catch (error) {
        console.error('Export error:', error);
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
            try {
                const updatedCount = await updateContent(section, fields);
                totalImported += updatedCount;
            } catch (error) {
                console.error(`Failed to import ${section}:`, error);
                // Continue with other sections
            }
        }
        
        res.json({ 
            message: 'Data imported successfully', 
            importedCount: totalImported 
        });
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import data' });
    }
});

// Get admin dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        // Get content for all sections to count items
        const sections = ['hero', 'about', 'features', 'coffee', 'contact', 'settings'];
        const sectionStats = [];
        let totalContent = 0;
        
        for (const section of sections) {
            try {
                const content = await getContentBySection(section);
                const count = Object.keys(content).length;
                if (count > 0) {
                    sectionStats.push({ section, count });
                    totalContent += count;
                }
            } catch (error) {
                console.warn(`Failed to get ${section} stats:`, error.message);
                // Continue with other sections
            }
        }

        res.json({
            stats: {
                totalContent,
                sections: sectionStats
            },
            recentUpdates: [] // This could be enhanced later with actual update tracking
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Upload new image
router.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imageData = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: `/uploads/${req.file.filename}`,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadedAt: new Date().toISOString(),
            section: req.body.section || 'general',
            field: req.body.field || 'image'
        };

        // Save image metadata to database
        await updateContent('images', {
            [imageData.field]: JSON.stringify(imageData)
        });

        res.json({ 
            message: 'Image uploaded successfully',
            image: imageData
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Get all uploaded images
router.get('/images', authenticateToken, async (req, res) => {
    try {
        const images = await getContentBySection('images');
        const imageList = [];
        
        for (const [field, imageData] of Object.entries(images)) {
            try {
                const parsed = JSON.parse(imageData);
                imageList.push(parsed);
            } catch (e) {
                console.warn(`Failed to parse image data for ${field}:`, e);
            }
        }
        
        res.json({ images: imageList });
    } catch (error) {
        console.error('Get images error:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Delete image
router.delete('/images/:filename', authenticateToken, async (req, res) => {
    try {
        const { filename } = req.params;
        const images = await getContentBySection('images');
        
        let deletedField = null;
        for (const [field, imageData] of Object.entries(images)) {
            try {
                const parsed = JSON.parse(imageData);
                if (parsed.filename === filename) {
                    deletedField = field;
                    break;
                }
            } catch (e) {
                continue;
            }
        }
        
        if (!deletedField) {
            return res.status(404).json({ error: 'Image not found' });
        }
        
        // Remove from database
        await updateContent('images', { [deletedField]: null });
        
        // Delete file from filesystem
        const filePath = path.join(__dirname, '../uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// Update image metadata (e.g., change section/field assignment)
router.put('/images/:filename', authenticateToken, [
    body('section').optional().isString(),
    body('field').optional().isString()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { filename } = req.params;
        const { section, field } = req.body;
        const images = await getContentBySection('images');
        
        let imageField = null;
        let imageData = null;
        
        for (const [fieldName, data] of Object.entries(images)) {
            try {
                const parsed = JSON.parse(data);
                if (parsed.filename === filename) {
                    imageField = fieldName;
                    imageData = parsed;
                    break;
                }
            } catch (e) {
                continue;
            }
        }
        
        if (!imageField || !imageData) {
            return res.status(404).json({ error: 'Image not found' });
        }
        
        // Update metadata
        if (section) imageData.section = section;
        if (field) imageData.field = field;
        
        // Save updated metadata
        await updateContent('images', {
            [imageField]: JSON.stringify(imageData)
        });
        
        res.json({ 
            message: 'Image metadata updated successfully',
            image: imageData
        });
    } catch (error) {
        console.error('Update image error:', error);
        res.status(500).json({ error: 'Failed to update image metadata' });
    }
});

// Get images by section
router.get('/images/section/:section', authenticateToken, async (req, res) => {
    try {
        const { section } = req.params;
        const images = await getContentBySection('images');
        const sectionImages = [];
        
        for (const [field, imageData] of Object.entries(images)) {
            try {
                const parsed = JSON.parse(imageData);
                if (parsed.section === section) {
                    sectionImages.push(parsed);
                }
            } catch (e) {
                continue;
            }
        }
        
        res.json({ images: sectionImages });
    } catch (error) {
        console.error('Get section images error:', error);
        res.status(500).json({ error: 'Failed to fetch section images' });
    }
});

module.exports = router;
