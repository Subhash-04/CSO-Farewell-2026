/* ================================================
   FAREWELL CSO 2026 — SCRIPT (Three.js + Interactions)
   ================================================ */

// ==========================================
// 1. THREE.JS — 3D MUSIC NOTES BACKGROUND
// ==========================================
(function initThreeBackground() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 30;

    // Colors
    const NEON_PINK = 0xff2d95;
    const NEON_BLUE = 0x00f0ff;
    const NEON_PURPLE = 0xb24bf3;
    const AMBER = 0xffb347;
    const GOLD = 0xffd700;
    const colorList = [NEON_PINK, NEON_BLUE, NEON_PURPLE, AMBER, GOLD];

    // --- Create a music note shape (♪) using THREE.Shape ---
    function createNoteShape(scale) {
        const s = scale || 1;
        const shape = new THREE.Shape();
        // Note head (ellipse)
        shape.absellipse(0, 0, 0.5 * s, 0.35 * s, 0, Math.PI * 2, false, -0.3);
        // Stem
        const stemPath = new THREE.Shape();
        stemPath.moveTo(0.4 * s, 0.15 * s);
        stemPath.lineTo(0.5 * s, 0.15 * s);
        stemPath.lineTo(0.5 * s, 1.8 * s);
        stemPath.lineTo(0.4 * s, 1.8 * s);
        stemPath.lineTo(0.4 * s, 0.15 * s);
        // Flag
        const flagPath = new THREE.Shape();
        flagPath.moveTo(0.5 * s, 1.8 * s);
        flagPath.quadraticCurveTo(1.0 * s, 1.4 * s, 0.7 * s, 1.0 * s);
        flagPath.lineTo(0.5 * s, 1.2 * s);
        flagPath.quadraticCurveTo(0.8 * s, 1.5 * s, 0.5 * s, 1.8 * s);
        return { head: shape, stem: stemPath, flag: flagPath };
    }

    // Create 3D music note meshes
    const musicNotes = [];
    const noteCount = 35;

    for (let i = 0; i < noteCount; i++) {
        const noteScale = 0.5 + Math.random() * 0.8;
        const parts = createNoteShape(noteScale);
        const color = colorList[Math.floor(Math.random() * colorList.length)];
        const group = new THREE.Group();

        // Head
        const headGeom = new THREE.ShapeGeometry(parts.head);
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.25 + Math.random() * 0.3,
            side: THREE.DoubleSide
        });
        group.add(new THREE.Mesh(headGeom, mat));

        // Stem
        const stemGeom = new THREE.ShapeGeometry(parts.stem);
        group.add(new THREE.Mesh(stemGeom, mat.clone()));

        // Flag
        const flagGeom = new THREE.ShapeGeometry(parts.flag);
        group.add(new THREE.Mesh(flagGeom, mat.clone()));

        // Position on left or right sides (avoid center for text readability)
        const side = Math.random() > 0.5 ? 1 : -1;
        const xPos = side * (18 + Math.random() * 20);
        group.position.set(
            xPos,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 50 - 10
        );
        group.rotation.z = (Math.random() - 0.5) * 0.8;

        // Store animation data
        group.userData = {
            floatSpeed: 0.3 + Math.random() * 0.7,
            floatOffset: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.5,
            driftX: (Math.random() - 0.5) * 0.005
        };

        scene.add(group);
        musicNotes.push(group);
    }

    // --- Double music notes (♫) ---
    for (let i = 0; i < 15; i++) {
        const s = 0.5 + Math.random() * 0.6;
        const color = colorList[Math.floor(Math.random() * colorList.length)];
        const group = new THREE.Group();
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2 + Math.random() * 0.25,
            side: THREE.DoubleSide
        });

        // Two note heads
        for (let j = 0; j < 2; j++) {
            const head = new THREE.Shape();
            head.absellipse(j * 0.8 * s, 0, 0.4 * s, 0.28 * s, 0, Math.PI * 2, false, -0.3);
            group.add(new THREE.Mesh(new THREE.ShapeGeometry(head), mat.clone()));
        }

        // Beam connecting the two stems
        const beam = new THREE.Shape();
        beam.moveTo(0.35 * s, 1.5 * s);
        beam.lineTo(1.15 * s, 1.7 * s);
        beam.lineTo(1.15 * s, 1.55 * s);
        beam.lineTo(0.35 * s, 1.35 * s);
        beam.lineTo(0.35 * s, 1.5 * s);
        group.add(new THREE.Mesh(new THREE.ShapeGeometry(beam), mat.clone()));

        // Two stems
        for (let j = 0; j < 2; j++) {
            const stem = new THREE.Shape();
            const xOff = j * 0.8 * s;
            stem.moveTo(xOff + 0.3 * s, 0.1 * s);
            stem.lineTo(xOff + 0.4 * s, 0.1 * s);
            stem.lineTo(xOff + 0.4 * s, 1.6 * s + j * 0.2 * s);
            stem.lineTo(xOff + 0.3 * s, 1.6 * s + j * 0.2 * s);
            group.add(new THREE.Mesh(new THREE.ShapeGeometry(stem), mat.clone()));
        }

        const side2 = Math.random() > 0.5 ? 1 : -1;
        const xPos2 = side2 * (20 + Math.random() * 18);
        group.position.set(
            xPos2,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 40 - 15
        );
        group.rotation.z = (Math.random() - 0.5) * 0.6;
        group.userData = {
            floatSpeed: 0.2 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.3,
            driftX: (Math.random() - 0.5) * 0.004
        };
        scene.add(group);
        musicNotes.push(group);
    }

    // --- Retro Grid (floor) ---
    const gridHelper = new THREE.GridHelper(80, 40, NEON_PINK, NEON_PURPLE);
    gridHelper.position.y = -22;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.06;
    scene.add(gridHelper);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        // Animate each music note
        musicNotes.forEach(note => {
            const d = note.userData;
            note.position.y += Math.sin(time * d.floatSpeed + d.floatOffset) * 0.008;
            note.position.x += d.driftX;
            note.rotation.z += d.rotSpeed * 0.003;

            // Wrap around if drifted too far
            if (note.position.x > 40) note.position.x = -40;
            if (note.position.x < -40) note.position.x = 40;
        });

        // Subtle camera follow mouse
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.015;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.015;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();


// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const buttonContainer = document.getElementById('button-container');
const escapeCounter = document.getElementById('escape-counter');
const nameModal = document.getElementById('name-modal');
const nameInput = document.getElementById('name-input');
const submitNameBtn = document.getElementById('submit-name-btn');
const invitationScreen = document.getElementById('invitation-screen');
const cardScreen = document.getElementById('card-screen');
const cardName = document.getElementById('card-name');
const confettiCanvas = document.getElementById('confetti-canvas');


// ==========================================
// 3. "NO" BUTTON ESCAPE LOGIC
// ==========================================
let escapeCount = 0;
let isEscaping = false;
const funnyMessages = [
    "Nice try! 😏",
    "You can't escape the party! 🎉",
    "The vibes won't let you leave! 🎵",
    "Nah, that button's too fast! ⚡",
    "You're coming, deal with it! 💃",
    "The DJ says NO to your NO! 🎧",
    "Error 404: Rejection not found! 🚫",
    "Your click has been REMIXED! 🎶",
    "That button has better moves than you! 🕺",
    "Just accept it already! 😂"
];

function getRandomPosition() {
    const padding = 80;
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    return {
        x: Math.max(padding, Math.random() * maxX),
        y: Math.max(padding, Math.random() * maxY)
    };
}

function escapeNoButton() {
    if (!isEscaping) {
        isEscaping = true;
        noBtn.classList.add('escaping');
    }
    escapeCount++;
    const pos = getRandomPosition();
    noBtn.style.left = pos.x + 'px';
    noBtn.style.top = pos.y + 'px';

    const msg = funnyMessages[Math.min(escapeCount - 1, funnyMessages.length - 1)];
    escapeCounter.textContent = msg;

    // Make the button shrink a little each time
    const scale = Math.max(0.6, 1 - escapeCount * 0.03);
    noBtn.style.transform = `scale(${scale})`;
}

// Multiple event listeners for thorough escape coverage
noBtn.addEventListener('mouseenter', escapeNoButton);
noBtn.addEventListener('mouseover', escapeNoButton);
noBtn.addEventListener('focus', escapeNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    escapeNoButton();
}, { passive: false });

// Proximity detection — move when cursor gets close
document.addEventListener('mousemove', (e) => {
    if (!isEscaping) return;
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 100) {
        escapeNoButton();
    }
});


// ==========================================
// 4. "YES" BUTTON — OPEN MODAL
// ==========================================
yesBtn.addEventListener('click', () => {
    nameModal.classList.add('active');
    setTimeout(() => nameInput.focus(), 300);
});


// ==========================================
// 5. NAME SUBMISSION — SHOW CARD
// ==========================================
function submitName() {
    const name = nameInput.value.trim();
    if (!name) {
        nameInput.style.borderColor = '#ff1744';
        nameInput.style.animation = 'none';
        nameInput.offsetHeight; // trigger reflow
        nameInput.style.animation = 'shake 0.5s ease';
        return;
    }

    // Set name on card
    cardName.textContent = name;

    // Hide modal
    nameModal.classList.remove('active');

    // Switch screens
    invitationScreen.classList.remove('active');
    cardScreen.classList.add('active');

    // Launch confetti!
    launchConfetti();
}

submitNameBtn.addEventListener('click', submitName);
nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitName();
});

// Shake animation (injected dynamically)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
}`;
document.head.appendChild(shakeStyle);


// ==========================================
// 6. CONFETTI EFFECT
// ==========================================
function launchConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const confettiPieces = [];
    const confettiColors = [
        '#ff2d95', '#00f0ff', '#b24bf3', '#ffb347',
        '#ffd700', '#00e676', '#ff1744', '#f5e6d3'
    ];
    const confettiCount = 200;

    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            speedX: (Math.random() - 0.5) * 4,
            speedY: Math.random() * 3 + 2,
            opacity: 1
        });
    }

    let frame = 0;
    const maxFrames = 300;

    function animateConfetti() {
        if (frame >= maxFrames) {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            return;
        }
        frame++;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confettiPieces.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            p.speedY += 0.05;

            if (frame > maxFrames * 0.7) {
                p.opacity = Math.max(0, p.opacity - 0.02);
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
}


// ==========================================
// 7. SCREENSHOT BUTTON
// ==========================================
document.getElementById('save-btn').addEventListener('click', () => {
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) || window.innerWidth <= 768;
    if (isMobile) {
        alert('📸 To take a screenshot:\n\n📱 Swipe down with 3 fingers\n   — OR —\n🔘 Press Power + Volume Down buttons at the same time\n\nThen share it with your friends! 🎵');
    } else {
        alert('🎵 Take a screenshot (Ctrl+Shift+S or PrtSc) and share with your friends! 🎵');
    }
});
