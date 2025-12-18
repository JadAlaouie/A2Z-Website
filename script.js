/* --- NEURAL NETWORK BACKGROUND ANIMATION --- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Handle Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = (Math.random() * 3) - 1.5; // Speed X
        this.directionY = (Math.random() * 3) - 1.5; // Speed Y
        this.size = (Math.random() * 2) + 1;
        // Professional blue tones
        const colors = ['#3182CE', '#4299E1', '#805AD5'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.baseSize = this.size;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        // Add glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    update() {
        // Boundary Check
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Create Particle Array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000; // Density
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Connect Particles with lines
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                // Create gradient for connections
                const gradient = ctx.createLinearGradient(
                    particlesArray[a].x, particlesArray[a].y,
                    particlesArray[b].x, particlesArray[b].y
                );
                gradient.addColorStop(0, `rgba(49, 130, 206, ${opacityValue * 0.6})`);
                gradient.addColorStop(0.5, `rgba(66, 153, 225, ${opacityValue * 0.6})`);
                gradient.addColorStop(1, `rgba(128, 90, 213, ${opacityValue * 0.6})`);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Start
init();
animate();

// Highlight Active Link
const currentLocation = location.href;
const menuItem = document.querySelectorAll('.nav-links a');
const menuLength = menuItem.length;
for (let i = 0; i < menuLength; i++) {
    if (menuItem[i].href === currentLocation) {
        menuItem[i].className = "active";
    }
}

/* --- SCROLL ANIMATIONS --- */
// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add a staggered delay for elements
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100); // 100ms delay between each element
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animation classes
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
animatedElements.forEach(el => observer.observe(el));

/* --- SMOOTH SCROLL FOR NAVIGATION --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* --- ENHANCED HOVER EFFECTS FOR SERVICE CARDS --- */
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    // Mouse move effect for 3D tilt
    card.addEventListener('mousemove', function(e) {
        // Don't apply tilt if hovering over a link
        if (e.target.closest('a')) {
            return;
        }

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
});

/* --- PARALLAX EFFECT FOR HERO SECTION --- */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-visual img');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

/* --- COUNTER ANIMATION FOR STATS --- */
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            // Handle different formats
            if (target.toString().includes('.')) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current);
            }
        }
    }, 16);
};

// Observe stat numbers for counter animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            const targetText = statNumber.textContent;

            // Extract number from text (handles "150+", "99.9%", "24/7" formats)
            const match = targetText.match(/[\d.]+/);
            if (match) {
                const targetValue = parseFloat(match[0]);
                const suffix = targetText.replace(/[\d.]+/, '');

                // Animate the number
                let current = 0;
                const increment = targetValue / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetValue) {
                        statNumber.textContent = targetText;
                        clearInterval(timer);
                    } else {
                        if (targetValue % 1 !== 0) {
                            statNumber.textContent = current.toFixed(1) + suffix;
                        } else {
                            statNumber.textContent = Math.floor(current) + suffix;
                        }
                    }
                }, 20);
            }
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe all stat numbers
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => statObserver.observe(stat));

/* --- TECH TAGS RIPPLE EFFECT --- */
const techTags = document.querySelectorAll('.tech-tags span');
techTags.forEach((tag, index) => {
    // Add staggered entrance animation
    tag.style.animationDelay = `${index * 0.05}s`;

    // Add ripple effect on click
    tag.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';

        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

/* --- MOUSE CURSOR TRAIL EFFECT --- */
const cursorDot = document.createElement('div');
cursorDot.style.cssText = `
    position: fixed;
    width: 6px;
    height: 6px;
    background: #3182CE;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease;
    box-shadow: 0 0 10px rgba(49, 130, 206, 0.5);
`;
document.body.appendChild(cursorDot);

const cursorCircle = document.createElement('div');
cursorCircle.style.cssText = `
    position: fixed;
    width: 32px;
    height: 32px;
    border: 2px solid rgba(49, 130, 206, 0.4);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: all 0.2s ease;
`;
document.body.appendChild(cursorCircle);

let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;
let circleX = 0, circleY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    circleX += (mouseX - circleX) * 0.15;
    circleY += (mouseY - circleY) * 0.15;

    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    cursorCircle.style.left = (circleX - 20) + 'px';
    cursorCircle.style.top = (circleY - 20) + 'px';

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale up cursor on hover over interactive elements
document.querySelectorAll('a, button, .btn, .service-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorCircle.style.transform = 'scale(1.4)';
        cursorCircle.style.borderColor = 'rgba(128, 90, 213, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
        cursorCircle.style.transform = 'scale(1)';
        cursorCircle.style.borderColor = 'rgba(49, 130, 206, 0.4)';
    });
});
