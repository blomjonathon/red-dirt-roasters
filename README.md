# Red Dirt Roasters - Coffee Roasting Website

A professional coffee roasting website with an integrated admin panel for easy content management.

## 🚀 Features

### Main Website
- **Responsive Design** - Works perfectly on all devices
- **Modern UI** - Clean, coffee-themed design with smooth animations
- **Dynamic Content** - Content updates automatically through the admin system
- **Contact Form** - Built-in contact form for customer inquiries
- **SEO Ready** - Proper meta tags and semantic HTML

### Admin Panel
- **Easy Content Management** - Update text, images, and settings without coding
- **Image Upload System** - Upload and manage website images
- **Real-time Updates** - Changes appear immediately on the main website
- **Export/Import** - Backup and restore your website data
- **Secure Access** - Password-protected admin area

## 📁 File Structure

```
red-dirt-roasters/
├── index.html          # Main website
├── styles.css          # Main website styling
├── script.js           # Main website functionality
├── admin.html          # Admin panel interface
├── admin.css           # Admin panel styling
├── admin.js            # Admin panel functionality
├── admin-integration.js # Connects admin to main website
└── README.md           # This file
```

## 🔐 Accessing the Admin Panel

1. **Navigate to**: `yourdomain.com/admin.html`
2. **Default Password**: `admin123`
3. **Change Password**: Use the Settings tab to set a new password

## 📝 How to Use the Admin Panel

### Content Tab
- **Hero Section**: Update main heading, subtitle, and button text
- **About Section**: Modify company story and features
- **Coffee Products**: Update product names, descriptions, and prices
- **Contact Info**: Change address, phone, email, and business hours

### Images Tab
- **Upload Images**: Replace default graphics with your own photos
- **Image Types**: Hero background, about section, and coffee product images
- **Preview**: See how images will look before uploading

### Settings Tab
- **Basic Settings**: Change website title and company name
- **Password Management**: Update admin password
- **Data Export/Import**: Backup and restore your website content

## 🌐 Deployment

### Simple Hosting (Static Sites)
1. Upload all files to your web hosting service
2. Access admin panel at `yourdomain.com/admin.html`
3. Make changes through the admin interface
4. Content updates automatically

### Advanced Hosting (With Backend)
For production use, consider:
- **Database Integration**: Store content in a real database
- **Image Storage**: Use cloud storage (AWS S3, Cloudinary)
- **User Authentication**: Implement proper user management
- **API Endpoints**: Create REST APIs for content management

## 🔧 Customization

### Adding New Content Sections
1. Add HTML structure to `index.html`
2. Update `admin.html` with form fields
3. Modify `admin.js` to handle new data
4. Update `admin-integration.js` to display new content

### Styling Changes
- **Main Website**: Edit `styles.css`
- **Admin Panel**: Edit `admin.css`
- **Colors**: Update CSS variables for consistent theming

### Adding New Features
- **JavaScript**: Extend `script.js` or `admin.js`
- **Form Handling**: Modify contact form processing
- **Animations**: Add new CSS animations and transitions

## 📱 Mobile Responsiveness

The website and admin panel are fully responsive:
- **Mobile-First Design** - Optimized for small screens
- **Touch-Friendly** - Easy to use on tablets and phones
- **Adaptive Layout** - Content adjusts to screen size

## 🔒 Security Considerations

### For Production Use
- **Change Default Password**: Immediately change from `admin123`
- **HTTPS**: Use SSL certificates for secure data transmission
- **Input Validation**: Add server-side validation for all inputs
- **Rate Limiting**: Prevent brute force attacks on admin login
- **Session Management**: Implement proper user sessions

### Current Implementation
- **Local Storage**: Data stored in browser (good for demos)
- **Client-Side Only**: No server-side security (not for production)
- **Basic Authentication**: Simple password check

### Git Security
- **`.gitignore`**: Configured to exclude sensitive files
- **Config Files**: Use `config.example.js` as template, create `config.js` locally
- **Never Commit**: Passwords, API keys, or sensitive configuration data

## 🚀 Getting Started

1. **Download** all files to your computer
2. **Open** `index.html` in a web browser to see the main website
3. **Open** `admin.html` to access the admin panel
4. **Login** with password: `admin123`
5. **Start Customizing** your coffee roasting website!

## 📞 Support

This is a self-contained website template. For customization help:
- Review the code comments in each file
- Check browser console for any error messages
- Ensure all files are in the same directory
- Verify file permissions on your hosting service

## 🎯 Next Steps

### Immediate Improvements
- [ ] Add your real coffee photos
- [ ] Update business information
- [ ] Customize color scheme
- [ ] Add social media links

### Future Enhancements
- [ ] Online ordering system
- [ ] Customer reviews section
- [ ] Blog/news section
- [ ] Newsletter signup
- [ ] Analytics integration

---

**Built with ❤️ for coffee lovers everywhere!**
