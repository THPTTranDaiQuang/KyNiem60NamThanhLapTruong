import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace 'Kim Sơn B' to 'cấp 3B Kim Sơn'
    content = content.replace('Trường THPT Kim Sơn B', 'Trường cấp 3B Kim Sơn')
    content = content.replace('THPT Kim Sơn B', 'cấp 3B Kim Sơn')
    content = content.replace('Kim Sơn B', 'cấp 3B Kim Sơn')

    # 2. Fix 6o -> 60
    content = content.replace('6o', '60')
    content = content.replace('6O', '60')

    # 3. Facebook link
    fb_link = 'https://www.facebook.com/profile.php?id=100070215815404'
    content = re.sub(r'href="[^"]*?"([^>]*><i class="fa-brands fa-facebook")', rf'href="{fb_link}" target="_blank"\1', content)
    # Also look for any standalone facebook links in the contact card
    content = content.replace('href="#"', f'href="{fb_link}" target="_blank"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('index.html')
fix_file('script.js')
print('Done!')
