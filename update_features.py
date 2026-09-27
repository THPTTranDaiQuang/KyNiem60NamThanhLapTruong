def update_files():
    # 1. Update HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Change "Huyện Kim Sơn" to "Xã Kim Sơn"
    html = html.replace('Huyện Kim Sơn, Tỉnh Ninh Bình', 'Xã Kim Sơn, Tỉnh Ninh Bình')
    
    # Add Notification Button in Hero Section
    reminder_btn = '''
      <div class="reminder-action" style="margin-top: 15px;">
        <button id="btn-reminder" class="hero-badge" style="cursor: pointer; background: rgba(255,255,255,0.7); transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid var(--border-sea);">
          <i class="fa-regular fa-bell fa-shake text-gold"></i> Bật Nhắc Nhở Đếm Ngược Mỗi Ngày
        </button>
      </div>'''
    
    if 'id="btn-reminder"' not in html:
        # Insert below the progress bar or countdown cards
        # Let's place it after the countdown-display
        html = html.replace('</div>\n    </div>\n  </section>', reminder_btn + '\n    </div>\n  </section>')

    # Add interactive classes to cards
    html = html.replace('class="achieve-card tilt-3d reveal-item', 'class="achieve-card interactive-card tilt-3d reveal-item')
    html = html.replace('class="contact-card tilt-3d reveal-item"', 'class="contact-card interactive-card tilt-3d reveal-item"')
    html = html.replace('class="timeline-card reveal-item"', 'class="timeline-card interactive-card reveal-item"')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    # 2. Update CSS
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    css_interactive = '''
/* ==========================================================================
   Interactive Card Effects (Lật, Nổi bật, Dìm)
   ========================================================================== */
.interactive-card {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease !important;
  cursor: pointer;
}

/* Nổi bật thẻ (Pop-out) khi đưa chuột vào */
.interactive-card:hover {
  transform: translateY(-12px) scale(1.02) !important;
  box-shadow: 0 25px 40px rgba(2, 132, 199, 0.15) !important;
  border-color: rgba(255, 255, 255, 1) !important;
  z-index: 10;
}

/* Dìm thẻ (Sink) khi bấm chuột vào */
.interactive-card:active {
  transform: translateY(4px) scale(0.96) !important;
  box-shadow: 0 5px 10px rgba(2, 132, 199, 0.1) !important;
}

#btn-reminder:hover {
  transform: scale(1.05);
  background: #fff !important;
}
#btn-reminder:active {
  transform: scale(0.95);
}
'''
    if '.interactive-card' not in css:
        css += css_interactive

    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)

    # 3. Update JS for the Reminder button
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()

    js_reminder = '''
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
            alert(`Đăng ký thành công!\\nHệ thống sẽ tự động gửi email nhắc nhở mỗi ngày đến: ${email}`);
        } catch(e) {
            btnReminder.innerHTML = originalHTML;
            btnReminder.disabled = false;
            alert("Lỗi kết nối. Vui lòng thử lại sau.");
        }
    });
}
'''
    if 'btnReminder.addEventListener' not in js:
        js += js_reminder
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(js)

    print("Successfully updated all files")

update_files()
