def fix_history_and_buttons():
    # 1. Update HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Find the reminder block
    reminder_block = '''
      <div class="reminder-action" style="margin-top: 15px;">
        <button id="btn-reminder" class="hero-badge" style="cursor: pointer; background: rgba(255,255,255,0.7); transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid var(--border-sea);">
          <i class="fa-regular fa-bell fa-shake text-gold"></i> Bật Nhắc Nhở Đếm Ngược Mỗi Ngày
        </button>
      </div>'''
    
    # Replace all occurrences of reminder block with nothing
    html = html.replace(reminder_block, '')
    
    # Inject it ONLY exactly once under the hero section.
    # The hero section ends with </section>. We will find the countdown-display end.
    # Actually, I can just insert it after the countdown-cards.
    target_spot = '<div class="countdown-progress-container">'
    html = html.replace(target_spot, reminder_block + '\n        ' + target_spot)

    # Add interactive-card to stepper-content
    html = html.replace('class="stepper-content reveal-item"', 'class="stepper-content interactive-card reveal-item"')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    # 2. Update CSS
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
    
    # Add the "Chạm để xem chi tiết" hint to stepper-content too
    if '.stepper-content::after' not in css:
        hint_css = '''
.stepper-content::after {
  content: 'Chạm để xem chi tiết ➝';
  display: block;
  margin-top: 15px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--sea-500);
  opacity: 0.6;
  transition: opacity 0.3s;
}
.stepper-content:hover::after {
  opacity: 1;
}
'''
        css += hint_css
        with open('styles.css', 'w', encoding='utf-8') as f:
            f.write(css)

    # 3. Update JS
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()

    import re
    # Change querySelectorAll('.timeline-card') to querySelectorAll('.timeline-card, .stepper-content')
    js = js.replace("document.querySelectorAll('.timeline-card').forEach(card => {", "document.querySelectorAll('.timeline-card, .stepper-content').forEach(card => {")
    
    # Need to update time extraction for stepper-content because it uses .stepper-year
    time_extraction_old = '''        const timelineItem = this.closest('.timeline-item');
        let timeText = 'Chi tiết sự kiện';
        if (timelineItem) {
            const timeEl = timelineItem.querySelector('.timeline-time .time');
            const dateEl = timelineItem.querySelector('.timeline-time .date');
            if (timeEl) timeText = timeEl.innerText;
            if (dateEl) timeText += ' - ' + dateEl.innerText;
        }'''
    
    time_extraction_new = '''        const timelineItem = this.closest('.timeline-item');
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
        }'''
    js = js.replace(time_extraction_old, time_extraction_new)

    # Inject History details into getExtendedDetails
    if 'khói lửa đạn bom' not in js:
        details_to_insert = '''
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
'''
        # find the end of the function and insert
        js = js.replace('return `<ul><li>Đang cập nhật chi tiết chương trình...</li></ul>`;', details_to_insert + '\n    return `<ul><li>Đang cập nhật chi tiết chương trình...</li></ul>`;')

    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    
    print("Fixed history timeline effects and bugs")

fix_history_and_buttons()
