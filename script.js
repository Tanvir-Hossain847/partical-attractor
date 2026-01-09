const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ======================
// STATE
// ======================
let isHolding = false;
let singularity = null;

// ======================
// MOUSE
// ======================
const mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("mousedown", (e) => {
  isHolding = true;
  singularity = { x: e.x, y: e.y };
});

window.addEventListener("mouseup", () => {
  if (singularity && singularityComplete()) {
    bigBang();
  }
  isHolding = false;
});

// ======================
// PARTICLE
// ======================
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.size = 1.3;
    this.locked = false;
  }

  update() {
    if (isHolding && singularity && !this.locked) {
      const dx = singularity.x - this.x;
      const dy = singularity.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;

      const force = 0.8 / (dist * dist);
      this.vx += dx * force;
      this.vy += dy * force;

      // Lock into singularity
      if (dist < 1.5) {
        this.x = singularity.x;
        this.y = singularity.y;
        this.vx = 0;
        this.vy = 0;
        this.locked = true;
      }
    }

    // Friction
    this.vx *= 0.985;
    this.vy *= 0.985;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

// ======================
// PARTICLES
// ======================
const particles = [];
const PARTICLE_COUNT = 12000;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

// ======================
// SINGULARITY CHECK
// ======================
function singularityComplete() {
  let locked = 0;
  for (let p of particles) {
    if (p.locked) locked++;
  }
  return locked > particles.length * 0.92;
}

// ======================
// BIG BANG 💥
// ======================
function bigBang() {
  for (let p of particles) {
    const angle = Math.random() * Math.PI * 2;
    const power = Math.random() * 10 + 6;

    p.vx = Math.cos(angle) * power;
    p.vy = Math.sin(angle) * power;
    p.locked = false;
  }
  singularity = null;
}

// ======================
// ANIMATION
// ======================
function animate() {
  // Motion trails
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw singularity
  if (isHolding && singularity) {
    ctx.beginPath();
    ctx.arc(singularity.x, singularity.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  for (let p of particles) {
    p.update();
    p.draw();
  }

  requestAnimationFrame(animate);
}

animate();
