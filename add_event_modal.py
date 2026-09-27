def inject_event_modal():
    # 1. Update HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    modal_html = '''
  <!-- Event Detail Modal (Glassmorphism) -->
  <div id="event-modal" class="event-modal-overlay">
    <div class="event-modal-container">
      <button class="event-modal-close" id="close-event-modal"><i class="fa-solid fa-xmark"></i></button>
      <div class="event-modal-header">
        <div class="em-time-badge" id="em-time">07h30</div>
        <h3 id="em-title">Đón Tiếp Đại Biểu</h3>
        <div class="em-location" id="em-loc"><i class="fa-solid fa-location-dot"></i> <span>Sảnh chính</span></div>
      </div>
      <div class="event-modal-body">
        <p id="em-desc" class="em-desc">Mô tả ngắn...</p>
        <div class="em-divider"></div>
        <h4>Chi tiết chương trình:</h4>
        <div id="em-extended" class="em-extended-details">
          <!-- JS will inject list here -->
        </div>
      </div>
      <div class="event-modal-footer">
        <button class="btn btn-primary" style="width: 100%; border-radius: 12px; font-weight: bold;" id="em-add-cal">
          <i class="fa-regular fa-calendar-plus"></i> Đưa vào Lịch cá nhân
        </button>
      </div>
    </div>
  </div>
'''
    if 'id="event-modal"' not in html:
        html = html.replace('</body>', modal_html + '\n</body>')
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Injected HTML Modal")

    # 2. Update CSS
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    modal_css = '''
/* ==========================================================================
   Event Detail Modal (Apple Pro Pop-up)
   ========================================================================== */
.event-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 15, 30, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.2, 1);
}

.event-modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

.event-modal-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  width: 100%;
  max-width: 500px;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  transform: scale(0.95) translateY(20px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

.event-modal-overlay.show .event-modal-container {
  transform: scale(1) translateY(0);
}

.event-modal-close {
  position: absolute;
  top: 15px; right: 15px;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.05);
  border: none;
  font-size: 1.1rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.event-modal-close:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  transform: rotate(90deg);
}

.event-modal-header {
  padding: 30px 25px 20px;
  background: linear-gradient(180deg, var(--sea-50) 0%, rgba(255,255,255,0) 100%);
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.em-time-badge {
  display: inline-block;
  background: var(--sea-gradient);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2);
}

.event-modal-header h3 {
  font-size: 1.4rem;
  color: var(--sea-900);
  font-weight: 800;
  margin-bottom: 8px;
  line-height: 1.3;
}

.em-location {
  font-size: 0.85rem;
  color: var(--coral-600);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.event-modal-body {
  padding: 25px;
}

.em-desc {
  font-size: 0.95rem;
  color: var(--text-sub);
  line-height: 1.6;
  margin-bottom: 15px;
}

.em-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent);
  margin: 20px 0;
}

.event-modal-body h4 {
  font-size: 0.95rem;
  color: var(--sea-800);
  margin-bottom: 12px;
  font-weight: 700;
}

.em-extended-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.em-extended-details li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
}
.em-extended-details li::before {
  content: '✦';
  position: absolute;
  left: 0; top: 0;
  color: var(--coral-500);
  font-size: 0.8rem;
}

.event-modal-footer {
  padding: 20px 25px;
  background: #fafcff;
  border-top: 1px solid rgba(0,0,0,0.04);
}

/* Add a visual cue to timeline cards */
.timeline-card::after {
  content: 'Chạm để xem chi tiết ➝';
  display: block;
  margin-top: 15px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--sea-500);
  opacity: 0.6;
  transition: opacity 0.3s;
}
.timeline-card:hover::after {
  opacity: 1;
}
'''
    if '.event-modal-overlay' not in css:
        css += modal_css
        with open('styles.css', 'w', encoding='utf-8') as f:
            f.write(css)
        print("Injected CSS Modal")

    # 3. Update JS
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()

    modal_js = '''
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
    return `<ul><li>Đang cập nhật chi tiết chương trình...</li></ul>`;
}

document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('h4').innerText;
        const desc = this.querySelector('p').innerText;
        
        let loc = '';
        const locEl = this.querySelector('.timeline-location');
        if (locEl) { loc = locEl.innerHTML; }
        
        // Find time from the sibling/parent structure
        const timelineItem = this.closest('.timeline-item');
        let timeText = 'Chi tiết sự kiện';
        if (timelineItem) {
            const timeEl = timelineItem.querySelector('.timeline-time .time');
            const dateEl = timelineItem.querySelector('.timeline-time .date');
            if (timeEl) timeText = timeEl.innerText;
            if (dateEl) timeText += ' - ' + dateEl.innerText;
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
'''
    if 'SCHEDULE EVENT MODAL LOGIC' not in js:
        js += modal_js
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print("Injected JS Modal logic")

inject_event_modal()
