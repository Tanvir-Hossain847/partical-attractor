const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.size = 1.5;
  }

  update() {
  const dx = this.x - mouse.x;
  const dy = this.y - mouse.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 100) {
    this.vx -= dx / distance;
    this.vy -= dy / distance;
  }

  this.x += this.vx;
  this.y += this.vy;

  if (target) {
  const dx = target.x - this.x;
  const dy = target.y - this.y;
  const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;

  this.vx += dx / dist * 0.05;
  this.vy += dy / dist * 0.05;
}

}


  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 1000);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

const particles = [];

for (let i = 0; i < 20000; i++) {
  particles.push(new Particle());
}

function particlesCollapsed() {
  let closeCount = 0;

  for (let p of particles) {
    const dx = p.x - target.x;
    const dy = p.y - target.y;
    if (Math.sqrt(dx * dx + dy * dy) < 5) {
      closeCount++;
    }
  }

  return closeCount > particles.length * 0.9;
}


function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let p of particles) {
    p.update();
    p.draw();
  }

  if (target && particlesCollapsed()) {
  explode();
}


  requestAnimationFrame(animate);
}

function explode() {
  for (let p of particles) {
    const dx = p.x - target.x;
    const dy = p.y - target.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    p.vx = (dx / dist) * 8;
    p.vy = (dy / dist) * 8;
  }

  target = null;
}



let target = null;

window.addEventListener("click", (e) => {
  target = {
    x: e.x,
    y: e.y
  };
});


const mouse = {
  x: 0,
  y: 0
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});


animate();
