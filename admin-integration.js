// Admin Integration Script
// This script connects the admin panel with the main website

let websiteData = {};

// Load website data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadWebsiteData();
    updateWebsiteContent();
    
    // Add admin link to navigation (only visible to admins)
    addAdminLink();
});

// Load data from admin system
function loadWebsiteData() {
    const savedData = localStorage.getItem('websiteData');
    if (savedData) {
        websiteData = JSON.parse(savedData);
    }
}

// Update website content with admin data
function updateWebsiteContent() {
    // Update page title
    if (websiteData.websiteTitle) {
        document.title = websiteData.websiteTitle;
    }
    
    // Update company name in navigation
    if (websiteData.companyName) {
        const navLogo = document.querySelector('.nav-logo h2');
        if (navLogo) {
            navLogo.textContent = websiteData.companyName;
        }
    }
    
    // Update hero section
    if (websiteData.heroHeading) {
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            heroTitle.textContent = websiteData.heroHeading;
        }
    }
    
    if (websiteData.heroSubtitle) {
        const heroSubtitle = document.querySelector('.hero p');
        if (heroSubtitle) {
            heroSubtitle.textContent = websiteData.heroSubtitle;
        }
    }
    
    if (websiteData.heroButton) {
        const heroButton = document.querySelector('.cta-button');
        if (heroButton) {
            heroButton.textContent = websiteData.heroButton;
        }
    }
    
    // Update about section
    if (websiteData.aboutTitle) {
        const aboutTitle = document.querySelector('.about h2');
        if (aboutTitle) {
            aboutTitle.textContent = websiteData.aboutTitle;
        }
    }
    
    if (websiteData.aboutStory1) {
        const aboutStory1 = document.querySelector('.about-text p:first-child');
        if (aboutStory1) {
            aboutStory1.textContent = websiteData.aboutStory1;
        }
    }
    
    if (websiteData.aboutStory2) {
        const aboutStory2 = document.querySelector('.about-text p:last-child');
        if (aboutStory2) {
            aboutStory2.textContent = websiteData.aboutStory2;
        }
    }
    
    // Update features
    if (websiteData.feature1Title) {
        const feature1Title = document.querySelector('.feature:nth-child(1) h3');
        if (feature1Title) {
            feature1Title.textContent = websiteData.feature1Title;
        }
    }
    
    if (websiteData.feature1Desc) {
        const feature1Desc = document.querySelector('.feature:nth-child(1) p');
        if (feature1Desc) {
            feature1Desc.textContent = websiteData.feature1Desc;
        }
    }
    
    if (websiteData.feature2Title) {
        const feature2Title = document.querySelector('.feature:nth-child(2) h3');
        if (feature2Title) {
            feature2Title.textContent = websiteData.feature2Title;
        }
    }
    
    if (websiteData.feature2Desc) {
        const feature2Desc = document.querySelector('.feature:nth-child(2) p');
        if (feature2Desc) {
            feature2Desc.textContent = websiteData.feature2Desc;
        }
    }
    
    if (websiteData.feature3Title) {
        const feature3Title = document.querySelector('.feature:nth-child(3) h3');
        if (feature3Title) {
            feature3Title.textContent = websiteData.feature3Title;
        }
    }
    
    if (websiteData.feature3Desc) {
        const feature3Desc = document.querySelector('.feature:nth-child(3) p');
        if (feature3Desc) {
            feature3Desc.textContent = websiteData.feature3Desc;
        }
    }
    
    // Update coffee products
    if (websiteData.lightRoastTitle) {
        const lightRoastTitle = document.querySelector('.coffee-card:nth-child(1) h3');
        if (lightRoastTitle) {
            lightRoastTitle.textContent = websiteData.lightRoastTitle;
        }
    }
    
    if (websiteData.lightRoastDesc) {
        const lightRoastDesc = document.querySelector('.coffee-card:nth-child(1) p');
        if (lightRoastDesc) {
            lightRoastDesc.textContent = websiteData.lightRoastDesc;
        }
    }
    
    if (websiteData.lightRoastPrice) {
        const lightRoastPrice = document.querySelector('.coffee-card:nth-child(1) .price');
        if (lightRoastPrice) {
            lightRoastPrice.textContent = websiteData.lightRoastPrice;
        }
    }
    
    if (websiteData.mediumRoastTitle) {
        const mediumRoastTitle = document.querySelector('.coffee-card:nth-child(2) h3');
        if (mediumRoastTitle) {
            mediumRoastTitle.textContent = websiteData.mediumRoastTitle;
        }
    }
    
    if (websiteData.mediumRoastDesc) {
        const mediumRoastDesc = document.querySelector('.coffee-card:nth-child(2) p');
        if (mediumRoastDesc) {
            mediumRoastDesc.textContent = websiteData.mediumRoastDesc;
        }
    }
    
    if (websiteData.mediumRoastPrice) {
        const mediumRoastPrice = document.querySelector('.coffee-card:nth-child(2) .price');
        if (mediumRoastPrice) {
            mediumRoastPrice.textContent = websiteData.mediumRoastPrice;
        }
    }
    
    if (websiteData.darkRoastTitle) {
        const darkRoastTitle = document.querySelector('.coffee-card:nth-child(3) h3');
        if (darkRoastTitle) {
            darkRoastTitle.textContent = websiteData.darkRoastTitle;
        }
    }
    
    if (websiteData.darkRoastDesc) {
        const darkRoastDesc = document.querySelector('.coffee-card:nth-child(3) p');
        if (darkRoastDesc) {
            darkRoastDesc.textContent = websiteData.darkRoastDesc;
        }
    }
    
    if (websiteData.darkRoastPrice) {
        const darkRoastPrice = document.querySelector('.coffee-card:nth-child(3) .price');
        if (darkRoastPrice) {
            darkRoastPrice.textContent = websiteData.darkRoastPrice;
        }
    }
    
    // Update contact information
    if (websiteData.contactAddress) {
        const addressLine = document.querySelector('.contact-info p:first-child');
        if (addressLine) {
            const addressText = addressLine.innerHTML;
            const newAddressText = addressText.replace(/123 Coffee Street/, websiteData.contactAddress);
            addressLine.innerHTML = newAddressText;
        }
    }
    
    if (websiteData.contactCity) {
        const cityLine = document.querySelector('.contact-info p:first-child');
        if (cityLine) {
            const cityText = cityLine.innerHTML;
            const newCityText = cityText.replace(/Oklahoma City, OK 73102/, websiteData.contactCity);
            cityLine.innerHTML = newCityText;
        }
    }
    
    if (websiteData.contactPhone) {
        const phoneLine = document.querySelector('.contact-info p:last-child');
        if (phoneLine) {
            const phoneText = phoneLine.innerHTML;
            const newPhoneText = phoneText.replace(/\(405\) 555-0123/, websiteData.contactPhone);
            phoneLine.innerHTML = newPhoneText;
        }
    }
    
    if (websiteData.contactEmail) {
        const emailLine = document.querySelector('.contact-info p:last-child');
        if (emailLine) {
            const emailText = emailLine.innerHTML;
            const newEmailText = emailText.replace(/info@reddirtroasters\.com/, websiteData.contactEmail);
            emailLine.innerHTML = newEmailText;
        }
    }
    
    // Update hours
    if (websiteData.contactHours1) {
        const hoursLine1 = document.querySelector('.contact-info p:nth-child(2)');
        if (hoursLine1) {
            const hoursText = hoursLine1.innerHTML;
            const newHoursText = hoursText.replace(/Monday - Friday: 7:00 AM - 6:00 PM/, websiteData.contactHours1);
            hoursLine1.innerHTML = newHoursText;
        }
    }
    
    if (websiteData.contactHours2) {
        const hoursLine2 = document.querySelector('.contact-info p:nth-child(2)');
        if (hoursLine2) {
            const hoursText = hoursLine2.innerHTML;
            const newHoursText = hoursText.replace(/Saturday: 8:00 AM - 4:00 PM/, websiteData.contactHours2);
            hoursLine2.innerHTML = newHoursText;
        }
    }
    
    if (websiteData.contactHours3) {
        const hoursLine3 = document.querySelector('.contact-info p:nth-child(2)');
        if (hoursLine3) {
            const hoursText = hoursLine3.innerHTML;
            const newHoursText = hoursText.replace(/Sunday: Closed/, websiteData.contactHours3);
            hoursLine3.innerHTML = newHoursText;
        }
    }
    
    // Update images if they exist
    updateImages();
}

// Update website images
function updateImages() {
    // Hero background image
    if (websiteData.heroImage) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundImage = `url(${websiteData.heroImage})`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }
    
    // About section image
    if (websiteData.aboutImage) {
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
    
    // Coffee product images
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
