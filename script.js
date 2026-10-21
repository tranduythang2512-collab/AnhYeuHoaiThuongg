// --- DANH SÁCH DỮ LIỆU ---
const loveMessages = [
    "Anh Yêu Em Nguồn Sống Của Anh ❤️",
    "You Are My Whole Universe ✨",
    "Mỗi Ngày Bên Em Đều Là Hạnh Phúc 🌸",
    "Cảm Ơn Em Đã Đến Bên Anh 💖",
    "Em Là Điều Tuyệt Vời Nhất 🌹",
    "Forever & Always In Love 💍",
    "Nụ Cười Em Làm Ấm Lòng Anh 😊",
    "Yêu Em Nhiều Hơn Mỗi Ngày 💞"
];

// Đường dẫn trỏ trực tiếp tới thư mục img/ của bạn
const memoryPhotos = [
    { url: "img/1.jpg", title: "Kỷ Niệm Yêu Thương ❤️" },
    { url: "img/2.jpg", title: "Nụ Cười Của Em 🌸" },
    { url: "img/3.jpg", title: "Buổi Hẹn Hò Ngọt Ngào ☕" },
    { url: "img/4.jpg", title: "Mãi Bên Nhau Em Nhé 💖" }
];

// --- THREE.JS 3D PARTICLE HEART SCENE ---
const canvas3D = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030008, 0.015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 32);

const renderer = new THREE.WebGLRenderer({ canvas: canvas3D, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tạo Texture phát sáng cho hạt
function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,100,160,0.8)');
    grad.addColorStop(0.6, 'rgba(255,30,100,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

const particleTexture = createParticleTexture();

// Tạo các hạt Trái tim 3D
const particleCount = 14000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const originalPositions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

const colorInside = new THREE.Color(0xff2a6d);
const colorOutside = new THREE.Color(0xff758c);

let i3 = 0;
while (i3 < particleCount * 3) {
    const x = (Math.random() - 0.5) * 3;
    const y = (Math.random() - 0.5) * 3;
    const z = (Math.random() - 0.5) * 3;

    // Phương trình Trái tim 3D
    const a = x * x + (9 / 4) * z * z + y * y - 1;
    if (a * a * a - x * x * y * y * y - (9 / 80) * z * z * y * y * y <= 0) {
        const scale = 7.8;
        positions[i3] = x * scale;
        positions[i3 + 1] = y * scale + 1.2;
        positions[i3 + 2] = z * scale;

        originalPositions[i3] = positions[i3];
        originalPositions[i3 + 1] = positions[i3 + 1];
        originalPositions[i3 + 2] = positions[i3 + 2];

        const dist = Math.sqrt(x * x + y * y + z * z);
        const mixedColor = colorInside.clone().lerp(colorOutside, dist);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        i3 += 3;
    }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const heartMaterial = new THREE.PointsMaterial({
    size: 0.65,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const heartMesh = new THREE.Points(geometry, heartMaterial);
scene.add(heartMesh);

// Vòng chữ 3D xoay bên dưới
function createTextRing() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, 1024, 128);

    ctx.font = 'bold 36px Montserrat, sans-serif';
    ctx.fillStyle = '#ff758c';
    ctx.shadowColor = '#ff2a6d';
    ctx.shadowBlur = 12;
    ctx.textAlign = 'center';

    const text = "ANH YÊU EM  •  I LOVE YOU  •  FOREVER WITH YOU  •  ";
    ctx.fillText(text + text, 512, 70);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);

    const ringGeo = new THREE.CylinderGeometry(8.5, 8.5, 2, 64, 1, true);
    const ringMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = -8;
    return { mesh: ringMesh, texture: texture };
}

const ringObj = createTextRing();
scene.add(ringObj.mesh);

// Các hạt sao nền vũ trụ
const starsGeo = new THREE.BufferGeometry();
const starsCount = 1800;
const starsPos = new Float32Array(starsCount * 3);
for (let s = 0; s < starsCount * 3; s += 3) {
    starsPos[s] = (Math.random() - 0.5) * 160;
    starsPos[s + 1] = (Math.random() - 0.5) * 160;
    starsPos[s + 2] = (Math.random() - 0.5) * 160;
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
const starsMat = new THREE.PointsMaterial({ size: 0.35, color: 0xffffff, transparent: true, opacity: 0.7 });
const starField = new THREE.Points(starsGeo, starsMat);
scene.add(starField);

// --- CƠ CHẾ NHẤN GIỮ BÙNG NỔ (HOLD & BURST) ---
let isHolding = false;
let holdEnergy = 0;
let releaseEnergy = 0;
let holdX = window.innerWidth / 2;
let holdY = window.innerHeight / 2;
let burstInterval = null;

const energyRing = document.getElementById('energy-ring');

function startHold(x, y) {
    isHolding = true;
    holdX = x;
    holdY = y;
    document.getElementById('guide-prompt').style.opacity = '0';

    const audio = document.getElementById('bg-audio');
    if (audio.paused) {
        audio.play().then(() => {
            document.getElementById('play-btn').innerHTML = '<i class="fa-solid fa-pause"></i>';
        }).catch(() => {});
    }

    if (burstInterval) clearInterval(burstInterval);
    burstInterval = setInterval(() => {
        if (isHolding || releaseEnergy > 0.1) {
            spawnLoveMessage(holdX, holdY);
            if (Math.random() > 0.4) spawnPhotoCard(holdX, holdY);
            spawnCanvasBurst(holdX, holdY, 25);
        }
    }, 350);
}

function endHold() {
    if (isHolding) {
        isHolding = false;
        releaseEnergy = holdEnergy;
        if (burstInterval) clearInterval(burstInterval);
    }
}

function updateHoldPos(x, y) {
    holdX = x;
    holdY = y;
    energyRing.style.left = `${x}px`;
    energyRing.style.top = `${y}px`;
}

// Bắt sự kiện Chuột & Cảm ứng
window.addEventListener('mousedown', (e) => startHold(e.clientX, e.clientY));
window.addEventListener('mouseup', endHold);
window.addEventListener('mousemove', (e) => updateHoldPos(e.clientX, e.clientY));

window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        const t = e.touches[0];
        startHold(t.clientX, t.clientY);
        updateHoldPos(t.clientX, t.clientY);
    }
});
window.addEventListener('touchend', endHold);
window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const t = e.touches[0];
        updateHoldPos(t.clientX, t.clientY);
    }
});

function triggerManualBurst() {
    startHold(window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(() => {
        endHold();
    }, 1200);
}

// Tạo thông điệp bay lên
function spawnLoveMessage(x, y) {
    const msgEl = document.createElement('div');
    msgEl.className = 'love-msg-float';
    msgEl.innerText = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    
    const offsetX = (Math.random() - 0.5) * 320;
    const offsetY = (Math.random() - 0.5) * 220;
    
    msgEl.style.left = `${x + offsetX}px`;
    msgEl.style.top = `${y + offsetY}px`;
    msgEl.style.fontSize = `${Math.random() * 14 + 22}px`;
    
    document.body.appendChild(msgEl);
    setTimeout(() => msgEl.remove(), 4000);
}

// Tạo khung ảnh Polaroid từ thư mục img/
function spawnPhotoCard(x, y) {
    const item = memoryPhotos[Math.floor(Math.random() * memoryPhotos.length)];
    const card = document.createElement('div');
    card.className = 'photo-card-float';
    
    const rot = (Math.random() - 0.5) * 30;
    card.style.setProperty('--rot', `${rot}deg`);

    const offsetX = (Math.random() - 0.5) * 400;
    const offsetY = (Math.random() - 0.5) * 280;

    card.style.left = `${x + offsetX}px`;
    card.style.top = `${y + offsetY}px`;

    card.innerHTML = `
        <img src="${item.url}" class="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg mb-1 pointer-events-none">
        <p class="text-center font-love text-slate-800 font-bold text-xs">${item.title}</p>
    `;

    document.body.appendChild(card);
    setTimeout(() => card.remove(), 4500);
}

// Canvas 2D bắn hạt trái tim nhỏ
const burstCanvas = document.getElementById('burst-canvas');
const bCtx = burstCanvas.getContext('2d');
let burstParticles = [];

function resizeBurstCanvas() {
    burstCanvas.width = window.innerWidth;
    burstCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBurstCanvas);
resizeBurstCanvas();

function spawnCanvasBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 3;
        burstParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: Math.random() * 16 + 12,
            char: ['💖', '❤️', '✨', '🌸', '💗', '💕'][Math.floor(Math.random() * 6)],
            alpha: 1,
            decay: Math.random() * 0.015 + 0.01
        });
    }
}

function renderBurstCanvas() {
    bCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);

    for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
            burstParticles.splice(i, 1);
            continue;
        }

        bCtx.globalAlpha = p.alpha;
        bCtx.font = `${p.size}px serif`;
        bCtx.fillText(p.char, p.x, p.y);
    }
    requestAnimationFrame(renderBurstCanvas);
}
renderBurstCanvas();

// Vòng lặp Render 3D & Vật lý hạt
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (isHolding) {
        if (holdEnergy < 1) holdEnergy += 0.04;
    } else {
        if (releaseEnergy > 0) releaseEnergy -= 0.02;
        holdEnergy = Math.max(0, releaseEnergy);
    }

    if (holdEnergy > 0.05) {
        energyRing.style.opacity = holdEnergy;
        energyRing.style.transform = `translate(-50%, -50%) scale(${1 + holdEnergy * 1.5})`;
    } else {
        energyRing.style.opacity = '0';
    }

    const baseScale = 1 + Math.sin(elapsedTime * 3) * 0.04;
    const energyScale = 1 + holdEnergy * 0.45;
    const currentScale = baseScale * energyScale;

    heartMesh.scale.set(currentScale, currentScale, currentScale);

    const posAttr = geometry.attributes.position;
    const array = posAttr.array;

    for (let p = 0; p < particleCount * 3; p += 3) {
        const ox = originalPositions[p];
        const oy = originalPositions[p + 1];
        const oz = originalPositions[p + 2];

        const scatter = 1 + holdEnergy * 0.35 * Math.sin(p + elapsedTime * 5);
        array[p] = ox * scatter;
        array[p + 1] = oy * scatter;
        array[p + 2] = oz * scatter;
    }
    posAttr.needsUpdate = true;

    const rotationSpeed = 0.006 + holdEnergy * 0.04;
    heartMesh.rotation.y += rotationSpeed;
    ringObj.mesh.rotation.y -= rotationSpeed * 0.8;
    ringObj.texture.offset.x -= 0.002;

    starField.rotation.y += 0.0004;

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function toggleMusic() {
    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('play-btn');

    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
    }
}