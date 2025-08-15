// Admin Panel JavaScript with Secure Backend Integration
let isLoggedIn = false;
let authToken = null;
let websiteData = {};

// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupImagePreviews();
    setupEventListeners();
});

// Check if user is already logged in
function checkLoginStatus() {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
        authToken = savedToken;
        verifyTokenAndLogin();
    }
}

// Verify JWT token and auto-login if valid
async function verifyTokenAndLogin() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            isLoggedIn = true;
            showAdminPanel();
            loadCurrentContent();
        } else {
            // Token expired or invalid
            localStorage.removeItem('adminToken');
            authToken = null;
            isLoggedIn = false;
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
        authToken = null;
        isLoggedIn = false;
    }
}

// Login function with secure backend
async function login() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            isLoggedIn = true;
            localStorage.setItem('adminToken', authToken);
            showAdminPanel();
            loadCurrentContent();
            
            // Clear form
            document.getElementById('adminEmail').value = '';
            document.getElementById('adminPassword').value = '';
        } else {
            alert(data.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your connection and try again.');
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

// Load current website content from database
async function loadCurrentContent() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/content`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            websiteData = data.content;
            populateFormFields();
        } else {
            console.error('Failed to load content:', response.statusText);
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Populate form fields with loaded data
function populateFormFields() {
    // Hero Section
    if (websiteData.hero) {
        document.getElementById('heroHeading').value = websiteData.hero.heading || '';
        document.getElementById('heroSubtitle').value = websiteData.hero.subtitle || '';
        document.getElementById('heroButton').value = websiteData.hero.button || '';
    }
    
    // About Section
    if (websiteData.about) {
        document.getElementById('aboutTitle').value = websiteData.about.title || '';
        document.getElementById('aboutStory1').value = websiteData.about.story1 || '';
        document.getElementById('aboutStory2').value = websiteData.about.story2 || '';
    }
    
    // Features
    if (websiteData.features) {
        document.getElementById('feature1Title').value = websiteData.features.feature1_title || '';
        document.getElementById('feature1Desc').value = websiteData.features.feature1_desc || '';
        document.getElementById('feature2Title').value = websiteData.features.feature2_title || '';
        document.getElementById('feature2Desc').value = websiteData.features.feature2_desc || '';
        document.getElementById('feature3Title').value = websiteData.features.feature3_title || '';
        document.getElementById('feature3Desc').value = websiteData.features.feature3_desc || '';
    }
    
    // Coffee Products
    if (websiteData.coffee) {
        document.getElementById('lightRoastTitle').value = websiteData.coffee.light_roast_title || '';
        document.getElementById('lightRoastDesc').value = websiteData.coffee.light_roast_desc || '';
        document.getElementById('lightRoastPrice').value = websiteData.coffee.light_roast_price || '';
        
        document.getElementById('mediumRoastTitle').value = websiteData.coffee.medium_roast_title || '';
        document.getElementById('mediumRoastDesc').value = websiteData.coffee.medium_roast_desc || '';
        document.getElementById('mediumRoastPrice').value = websiteData.coffee.medium_roast_price || '';
        
        document.getElementById('darkRoastTitle').value = websiteData.coffee.dark_roast_title || '';
        document.getElementById('darkRoastDesc').value = websiteData.coffee.dark_roast_desc || '';
        document.getElementById('darkRoastPrice').value = websiteData.coffee.dark_roast_price || '';
    }
    
    // Contact Information
    if (websiteData.contact) {
        document.getElementById('contactAddress').value = websiteData.contact.address || '';
        document.getElementById('contactCity').value = websiteData.contact.city || '';
        document.getElementById('contactPhone').value = websiteData.contact.phone || '';
        document.getElementById('contactEmail').value = websiteData.contact.email || '';
        document.getElementById('contactHours1').value = websiteData.contact.hours1 || '';
        document.getElementById('contactHours2').value = websiteData.contact.hours2 || '';
        document.getElementById('contactHours3').value = websiteData.contact.hours3 || '';
    }
    
    // Settings
    if (websiteData.settings) {
        document.getElementById('websiteTitle').value = websiteData.settings.website_title || '';
        document.getElementById('companyName').value = websiteData.settings.company_name || '';
    }
}

// Save content changes to database
async function saveContent() {
    try {
        // Collect all form data
        const content = {
            hero: {
                heading: document.getElementById('heroHeading').value,
                subtitle: document.getElementById('heroSubtitle').value,
                button: document.getElementById('heroButton').value
            },
            about: {
                title: document.getElementById('aboutTitle').value,
                story1: document.getElementById('aboutStory1').value,
                story2: document.getElementById('aboutStory2').value
            },
            features: {
                feature1_title: document.getElementById('feature1Title').value,
                feature1_desc: document.getElementById('feature1Desc').value,
                feature2_title: document.getElementById('feature2Title').value,
                feature2_desc: document.getElementById('feature2Desc').value,
                feature3_title: document.getElementById('feature3Title').value,
                feature3_desc: document.getElementById('feature3Desc').value
            },
            coffee: {
                light_roast_title: document.getElementById('lightRoastTitle').value,
                light_roast_desc: document.getElementById('lightRoastDesc').value,
                light_roast_price: document.getElementById('lightRoastPrice').value,
                medium_roast_title: document.getElementById('mediumRoastTitle').value,
                medium_roast_desc: document.getElementById('mediumRoastDesc').value,
                medium_roast_price: document.getElementById('mediumRoastPrice').value,
                dark_roast_title: document.getElementById('darkRoastTitle').value,
                dark_roast_desc: document.getElementById('darkRoastDesc').value,
                dark_roast_price: document.getElementById('darkRoastPrice').value
            },
            contact: {
                address: document.getElementById('contactAddress').value,
                city: document.getElementById('contactCity').value,
                phone: document.getElementById('contactPhone').value,
                email: document.getElementById('contactEmail').value,
                hours1: document.getElementById('contactHours1').value,
                hours2: document.getElementById('contactHours2').value,
                hours3: document.getElementById('contactHours3').value
            },
            settings: {
                website_title: document.getElementById('websiteTitle').value,
                company_name: document.getElementById('companyName').value
            }
        };

        const response = await fetch(`${API_BASE_URL}/admin/content`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            const data = await response.json();
            websiteData = content;
            alert(`Content saved successfully! ${data.updatedCount} fields updated.`);
        } else {
            const errorData = await response.json();
            alert(`Failed to save content: ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Save content error:', error);
        alert('Failed to save content. Please check your connection and try again.');
    }
}

// Save settings
async function saveSettings() {
    try {
        const settings = {
            website_title: document.getElementById('websiteTitle').value,
            company_name: document.getElementById('companyName').value
        };

        const response = await fetch(`${API_BASE_URL}/admin/content/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(settings)
        });

        if (response.ok) {
            alert('Settings saved successfully!');
        } else {
            const errorData = await response.json();
            alert(`Failed to save settings: ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Save settings error:', error);
        alert('Failed to save settings. Please check your connection and try again.');
    }
}

// Change admin password securely
async function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    
    if (!currentPassword || !newPassword) {
        alert('Please enter both current and new passwords.');
        return;
    }

    if (newPassword.length < 8) {
        alert('New password must be at least 8 characters long.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Password changed successfully!');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
        } else {
            alert(data.error || 'Failed to change password.');
        }
    } catch (error) {
        console.error('Change password error:', error);
        alert('Failed to change password. Please check your connection and try again.');
    }
}

// Export website data
async function exportData() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/export`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'red-dirt-roasters-data.json';
            link.click();
            
            URL.revokeObjectURL(url);
        } else {
            alert('Failed to export data. Please try again.');
        }
    } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export data. Please check your connection and try again.');
    }
}

// Import website data
async function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file to import.');
        return;
    }

    try {
        const fileContent = await file.text();
        const importedData = JSON.parse(fileContent);
        
        if (!importedData.content) {
            alert('Invalid file format. Please check the file and try again.');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/admin/import`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ content: importedData.content })
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Data imported successfully! ${data.importedCount} fields imported.`);
            loadCurrentContent(); // Reload the form
        } else {
            const errorData = await response.json();
            alert(`Failed to import data: ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Import error:', error);
        alert('Error importing data. Please check the file format and try again.');
    }
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

// Upload images (placeholder for future implementation)
function uploadImages() {
    alert('Image upload functionality will be implemented in a future update.');
}

// Logout function
async function logout() {
    try {
        // Call logout endpoint
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear local state
        isLoggedIn = false;
        authToken = null;
        localStorage.removeItem('adminToken');
        location.reload();
    }
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

// Setup all event listeners
function setupEventListeners() {
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }

    // Tab navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });

    // Save content button
    const saveContentBtn = document.getElementById('saveContentBtn');
    if (saveContentBtn) {
        saveContentBtn.addEventListener('click', saveContent);
    }

    // Upload images button
    const uploadImagesBtn = document.getElementById('uploadImagesBtn');
    if (uploadImagesBtn) {
        uploadImagesBtn.addEventListener('click', uploadImages);
    }

    // Change password button
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', changePassword);
    }

    // Export data button
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }

    // Import data button
    const importDataBtn = document.getElementById('importDataBtn');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', importData);
    }

    // Save settings button
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
}
