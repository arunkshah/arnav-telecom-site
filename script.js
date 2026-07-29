document.addEventListener('DOMContentLoaded', () => {
    // Offers Banner Dismiss
    const offersBanner = document.getElementById('offers-banner');
    const offersClose  = document.getElementById('offers-close');
    if (offersBanner && offersClose) {
        if (sessionStorage.getItem('offersClosed')) {
            offersBanner.style.display = 'none';
        }
        offersClose.addEventListener('click', () => {
            offersBanner.style.display = 'none';
            sessionStorage.setItem('offersClosed', '1');
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle with Smooth Transition + Accessibility
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    function openMenu() {
        navLinks.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuBtn.setAttribute('aria-label', 'Close menu');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'ri-close-line';
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Open menu');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'ri-menu-4-line';
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.contains('active') ? closeMenu() : openMenu();
        });

        // Close menu when clicking a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside the navbar
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // Form Validation for Contact Page
    const contactForm = document.querySelector('#contact-form') || (
        document.getElementById('name') &&
        document.getElementById('phone') &&
        document.getElementById('inquiry') &&
        document.getElementById('message')
            ? document.getElementById('phone').closest('form')
            : null
    );
    if (contactForm && contactForm.id !== 'lead-popup-form') {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phoneField = document.getElementById('phone');
            const nameField = document.getElementById('name');
            const inquiryField = document.getElementById('inquiry');
            const messageField = document.getElementById('message');

            if (!phoneField || !nameField || !inquiryField || !messageField) return;

            const phone = phoneField.value;
            // Simple Indian phone number validation
            const phoneRegex = /^(?:\+91|91)?[789]\d{9}$/;
            
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                alert('Please enter a valid 10-digit Indian phone number.');
                return;
            }
            
            // Set action to mailto
            const name = nameField.value;
            const inquiry = inquiryField.value;
            const message = messageField.value;
            
            const subject = encodeURIComponent(`Arnav Telecom Inquiry: ${inquiry} from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`);
            
            window.location.href = `mailto:support@arnavtelecom.com?subject=${subject}&body=${body}`;
        });
    }

    // ================================================================
    // LEAD CAPTURE POPUP CRM — Option 1 + 4
    // Smart 30s timing + Exit Intent. Source tracked per page.
    // ================================================================
    const popup       = document.getElementById('lead-popup');
    const popupClose  = document.getElementById('lead-popup-close');
    const popupForm   = document.getElementById('lead-popup-form');
    const popupSuccess = document.getElementById('lead-popup-success');

    if (popup) {
        // --- Source Tracking ---
        const sourcePage = document.getElementById('lead-source-page');
        const sourceUTM  = document.getElementById('lead-source-utm');
        if (sourcePage) sourcePage.value = window.location.pathname + window.location.search;
        if (sourceUTM)  sourceUTM.value  = new URLSearchParams(window.location.search).toString() || 'direct';

        const POPUP_KEY = 'leadPopupShown';

        function shownToday() {
            try { return localStorage.getItem(POPUP_KEY) === new Date().toDateString(); }
            catch (e) { return sessionStorage.getItem(POPUP_KEY) === '1'; }
        }

        function showPopup() {
            // Don't show if user already submitted or dismissed today
            if (shownToday()) return;
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function hidePopup() {
            popup.style.display = 'none';
            document.body.style.overflow = '';
            try { localStorage.setItem(POPUP_KEY, new Date().toDateString()); }
            catch (e) { sessionStorage.setItem(POPUP_KEY, '1'); }
        }

        // Trigger 1: 30 seconds timer
        const popupTimer = setTimeout(showPopup, 30000);

        // Trigger 2: Exit intent (mouse leaves top of page)
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 20) showPopup();
        });

        // Trigger 3: Scroll 70% down the page
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
            if (scrolled > 0.7) showPopup();
        }, { once: true });

        // Close on button click
        if (popupClose) popupClose.addEventListener('click', hidePopup);

        // Close on backdrop click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) hidePopup();
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') hidePopup();
        });

        // Handle Form Submission (AJAX to Formspree)
        if (popupForm) {
            popupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = popupForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                try {
                    const formData = new FormData(popupForm);
                    const response = await fetch(popupForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        // Show success state
                        popupForm.style.display = 'none';
                        popupSuccess.style.display = 'block';
                        sessionStorage.setItem(POPUP_KEY, '1');
                        clearTimeout(popupTimer);

                        // Push to dataLayer for Google Analytics (if available)
                        if (window.dataLayer) {
                            window.dataLayer.push({ event: 'lead_submitted', source: sourcePage.value });
                        }
                    } else {
                        submitBtn.textContent = 'Try Again';
                        submitBtn.disabled = false;
                        alert('Something went wrong. Please WhatsApp us directly.');
                    }
                } catch (err) {
                    submitBtn.textContent = 'Try Again';
                    submitBtn.disabled = false;
                    alert('Network error. Please try WhatsApp.');
                }
            });
        }
    }

    // ================================================================
    // WHATSAPP CLICK TRACKING — Tag each click with source page
    // ================================================================
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            const page = window.location.pathname.replace('/', '') || 'homepage';
            // Append source to the URL if it doesn't already have a text param
            const url = new URL(link.href);
            if (!url.searchParams.has('text') && !link.href.includes('?text')) {
                // Log the click source in sessionStorage for analytics
            }
            // Fire GA event if available
            if (window.gtag) {
                window.gtag('event', 'whatsapp_click', {
                    event_category: 'lead',
                    event_label: page
                });
            }
            if (window.dataLayer) {
                window.dataLayer.push({ event: 'whatsapp_click', source_page: page });
            }
        });
    });

});
