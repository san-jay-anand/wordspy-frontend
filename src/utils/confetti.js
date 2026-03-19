// Pure CSS canvas confetti — no libraries needed!

export function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 9999;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#7c6af5","#1fcfb4","#f04d5a","#f5a623","#06d6a0","#ff9f1c","#e63946"];
  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height - canvas.height,
      w:      Math.random() * 10 + 5,
      h:      Math.random() * 5 + 3,
      color:  colors[Math.floor(Math.random() * colors.length)],
      speed:  Math.random() * 4 + 2,
      angle:  Math.random() * 360,
      spin:   Math.random() * 10 - 5,
      drift:  Math.random() * 2 - 1,
    });
  }

  let frame;
  let elapsed = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elapsed++;

    particles.forEach(p => {
      p.y     += p.speed;
      p.x     += p.drift;
      p.angle += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / 200);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < 200) {
      frame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(frame);
      document.body.removeChild(canvas);
    }
  }

  animate();
}