// --- CONFIGURATION ---
const CONFIG = {
    triggerId: 'triggerArea', 
    audioId: 'bgMusic',
    // Romantic color palette for the confetti
    confettiColors: ['#e74c3c', '#ff9f43', '#ffb7b2', '#ffffff', '#d4af37'] 
};

// --- DOM ELEMENTS ---
const trigger = document.getElementById(CONFIG.triggerId);
const envelopeImage = document.getElementById('envelopeImage');
const letter = document.getElementById('letter');
const music = document.getElementById(CONFIG.audioId);
const musicBtn = document.querySelector('.music-control');

// --- STATE ---
let isOpened = false;
let isMusicPlaying = false;
let startX = 0;
let currentX = 0;
const swipeThreshold = 30; // Sensitivity of the swipe

// --- MUSIC CONTROLS ---
function toggleMusic() {
    if (isMusicPlaying) {
        music.pause();
        // Change icon to mute
        musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>'; 
        musicBtn.style.opacity = '0.7';
    } else {
        music.play();
        // Change icon to playing volume
        musicBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        musicBtn.style.opacity = '1';
        musicBtn.style.background = 'var(--text-color)';
        musicBtn.style.color = '#fff';
    }
    isMusicPlaying = !isMusicPlaying;
}

function autoStartMusic() {
    if (!isMusicPlaying) {
        toggleMusic();
    }
}

// --- CONFETTI ANIMATION ---
function shootConfetti() {
    const duration = 5 * 1000; // 5 seconds of hearts
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);

        // Shoot hearts from left and right corners
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            shapes: ['heart'], 
            colors: CONFIG.confettiColors
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            shapes: ['heart'],
            colors: CONFIG.confettiColors
        }));
    }, 250);
}

// --- THE POP-OUT ANIMATION (GSAP) ---
function openEnvelope() {
    if (isOpened) return;
    isOpened = true;

    // 1. Play the song
    autoStartMusic();

    // 2. Disable the trigger so she can't click it twice
    trigger.style.display = 'none';

    // 3. The Animation Sequence
    const tl = gsap.timeline();

    // Step A: The Envelope Cover slides DOWN and fades OUT
    tl.to(envelopeImage, {
        duration: 1,
        y: 200,           // Moves down 200px
        rotation: -10,    // Tults slightly left
        opacity: 0,       // Disappears
        ease: "power2.in", // Starts slow, ends fast
    })

    // Step B: The Letter pops UP (Starts slightly before Step A finishes)
    .to(letter, {
        duration: 1.2,
        opacity: 1,
        y: 0,             // Moves to center
        scale: 1,         // Scales up to normal size
        zIndex: 10,       // Brings it to the very front
        ease: "back.out(1.5)", // The "Pop" effect (overshoots slightly then settles)
    }, "-=0.8")           // Overlap: Start this 0.8s before the previous animation ends

    // Step C: Trigger Confetti when the letter is in place
    .call(shootConfetti)
    
    // Step D: Reveal the text nicely
    .call(() => {
        letter.classList.add('open'); // Triggers the CSS opacity transition for the text
    });
}

// --- SWIPE & CLICK LISTENERS ---

// 1. Simple Click
trigger.addEventListener('click', openEnvelope);

// 2. Touch Swipe (Mobile)
trigger.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

trigger.addEventListener('touchend', (e) => {
    currentX = e.changedTouches[0].clientX;
    if (Math.abs(currentX - startX) > swipeThreshold) {
        openEnvelope();
    }
});

// 3. Mouse Drag (Desktop Swipe)
let isDragging = false;

trigger.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    trigger.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    trigger.style.cursor = 'grab';
    
    currentX = e.clientX;
    // If dragged left or right
    if (Math.abs(currentX - startX) > swipeThreshold) {
        openEnvelope();
    }
});