// Admin Integration Script
// This script connects the admin panel with the main website

let websiteData = {};

// Load website data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadWebsiteData();
    
    // Add admin link to navigation (only visible to admins)
    addAdminLink();
});

// Load data from admin system via API
async function loadWebsiteData() {
    try {
        // Try to load from API first (no authentication needed for public content)
        const response = await fetch('/api/website/content');
        if (response.ok) {
            const data = await response.json();
            websiteData = data.content || {};
            console.log('✅ Loaded content from API:', websiteData);
        } else {
            console.warn('⚠️ Could not load from API, using fallback content');
            // Fallback to localStorage if API fails
            const savedData = localStorage.getItem('websiteData');
            if (savedData) {
                websiteData = JSON.parse(savedData);
            }
        }
        
        // Update the website content with loaded data
        updateWebsiteContent();
    } catch (error) {
        console.error('❌ Error loading website data:', error);
        // Fallback to localStorage if API fails
        const savedData = localStorage.getItem('websiteData');
        if (savedData) {
            websiteData = JSON.parse(savedData);
            updateWebsiteContent();
        }
    }
}

// Update website content with admin data
function updateWebsiteContent() {
    // Update page title
    if (websiteData.settings && websiteData.settings.website_title) {
        document.title = websiteData.settings.website_title;
    }
    
    // Update company name in navigation
    if (websiteData.settings && websiteData.settings.company_name) {
        const navLogo = document.querySelector('.nav-logo h2');
        if (navLogo) {
            navLogo.textContent = websiteData.settings.company_name;
        }
    }
    
    // Update hero section
    if (websiteData.hero && websiteData.hero.heading) {
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            heroTitle.textContent = websiteData.hero.heading;
        }
    }
    
    if (websiteData.hero && websiteData.hero.subtitle) {
        const heroSubtitle = document.querySelector('.hero p');
        if (heroSubtitle) {
            heroSubtitle.textContent = websiteData.hero.subtitle;
        }
    }
    
    if (websiteData.hero && websiteData.hero.button) {
        const heroButton = document.querySelector('.cta-button');
        if (heroButton) {
            heroButton.textContent = websiteData.hero.button;
        }
    }
    
    // Update about section
    if (websiteData.about && websiteData.about.title) {
        const aboutTitle = document.querySelector('.about h2');
        if (aboutTitle) {
            aboutTitle.textContent = websiteData.about.title;
        }
    }
    
    if (websiteData.about && websiteData.about.story1) {
        const aboutStory1 = document.querySelector('.about-text p:first-child');
        if (aboutStory1) {
            aboutStory1.textContent = websiteData.about.story1;
        }
    }
    
    if (websiteData.about && websiteData.about.story2) {
        const aboutStory2 = document.querySelector('.about-text p:last-child');
        if (aboutStory2) {
            aboutStory2.textContent = websiteData.about.story2;
        }
    }
    
    // Update features
    if (websiteData.features && websiteData.features.feature1_title) {
        const feature1Title = document.querySelector('.feature:nth-child(1) h3');
        if (feature1Title) {
            feature1Title.textContent = websiteData.features.feature1_title;
        }
    }
    
    if (websiteData.features && websiteData.features.feature1_desc) {
        const feature1Desc = document.querySelector('.feature:nth-child(1) p');
        if (feature1Desc) {
            feature1Desc.textContent = websiteData.features.feature1_desc;
        }
    }
    
    if (websiteData.features && websiteData.features.feature2_title) {
        const feature2Title = document.querySelector('.feature:nth-child(2) h3');
        if (feature2Title) {
            feature2Title.textContent = websiteData.features.feature2_title;
        }
    }
    
    if (websiteData.features && websiteData.features.feature2_desc) {
        const feature2Desc = document.querySelector('.feature:nth-child(2) p');
        if (feature2Desc) {
            feature2Desc.textContent = websiteData.features.feature2_desc;
        }
    }
    
    if (websiteData.features && websiteData.features.feature3_title) {
        const feature3Title = document.querySelector('.feature:nth-child(3) h3');
        if (feature3Title) {
            feature3Title.textContent = websiteData.features.feature3_title;
        }
    }
    
    if (websiteData.features && websiteData.features.feature3_desc) {
        const feature3Desc = document.querySelector('.feature:nth-child(3) p');
        if (feature3Desc) {
            feature3Desc.textContent = websiteData.features.feature3_desc;
        }
    }
    
    // Update coffee products
    if (websiteData.coffee && websiteData.coffee.light_roast_title) {
        const lightRoastTitle = document.querySelector('.coffee-card:nth-child(1) h3');
        if (lightRoastTitle) {
            lightRoastTitle.textContent = websiteData.coffee.light_roast_title;
        }
    }
    
    if (websiteData.coffee && websiteData.coffee.light_roast_desc) {
        const lightRoastDesc = document.querySelector('.coffee-card:nth-child(1) p');
        if (lightRoastDesc) {
            lightRoastDesc.textContent = websiteData.coffee.light_roast_desc;
        }
    }
    
    if (websiteData.coffee && websiteData.coffee.light_roast_price) {
        const lightRoastPrice = document.querySelector('.coffee-card:nth-child(1) .price');
        if (lightRoastPrice) {
            lightRoastPrice.textContent = websiteData.coffee.light_roast_price;
        }
    }
    
    if (websiteData.coffee && websiteData.coffee.medium_roast_title) {
        const mediumRoastTitle = document.querySelector('.coffee-card:nth-child(2) h3');
        if (mediumRoastTitle) {
            mediumRoastTitle.textContent = websiteData.coffee.medium_roast_title;
        }
    }
    
    if (websiteData.coffee && websiteData.coffee.medium_roast_desc) {
        const mediumRoastDesc = document.querySelector('.coffee-card:nth-child(2) p');
        if (mediumRoastDesc) {
            mediumRoastDesc.textContent = websiteData.coffee.medium_roast_desc;
        }
    }
    
    if (websiteData.coffee && websiteData.coffee.medium_roast_price) {
        const mediumRoastPrice = document.querySelector('.coffee-card:nth-child(2) .price');
        if (mediumRoastPrice) {
            mediumRoastPrice.textContent = websiteData.coffee.medium_roast_price;
        }
    }
    
    if (websiteData.coffee && websiteData.coffee.dark_roast_title) {
        const darkRoastTitle = document.querySelector('.coffee-card:nth-child(3) h3');
        if (darkRoastTitle) {
            darkRoastTitle.textContent = websiteData.coffee.dark_roast_title;
        }
    }
    
    if (websiteData.coffee && websiteData.coffee.dark_roast_desc) {
        const darkRoastDesc = document.querySelector('.coffee-card:nth-child(3) p');
        if (darkRoastDesc) {
            darkRoastDesc.textContent = websiteData.coffee.dark_roast_desc;
        }
    }
    
    if (websiteData.coffee && websiteData.coffee.dark_roast_price) {
        const darkRoastPrice = document.querySelector('.coffee-card:nth-child(3) .price');
        if (darkRoastPrice) {
            darkRoastPrice.textContent = websiteData.coffee.dark_roast_price;
        }
    }
    
    // Update contact information
    if (websiteData.contact && websiteData.contact.address) {
        const addressLine = document.querySelector('.contact-info p:first-child');
        if (addressLine) {
            const addressText = addressLine.innerHTML;
            const newAddressText = addressText.replace(/123 Coffee Street/, websiteData.contact.address);
            addressLine.innerHTML = newAddressText;
        }
    }
    
    if (websiteData.contact && websiteData.contact.city) {
        const cityLine = document.querySelector('.contact-info p:first-child');
        if (cityLine) {
            const cityText = cityLine.innerHTML;
            const newCityText = cityText.replace(/Oklahoma City, OK 73102/, websiteData.contact.city);
            cityLine.innerHTML = newCityText;
        }
    }
    
    if (websiteData.contact && websiteData.contact.phone) {
        const phoneLine = document.querySelector('.contact-info p:last-child');
        if (phoneLine) {
            const phoneText = phoneLine.innerHTML;
            const newPhoneText = phoneText.replace(/\(405\) 555-0123/, websiteData.contact.phone);
            phoneLine.innerHTML = newPhoneText;
        }
    }
    
    if (websiteData.contact && websiteData.contact.email) {
        const emailLine = document.querySelector('.contact-info p:last-child');
        if (emailLine) {
            const emailText = emailLine.innerHTML;
            const newEmailText = emailText.replace(/info@reddirtroasters\.com/, websiteData.contact.email);
            emailLine.innerHTML = newEmailText;
        }
    }
    
    // Update hours
    if (websiteData.contact && websiteData.contact.hours1) {
        const hoursLine1 = document.querySelector('.contact-info p:nth-child(2)');
        if (hoursLine1) {
            const hoursText = hoursLine1.innerHTML;
            const newHoursText = hoursText.replace(/Monday - Friday: 7:00 AM - 6:00 PM/, websiteData.contact.hours1);
            hoursLine1.innerHTML = newHoursText;
        }
    }
    
    if (websiteData.contact && websiteData.contact.hours2) {
        const hoursLine2 = document.querySelector('.contact-info p:nth-child(2)');
        if (hoursLine2) {
            const hoursText = hoursLine2.innerHTML;
            const newHoursText = hoursText.replace(/Saturday: 8:00 AM - 4:00 PM/, websiteData.contact.hours2);
            hoursLine2.innerHTML = newHoursText;
        }
    }
    
    if (websiteData.contact && websiteData.contact.hours3) {
        const hoursLine3 = document.querySelector('.contact-info p:nth-child(2)');
        if (hoursLine3) {
            const hoursText = hoursLine3.innerHTML;
            const newHoursText = hoursText.replace(/Sunday: Closed/, websiteData.contact.hours3);
            hoursLine3.innerHTML = newHoursText;
        }
    }
    
    // Update images if they exist
    updateImages();
}

// Update website images
function updateImages() {
    // Check if we have images from the database
    if (websiteData.images && Array.isArray(websiteData.images)) {
        websiteData.images.forEach(image => {
            // Hero background image
            if (image.section === 'hero' && image.field === 'background') {
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    heroSection.style.backgroundImage = `url(${image.path})`;
                    heroSection.style.backgroundSize = 'cover';
                    heroSection.style.backgroundPosition = 'center';
                }
            }
            
            // About section image
            if (image.section === 'about' && image.field === 'image') {
                const aboutSection = document.querySelector('.about');
                if (aboutSection) {
                    // Create image element if it doesn't exist
                    let aboutImg = aboutSection.querySelector('.about-image');
                    if (!aboutImg) {
                        aboutImg = document.createElement('div');
                        aboutImg.className = 'about-image';
                        aboutImg.style.cssText = `
                            width: 300px;
                            height: 300px;
                            background-image: url(${image.path});
                            background-size: cover;
                            background-position: center;
                            border-radius: 15px;
                            margin: 2rem auto;
                        `;
                        aboutSection.querySelector('.about-content').appendChild(aboutImg);
                    } else {
                        aboutImg.style.backgroundImage = `url(${image.path})`;
                    }
                }
            }
            
            // Coffee product images
            if (image.section === 'coffee') {
                if (image.field === 'light_roast_image') {
                    const lightRoastImg = document.querySelector('.light-roast');
                    if (lightRoastImg) {
                        lightRoastImg.style.backgroundImage = `url(${image.path})`;
                        lightRoastImg.style.backgroundSize = 'cover';
                        lightRoastImg.style.backgroundPosition = 'center';
                    }
                }
                
                if (image.field === 'medium_roast_image') {
                    const mediumRoastImg = document.querySelector('.medium-roast');
                    if (mediumRoastImg) {
                        mediumRoastImg.style.backgroundImage = `url(${image.path})`;
                        mediumRoastImg.style.backgroundSize = 'cover';
                        mediumRoastImg.style.backgroundPosition = 'center';
                    }
                }
                
                if (image.field === 'dark_roast_image') {
                    const darkRoastImg = document.querySelector('.dark-roast');
                    if (darkRoastImg) {
                        darkRoastImg.style.backgroundImage = `url(${image.path})`;
                        darkRoastImg.style.backgroundSize = 'cover';
                        darkRoastImg.style.backgroundPosition = 'center';
                    }
                }
            }
        });
    }
    
    // Fallback to old image system for backward compatibility
    if (websiteData.heroImage) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundImage = `url(${websiteData.heroImage})`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }
    
    if (websiteData.aboutImage) {
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            let aboutImg = aboutSection.querySelector('.about-image');
            if (!aboutImg) {
                aboutImg = document.createElement('div');
                aboutImg.className = 'about-image';
                aboutImg.style.cssText = `
                    width: 300px;
                    height: 300px;
                    background-image: url(${websiteData.aboutImage});
                    background-size: cover;
                    background-position: center;
                    border-radius: 15px;
                    margin: 2rem auto;
                `;
                aboutSection.querySelector('.about-content').appendChild(aboutImg);
            } else {
                aboutImg.style.backgroundImage = `url(${websiteData.aboutImage})`;
            }
        }
    }
    
    if (websiteData.lightRoastImage) {
        const lightRoastImg = document.querySelector('.light-roast');
        if (lightRoastImg) {
            lightRoastImg.style.backgroundImage = `url(${websiteData.lightRoastImage})`;
            lightRoastImg.style.backgroundSize = 'cover';
            lightRoastImg.style.backgroundPosition = 'center';
        }
    }
    
    if (websiteData.mediumRoastImage) {
        const mediumRoastImg = document.querySelector('.medium-roast');
        if (mediumRoastImg) {
            mediumRoastImg.style.backgroundImage = `url(${websiteData.mediumRoastImage})`;
            mediumRoastImg.style.backgroundSize = 'cover';
            mediumRoastImg.style.backgroundPosition = 'center';
        }
    }
    
    if (websiteData.darkRoastImage) {
        const darkRoastImg = document.querySelector('.dark-roast');
        if (darkRoastImg) {
            darkRoastImg.style.backgroundImage = `url(${websiteData.darkRoastImage})`;
            darkRoastImg.style.backgroundSize = 'cover';
            darkRoastImg.style.backgroundPosition = 'center';
        }
    }
}

// Add admin link to navigation
function addAdminLink() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const adminLink = document.createElement('li');
        adminLink.innerHTML = '<a href="admin.html" target="_blank">Admin</a>';
        adminLink.style.cssText = 'opacity: 0.7; font-size: 0.9rem;';
        navMenu.appendChild(adminLink);
    }
}

// Listen for storage changes to update content in real-time
window.addEventListener('storage', function(e) {
    if (e.key === 'websiteData') {
        loadWebsiteData();
        updateWebsiteContent();
    }
});

// Function to manually refresh content (can be called from admin panel)
function refreshWebsiteContent() {
    loadWebsiteData();
    updateWebsiteContent();
}

// Make refresh function globally available
window.refreshWebsiteContent = refreshWebsiteContent;
