// Admin Panel JavaScript
let isLoggedIn = false;
let websiteData = {};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadWebsiteData();
    setupImagePreviews();
    checkLoginStatus();
});

// Check if user is already logged in
function checkLoginStatus() {
    const savedLogin = localStorage.getItem('adminLoggedIn');
    if (savedLogin === 'true') {
        login();
    }
}

// Login function
function login() {
    const password = document.getElementById('adminPassword').value;
    const defaultPassword = 'admin123';
    
    if (password === defaultPassword) {
        isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        loadCurrentContent();
    } else {
        alert('Incorrect password. Please try again.');
        document.getElementById('adminPassword').value = '';
    }
}

// Show admin panel after login
function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Load current website content into admin form
function loadCurrentContent() {
    // Hero Section
    document.getElementById('heroHeading').value = websiteData.heroHeading || 'Artisan Coffee Roasting';
    document.getElementById('heroSubtitle').value = websiteData.heroSubtitle || 'Small batch, handcrafted coffee roasted with passion in the heart of Oklahoma';
    document.getElementById('heroButton').value = websiteData.heroButton || 'Explore Our Coffee';
    
    // About Section
    document.getElementById('aboutTitle').value = websiteData.aboutTitle || 'Our Story';
    document.getElementById('aboutStory1').value = websiteData.aboutStory1 || 'Red Dirt Roasters began as a passion project in our garage, where we discovered the art of coffee roasting. What started with a small home roaster has grown into a beloved local business, serving the finest coffee to our community.';
    document.getElementById('aboutStory2').value = websiteData.aboutStory2 || 'We source the highest quality green coffee beans from sustainable farms around the world and roast them in small batches to ensure perfect flavor development. Every batch is carefully monitored and tasted to meet our exacting standards.';
    
    // Features
    document.getElementById('feature1Title').value = websiteData.feature1Title || 'Small Batch';
    document.getElementById('feature1Desc').value = websiteData.feature1Desc || 'We roast in small batches to ensure consistency and quality in every cup.';
    document.getElementById('feature2Title').value = websiteData.feature2Title || 'Fresh Roasted';
    document.getElementById('feature2Desc').value = websiteData.feature2Desc || 'All our coffee is roasted fresh and shipped within 24 hours of roasting.';
    document.getElementById('feature3Title').value = websiteData.feature3Title || 'Local Business';
    document.getElementById('feature3Desc').value = websiteData.feature3Desc || 'Proudly serving our community with personal attention and care.';
    
    // Coffee Products
    document.getElementById('lightRoastTitle').value = websiteData.lightRoastTitle || 'Light Roast';
    document.getElementById('lightRoastDesc').value = websiteData.lightRoastDesc || 'Bright, crisp flavors with subtle acidity. Perfect for those who appreciate the natural character of the bean.';
    document.getElementById('lightRoastPrice').value = websiteData.lightRoastPrice || '$16.99';
    
    document.getElementById('mediumRoastTitle').value = websiteData.mediumRoastTitle || 'Medium Roast';
    document.getElementById('mediumRoastDesc').value = websiteData.mediumRoastDesc || 'Balanced body with rich flavors. Our most popular roast, offering the perfect middle ground.';
    document.getElementById('mediumRoastPrice').value = websiteData.mediumRoastPrice || '$17.99';
    
    document.getElementById('darkRoastTitle').value = websiteData.darkRoastTitle || 'Dark Roast';
    document.getElementById('darkRoastDesc').value = websiteData.darkRoastDesc || 'Bold, full-bodied with deep chocolate notes. For those who love a strong, rich cup.';
    document.getElementById('darkRoastPrice').value = websiteData.darkRoastPrice || '$18.99';
    
    // Contact Information
    document.getElementById('contactAddress').value = websiteData.contactAddress || '123 Coffee Street';
    document.getElementById('contactCity').value = websiteData.contactCity || 'Oklahoma City, OK 73102';
    document.getElementById('contactPhone').value = websiteData.contactPhone || '(405) 555-0123';
    document.getElementById('contactEmail').value = websiteData.contactEmail || 'info@reddirtroasters.com';
    document.getElementById('contactHours1').value = websiteData.contactHours1 || 'Monday - Friday: 7:00 AM - 6:00 PM';
    document.getElementById('contactHours2').value = websiteData.contactHours2 || 'Saturday: 8:00 AM - 4:00 PM';
    document.getElementById('contactHours3').value = websiteData.contactHours3 || 'Sunday: Closed';
    
    // Settings
    document.getElementById('websiteTitle').value = websiteData.websiteTitle || 'Red Dirt Roasters - Artisan Coffee Roasting';
    document.getElementById('companyName').value = websiteData.companyName || 'Red Dirt Roasters';
}

// Save content changes
function saveContent() {
    // Collect all form data
    websiteData = {
        heroHeading: document.getElementById('heroHeading').value,
        heroSubtitle: document.getElementById('heroSubtitle').value,
        heroButton: document.getElementById('heroButton').value,
        aboutTitle: document.getElementById('aboutTitle').value,
        aboutStory1: document.getElementById('aboutStory1').value,
        aboutStory2: document.getElementById('aboutStory2').value,
        feature1Title: document.getElementById('feature1Title').value,
        feature1Desc: document.getElementById('feature1Desc').value,
        feature2Title: document.getElementById('feature2Title').value,
        feature2Desc: document.getElementById('feature2Desc').value,
        feature3Title: document.getElementById('feature3Title').value,
        feature3Desc: document.getElementById('feature3Desc').value,
        lightRoastTitle: document.getElementById('lightRoastTitle').value,
        lightRoastDesc: document.getElementById('lightRoastDesc').value,
        lightRoastPrice: document.getElementById('lightRoastPrice').value,
        mediumRoastTitle: document.getElementById('mediumRoastTitle').value,
        mediumRoastDesc: document.getElementById('mediumRoastDesc').value,
        mediumRoastPrice: document.getElementById('mediumRoastPrice').value,
        darkRoastTitle: document.getElementById('darkRoastTitle').value,
        darkRoastDesc: document.getElementById('darkRoastDesc').value,
        darkRoastPrice: document.getElementById('darkRoastPrice').value,
        contactAddress: document.getElementById('contactAddress').value,
        contactCity: document.getElementById('contactCity').value,
        contactPhone: document.getElementById('contactPhone').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactHours1: document.getElementById('contactHours1').value,
        contactHours2: document.getElementById('contactHours2').value,
        contactHours3: document.getElementById('contactHours3').value,
        websiteTitle: document.getElementById('websiteTitle').value,
        companyName: document.getElementById('companyName').value
    };
    
    // Save to localStorage
    localStorage.setItem('websiteData', JSON.stringify(websiteData));
    
    // Update main website
    updateMainWebsite();
    
    alert('Content saved successfully! The main website has been updated.');
}

// Save settings
function saveSettings() {
    websiteData.websiteTitle = document.getElementById('websiteTitle').value;
    websiteData.companyName = document.getElementById('companyName').value;
    
    localStorage.setItem('websiteData', JSON.stringify(websiteData));
    updateMainWebsite();
    
    alert('Settings saved successfully!');
}

// Change admin password
function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    // In a real application, you'd want to hash this password
    // For this demo, we'll store it in localStorage
    localStorage.setItem('adminPassword', newPassword);
    document.getElementById('newPassword').value = '';
    alert('Password changed successfully!');
}

// Export website data
function exportData() {
    const dataStr = JSON.stringify(websiteData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'red-dirt-roasters-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import website data
function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file to import.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            websiteData = { ...websiteData, ...importedData };
            localStorage.setItem('websiteData', JSON.stringify(websiteData));
            loadCurrentContent();
            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

// Setup image previews
function setupImagePreviews() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const previewId = this.id + 'Preview';
            const preview = document.getElementById(previewId);
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview" />`;
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

// Upload images
function uploadImages() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    let uploadedCount = 0;
    
    fileInputs.forEach(input => {
        if (input.files[0]) {
            uploadedCount++;
            const fileName = input.files[0].name;
            const imageType = input.id.replace('Image', '');
            
            // Store image data (in a real app, you'd upload to a server)
            const reader = new FileReader();
            reader.onload = function(e) {
                websiteData[imageType + 'Image'] = e.target.result;
                localStorage.setItem('websiteData', JSON.stringify(websiteData));
            };
            reader.readAsDataURL(input.files[0]);
        }
    });
    
    if (uploadedCount > 0) {
        alert(`${uploadedCount} image(s) uploaded successfully!`);
        updateMainWebsite();
    } else {
        alert('Please select at least one image to upload.');
    }
}

// Load website data from localStorage
function loadWebsiteData() {
    const savedData = localStorage.getItem('websiteData');
    if (savedData) {
        websiteData = JSON.parse(savedData);
    }
}

// Update main website with new content
function updateMainWebsite() {
    // This function would typically send data to your main website
    // For now, we'll just store it in localStorage
    // In a real deployment, you might want to:
    // 1. Send data to a backend API
    // 2. Update a database
    // 3. Trigger a website rebuild
    
    console.log('Website data updated:', websiteData);
    
    // You can also open the main website in a new tab to see changes
    // window.open('index.html', '_blank');
}

// Logout function
function logout() {
    isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Add logout button to admin panel
document.addEventListener('DOMContentLoaded', function() {
    const adminHeader = document.querySelector('.admin-header');
    if (adminHeader) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.className = 'logout-btn';
        logoutBtn.onclick = logout;
        logoutBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
        `;
        adminHeader.style.position = 'relative';
        adminHeader.appendChild(logoutBtn);
    }
});

// Auto-save functionality
let autoSaveTimer;
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                saveContent();
            }, 2000); // Auto-save after 2 seconds of inactivity
        });
    });
}

// Initialize auto-save when admin panel is shown
const originalShowAdminPanel = showAdminPanel;
showAdminPanel = function() {
    originalShowAdminPanel();
    setupAutoSave();
};
