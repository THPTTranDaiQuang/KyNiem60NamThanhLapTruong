def update_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Insert Trống Đồng background into hero-section
    trong_dong_html = '\n    <!-- Trống Đồng Việt Nam Background -->\n    <img src="assets/trong_dong.png" alt="Trống Đồng" class="trong-dong-bg">\n'
    html = html.replace('<div class="hero-overlay"></div>', '<div class="hero-overlay"></div>' + trong_dong_html)

    # 2. Add Lotus separator and poetic description to Hero section
    lotus_svg = '''
      <div class="lotus-divider reveal-item">
        <svg width="80" height="60" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gold" style="margin: 15px auto;">
          <path d="M32 60C32 60 16 45 16 28C16 15 32 4 32 4C32 4 48 15 48 28C48 45 32 60 32 60Z"></path>
          <path d="M32 60C32 60 24 48 24 34C24 22 32 14 32 14C32 14 40 22 40 34C40 48 32 60 32 60Z"></path>
          <path d="M16 32C16 32 6 28 2 16C2 16 12 12 20 20C24 24 28 32 32 40"></path>
          <path d="M48 32C48 32 58 28 62 16C62 16 52 12 44 20C40 24 36 32 32 40"></path>
        </svg>
      </div>'''
    
    old_subtitle = '''Hành trình 60 năm - Nơi khởi nguồn của những ước mơ'''
    new_subtitle = '''Hành trình 60 năm - Nơi khởi nguồn của những ước mơ<br>
        Vang mãi tiếng sóng biển Kim Sơn và truyền thống hiếu học hào hùng'''
    html = html.replace(old_subtitle, new_subtitle)
    html = html.replace('Thành Lập Trường</h1>', 'Thành Lập Trường</h1>' + lotus_svg)

    # 3. Add "Bảng Vàng Thành Tích" section after History section
    achievements_section = '''
  <!-- Bảng Vàng Thành Tích Section -->
  <section class="achievements-section reveal-section" id="achievements">
    <div class="container text-center">
      <h2 class="section-title sea-gradient-text">Bảng Vàng Thành Tích</h2>
      <p class="section-subtitle">Phần thưởng cao quý ghi nhận truyền thống hào hùng và cống hiến không ngừng nghỉ của thày và trò trường THPT Trần Đại Quang</p>
      
      <div class="achievements-grid">
        <div class="achieve-card tilt-3d reveal-item">
          <div class="achieve-icon"><i class="fa-solid fa-medal text-gold"></i></div>
          <h4>Huân chương Lao động Hạng Nhì</h4>
          <p>Phần thưởng cao quý do Đảng và Nhà nước trao tặng, ghi nhận sự nỗ lực vượt bậc trong sự nghiệp giáo dục.</p>
        </div>
        
        <div class="achieve-card tilt-3d reveal-item" style="transition-delay: 0.15s;">
          <div class="achieve-icon"><i class="fa-solid fa-award text-gold"></i></div>
          <h4>Huân chương Lao động Hạng Ba</h4>
          <p>Dấu ấn tự hào của trường trên chặng đường phát triển và bồi dưỡng nhân tài cho quê hương Kim Sơn.</p>
        </div>

        <div class="achieve-card tilt-3d reveal-item" style="transition-delay: 0.3s;">
          <div class="achieve-icon"><i class="fa-solid fa-flag text-danger"></i></div>
          <h4>Cờ thi đua của Chính phủ</h4>
          <p>Đơn vị xuất sắc dẫn đầu phong trào thi đua, luôn sáng tạo và đổi mới trong dạy và học.</p>
        </div>

        <div class="achieve-card tilt-3d reveal-item" style="transition-delay: 0.45s;">
          <div class="achieve-icon"><i class="fa-solid fa-certificate text-ocean"></i></div>
          <h4>Trường Chuẩn Quốc Gia</h4>
          <p>Môi trường học tập hiện đại, uy tín, chắp cánh cho hàng ngàn thế hệ học sinh vươn xa.</p>
        </div>
      </div>
    </div>
  </section>
'''
    html = html.replace('</section>\n\n  <!-- Sổ Lưu Bút', '</section>\n' + achievements_section + '\n  <!-- Sổ Lưu Bút')

    # Also add achievements link to the nav menu
    old_nav = '<a href="#history" class="nav-item"><i class="fa-solid fa-landmark"></i> 60 Năm Vẻ Vang</a>'
    new_nav = old_nav + '\n        <a href="#achievements" class="nav-item"><i class="fa-solid fa-medal"></i> Bảng Vàng</a>'
    html = html.replace(old_nav, new_nav)

    # Make sure we save it
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Done")

update_html()
