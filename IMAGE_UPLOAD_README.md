# Image Upload Functionality - Red Dirt Roasters

This document describes the new image upload functionality that has been added to the Red Dirt Roasters admin panel.

## Overview

The image upload system allows administrators to:
- Upload images for different sections of the website
- Manage uploaded images (view, delete, update metadata)
- See real-time updates on the main website
- Organize images by section and field

## Features

### 1. Image Upload
- **Supported formats**: All common image formats (JPEG, PNG, GIF, WebP, etc.)
- **File size limit**: 5MB per image
- **Automatic naming**: Unique filenames with timestamps to prevent conflicts
- **Section organization**: Images are organized by website section (hero, about, coffee, etc.)

### 2. Image Management
- **View all uploaded images** with metadata (filename, size, upload date, section, field)
- **Delete images** with confirmation
- **Update metadata** (change section or field assignment)
- **Real-time preview** of images in the admin panel

### 3. Website Integration
- **Automatic display**: Images appear on the website immediately after upload
- **Section-based loading**: Images are loaded based on their section and field assignments
- **Fallback support**: Maintains backward compatibility with existing image system

## API Endpoints

### Admin Routes (Authentication Required)

#### Upload Image
```
POST /api/admin/upload-image
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- image: File
- section: String (e.g., "hero", "about", "coffee")
- field: String (e.g., "background", "image", "light_roast_image")
```

#### Get All Images
```
GET /api/admin/images
Authorization: Bearer <token>
```

#### Delete Image
```
DELETE /api/admin/images/:filename
Authorization: Bearer <token>
```

#### Update Image Metadata
```
PUT /api/admin/images/:filename
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "section": "new_section",
  "field": "new_field"
}
```

#### Get Images by Section
```
GET /api/admin/images/section/:section
Authorization: Bearer <token>
```

### Public Routes (No Authentication Required)

#### Get Website Images
```
GET /api/website/images?section=hero
```

#### Get All Website Content (including images)
```
GET /api/website/content
```

## Database Structure

Images are stored in the `website_content` table with the following structure:

```sql
CREATE TABLE website_content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    field VARCHAR(100) NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section, field)
);
```

Image metadata is stored as JSON in the `value` field:

```json
{
  "filename": "image-1234567890-123456789.jpg",
  "originalName": "coffee-beans.jpg",
  "path": "/uploads/image-1234567890-123456789.jpg",
  "size": 245760,
  "mimetype": "image/jpeg",
  "uploadedAt": "2024-01-15T10:30:00.000Z",
  "section": "coffee",
  "field": "light_roast_image"
}
```

## File Storage

- **Upload directory**: `/uploads/` (relative to server root)
- **File naming**: `{field}-{timestamp}-{random}.{extension}`
- **Automatic creation**: Upload directory is created if it doesn't exist
- **Static serving**: Files are served via Express static middleware

## Usage Examples

### 1. Upload Hero Background Image

1. Go to Admin Panel → Images Tab
2. Select "Hero Background Image" file input
3. Choose an image file
4. Click "Upload All Images"
5. The image will appear as the hero background on the main website

### 2. Upload Coffee Product Images

1. Go to Admin Panel → Images Tab
2. Select images for Light, Medium, and Dark Roast
3. Click "Upload All Images"
4. Images will appear in the coffee section cards

### 3. Manage Existing Images

1. Go to Admin Panel → Images Tab
2. View all uploaded images in the "Current Images" section
3. Use "Delete" button to remove images
4. Use "Update" button to change section/field assignments

## Frontend Integration

The main website automatically displays uploaded images through the `admin-integration.js` script:

- **Hero section**: Background images are applied to the hero section
- **About section**: Images are displayed as decorative elements
- **Coffee products**: Product images are shown in the coffee cards
- **Real-time updates**: Changes appear immediately after refresh

## Security Features

- **Authentication required**: All admin routes require valid JWT tokens
- **File type validation**: Only image files are accepted
- **File size limits**: 5MB maximum per image
- **Unique filenames**: Prevents filename conflicts and security issues
- **Section isolation**: Images are organized by website sections

## Error Handling

The system includes comprehensive error handling:

- **Upload failures**: Detailed error messages for failed uploads
- **File validation**: Clear feedback for invalid file types or sizes
- **Database errors**: Graceful fallbacks when database operations fail
- **Network issues**: User-friendly messages for connection problems

## Testing

A test page is available at `/test-upload.html` to verify functionality:

- Test image uploads (will fail without authentication)
- Test image retrieval endpoints
- Test website content loading

## Troubleshooting

### Common Issues

1. **Images not appearing**: Check that images are assigned to correct sections/fields
2. **Upload failures**: Verify file size is under 5MB and file type is an image
3. **Permission errors**: Ensure admin authentication is working
4. **Database errors**: Check database connection and table structure

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API endpoints are accessible
3. Check server logs for backend errors
4. Confirm database connectivity
5. Verify file permissions on upload directory

## Future Enhancements

Potential improvements for the image system:

- **Image resizing**: Automatic thumbnail generation
- **Image optimization**: WebP conversion and compression
- **CDN integration**: Cloud storage for better performance
- **Bulk operations**: Multiple image upload and management
- **Image cropping**: Built-in image editing tools
- **Version control**: Image history and rollback functionality

## Support

For issues or questions about the image upload system:

1. Check this documentation
2. Review server logs for error details
3. Test with the provided test page
4. Verify database and file system permissions
5. Contact the development team for assistance
