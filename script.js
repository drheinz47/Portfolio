document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // Loading Screen Logic
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        loadingProgress.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                document.body.classList.add('loaded'); // Can be used to trigger other animations
            }, 500);
        }
    }, 100);

    // Skill Bars Animation
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = `${level}%`;
                observer.unobserve(entry.target);
            }
        });
    };

    const skillsObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.5
    });

    skillLevels.forEach(skill => {
        skillsObserver.observe(skill);
    });

    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sidebar-menu a, .mobile-nav a');

    const highlightNav = () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNav);

    // Smooth Scrolling for Anchor Links (if CSS scroll-behavior fails on some browsers)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Grid Motion Logic ---
    const initGridMotion = () => {
        const container = document.getElementById('gridMotion-container');
        if (!container) return;

        // Configuration
        const totalRows = 4;
        const itemsPerRow = 7;
        const totalItems = totalRows * itemsPerRow;
        
        // Generate Grid Items
        for (let i = 0; i < totalRows; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            
            // Map grid row index to file y-coordinate (1-3)
            // We loop y (rows) if totalRows > 3
            const yIndex = (i % 3) + 1;

            for (let j = 0; j < itemsPerRow; j++) {
                const item = document.createElement('div');
                item.classList.add('row__item');
                
                // Map grid column index to file x-coordinate (1-3)
                // We loop x (columns) to create the infinite scroll effect
                const xIndex = (j % 3) + 1;
                
                // Construct filename: x{col}y{row}.png
                // Add a cache-busting query parameter to force reload of new images
                const imagePath = `images/x${xIndex}y${yIndex}.png?t=${new Date().getTime()}`;
                
                item.innerHTML = `
                    <div class="row__item-inner">
                        <div class="row__item-img" style="background-image: url('${imagePath}')"></div> 
                    </div>
                `;
                row.appendChild(item);
            }
            container.appendChild(row);
        }

        // Animation Logic
        const rows = document.querySelectorAll('.row');
        let mouseX = window.innerWidth / 2;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
        };

        const updateMotion = () => {
            const maxMoveAmount = 300;
            const baseDuration = 0.8;
            const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

            rows.forEach((row, index) => {
                const direction = index % 2 === 0 ? 1 : -1;
                // Calculate move amount based on mouse position relative to center
                const moveAmount = ((mouseX / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

                gsap.to(row, {
                    x: moveAmount,
                    duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            });
        };

        // Start GSAP Ticker
        gsap.ticker.add(updateMotion);
        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup function (if needed in SPA, but here standard page load is fine)
        // logic is self-contained.
    };

    // Initialize Grid Motion only if GSAP is loaded
    if (typeof gsap !== 'undefined') {
        initGridMotion();
    } else {
        console.warn('GSAP not loaded. Grid Motion disabled.');
    }

});
