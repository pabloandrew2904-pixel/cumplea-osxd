/* =========================================
   BIRTHDAY SITE FOR ALLYSON — JavaScript
   Page transitions, particles, confetti, photo upload
   ========================================= */

// ---- PAGE NAVIGATION ----

let currentPage = 1;
const totalPages = 5;

function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages || pageNum === currentPage) return;

    const current = document.getElementById(`page${currentPage}`);
    const next = document.getElementById(`page${pageNum}`);

    // Transition out current
    current.classList.remove('active');
    current.classList.add('transitioning-out');

    // Small delay, then transition in next
    setTimeout(() => {
        current.classList.remove('transitioning-out');
        next.classList.add('active');
        currentPage = pageNum;

        // Trigger page-specific effects
        if (pageNum === 5) {
            startConfetti();
        }
    }, 400);
}

// ---- FLOATING PARTICLES ----

function createParticles(containerId, count, color) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 12;
        const opacity = Math.random() * 0.4 + 0.1;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            background: ${color || 'rgba(240, 194, 127, 0.3)'};
            opacity: ${opacity};
        `;

        container.appendChild(particle);
    }
}

// Initialize particles
createParticles('particles2', 25, 'rgba(240, 194, 127, 0.25)');
createParticles('particles4', 25, 'rgba(177, 74, 237, 0.2)');

// ---- PHOTO UPLOAD ----

function loadPhoto(input, slotId) {
    const file = input.files[0];
    if (!file) return;

    const slot = document.getElementById(slotId);
    const reader = new FileReader();

    reader.onload = function(e) {
        // Remove placeholder
        const placeholder = slot.querySelector('.photo-placeholder');
        const label = slot.querySelector('.photo-label');
        if (placeholder) placeholder.style.display = 'none';

        // Check if image already exists
        let img = slot.querySelector('img.loaded-photo');
        if (!img) {
            img = document.createElement('img');
            img.classList.add('loaded-photo');
            label.appendChild(img);
        }

        img.src = e.target.result;
        img.alt = 'Recuerdo con Allyson';
    };

    reader.readAsDataURL(file);
}

// ---- CONFETTI SYSTEM ----

let confettiAnimationId = null;

function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = [
        '#ff6b9d', '#c44dff', '#6e8efb', '#ffd700',
        '#ff4757', '#2ed573', '#ff6348', '#a55eea',
        '#f0c27f', '#e8837c', '#7ec8c8'
    ];

    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            speedX: (Math.random() - 0.5) * 3,
            speedY: Math.random() * 3 + 2,
            oscillationSpeed: Math.random() * 0.02 + 0.01,
            oscillationDistance: Math.random() * 40 + 20,
            phase: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.5 + 0.5,
        });
    }

    let frame = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;

        confettiPieces.forEach(p => {
            p.y += p.speedY;
            p.x += Math.sin(p.phase + frame * p.oscillationSpeed) * 0.8 + p.speedX * 0.3;
            p.rotation += p.rotationSpeed;

            // Reset when off screen
            if (p.y > canvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        confettiAnimationId = requestAnimationFrame(animate);
    }

    // Cancel previous animation if any
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
    }

    animate();

    // Stop confetti after 8 seconds, let remaining pieces fall
    setTimeout(() => {
        confettiPieces.forEach(p => {
            p.speedY *= 0.5;
        });
    }, 8000);
}

// ---- WINDOW RESIZE ----

window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// ---- KEYBOARD NAVIGATION ----

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentPage < totalPages) goToPage(currentPage + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentPage > 1) goToPage(currentPage - 1);
    }
});

// ---- DRAG AND DROP FOR PHOTOS ----

document.querySelectorAll('.photo-slot').forEach(slot => {
    slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.querySelector('.photo-placeholder')?.style && 
            (slot.querySelector('.photo-placeholder').style.borderColor = 'rgba(232, 223, 245, 0.5)');
    });

    slot.addEventListener('dragleave', () => {
        slot.querySelector('.photo-placeholder')?.style && 
            (slot.querySelector('.photo-placeholder').style.borderColor = 'rgba(255, 255, 255, 0.12)');
    });

    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function(ev) {
            const placeholder = slot.querySelector('.photo-placeholder');
            const label = slot.querySelector('.photo-label');
            if (placeholder) placeholder.style.display = 'none';

            let img = slot.querySelector('img.loaded-photo');
            if (!img) {
                img = document.createElement('img');
                img.classList.add('loaded-photo');
                label.appendChild(img);
            }

            img.src = ev.target.result;
            img.alt = 'Recuerdo con Allyson';
        };
        reader.readAsDataURL(file);
    });
});

console.log('🎂 Birthday site loaded for Allyson!');
