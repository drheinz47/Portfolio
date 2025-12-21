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

});
