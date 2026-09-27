/**
 * ==========================================================================
 * ✨ HIỆU ỨNG CHUYÊN NGHIỆP - TỐI ƯU HIỆU NĂNG
 * KỶ NIỆM 60 NĂM THPT TRẦN ĐẠI QUANG (1966 - 2026)
 * 
 * Chỉ giữ: Pháo hoa tinh tế + Confetti nhẹ khi tương tác
 * Không chạy nền liên tục — chỉ kích hoạt khi cần
 * ==========================================================================
 */
(function () {
  'use strict';

  const COLORS = [
    '#0ea5e9', '#38bdf8', '#7dd3fc',   // Xanh biển
    '#f59e0b', '#fbbf24',               // Vàng
    '#ea580c', '#ef4444',               // Cam, đỏ
    '#ffffff'                            // Trắng
  ];

  // ==================== CONFETTI (chỉ khi bấm) ====================
  class ConfettiPiece {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 14;
      this.vy = -(Math.random() * 10 + 4);
      this.gravity = 0.3;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 10;
      this.w = Math.random() * 8 + 4;
      this.h = Math.random() * 5 + 2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = 1;
      this.decay = 0.006 + Math.random() * 0.006;
    }

    update() {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.rotation += this.rotSpeed;
      this.alpha -= this.decay;
      return this.alpha > 0 && this.y < window.innerHeight + 30;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  // ==================== PHÁO HOA (gọn nhẹ) ====================
  class Rocket {
    constructor(startX, targetX, targetY) {
      this.x = startX;
      this.y = window.innerHeight + 5;
      this.tx = targetX;
      this.ty = targetY;
      this.angle = Math.atan2(targetY - this.y, targetX - startX);
      this.speed = 3;
      this.acc = 1.04;
      this.dist = Math.hypot(targetX - startX, targetY - this.y);
      this.traveled = 0;
      this.sx = startX;
      this.sy = this.y;
    }

    update() {
      this.speed *= this.acc;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.traveled = Math.hypot(this.x - this.sx, this.y - this.sy);
      return this.traveled < this.dist;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.cos(this.angle) * 10,
        this.y - Math.sin(this.angle) * 10
      );
      ctx.stroke();
      ctx.restore();
    }

    explode() {
      const sparks = [];
      const count = 35 + Math.floor(Math.random() * 15);
      const hue = [195, 210, 30, 45, 0][Math.floor(Math.random() * 5)];
      for (let i = 0; i < count; i++) {
        sparks.push(new Spark(this.tx, this.ty, hue));
      }
      return sparks;
    }
  }

  class Spark {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * 5 + 1.5;
      this.vx = Math.cos(a) * s;
      this.vy = Math.sin(a) * s;
      this.alpha = 1;
      this.decay = 0.015 + Math.random() * 0.01;
      this.hue = hue + (Math.random() - 0.5) * 20;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.vy += 0.04;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      return this.alpha > 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `hsl(${this.hue}, 100%, 65%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ==================== CONTROLLER ====================
  class Effects {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.confetti = [];
      this.rockets = [];
      this.sparks = [];
      this.running = false;
      this.raf = null;
    }

    init() {
      this.canvas = document.getElementById('fireworks-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.bind();

      // Pháo hoa khai mạc — 1 lần duy nhất, nhẹ
      setTimeout(() => this.fireShow(3), 600);
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    bind() {
      const btn = document.getElementById('fireworks-trigger-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          this.fireShow(4);
          this.confettiBurst(window.innerWidth / 2, window.innerHeight * 0.3, 50);
        });
      }

      const emblem = document.querySelector('.hero-emblem-img');
      if (emblem) {
        emblem.addEventListener('click', () => {
          const r = emblem.getBoundingClientRect();
          this.confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 40);
          this.fireShow(2);
        });
      }
    }

    confettiBurst(x, y, count) {
      for (let i = 0; i < count; i++) {
        this.confetti.push(new ConfettiPiece(x, y));
      }
      this.ensureRunning();
    }

    fireShow(count) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          this.rockets.push(new Rocket(
            w * 0.2 + Math.random() * w * 0.6,
            w * 0.1 + Math.random() * w * 0.8,
            h * 0.08 + Math.random() * h * 0.3
          ));
          this.ensureRunning();
        }, i * 350);
      }
    }

    ensureRunning() {
      if (this.running) return;
      this.running = true;
      this.loop();
    }

    loop() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Rockets
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        this.rockets[i].draw(ctx);
        if (!this.rockets[i].update()) {
          const newSparks = this.rockets[i].explode();
          this.sparks.push(...newSparks);
          this.rockets.splice(i, 1);
        }
      }

      // Sparks
      ctx.globalCompositeOperation = 'lighter';
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        this.sparks[i].draw(ctx);
        if (!this.sparks[i].update()) {
          this.sparks.splice(i, 1);
        }
      }

      // Confetti
      ctx.globalCompositeOperation = 'source-over';
      for (let i = this.confetti.length - 1; i >= 0; i--) {
        this.confetti[i].draw(ctx);
        if (!this.confetti[i].update()) {
          this.confetti.splice(i, 1);
        }
      }

      // Dừng khi hết hạt — không chạy nền lãng phí
      if (this.rockets.length === 0 && this.sparks.length === 0 && this.confetti.length === 0) {
        this.running = false;
        ctx.clearRect(0, 0, w, h);
        return;
      }

      this.raf = requestAnimationFrame(() => this.loop());
    }
  }

  // ==================== KHỞI CHẠY ====================
  document.addEventListener('DOMContentLoaded', () => {
    const fx = new Effects();
    fx.init();

    // Gán hàm toàn cục để script.js gọi được
    window.launchFireworksBurst = () => {
      fx.fireShow(3);
      fx.confettiBurst(window.innerWidth / 2, window.innerHeight * 0.35, 40);
    };

    // Confetti khi gửi lời chúc
    const form = document.getElementById('wish-form');
    if (form) {
      form.addEventListener('submit', () => {
        setTimeout(() => fx.confettiBurst(window.innerWidth / 2, window.innerHeight * 0.5, 30), 200);
      });
    }

    // Confetti khi tạo thiệp
    const genBtn = document.getElementById('btn-generate-guest-card');
    if (genBtn) {
      genBtn.addEventListener('click', () => {
        setTimeout(() => {
          fx.confettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 40);
          fx.fireShow(2);
        }, 100);
      });
    }
  });

})();
