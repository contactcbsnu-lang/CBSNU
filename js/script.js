// ===== 1. INITIALIZE LIBRARIES =====
// Initialize EmailJS with your Public ID
// This runs first, outside of any listener.
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: "DqEZGom9bxso5B5Zl",
        });
    }
})();


// ===== 2. MAIN DOM CONTENT LISTENER =====
// This single listener wraps ALL the code that interacts with the page.
document.addEventListener('DOMContentLoaded', () => {

    // ===== 2a. THEME SWITCHER CODE (This runs on every page) =====
    const themeRouge = document.getElementById('theme-rouge');
    const themeEmber = document.getElementById('theme-ember');
    const themeMidnight = document.getElementById('theme-midnight');
    const themeGold = document.getElementById('theme-gold');
    const themeTeal = document.getElementById('theme-teal');
    const themePlatinum = document.getElementById('theme-platinum');
    const themePwYellow = document.getElementById('theme-pw-yellow');
    const body = document.body;

    const setTheme = (theme) => {
        body.dataset.theme = theme;
        localStorage.setItem('cbsnu-theme', theme);
    };

    if (themeRouge) themeRouge.addEventListener('click', () => setTheme('deep-rouge'));
    if (themeEmber) themeEmber.addEventListener('click', () => setTheme('warm-ember'));
    if (themeMidnight) themeMidnight.addEventListener('click', () => setTheme('coastal-midnight'));
    if (themeGold) themeGold.addEventListener('click', () => setTheme('theme-gold'));
    if (themeTeal) themeTeal.addEventListener('click', () => setTheme('theme-teal'));
    if (themePlatinum) themePlatinum.addEventListener('click', () => setTheme('theme-platinum'));
    if (themePwYellow) themePwYellow.addEventListener('click', () => setTheme('pw-yellow'));

    const savedTheme = localStorage.getItem('cbsnu-theme');
    if (savedTheme) {
        body.dataset.theme = savedTheme;
    } else {
        body.dataset.theme = 'coastal-midnight'; // Default theme
    }

    // ===== 2b. RESPONSIVE NAVBAR CODE =====
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    const dropdowns = document.querySelectorAll('.nav-menu .dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                dropdown.parentElement.classList.toggle('active');
            }
        });
    });

    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                loginBtn.parentElement.classList.toggle('active');
            }
        });
    }

    // ===== 2c. BANNER CAROUSEL CODE (INDEX.HTML) =====
    const track = document.querySelector('.carousel-track');
    if (track) {
        const prevButton = document.getElementById('carousel-prev');
        const nextButton = document.getElementById('carousel-next');
        let slides = Array.from(track.children);
        const originalSlidesCount = slides.length; 
        
        let slidesVisible = (window.innerWidth <= 900) ? 1 : 3;
        let currentIndex = slidesVisible;
        let isMoving = false;
        let slideTimer;

        function setupCarousel() {
            // Clear old clones
            slides.forEach(slide => {
                if (slide.classList.contains('clone')) {
                    track.removeChild(slide);
                }
            });
            slides = Array.from(track.children).filter(slide => !slide.classList.contains('clone'));
            
            // Re-check visibility and count
            slidesVisible = (window.innerWidth <= 900) ? 1 : 3;
            if (originalSlidesCount <= slidesVisible) return; // Not enough slides to clone
            
            // Add new clones
            for (let i = 0; i < slidesVisible; i++) {
                const clone = slides[i].cloneNode(true);
                clone.classList.add('clone');
                track.appendChild(clone);
            }
            for (let i = originalSlidesCount - slidesVisible; i < originalSlidesCount; i++) {
                const clone = slides[i].cloneNode(true);
                clone.classList.add('clone');
                track.insertBefore(clone, slides[0]);
            }

            slides = Array.from(track.children);
            currentIndex = slidesVisible;
            track.style.transition = 'none';
            updateSlidePosition();
        }

        function updateSlidePosition() {
            if (slides.length === 0) return; // Fix for pages without this element
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }

        function moveSlide(direction) {
            if (isMoving || originalSlidesCount <= slidesVisible) return;
            isMoving = true;
            currentIndex += direction;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateSlidePosition();
            startSlideTimer();
        }

        function autoSlide() { moveSlide(1); }
        function startSlideTimer() {
            clearTimeout(slideTimer);
            slideTimer = setTimeout(autoSlide, 1000); // 1 sec
        }

        track.addEventListener('transitionend', () => {
            isMoving = false;
            if (originalSlidesCount <= slidesVisible) return;
            if (currentIndex >= originalSlidesCount + slidesVisible) {
                currentIndex = slidesVisible;
                track.style.transition = 'none';
                updateSlidePosition();
            }
            if (currentIndex <= slidesVisible - 1) {
                currentIndex = originalSlidesCount + slidesVisible - 1;
                track.style.transition = 'none';
                updateSlidePosition();
            }
        });

        if (nextButton) nextButton.addEventListener('click', () => moveSlide(1));
        if (prevButton) prevButton.addEventListener('click', () => moveSlide(-1));
        window.addEventListener('resize', () => { setupCarousel(); });
        
        if (originalSlidesCount > 0) {
            setupCarousel();
            startSlideTimer();
        }
    }

    // ===== 2d. CLIENTS SLIDER CODE (Collaborators) =====
    const clientTrack = document.querySelector('.collaborator-track');
    if (clientTrack) {
        // Hardcoded clients array is now inside the code block
        const clients = [
          { "name": "Mentora Edge", "logo": "image/client-logo/mentora.png", "type": "Institute Partner" },
          { "name": "", "logo": "image/client-logo/client1.png", "type": "" },
          { "name": "", "logo": "image/client-logo/client2.png", "type": "" },
          { "name": "", "logo": "image/client-logo/client3.png", "type": "" },
          { "name": "", "logo": "image/client-logo/client4.png", "type": "" },
          { "name": "", "logo": "image/client-logo/client5.png", "type": "" }
        ];

        clients.forEach(client => {
            const slideHTML = `
                <div class="collaborator-slide">
                    <img src="${client.logo}" alt="${client.name} Logo">
                    <h3>${client.name}</h3>
                    <p>${client.type}</p>
                </div>
            `;
            clientTrack.innerHTML += slideHTML;
        });
        
        setupClientSlider();

        function setupClientSlider() {
            const clientPrevButton = document.getElementById('client-prev');
            const clientNextButton = document.getElementById('client-next');
            let clientSlides = Array.from(clientTrack.children);
            const originalClientSlidesCount = clientSlides.length;
            
            if (originalClientSlidesCount === 0) return;

            let clientSlidesVisible = (window.innerWidth <= 900) ? 1 : 6;
            let clientCurrentIndex = clientSlidesVisible;
            let clientIsMoving = false;
            let clientSlideTimer;

            function setupClientClones() {
                clientSlides.forEach(slide => {
                    if (slide.classList.contains('clone')) {
                        clientTrack.removeChild(slide);
                    }
                });

                clientSlides = Array.from(clientTrack.children);
                clientSlidesVisible = (window.innerWidth <= 900) ? 1 : (originalClientSlidesCount < 6 ? originalClientSlidesCount : 6);

                if (originalClientSlidesCount <= clientSlidesVisible) return;

                for (let i = 0; i < clientSlidesVisible; i++) {
                    const clone = clientSlides[i].cloneNode(true);
                    clone.classList.add('clone');
                    clientTrack.appendChild(clone);
                }
                for (let i = originalClientSlidesCount - slidesVisible; i < originalClientSlidesCount; i++) {
                    const clone = clientSlides[i].cloneNode(true);
                    clone.classList.add('clone');
                    clientTrack.insertBefore(clone, clientSlides[0]);
                }

                clientSlides = Array.from(clientTrack.children);
                clientCurrentIndex = slidesVisible;
                clientTrack.style.transition = 'none';
                updateClientSlidePosition();
            }

            function updateClientSlidePosition() {
                if (clientSlides.length === 0) return;
                const slideWidth = clientSlides[0].getBoundingClientRect().width;
                clientTrack.style.transform = `translateX(-${clientCurrentIndex * slideWidth}px)`;
            }

            function moveClientSlide(direction) {
                if (clientIsMoving || originalClientSlidesCount <= clientSlidesVisible) return;
                clientIsMoving = true;
                clientCurrentIndex += direction;
                clientTrack.style.transition = 'transform 0.5s ease-in-out';
                updateClientSlidePosition();
                startClientSlideTimer();
            }

            function autoClientSlide() { moveClientSlide(1); }
            function startClientSlideTimer() {
                clearTimeout(clientSlideTimer);
                clientSlideTimer = setTimeout(autoClientSlide, 2000); // 2 sec
            }

            clientTrack.addEventListener('transitionend', () => {
                isMoving = false;
                if (originalClientSlidesCount <= clientSlidesVisible) return;
                if (clientCurrentIndex >= originalClientSlidesCount + clientSlidesVisible) {
                    clientCurrentIndex = slidesVisible;
                    clientTrack.style.transition = 'none';
                    updateClientSlidePosition();
                }
                if (clientCurrentIndex <= slidesVisible - 1) {
                    clientCurrentIndex = originalClientSlidesCount + slidesVisible - 1;
                    clientTrack.style.transition = 'none';
                    updateClientSlidePosition();
                }
            });

            if (clientNextButton) clientNextButton.addEventListener('click', () => moveClientSlide(1));
            if (clientPrevButton) clientPrevButton.addEventListener('click', () => moveClientSlide(-1));
            window.addEventListener('resize', setupClientClones);
            
            if (originalClientSlidesCount > 0) {
                setupClientClones();
                startClientSlideTimer();
            }
        }
    }

    // ===== 2e. STATS COUNTER CODE (INDEX.HTML) =====
    const statsSection = document.querySelector('.stats-counter-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false; 

    if (statsSection) { // Only run if stats section exists
        const startCounter = (el) => {
            const target = parseInt(el.dataset.target, 10);
            let count = 0;
            const speed = 200; 

            const updateCount = () => {
                const increment = target / speed;
                if (count < target) {
                    count += increment;
                    el.innerText = Math.ceil(count);
                    setTimeout(updateCount, 10);
                } else {
                    el.innerText = target;
                }
            };
            updateCount();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    statNumbers.forEach(startCounter);
                    hasAnimated = true;
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // ===== 2f. TOPPERS SLIDER CODE (INDEX.HTML) =====
    const topperTrack = document.querySelector('.topper-track');
    if (topperTrack) {
        const topperPrevButton = document.getElementById('topper-prev');
        const topperNextButton = document.getElementById('topper-next');
        let topperSlides = Array.from(topperTrack.children);
        const originalTopperSlidesCount = topperSlides.length;
        
        let topperSlidesVisible = (window.innerWidth <= 900) ? 2 : 5;
        let topperCurrentIndex = topperSlidesVisible;
        let topperIsMoving = false;
        let topperSlideTimer;

        function setupTopperClones() {
            topperSlides.forEach(slide => {
                if (slide.classList.contains('clone')) {
                    topperTrack.removeChild(slide);
                }
            });

            topperSlides = Array.from(topperTrack.children);
            topperSlidesVisible = (window.innerWidth <= 900) ? 2 : 5;
            if (originalTopperSlidesCount <= topperSlidesVisible) return;

            for (let i = 0; i < topperSlidesVisible; i++) {
                const clone = topperSlides[i].cloneNode(true);
                clone.classList.add('clone');
                topperTrack.appendChild(clone);
            }
            for (let i = originalTopperSlidesCount - slidesVisible; i < originalTopperSlidesCount; i++) {
                const clone = topperSlides[i].cloneNode(true);
                clone.classList.add('clone');
                topperTrack.insertBefore(clone, topperSlides[0]);
            }

            topperSlides = Array.from(topperTrack.children);
            topperCurrentIndex = slidesVisible;
            topperTrack.style.transition = 'none';
            updateTopperSlidePosition();
        }

        function updateTopperSlidePosition() {
            if (topperSlides.length === 0) return;
            const slideWidth = topperSlides[0].getBoundingClientRect().width;
            topperTrack.style.transform = `translateX(-${topperCurrentIndex * slideWidth}px)`;
        }

        function moveTopperSlide(direction) {
            if (topperIsMoving || originalTopperSlidesCount <= topperSlidesVisible) return;
            topperIsMoving = true;
            topperCurrentIndex += direction;
            topperTrack.style.transition = 'transform 0.5s ease-in-out';
            updateTopperSlidePosition();
            startTopperSlideTimer();
        }

        function autoTopperSlide() { moveTopperSlide(1); }
        function startTopperSlideTimer() {
            clearTimeout(topperSlideTimer);
            topperSlideTimer = setTimeout(autoTopperSlide, 1000); // 1 sec
        }

        topperTrack.addEventListener('transitionend', () => {
            topperIsMoving = false;
            if (originalTopperSlidesCount <= topperSlidesVisible) return;
            if (topperCurrentIndex >= originalTopperSlidesCount + topperSlidesVisible) {
                topperCurrentIndex = slidesVisible;
                topperTrack.style.transition = 'none';
                updateTopperSlidePosition();
            }
            if (topperCurrentIndex <= slidesVisible - 1) {
                topperCurrentIndex = originalTopperSlidesCount + slidesVisible - 1;
                topperTrack.style.transition = 'none';
                updateTopperSlidePosition();
            }
        });

        if(topperNextButton) topperNextButton.addEventListener('click', () => moveTopperSlide(1));
        if(topperPrevButton) topperPrevButton.addEventListener('click', () => moveTopperSlide(-1));
        window.addEventListener('resize', setupTopperClones);
        
        if (originalTopperSlidesCount > 0) {
            setupTopperClones();
            startTopperSlideTimer();
        }
    }

    // ===== 2g. TESTIMONIALS SLIDER CODE (INDEX.HTML) =====
    const testimonialTrack = document.querySelector('.testimonial-track');
    if (testimonialTrack) {
        const testimonialPrevButton = document.getElementById('testimonial-prev');
        const testimonialNextButton = document.getElementById('testimonial-next');
        let testimonialSlides = Array.from(testimonialTrack.children);
        const originalTestimonialSlidesCount = testimonialSlides.length; // <-- TYPO FIXED
        
        let slidesVisible = 1;
        let testimonialCurrentIndex = slidesVisible;
        let testimonialIsMoving = false;
        let testimonialSlideTimer;

        function setupTestimonialClones() {
            testimonialSlides.forEach(slide => {
                if (slide.classList.contains('clone')) {
                    testimonialTrack.removeChild(slide);
                }
            });

            testimonialSlides = Array.from(testimonialTrack.children);
            if (originalTestimonialSlidesCount <= slidesVisible) return;

            for (let i = 0; i < slidesVisible; i++) {
                const clone = testimonialSlides[i].cloneNode(true);
                clone.classList.add('clone');
                testimonialTrack.appendChild(clone);
            }
            for (let i = originalTestimonialSlidesCount - slidesVisible; i < originalTestimonialSlidesCount; i++) {
                const clone = testimonialSlides[i].cloneNode(true);
                clone.classList.add('clone');
                testimonialTrack.insertBefore(clone, testimonialSlides[0]);
            }

            testimonialSlides = Array.from(testimonialTrack.children);
            testimonialCurrentIndex = slidesVisible;
            testimonialTrack.style.transition = 'none';
            updateTestimonialSlidePosition();
        }

        function updateTestimonialSlidePosition() {
            if (testimonialSlides.length === 0) return;
            const slideWidth = testimonialSlides[0].getBoundingClientRect().width;
            testimonialTrack.style.transform = `translateX(-${testimonialCurrentIndex * slideWidth}px)`;
        }

        function moveTestimonialSlide(direction) {
            if (testimonialIsMoving || originalTestimonialSlidesCount <= slidesVisible) return;
            testimonialIsMoving = true;
            testimonialCurrentIndex += direction;
            testimonialTrack.style.transition = 'transform 0.5s ease-in-out';
            updateTestimonialSlidePosition();
            startTestimonialSlideTimer();
        }

        function autoTestimonialSlide() { moveTestimonialSlide(1); }
        function startTestimonialSlideTimer() {
            clearTimeout(testimonialSlideTimer);
            testimonialSlideTimer = setTimeout(autoTestimonialSlide, 1000); // 1 sec
        }

        testimonialTrack.addEventListener('transitionend', () => {
            testimonialIsMoving = false;
            if (originalTestimonialSlidesCount <= slidesVisible) return;
            if (testimonialCurrentIndex >= originalTestimonialSlidesCount + slidesVisible) {
                testimonialCurrentIndex = slidesVisible;
                testimonialTrack.style.transition = 'none';
                updateTestimonialSlidePosition();
            }
            if (testimonialCurrentIndex <= slidesVisible - 1) {
                testimonialCurrentIndex = originalTestimonialSlidesCount + slidesVisible - 1;
                testimonialTrack.style.transition = 'none';
                updateTestimonialSlidePosition();
            }
        });

        if(testimonialNextButton) testimonialNextButton.addEventListener('click', () => moveTestimonialSlide(1));
        if(testimonialPrevButton) testimonialPrevButton.addEventListener('click', () => moveTestimonialSlide(-1));
        window.addEventListener('resize', setupTestimonialClones);
        
        if (originalTestimonialSlidesCount > 0) {
            setupTestimonialClones();
            startTestimonialSlideTimer();
        }
    }
    
    // ===== 2h. CONTACT FORM (EMAILJS) CODE =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('form-submit-btn');
        const statusMsg = document.getElementById('form-status');

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Check if emailjs is defined before using it
            if (typeof emailjs !== 'undefined') {
                emailjs.sendForm('service_nvwp74b', 'template_jphnhtj', this)
                    .then(() => {
                        statusMsg.textContent = 'Message sent successfully! We will get back to you soon.';
                        statusMsg.className = 'form-status success';
                        submitBtn.textContent = 'Send Message';
                        submitBtn.disabled = false;
                        contactForm.reset(); 
                    }, (error) => {
                        statusMsg.textContent = 'Failed to send message. Please try again or email us directly.';
                        statusMsg.className = 'form-status error';
                        submitBtn.textContent = 'Send Message';
                        submitBtn.disabled = false;
                    });
            } else {
                // Fallback if EmailJS fails to load
                statusMsg.textContent = 'Error: Email service could not be loaded. Please email us directly.';
                statusMsg.className = 'form-status error';
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }

    // ===== 2i. SLIDING LOGIN FORM LOGIC (FOR STUDENT PAGE ONLY - NOW DISABLED) =====
    // NOTE: This code is currently disabled by user request.
    /*
    const slideContainer = document.getElementById('slide-container');
    const slideToRegisterBtn = document.getElementById('slide-to-register');
    const slideToLoginBtn = document.getElementById('slide-to-login');

    if (slideContainer && slideToRegisterBtn && slideToLoginBtn) {
        
        slideToRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            slideContainer.classList.add('slide-active');
        });

        slideToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            slideContainer.classList.remove('slide-active');
        });
    }
    */
    // End of 2i.

}); // <-- THIS IS THE SINGLE, FINAL CLOSING BRACKET