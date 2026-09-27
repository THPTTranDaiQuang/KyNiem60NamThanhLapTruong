def enhance_ui():
    # 1. Update HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Add Canvas for birds and Music widget
    birds_and_music_html = '''
  <!-- Canvas for Flying Birds Cursor Effect -->
  <canvas id="bird-canvas" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9999;"></canvas>

  <!-- Floating Music Widget -->
  <div class="music-widget">
    <button class="music-toggle" id="music-toggle">
      <i class="fa-solid fa-music fa-beat" style="--fa-animation-duration: 2s;"></i>
    </button>
    <div class="music-menu" id="music-menu">
      <h4 style="margin-top:0; color: var(--sea-900); font-size: 1rem; margin-bottom: 12px;"><i class="fa-solid fa-headphones"></i> Giai Điệu Tri Ân</h4>
      <a href="https://www.youtube.com/results?search_query=b%E1%BB%A5i+ph%E1%BA%A5n+b%C3%A0i+h%C3%A1t" target="_blank" class="music-link">
        <i class="fa-solid fa-play"></i> Bụi Phấn (Ngày Nhà Giáo)
      </a>
      <a href="https://www.youtube.com/results?search_query=qu%C3%AA+h%C6%B0%C6%A1ng+kim+s%C6%A1n+ninh+b%C3%ACnh" target="_blank" class="music-link">
        <i class="fa-solid fa-play"></i> Giai điệu Quê hương Kim Sơn
      </a>
      <a href="https://www.youtube.com/results?search_query=mong+%C6%B0%E1%BB%9Bc+k%E1%BB%B7+ni%E1%BB%87m+x%C6%B0a" target="_blank" class="music-link">
        <i class="fa-solid fa-play"></i> Mong Ước Kỷ Niệm Xưa
      </a>
    </div>
  </div>
'''
    if 'id="bird-canvas"' not in html:
        html = html.replace('</body>', birds_and_music_html + '\n</body>')
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Injected HTML for Birds and Music")

    # 2. Update CSS
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    css_additions = '''
/* ==========================================================================
   Advanced Button Effects (Apple-like Tab Slider)
   ========================================================================== */
/* Nâng cấp các nút Tab (Chọn sự kiện, Chọn giấy mời) */
.tab-container {
  position: relative;
  display: inline-flex;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 6px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05), inset 0 2px 5px rgba(255,255,255,1);
  margin-bottom: 25px;
}

.tab-btn {
  position: relative;
  z-index: 2;
  background: transparent;
  border: none;
  padding: 12px 25px;
  font-weight: 700;
  color: var(--text-muted);
  border-radius: 40px;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s cubic-bezier(0.25, 1.5, 0.5, 1);
}

.tab-btn:hover {
  color: var(--sea-700);
  transform: scale(1.05);
}

.tab-btn.active {
  color: white;
  background: var(--sea-gradient);
  box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3);
  transform: scale(1.05);
}

/* ==========================================================================
   Floating Music Widget
   ========================================================================== */
.music-widget {
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 1000;
}

.music-toggle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,1);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  color: var(--sea-600);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1.5, 0.5, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-toggle:hover {
  transform: scale(1.15) rotate(10deg);
  color: var(--coral-500);
  background: white;
}

.music-menu {
  position: absolute;
  bottom: 65px;
  left: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 15px;
  width: 280px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px) scale(0.95);
  transform-origin: bottom left;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.music-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.music-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s;
  margin-bottom: 5px;
}
.music-link:last-child { margin-bottom: 0; }
.music-link:hover {
  background: var(--sea-50);
  color: var(--sea-700);
  transform: translateX(5px);
}
.music-link i {
  color: var(--coral-500);
}

@media (max-width: 768px) {
  .music-widget {
    bottom: 20px;
    left: 20px;
  }
}
'''
    if '.music-widget' not in css:
        css += css_additions
        with open('styles.css', 'w', encoding='utf-8') as f:
            f.write(css)
        print("Injected CSS for Buttons and Music")

    # 3. Update JS
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()

    js_additions = '''
// ==========================================================================
// MUSIC WIDGET LOGIC
// ==========================================================================
const musicToggle = document.getElementById('music-toggle');
const musicMenu = document.getElementById('music-menu');

if (musicToggle && musicMenu) {
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        musicMenu.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
        if (!musicMenu.contains(e.target) && e.target !== musicToggle) {
            musicMenu.classList.remove('show');
        }
    });
}

// ==========================================================================
// FLYING BIRDS MOUSE TRAIL (OPTIMIZED CANVAS)
// ==========================================================================
(function() {
    // Disable on mobile to save battery and prevent lag
    if (window.innerWidth <= 768) return;

    const canvas = document.getElementById('bird-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const birds = [];
    let mouse = { x: -1000, y: -1000 };
    let lastSpawn = 0;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        const now = Date.now();
        // Throttle spawn rate to prevent lag (max 1 bird per 50ms)
        if (now - lastSpawn > 50) {
            birds.push({
                x: mouse.x,
                y: mouse.y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2 - 1, // Tend to fly up
                life: 1.0,
                decay: 0.015 + Math.random() * 0.02,
                size: 4 + Math.random() * 4,
                flapSpeed: 0.1 + Math.random() * 0.2,
                angle: 0
            });
            lastSpawn = now;
        }
    });

    function drawBird(x, y, size, life, flapAngle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = life * 0.6; // Subtle opacity
        ctx.strokeStyle = '#0ea5e9'; // Sea blue color
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // Draw a simple "V" shaped bird with flapping wings
        ctx.beginPath();
        // Left wing
        ctx.moveTo(-size, -size * Math.sin(flapAngle));
        ctx.quadraticCurveTo(-size/2, 0, 0, 0);
        // Right wing
        ctx.quadraticCurveTo(size/2, 0, size, -size * Math.sin(flapAngle));
        ctx.stroke();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = birds.length - 1; i >= 0; i--) {
            let b = birds[i];
            b.x += b.vx;
            b.y += b.vy;
            b.life -= b.decay;
            b.angle += b.flapSpeed;

            if (b.life <= 0) {
                birds.splice(i, 1);
            } else {
                drawBird(b.x, b.y, b.size, b.life, b.angle);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation loop
    requestAnimationFrame(animate);
})();
'''
    if 'FLYING BIRDS MOUSE TRAIL' not in js:
        js += js_additions
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print("Injected JS for Birds and Music")

enhance_ui()
