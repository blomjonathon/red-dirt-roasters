// Client-side Admin Panel JavaScript
// This file runs in the browser and communicates with the server via API calls

class AdminPanel {
    constructor() {
        this.token = localStorage.getItem('adminToken');
        this.apiBase = '/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadContent();
    }

    setupEventListeners() {
        // Login
        document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Content management
        document.getElementById('saveContentBtn').addEventListener('click', () => this.saveContent());
        
        // Image management
        document.getElementById('uploadImagesBtn').addEventListener('click', () => this.uploadImages());
        
        // Settings
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('changePasswordBtn').addEventListener('click', () => this.changePassword());
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn').addEventListener('click', () => this.importData());

        // Logout (add logout button if needed)
        this.addLogoutButton();
    }

    addLogoutButton() {
        const header = document.querySelector('.admin-header');
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.className = 'logout-btn';
        logoutBtn.addEventListener('click', () => this.logout());
        header.appendChild(logoutBtn);
    }

    async handleLogin() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        if (!email || !password) {
            this.showMessage('Please enter both email and password', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('adminToken', this.token);
                this.showMessage('Login successful!', 'success');
                this.showAdminPanel();
                this.loadContent();
            } else {
                this.showMessage(data.error || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Login failed. Please try again.', 'error');
        }
    }

    checkAuthStatus() {
        if (this.token) {
            this.showAdminPanel();
        } else {
            this.showLoginSection();
        }
    }

    showLoginSection() {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
    }

    showAdminPanel() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        // Add active class to clicked button
        event.target.classList.add('active');
    }

    async loadContent() {
        if (!this.token) return;

        try {
            const response = await fetch(`${this.apiBase}/admin/content`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.populateFormFields(data.content);
            } else {
                console.error('Failed to load content');
            }
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    populateFormFields(content) {
        // Hero Section
        if (content.hero) {
            if (content.hero.heading) document.getElementById('heroHeading').value = content.hero.heading;
            if (content.hero.subtitle) document.getElementById('heroSubtitle').value = content.hero.subtitle;
            if (content.hero.button) document.getElementById('heroButton').value = content.hero.button;
        }

        // About Section
        if (content.about) {
            if (content.about.title) document.getElementById('aboutTitle').value = content.about.title;
            if (content.about.story1) document.getElementById('aboutStory1').value = content.about.story1;
            if (content.about.story2) document.getElementById('aboutStory2').value = content.about.story2;
        }

        // Features
        if (content.features) {
            if (content.features.feature1_title) document.getElementById('feature1Title').value = content.features.feature1_title;
            if (content.features.feature1_desc) document.getElementById('feature1Desc').value = content.features.feature1_desc;
            if (content.features.feature2_title) document.getElementById('feature2Title').value = content.features.feature2_title;
            if (content.features.feature2_desc) document.getElementById('feature2Desc').value = content.features.feature2_desc;
            if (content.features.feature3_title) document.getElementById('feature3Title').value = content.features.feature3_title;
            if (content.features.feature3_desc) document.getElementById('feature3Desc').value = content.features.feature3_desc;
        }

        // Coffee Products
        if (content.coffee) {
            if (content.coffee.light_roast_title) document.getElementById('lightRoastTitle').value = content.coffee.light_roast_title;
            if (content.coffee.light_roast_desc) document.getElementById('lightRoastDesc').value = content.coffee.light_roast_desc;
            if (content.coffee.light_roast_price) document.getElementById('lightRoastPrice').value = content.coffee.light_roast_price;
            if (content.coffee.medium_roast_title) document.getElementById('mediumRoastTitle').value = content.coffee.medium_roast_title;
            if (content.coffee.medium_roast_desc) document.getElementById('mediumRoastDesc').value = content.coffee.medium_roast_desc;
            if (content.coffee.medium_roast_price) document.getElementById('mediumRoastPrice').value = content.coffee.medium_roast_price;
            if (content.coffee.dark_roast_title) document.getElementById('darkRoastTitle').value = content.coffee.dark_roast_title;
            if (content.coffee.dark_roast_desc) document.getElementById('darkRoastDesc').value = content.coffee.dark_roast_desc;
            if (content.coffee.dark_roast_price) document.getElementById('darkRoastPrice').value = content.coffee.dark_roast_price;
        }

        // Contact Information
        if (content.contact) {
            if (content.contact.address) document.getElementById('contactAddress').value = content.contact.address;
            if (content.contact.city) document.getElementById('contactCity').value = content.contact.city;
            if (content.contact.phone) document.getElementById('contactPhone').value = content.contact.phone;
            if (content.contact.email) document.getElementById('contactEmail').value = content.contact.email;
            if (content.contact.hours1) document.getElementById('contactHours1').value = content.contact.hours1;
            if (content.contact.hours2) document.getElementById('contactHours2').value = content.contact.hours2;
            if (content.contact.hours3) document.getElementById('contactHours3').value = content.contact.hours3;
        }

        // Settings
        if (content.settings) {
            if (content.settings.website_title) document.getElementById('websiteTitle').value = content.settings.website_title;
            if (content.settings.company_name) document.getElementById('companyName').value = content.settings.company_name;
        }
    }

    async saveContent() {
        if (!this.token) return;

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

        try {
            const response = await fetch(`${this.apiBase}/admin/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                this.showMessage('Content saved successfully!', 'success');
            } else {
                const data = await response.json();
                this.showMessage(data.error || 'Failed to save content', 'error');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            this.showMessage('Failed to save content. Please try again.', 'error');
        }
    }

    async uploadImages() {
        // Image upload functionality would go here
        this.showMessage('Image upload functionality coming soon!', 'info');
    }

    async saveSettings() {
        // Settings save functionality would go here
        this.showMessage('Settings saved!', 'success');
    }

    async changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        if (!currentPassword || !newPassword) {
            this.showMessage('Please enter both current and new passwords', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Password changed successfully!', 'success');
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
            } else {
                this.showMessage(data.error || 'Failed to change password', 'error');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            this.showMessage('Failed to change password. Please try again.', 'error');
        }
    }

    async exportData() {
        try {
            const response = await fetch(`${this.apiBase}/admin/export`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'red-dirt-roasters-data.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                this.showMessage('Data exported successfully!', 'success');
            } else {
                this.showMessage('Failed to export data', 'error');
            }
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showMessage('Failed to export data. Please try again.', 'error');
        }
    }

    async importData() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];

        if (!file) {
            this.showMessage('Please select a file to import', 'error');
            return;
        }

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.content) {
                this.showMessage('Invalid file format', 'error');
                return;
            }

            const response = await fetch(`${this.apiBase}/admin/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ content: data.content })
            });

            if (response.ok) {
                this.showMessage('Data imported successfully!', 'success');
                this.loadContent(); // Reload the form with new data
                fileInput.value = ''; // Clear the file input
            } else {
                const responseData = await response.json();
                this.showMessage(responseData.error || 'Failed to import data', 'error');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            this.showMessage('Failed to import data. Please try again.', 'error');
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('adminToken');
        this.showLoginSection();
        this.showMessage('Logged out successfully', 'success');
    }

    showMessage(message, type = 'info') {
        // Create a simple message display
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Add to the page
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
}

// Initialize the admin panel when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});