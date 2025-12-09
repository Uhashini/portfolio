document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('scene');
    const fireflyContainer = document.getElementById('firefly-container');
    const characterImage = document.getElementById('character-image');
    
    // Navigation Elements
    const featuresContainer = document.getElementById('features-container');
    const contentDisplay = document.getElementById('content-display');
    
    // ===================================
    // 1. Navigation Logic (AJAX Fetch and Transitions)
    // ===================================

    // Function to load external HTML content via AJAX
    async function loadContent(url) {
        // 1. Start the fade-out/slide-out transition
        contentDisplay.classList.remove('active-content');

        // Wait for the animation to finish (500ms from CSS) 
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        contentDisplay.innerHTML = ''; // Clear previous content

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}. File: ${url}`);
            }
            const htmlContent = await response.text();
            
            // 2. Inject the new content
            // Simple injection is fine since the external files are simple HTML sections
            contentDisplay.innerHTML = `<div class="page-content-wrapper">${htmlContent}</div>`;
            
            // 3. Animate the content container to show the new page 
            contentDisplay.classList.add('active-content');

        } catch (error) {
            console.error("Failed to load content:", error);
            contentDisplay.innerHTML = `<div class="error-message" style="color:red;padding:20px;">
                Error: Content failed to load from ${url}. 
                <br>Make sure the file exists and the server is running.
            </div>`;
            contentDisplay.classList.add('active-content');
        }
    }

    // Event Listener for feature circles
    featuresContainer.addEventListener('click', (e) => {
        const targetLink = e.target.closest('.feature-circle');
        if (!targetLink) return;

        // Check if the link has the internal-link class
        if (targetLink.classList.contains('internal-link')) {
            e.preventDefault(); // STOP the browser from navigating away
            const targetHref = targetLink.getAttribute('href');
            loadContent(targetHref);
        } else if (targetLink.classList.contains('external-link')) {
            // For external/direct links, just ensure the content box is closed.
            contentDisplay.classList.remove('active-content');
        }
        // If it's neither internal nor external, do nothing (shouldn't happen with the new classes).
    });

    // Event listener to hide content when clicking off the box
    scene.addEventListener('click', (e) => {
        // Only hide if the click is directly on the background elements
        if (e.target.id === 'scene' || e.target.id === 'character-image' || e.target.id === 'firefly-container') {
            contentDisplay.classList.remove('active-content');
        }
    });


    // ===================================
    // 2. Character Parallax Effect 
    // ===================================
    const parallaxStrength = 0.05; 

    scene.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (e.clientX - centerX) * parallaxStrength;
        const moveY = (e.clientY - centerY) * parallaxStrength;
        
        characterImage.style.transform = `translate(${-moveX * 0.5}px, ${-moveY * 0.5}px)`;
    });


    // ===================================
    // 3. Firefly Generation and Animation
    // ===================================
    const numFireflies = 30;
    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    for (let i = 0; i < numFireflies; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        
        const startX = rand(0, window.innerWidth);
        const startY = rand(0, window.innerHeight);

        const duration = rand(8, 15);
        const delay = rand(0, 5);

        const keyframes = `@keyframes firefly-move-${i} {
            0% { 
                top: ${startY}px; 
                left: ${startX}px; 
                opacity: 0;
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { 
                top: ${rand(0, window.innerHeight)}px; 
                left: ${rand(0, window.innerWidth)}px;
                opacity: 0;
            }
        }`;
        
        styleSheet.sheet.insertRule(keyframes, styleSheet.sheet.cssRules.length);

        firefly.style.animationName = `firefly-move-${i}`;
        firefly.style.animationDuration = `${duration}s`;
        firefly.style.animationDelay = `${delay}s`;

        fireflyContainer.appendChild(firefly);
    }
});