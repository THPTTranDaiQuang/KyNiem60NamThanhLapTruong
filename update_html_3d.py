def update_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add email field to the Wish Form
    wish_form_old = '''<div class="form-group">
                <label for="author-name">Họ và Tên</label>
                <input type="text" id="author-name" class="form-control" placeholder="Nhập tên của bạn..." required>
              </div>'''
    wish_form_new = '''<div class="form-group">
                <label for="author-name">Họ và Tên</label>
                <input type="text" id="author-name" class="form-control" placeholder="Nhập tên của bạn..." required>
              </div>
              <div class="form-group">
                <label for="author-email">Email (Để nhà trường ghi nhận)</label>
                <input type="email" id="author-email" class="form-control" placeholder="Email của bạn..." required>
              </div>'''
    html = html.replace(wish_form_old, wish_form_new)

    # 2. Add email field to the Invitation Generator
    inv_form_old = '''<div class="form-group">
                  <label for="guest-name">Tên Khách Mời</label>
                  <input type="text" id="guest-name" class="form-control" placeholder="VD: Nguyễn Văn A" required>
                </div>'''
    inv_form_new = '''<div class="form-group">
                  <label for="guest-name">Tên Khách Mời</label>
                  <input type="text" id="guest-name" class="form-control" placeholder="VD: Nguyễn Văn A" required>
                </div>
                <div class="form-group">
                  <label for="guest-email">Email nhận thiệp</label>
                  <input type="email" id="guest-email" class="form-control" placeholder="Thiệp sẽ được gửi qua email này..." required>
                </div>'''
    html = html.replace(inv_form_old, inv_form_new)

    # 3. Add 'reveal-3d' classes for 3D scroll animations to various sections
    html = html.replace('<div class="stat-card">', '<div class="stat-card tilt-3d reveal-item">')
    html = html.replace('<div class="time-card">', '<div class="time-card tilt-3d">')
    html = html.replace('<div class="contact-card">', '<div class="contact-card tilt-3d reveal-item">')
    html = html.replace('<div class="timeline-card">', '<div class="timeline-card reveal-item">')
    html = html.replace('<div class="stepper-content">', '<div class="stepper-content reveal-item">')
    html = html.replace('<div class="invitation-viewer">', '<div class="invitation-viewer reveal-item">')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("HTML updated with 3D animation classes and email inputs.")

update_html()
