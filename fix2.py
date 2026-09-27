def fix_hrefs():
    with open('index.html', 'r', encoding='utf-8') as f:
        c = f.read()

    fb_link = 'https://www.facebook.com/profile.php?id=100070215815404'
    
    # Restore brand logo
    c = c.replace(f'<a href="{fb_link}" target="_blank" class="brand-logo">', '<a href="#" class="brand-logo">')
    
    # Restore calendar drop downs
    c = c.replace(f'<a href="{fb_link}" target="_blank" class="dropdown-item"', '<a href="#" class="dropdown-item"')
    
    # Fix the actual contact link properly
    c = c.replace(f'<p><a href="{fb_link}" target="_blank">Thêm liên kết</a></p>', f'<p><a href="{fb_link}" target="_blank">Truy cập Fanpage</a></p>')
    c = c.replace(f'<p><a href="{fb_link}" target="_blank">@thptkimsonb</a></p>', f'<p><a href="{fb_link}" target="_blank">Fanpage Nhà Trường</a></p>')
    
    # Also fix footer social links if any
    c = c.replace(f'<a href="{fb_link}" target="_blank" class="social-link"><i class="fa-brands fa-facebook"></i></a>', f'<a href="{fb_link}" target="_blank" class="social-link"><i class="fa-brands fa-facebook"></i></a>')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Done restoring hrefs")

fix_hrefs()
