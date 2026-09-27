/* --- EFFECTS.JS (MERGED) --- */
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

/* --- MAIN SCRIPT --- */
/**
 * ==========================================================================
 * KỶ NIỆM 60 NĂM THÀNH LẬP TRƯỜNG THPT TRẦN ĐẠI QUANG (KIM SƠN B) (1966 - 2026)
 * Script.js - Xử lý Đếm Ngược, Tích Hợp Giấy Mời, Cá Nhân Hóa Thiệp, Pháo Hoa & Lưu Bút
 * ==========================================================================
 */

// Cấu hình mốc thời gian theo Giấy mời chính thức (GMT+7 Việt Nam)
const DEFAULT_CONFIG = {
  day14: '2026-11-14T07:30:00+07:00', // Ngày Hội Khóa & Giao Lưu (07h30)
  day15: '2026-11-15T07:30:00+07:00', // Đại Lễ Kỷ Niệm 60 Năm (07h30)
  baseDate: '2026-01-01T00:00:00+07:00'
};

// Dữ liệu hình ảnh Giấy mời chính thức
const INVITATION_DATA = {
  main: {
    src: 'assets/invitation_p1_web.png',
    title: 'Giấy Mời Dự Lễ Kỷ Niệm 60 Năm Thành Lập Trường (Ngày 14 & 15/11/2026)',
    desc: 'Chương trình chi tiết Ngày 14 & Ngày 15 tháng 11 năm 2026 do Hiệu trưởng Nguyễn Mạnh Hà ký.'
  },
  prep: {
    src: 'assets/invitation_p2_web.png',
    title: 'Giấy Mời Dự Hội Nghị Họp Bàn Về Công Tác Tổ Chức (04/10/2026)',
    desc: 'Hội nghị họp bàn công tác tổ chức lễ kỷ niệm 60 năm vào 08h00 ngày 04/10/2026.'
  },
  cover: {
    src: 'assets/invitation_p3_web.png',
    title: 'Bìa Ngoài Giấy Mời & Phong Bì Kỷ Niệm 60 Năm',
    desc: 'Hình ảnh mặt ngoài và phong bì thiệp mời kỷ niệm 60 năm trường THPT Trần Đại Quang.'
  }
};

// State ứng dụng
let appState = {
  currentMode: 'day14', // 'day14' | 'day15' | 'dual'
  targetDate14: new Date(localStorage.getItem('thpt_target_14') || DEFAULT_CONFIG.day14),
  targetDate15: new Date(localStorage.getItem('thpt_target_15') || DEFAULT_CONFIG.day15),
  currentInvTab: 'main',
  audioPlaying: false,
  audioCtx: null,
  audioTimer: null,
  activeFilter: 'all'
};

// Dữ liệu lời chúc mẫu ban đầu
const INITIAL_WISHES = [
  {
    id: 1,
    name: "Phạm Quốc Tuấn",
    role: "Cựu học sinh",
    cohort: "Khóa 1970 - 1973 (Cấp 3B Kim Sơn)",
    message: "Nhớ mãi những năm tháng học tập dưới mái trường Cấp 3B Kim Sơn thời bom đạn, vừa học vừa đào hào tránh máy bay. 60 năm nhìn lại, trường đã đổi thay vượt bậc, rạng danh quê hương Kim Sơn ven biển. Chúc thầy và trò nhà trường luôn tự hào vững bước!",
    likes: 58,
    time: "3 ngày trước"
  },
  {
    id: 2,
    name: "Cô giáo Nguyễn Thị Minh",
    role: "Cựu giáo viên / Cán bộ",
    cohort: "Giảng dạy môn Văn (1985 - 2012)",
    message: "Gần 30 năm gắn bó dưới mái trường cấp 3B Kim Sơn thân yêu, mỗi chuyến đò tri thức cập bến là một niềm hạnh phúc khôn nguôi. Chúc Đại lễ 60 năm thành công rực rỡ, chúc ngôi trường mang tên cố Chủ tịch nước Trần Đại Quang mãi là cái nôi ươm mầm tài năng non sông!",
    likes: 76,
    time: "2 ngày trước"
  },
  {
    id: 3,
    name: "Trần Hoàng Long",
    role: "Cựu học sinh",
    cohort: "Khóa 1996 - 1999",
    message: "Nhớ kỷ niệm 30 năm trường khi chúng em còn là học sinh lớp 10, nay chớp mắt đã là đại lễ 60 năm 'Kiến tạo những ước mơ'! Kính chúc quý thầy cô luôn mạnh khỏe. Toàn thể cựu học sinh khóa 1996 - 1999 hẹn ngày 14 & 15/11/2026 sẽ tề tựu đông đủ!",
    likes: 42,
    time: "Hôm qua"
  },
  {
    id: 4,
    name: "Vũ Mai Phương",
    role: "Cựu học sinh",
    cohort: "Khóa 2013 - 2016",
    message: "Khóa chúng em vinh dự được dự lễ kỷ niệm 50 năm trường và chứng kiến thời khắc Bác Trần Đại Quang về thăm trường, cắt băng khánh thành cơ sở mới. Dù đi muôn phương, con sóng lòng vẫn luôn hướng về mái trường cấp 3B Kim Sơn!",
    likes: 51,
    time: "Hôm qua"
  },
  {
    id: 5,
    name: "Nguyễn Đức Anh",
    role: "Học sinh đang theo học",
    cohort: "Lớp 12A1 (Khóa 60: 2024 - 2027)",
    message: "Là học sinh khóa 60 của trường THPT Trần Đại Quang, chúng em vô cùng tự hào và quyết tâm đạt thành tích cao nhất trong các kỳ thi sắp tới để dâng tặng ngày hội trường trọng đại!",
    likes: 35,
    time: "5 giờ trước"
  }
];

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initSwitcher();
  initInvitationSection();
  initScheduleTabs();
  initWishesSystem();
  initFireworks();
  initAudioSystem();
  initCalendarAndShare();
  initSettingsModal();
  initMobileMenu();
});

/* ==========================================================================
   1. Đếm Ngược Thời Gian (Countdown Timer Engine)
   ========================================================================== */
function initCountdown() {
  updateCountdownValues();
  setInterval(updateCountdownValues, 1000);
}

function updateCountdownValues() {
  const now = new Date();
  
  // Mốc thời gian đơn hiện tại
  let currentTarget = appState.currentMode === 'day15' ? appState.targetDate15 : appState.targetDate14;
  let diff = currentTarget - now;

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const targetTitleEl = document.getElementById('target-event-title');

  if (diff <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    if (targetTitleEl) {
      targetTitleEl.innerHTML = `🎉 <strong>ĐẠI LỄ KỶ NIỆM 60 NĂM ĐANG DIỄN RA! CHÀO MỪNG TOÀN THỂ THẦY CÔ & CỰU HỌC SINH!</strong>`;
    }
  } else {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    if (targetTitleEl) {
      if (appState.currentMode === 'day14') {
        targetTitleEl.innerHTML = `Đang đếm ngược tới: <strong>Ngày Hội Ngộ & Hội Trại Khóa (07h30 Thứ Bảy, 14/11/2026)</strong>`;
      } else if (appState.currentMode === 'day15') {
        targetTitleEl.innerHTML = `Đang đếm ngược tới: <strong>Đại Lễ Chính Thức Kỷ Niệm 60 Năm (07h30 Chủ Nhật, 15/11/2026)</strong>`;
      }
    }
  }

  // Cập nhật Dual Countdown view
  updateDualCountdown(now);

  // Cập nhật thanh tiến trình %
  updateProgressBar(now, currentTarget);
}

function updateDualCountdown(now) {
  // Ngày 14
  const diff14 = appState.targetDate14 - now;
  if (diff14 > 0) {
    const d = Math.floor(diff14 / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff14 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff14 % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff14 % (1000 * 60)) / 1000);
    const d14El = document.getElementById('d14-days');
    if (d14El) {
      d14El.textContent = String(d).padStart(2, '0');
      document.getElementById('d14-hours').textContent = String(h).padStart(2, '0');
      document.getElementById('d14-minutes').textContent = String(m).padStart(2, '0');
      document.getElementById('d14-seconds').textContent = String(s).padStart(2, '0');
    }
  }

  // Ngày 15
  const diff15 = appState.targetDate15 - now;
  if (diff15 > 0) {
    const d = Math.floor(diff15 / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff15 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff15 % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff15 % (1000 * 60)) / 1000);
    const d15El = document.getElementById('d15-days');
    if (d15El) {
      d15El.textContent = String(d).padStart(2, '0');
      document.getElementById('d15-hours').textContent = String(h).padStart(2, '0');
      document.getElementById('d15-minutes').textContent = String(m).padStart(2, '0');
      document.getElementById('d15-seconds').textContent = String(s).padStart(2, '0');
    }
  }
}

function updateProgressBar(now, targetDate) {
  const baseStart = new Date(DEFAULT_CONFIG.baseDate);
  const totalDuration = targetDate - baseStart;
  const elapsed = now - baseStart;
  let percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  
  const fillEl = document.getElementById('progress-bar-fill');
  const textEl = document.getElementById('progress-percent');
  if (fillEl) fillEl.style.width = `${percent.toFixed(1)}%`;
  if (textEl) textEl.textContent = `${percent.toFixed(1)}%`;
}

/* ==========================================================================
   2. Bộ Chuyển Đổi Tab Đếm Ngược
   ========================================================================== */
function initSwitcher() {
  const tab14 = document.getElementById('tab-day14');
  const tab15 = document.getElementById('tab-day15');
  const tabDual = document.getElementById('tab-dual');
  const singleView = document.getElementById('single-countdown-view');
  const dualView = document.getElementById('dual-countdown-view');

  if (!tab14 || !tab15 || !tabDual) return;

  function setMode(mode) {
    appState.currentMode = mode;
    [tab14, tab15, tabDual].forEach(btn => btn.classList.remove('active'));

    if (mode === 'day14') {
      tab14.classList.add('active');
      singleView.style.display = 'block';
      dualView.style.display = 'none';
    } else if (mode === 'day15') {
      tab15.classList.add('active');
      singleView.style.display = 'block';
      dualView.style.display = 'none';
    } else {
      tabDual.classList.add('active');
      singleView.style.display = 'none';
      dualView.style.display = 'block';
    }
    updateCountdownValues();
  }

  tab14.addEventListener('click', () => setMode('day14'));
  tab15.addEventListener('click', () => setMode('day15'));
  tabDual.addEventListener('click', () => setMode('dual'));
}

/* ==========================================================================
   3. Tích Hợp Giấy Mời & Cá Nhân Hóa Thiệp
   ========================================================================== */
function initInvitationSection() {
  const tabMain = document.getElementById('inv-tab-main');
  const tabPrep = document.getElementById('inv-tab-prep');
  const tabCover = document.getElementById('inv-tab-cover');
  const invImg = document.getElementById('invitationImage');
  const imgBox = document.getElementById('invitationImageBox');
  const zoomBtn = document.getElementById('btn-zoom-invitation');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxCloseBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxTitle = document.getElementById('lightboxTitle');

  const tabs = [
    { btn: tabMain, key: 'main' },
    { btn: tabPrep, key: 'prep' },
    { btn: tabCover, key: 'cover' }
  ];

  tabs.forEach(item => {
    if (item.btn) {
      item.btn.addEventListener('click', () => {
        tabs.forEach(t => t.btn && t.btn.classList.remove('active'));
        item.btn.classList.add('active');
        appState.currentInvTab = item.key;
        const data = INVITATION_DATA[item.key];
        if (data && invImg) {
          invImg.src = data.src;
          invImg.alt = data.title;
        }
      });
    }
  });

  // Mở Lightbox xem toàn màn hình
  function openLightbox() {
    const data = INVITATION_DATA[appState.currentInvTab];
    if (lightboxModal && lightboxImg && data) {
      lightboxImg.src = data.src;
      if (lightboxTitle) lightboxTitle.innerHTML = `<i class="fa-solid fa-envelope-open text-ocean"></i> ${data.title}`;
      lightboxModal.classList.add('show');
    }
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('show');
  }

  if (imgBox) imgBox.addEventListener('click', openLightbox);
  if (zoomBtn) zoomBtn.addEventListener('click', openLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Tính năng cá nhân hóa thiệp mời
  const nameInput = document.getElementById('guest-name-input');
  const classInput = document.getElementById('guest-class-input');
  const generateBtn = document.getElementById('btn-generate-guest-card');
  const renderedName = document.getElementById('renderedGuestName');
  const renderedClass = document.getElementById('renderedGuestClass');
  const printBtn = document.getElementById('btn-print-card');
  const shareCardBtn = document.getElementById('btn-share-guest-card');

  if (generateBtn && nameInput && renderedName) {
    generateBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const cohort = classInput.value.trim();
      if (!name) {
        showToast('Vui lòng nhập họ và tên của bạn!', 'error');
        nameInput.focus();
        return;
      }
      renderedName.textContent = name;
      if (renderedClass) {
        renderedClass.textContent = cohort || "Cựu Học Sinh Trường THPT Trần Đại Quang (cấp 3B Kim Sơn)";
      }
      showToast(`✨ Đã tạo Giấy mời danh dự mang tên "${name}"!`);
      launchFireworksBurst();

      // Cuộn nhẹ xuống thiệp
      const renderCard = document.getElementById('digitalCardRender');
      if (renderCard) {
        renderCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (shareCardBtn) {
    shareCardBtn.addEventListener('click', () => {
      const name = renderedName ? renderedName.textContent : "Quý Thầy Cô & Cựu Học Sinh";
      const shareUrl = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${shareUrl}#invitation`).then(() => {
          showToast(`📋 Đã sao chép liên kết Giấy mời của ${name}! Bạn có thể gửi cho bạn bè ngay.`);
        });
      }
    });
  }
}

/* ==========================================================================
   4. Lịch Trình (Schedule Panels)
   ========================================================================== */
function initScheduleTabs() {
  const tab14 = document.getElementById('sched-tab-14');
  const tab15 = document.getElementById('sched-tab-15');
  const panel14 = document.getElementById('sched-panel-14');
  const panel15 = document.getElementById('sched-panel-15');

  if (!tab14 || !tab15 || !panel14 || !panel15) return;

  tab14.addEventListener('click', () => {
    tab14.classList.add('active');
    tab15.classList.remove('active');
    panel14.style.display = 'block';
    panel15.style.display = 'none';
  });

  tab15.addEventListener('click', () => {
    tab15.classList.add('active');
    tab14.classList.remove('active');
    panel15.style.display = 'block';
    panel14.style.display = 'none';
  });
}

/* ==========================================================================
   5. Sổ Lưu Bút Tri Ân (Guestbook System)
   ========================================================================== */
function initWishesSystem() {
  const form = document.getElementById('wish-form');
  const listEl = document.getElementById('wishes-list');
  const counterEl = document.getElementById('total-wishes-count');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!form || !listEl) return;

  let stored = localStorage.getItem('thpt_wishes_data');
  let wishes = stored ? JSON.parse(stored) : INITIAL_WISHES;

  function renderWishes() {
    listEl.innerHTML = '';
    const filtered = wishes.filter(w => {
      if (appState.activeFilter === 'alumni') return w.role.includes('học sinh');
      if (appState.activeFilter === 'teacher') return w.role.includes('giáo viên');
      return true;
    });

    if (counterEl) counterEl.textContent = wishes.length;

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="text-center text-muted py-4">Chưa có lời chúc nào trong mục này. Hãy là người đầu tiên gửi lời chúc!</div>`;
      return;
    }

    filtered.forEach(wish => {
      const item = document.createElement('div');
      item.className = 'wish-item';
      const initial = wish.name.trim().charAt(0).toUpperCase();

      item.innerHTML = `
        <div class="wish-item-header">
          <div class="wish-author-info">
            <div class="wish-avatar">${initial}</div>
            <div>
              <div class="wish-name">${escapeHtml(wish.name)}</div>
              <div class="wish-meta">${escapeHtml(wish.cohort || 'Cấp 3B Kim Sơn - Trần Đại Quang')}</div>
            </div>
          </div>
          <span class="wish-role-badge">${escapeHtml(wish.role)}</span>
        </div>
        <div class="wish-message">${escapeHtml(wish.message)}</div>
        <div class="wish-item-footer">
          <span><i class="fa-regular fa-clock"></i> ${escapeHtml(wish.time)}</span>
          <button class="like-wish-btn" data-id="${wish.id}">
            <i class="fa-solid fa-heart"></i> <span class="like-num">${wish.likes}</span>
          </button>
        </div>
      `;
      listEl.appendChild(item);
    });

    // Thả tim
    listEl.querySelectorAll('.like-wish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const targetWish = wishes.find(w => w.id === id);
        if (targetWish) {
          targetWish.likes += 1;
          btn.classList.add('liked');
          btn.querySelector('.like-num').textContent = targetWish.likes;
          saveWishes();
          showToast(`Đã thả tim lời chúc của ${targetWish.name}! ❤️`);
        }
      });
    });
  }

  function saveWishes() {
    localStorage.setItem('thpt_wishes_data', JSON.stringify(wishes));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('author-name').value.trim();
    const role = document.getElementById('author-role').value;
    const cohort = document.getElementById('author-cohort').value.trim();
    const message = document.getElementById('author-message').value.trim();

    if (!name || !message) {
      showToast('Vui lòng nhập họ tên và lời nhắn gửi!', 'error');
      return;
    }

    const newWish = {
      id: Date.now(),
      name,
      role,
      cohort: cohort || "Kỷ niệm 60 năm trường",
      message,
      likes: 1,
      time: "Vừa xong"
    };

    wishes.unshift(newWish);
    saveWishes();
    renderWishes();
    form.reset();
    showToast('✨ Lời chúc của bạn đã được ghi vào Sổ Vàng Kỷ Niệm 60 Năm!');
    launchFireworksBurst();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.activeFilter = btn.getAttribute('data-filter');
      renderWishes();
    });
  });

  renderWishes();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/* ==========================================================================
   6. Pháo Hoa & Hiệu Ứng - Được xử lý bởi effects.js (engine nâng cao)
   ========================================================================== */
function initFireworks() {
  // Toàn bộ hiệu ứng pháo hoa, confetti, sparkle, mưa vàng, bong bóng bay
  // đã được xử lý bởi file effects.js với engine nâng cao cấp độ cao.
  // File effects.js tự động gán window.launchFireworksBurst() toàn cục.
  // Các nút bấm và sự kiện cũng được effects.js tự xử lý.
}


/* ==========================================================================
   7. Âm Vang Tiếng Chuông Trường & Giai Điệu Biển (Web Audio API)
   ========================================================================== */
function initAudioSystem() {
  const audioBtn = document.getElementById('toggle-audio-btn');

  function getAudioContext() {
    if (!appState.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      appState.audioCtx = new AudioCtx();
    }
    if (appState.audioCtx.state === 'suspended') {
      appState.audioCtx.resume();
    }
    return appState.audioCtx;
  }

  function playSchoolChime() {
    const ctx = getAudioContext();
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [220.00, 261.63, 329.63, 440.00], // A Minor
      [174.61, 220.00, 261.63, 349.23], // F Major
      [196.00, 246.94, 293.66, 392.00]  // G Major
    ];
    let chordIdx = 0;

    function playNext() {
      if (!appState.audioPlaying) return;
      const currentNotes = chords[chordIdx % chords.length];
      currentNotes.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 3.3);
      });
      chordIdx++;
      appState.audioTimer = setTimeout(playNext, 3500);
    }

    playNext();
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (!appState.audioPlaying) {
        appState.audioPlaying = true;
        audioBtn.classList.add('playing');
        audioBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span class="btn-text">Đang phát</span>`;
        playSchoolChime();
        showToast('🎵 Đang phát giai điệu thanh âm mái trường & tiếng chuông ngân!');
      } else {
        appState.audioPlaying = false;
        audioBtn.classList.remove('playing');
        audioBtn.innerHTML = `<i class="fa-solid fa-music"></i> <span class="btn-text">Nhạc nền</span>`;
        if (appState.audioTimer) clearTimeout(appState.audioTimer);
        showToast('🔇 Đã tạm dừng nhạc nền.');
      }
    });
  }
}

/* ==========================================================================
   8. Lịch & Chia Sẻ
   ========================================================================== */
function initCalendarAndShare() {
  const calDropdownBtn = document.getElementById('calendarDropdownBtn');
  const calMenu = document.getElementById('calendarMenu');

  if (calDropdownBtn && calMenu) {
    calDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      calMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      calMenu.classList.remove('show');
    });
  }

  function makeGoogleCalUrl(title, startIso, endIso, desc, location) {
    const fmt = d => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const s = fmt(new Date(startIso));
    const e = fmt(new Date(endIso));
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${s}/${e}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(location)}`;
  }

  const google14 = document.getElementById('cal-google-14');
  if (google14) {
    google14.addEventListener('click', (e) => {
      e.preventDefault();
      const url = makeGoogleCalUrl(
        "Hội Khóa & Giao Lưu Kỷ Niệm 60 Năm THPT Trần Đại Quang",
        "2026-11-14T07:30:00+07:00",
        "2026-11-14T21:30:00+07:00",
        "Đón tiếp đại biểu, hội trại học sinh, giao lưu thể thao, dâng hương mộ cố Chủ tịch nước Trần Đại Quang và dạ hội văn nghệ.",
        "Trường THPT Trần Đại Quang, Xã Kim Sơn, Tỉnh Ninh Bình"
      );
      window.open(url, '_blank');
    });
  }

  const google15 = document.getElementById('cal-google-15');
  if (google15) {
    google15.addEventListener('click', (e) => {
      e.preventDefault();
      const url = makeGoogleCalUrl(
        "ĐẠI LỄ KỶ NIỆM 60 NĂM THÀNH LẬP TRƯỜNG THPT TRẦN ĐẠI QUANG (1966 - 2026)",
        "2026-11-15T07:30:00+07:00",
        "2026-11-15T12:00:00+07:00",
        "Đại lễ chính thức kỷ niệm 60 năm thành lập trường, chương trình nghệ thuật Mạch nguồn 60 năm và tiệc giao lưu.",
        "Trường THPT Trần Đại Quang, Xã Kim Sơn, Tỉnh Ninh Bình"
      );
      window.open(url, '_blank');
    });
  }

  const icsAll = document.getElementById('cal-ics-all');
  if (icsAll) {
    icsAll.addEventListener('click', (e) => {
      e.preventDefault();
      downloadIcsCalendar();
    });
  }

  document.querySelectorAll('.add-cal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.getAttribute('data-day');
      if (day === '14') {
        if (google14) google14.click();
      } else {
        if (google15) google15.click();
      }
    });
  });

  const shareFb = document.getElementById('share-facebook');
  if (shareFb) {
    shareFb.addEventListener('click', () => {
      const pageUrl = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, '_blank', 'width=600,height=450');
    });
  }

  const shareZalo = document.getElementById('share-zalo');
  if (shareZalo) {
    shareZalo.addEventListener('click', () => {
      const pageUrl = encodeURIComponent(window.location.href);
      window.open(`https://sp.zalo.me/share?url=${pageUrl}`, '_blank', 'width=600,height=450');
    });
  }

  const copyBtn = document.getElementById('copy-link-btn');
  const copyText = document.getElementById('copy-text');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        if (copyText) copyText.textContent = "Đã sao chép!";
        showToast("🔗 Đã sao chép liên kết trang web vào bộ nhớ tạm!");
        setTimeout(() => {
          if (copyText) copyText.textContent = "Sao chép link";
        }, 2500);
      });
    });
  }
}

function downloadIcsCalendar() {
  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//THPT Tran Dai Quang//Ky Niem 60 Nam//VI
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:thpt-tdq-60nam-day14@trandaiquang.edu.vn
DTSTART:20261114T003000Z
DTEND:20261114T143000Z
SUMMARY:Hội Khóa & Giao Lưu Kỷ Niệm 60 Năm THPT Trần Đại Quang
DESCRIPTION:Hội trại học sinh\\, dâng hương cố Chủ tịch nước Trần Đại Quang\\, dạ hội văn nghệ 60 năm.
LOCATION:Trường THPT Trần Đại Quang\\, Kim Sơn\\, Ninh Bình
STATUS:CONFIRMED
END:VEVENT
BEGIN:VEVENT
UID:thpt-tdq-60nam-day15@trandaiquang.edu.vn
DTSTART:20261115T003000Z
DTEND:20261115T053000Z
SUMMARY:ĐẠI LỄ KỶ NIỆM 60 NĂM THÀNH LẬP TRƯỜNG THPT TRẦN ĐẠI QUANG (1966 - 2026)
DESCRIPTION:Đại lễ chính thức kỷ niệm 60 năm ngày thành lập trường và Tri ân các thầy cô giáo.
LOCATION:Lễ đài sân trường THPT Trần Đại Quang\\, Kim Sơn\\, Ninh Bình
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'Giay_Moi_60_Nam_THPT_Tran_Dai_Quang.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("📅 Đã tải file lịch iCal (.ics) thành công!");
}

/* ==========================================================================
   9. Modal Tùy Chỉnh Giờ
   ========================================================================== */
function initSettingsModal() {
  const modal = document.getElementById('settingsModal');
  const openBtn = document.getElementById('open-settings-modal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = document.getElementById('modalBackdrop');
  const saveBtn = document.getElementById('save-dates-btn');
  const resetBtn = document.getElementById('reset-dates-btn');
  const input14 = document.getElementById('custom-date-14');
  const input15 = document.getElementById('custom-date-15');

  if (!modal || !openBtn) return;

  function toLocalInput(d) {
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  openBtn.addEventListener('click', () => {
    if (input14) input14.value = toLocalInput(appState.targetDate14);
    if (input15) input15.value = toLocalInput(appState.targetDate15);
    modal.classList.add('show');
  });

  function closeModal() {
    modal.classList.remove('show');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (input14 && input14.value) {
        appState.targetDate14 = new Date(input14.value);
        localStorage.setItem('thpt_target_14', appState.targetDate14.toISOString());
      }
      if (input15 && input15.value) {
        appState.targetDate15 = new Date(input15.value);
        localStorage.setItem('thpt_target_15', appState.targetDate15.toISOString());
      }
      updateCountdownValues();
      closeModal();
      showToast('⚙️ Đã cập nhật mốc thời gian thành công!');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      appState.targetDate14 = new Date(DEFAULT_CONFIG.day14);
      appState.targetDate15 = new Date(DEFAULT_CONFIG.day15);
      localStorage.removeItem('thpt_target_14');
      localStorage.removeItem('thpt_target_15');
      if (input14) input14.value = toLocalInput(appState.targetDate14);
      if (input15) input15.value = toLocalInput(appState.targetDate15);
      updateCountdownValues();
      closeModal();
      showToast('🔄 Đã khôi phục mốc thời gian chuẩn theo Giấy Mời!');
    });
  }
}

/* ==========================================================================
   10. Mobile Menu
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('show')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    navMenu.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('show');
        menuToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }
}

/* ==========================================================================
   11. Toast Notifications
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid fa-${type === 'error' ? 'circle-exclamation text-danger' : 'circle-check text-ocean'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

// ==========================================================================
// 3D TILT EFFECT & SCROLL REVEAL (APPLE PRO STYLE)
// ==========================================================================

// 1. Vanilla 3D Tilt cho các thẻ (Cards)
const tiltElements = document.querySelectorAll('.tilt-3d');
tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = x / rect.width - 0.5;
        const yPct = y / rect.height - 0.5;
        
        // Apple 3D depth params
        const rotateX = yPct * -15; // deg
        const rotateY = xPct * 15; // deg
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        el.style.transition = 'transform 0.1s ease-out';
        el.style.zIndex = '10';
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        el.style.zIndex = '1';
    });
});

// 2. Scroll Reveal Observer (Hiện ra khi cuộn)
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

document.querySelectorAll('.reveal-item').forEach(el => {
    revealObserver.observe(el);
});

// ==========================================================================
// THÔNG BÁO NHẮC NHỞ MỖI NGÀY
// ==========================================================================
const btnReminder = document.getElementById('btn-reminder');
if (btnReminder) {
    btnReminder.addEventListener('click', async () => {
        const email = prompt("Vui lòng nhập Email của bạn để nhận thông báo đếm ngược và nhắc nhở sự kiện mỗi ngày:");
        if (!email) return;
        
        // Basic email validation
        if (!email.includes('@') || !email.includes('.')) {
            alert("Email không hợp lệ. Vui lòng thử lại!");
            return;
        }

        const originalHTML = btnReminder.innerHTML;
        btnReminder.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-gold"></i> Đang đăng ký...';
        btnReminder.disabled = true;

        try {
            await fetch('https://formsubmit.co/ajax/tuvu31277@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: `[Đăng ký Nhắc Nhở] Đếm ngược 60 Năm từ ${email}`,
                    _replyto: email,
                    Email_Khach: email,
                    Thong_Bao: `Khách có email ${email} vừa đăng ký nhận thông báo nhắc nhở mỗi ngày về sự kiện Kỷ niệm 60 năm.`
                })
            });
            
            btnReminder.innerHTML = '<i class="fa-solid fa-check-circle" style="color: #10b981;"></i> Đã Đăng Ký Nhắc Nhở';
            alert(`Đăng ký thành công!\nHệ thống sẽ tự động gửi email nhắc nhở mỗi ngày đến: ${email}`);
        } catch(e) {
            btnReminder.innerHTML = originalHTML;
            btnReminder.disabled = false;
            alert("Lỗi kết nối. Vui lòng thử lại sau.");
        }
    });
}

// ==========================================================================
// SCHEDULE EVENT MODAL LOGIC
// ==========================================================================
const eventModal = document.getElementById('event-modal');
const closeEventModalBtn = document.getElementById('close-event-modal');
const emTime = document.getElementById('em-time');
const emTitle = document.getElementById('em-title');
const emLoc = document.getElementById('em-loc');
const emDesc = document.getElementById('em-desc');
const emExtended = document.getElementById('em-extended');

function getExtendedDetails(title) {
    const t = title.toLowerCase();
    if (t.includes('đón tiếp')) {
        return `<ul>
            <li>Check-in tại quầy đại biểu và nhận thẻ tên.</li>
            <li>Nhận bộ tài liệu và quà tặng kỷ niệm 60 năm.</li>
            <li>Ghi danh và lưu bút tại Sổ vàng truyền thống.</li>
            <li>Thưởng thức tiệc trà nhẹ tại sảnh chờ.</li>
        </ul>`;
    }
    if (t.includes('dâng hương')) {
        return `<ul>
            <li>Tập trung toàn thể đại biểu tại sân trường.</li>
            <li>Di chuyển trang trọng ra khu lưu niệm cố Chủ tịch nước.</li>
            <li>Thực hiện nghi thức dâng hương tưởng nhớ và tri ân.</li>
        </ul>`;
    }
    if (t.includes('gặp mặt') || t.includes('hội khóa')) {
        return `<ul>
            <li>Các khóa học sinh tự do tổ chức gặp mặt thầy cô giáo cũ.</li>
            <li>Tham quan Không gian trưng bày truyền thống 60 năm.</li>
            <li>Chụp ảnh lưu niệm tại các Photobooth được thiết kế riêng.</li>
            <li>Giao lưu, kết nối các thế hệ cựu học sinh Kim Sơn B.</li>
        </ul>`;
    }
    if (t.includes('dạ hội')) {
        return `<ul>
            <li>Chương trình biểu diễn nghệ thuật đặc sắc từ cựu học sinh.</li>
            <li>Nghi thức Đốt lửa trại truyền thống rực rỡ.</li>
            <li>Bùng nổ với không gian âm nhạc hiện đại, trẻ trung.</li>
        </ul>`;
    }
    if (t.includes('đại lễ chính thức')) {
        return `<ul>
            <li>Đón tiếp các đồng chí Lãnh đạo cấp cao, khách quý.</li>
            <li>Chương trình văn nghệ chào mừng hào hùng, hoành tráng.</li>
            <li>Lễ Chào cờ và Phút sinh hoạt truyền thống.</li>
            <li>Đọc Diễn văn kỷ niệm và Nghi thức Đánh trống trường.</li>
            <li>Lễ Công bố quyết định và Trao thưởng các danh hiệu cao quý.</li>
            <li>Phát biểu tri ân của các thế hệ học sinh.</li>
        </ul>`;
    }
    if (t.includes('tiệc giao lưu')) {
        return `<ul>
            <li>Dự tiệc thân mật toàn thể đại biểu, khách mời, cựu học sinh.</li>
            <li>Giao lưu văn nghệ tự do "Hát cho nhau nghe".</li>
            <li>Trao những cái ôm tạm biệt và bế mạc đại lễ.</li>
        </ul>`;
    }
    
    if (t.includes('khói lửa đạn bom')) {
        return `<ul>
            <li>Thành lập trong bối cảnh chiến tranh ác liệt.</li>
            <li>Học sinh và giáo viên vừa học vừa đào hào tránh bom.</li>
            <li>Chi viện hàng ngàn học sinh ưu tú lên đường nhập ngũ bảo vệ Tổ quốc.</li>
            <li>Đặt nền móng vững chắc cho truyền thống hiếu học của Kim Sơn B.</li>
        </ul>`;
    }
    if (t.includes('tái thiết')) {
        return `<ul>
            <li>Nhà trường chuyển từ lớp học tạm bợ sang xây dựng kiên cố.</li>
            <li>Đội ngũ giáo viên được củng cố và không ngừng nâng cao chuyên môn.</li>
            <li>Trở thành lá cờ đầu trong phong trào thi đua dạy tốt học tốt của tỉnh.</li>
            <li>Đào tạo ra nhiều thế hệ Lãnh đạo, Tướng lĩnh, Kỹ sư, Bác sĩ tài năng.</li>
        </ul>`;
    }
    if (t.includes('50 năm')) {
        return `<ul>
            <li>Tổ chức Đại lễ kỷ niệm 50 năm thành lập trường hoành tráng.</li>
            <li>Vinh dự đón tiếp Cố Chủ tịch nước Trần Đại Quang (Cựu học sinh ưu tú) về thăm trường.</li>
            <li>Cắt băng khánh thành cơ sở vật chất mới khang trang, hiện đại.</li>
            <li>Được Đảng và Nhà nước trao tặng nhiều phần thưởng cao quý.</li>
        </ul>`;
    }
    if (t.includes('60 năm')) {
        return `<ul>
            <li>Chính thức mang tên Trường THPT Trần Đại Quang theo quyết định của UBND Tỉnh.</li>
            <li>Khởi động chuỗi sự kiện Kỷ niệm 60 năm - Kiến tạo những ước mơ.</li>
            <li>Quy tụ hàng ngàn cựu học sinh các thời kỳ từ khắp mọi miền Tổ quốc.</li>
            <li>Bước vào kỷ nguyên giáo dục đổi mới, vươn tầm quốc gia.</li>
        </ul>`;
    }

    return `<ul><li>Đang cập nhật chi tiết chương trình...</li></ul>`;
}

document.querySelectorAll('.timeline-card, .stepper-content').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('h4').innerText;
        const desc = this.querySelector('p').innerText;
        
        let loc = '';
        const locEl = this.querySelector('.timeline-location');
        if (locEl) { loc = locEl.innerHTML; }
        
        // Find time from the sibling/parent structure
        const timelineItem = this.closest('.timeline-item');
        const stepperItem = this.closest('.stepper-row');
        let timeText = 'Chi tiết';
        if (timelineItem) {
            const timeEl = timelineItem.querySelector('.timeline-time .time');
            const dateEl = timelineItem.querySelector('.timeline-time .date');
            if (timeEl) timeText = timeEl.innerText;
            if (dateEl) timeText += ' - ' + dateEl.innerText;
        } else if (stepperItem) {
            const yearEl = stepperItem.querySelector('.stepper-year');
            if (yearEl) timeText = "Năm " + yearEl.innerText;
        }

        emTitle.innerText = title;
        emDesc.innerText = desc;
        emTime.innerText = timeText;
        emLoc.innerHTML = loc;
        emExtended.innerHTML = getExtendedDetails(title);

        eventModal.classList.add('show');
    });
});

if (closeEventModalBtn) {
    closeEventModalBtn.addEventListener('click', () => {
        eventModal.classList.remove('show');
    });
}
if (eventModal) {
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            eventModal.classList.remove('show');
        }
    });
}
document.getElementById('em-add-cal')?.addEventListener('click', () => {
    alert("Đã mở ứng dụng Lịch (Calendar) để thêm sự kiện này!");
});
