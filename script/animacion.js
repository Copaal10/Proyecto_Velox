/* ===============================
   CONFIGURACIÓN
================================ */
const totalFrames = 43;
const ultimoFrame = 10;
const smooth = 0.15;

const framePath = i =>
    `./img/video1/carroScroll/out${String(i).padStart(4, '0')}.png`;

/* ===============================
   DOM CACHE
================================ */
const imgEl = document.getElementById('animImage');
const textWrap = document.querySelector('#overlayText .text-wrap');
const imagineEl = document.querySelector('.imagine');
const byEl = document.querySelector('.by');
const section = document.querySelector('.animation-section');

/* ===============================
   PRECARGA DE IMÁGENES (TODAS)
================================ */
const images = [];
for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = framePath(i);
    images.push(img);
}

/* ===============================
   ESTADO
================================ */
let currentFrame = 1;
let targetFrame = 1;
let lastRendered = 0;
let needsUpdate = true;

/* ===============================
   SCROLL
================================ */
window.addEventListener('scroll', () => {
    needsUpdate = true;
});

/* ===============================
   UTILIDADES
================================ */
function getScrollFraction() {
    const top = section.offsetTop;
    const height = section.offsetHeight - window.innerHeight;
    const scrollY = window.scrollY;

    if (scrollY <= top) return 0;
    if (scrollY >= top + height) return 1;
    return (scrollY - top) / height;
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/* ===============================
   LOOP PRINCIPAL
================================ */
function loop() {
    if (needsUpdate) {
        updateAnimation();
        needsUpdate = false;
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ===============================
   ACTUALIZACIÓN
================================ */
function updateAnimation() {
    const frac = getScrollFraction();
    targetFrame = frac * (totalFrames - 1) + 1;

    currentFrame += (targetFrame - currentFrame) * smooth;

    const frameToShow = Math.min(
        totalFrames,
        Math.max(1, Math.floor(currentFrame))
    );

    if (
        frameToShow !== lastRendered &&
        images[frameToShow - 1].complete
    ) {
        imgEl.src = images[frameToShow - 1].src;
        lastRendered = frameToShow;
    }

    handleOverlay(frameToShow);
}

/* ===============================
   TEXTO OVERLAY
================================ */
function handleOverlay(frame) {
    const start = totalFrames - ultimoFrame - 9;

    if (frame < start) {
        hideOverlay();
        return;
    }

    const progress = (frame - start) / (ultimoFrame - 1);
    const eased = easeOutCubic(Math.min(1, Math.max(0, progress)));

    textWrap.style.opacity = eased;
    textWrap.style.transform =
        `translateY(${(1 - eased) * 24}px) scale(${0.92 + eased * 0.08})`;

    //ing
    imagineEl.style.transform = `scaleX(${0.9 + eased * 0.1})`;

    byEl.style.opacity = Math.max(0, (eased - 0.25) / 0.75);

    imagineEl.classList.toggle('glow', eased > 0.7);
}

function hideOverlay() {
    textWrap.style.opacity = 0;
    textWrap.style.transform = `translateY(24px) scale(0.92)`;
    imagineEl.style.transform = '';
    imagineEl.classList.remove('glow');
    byEl.style.opacity = 0;
}
