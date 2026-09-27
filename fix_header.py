def fix_layout():
    # 1. Fix duplicate HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    import re
    # Remove any Bảng Vàng link first
    html = re.sub(r'<a href="#achievements" class="nav-item">.*?Bảng Vàng</a>\s*', '', html)
    # Re-insert exactly once
    html = html.replace('<a href="#history" class="nav-item"><i class="fa-solid fa-landmark"></i> 60 Năm Vẻ Vang</a>', 
                        '<a href="#history" class="nav-item"><i class="fa-solid fa-landmark"></i> 60 Năm Vẻ Vang</a>\n        <a href="#achievements" class="nav-item"><i class="fa-solid fa-medal"></i> Bảng Vàng</a>')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    # 2. Fix CSS to prevent brand-text from wrapping
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
        
    # Add white-space: nowrap to brand elements
    css = css.replace('.brand-logo {', '.brand-logo {\n  flex-shrink: 0;\n  white-space: nowrap;')
    css = css.replace('.school-name {', '.school-name {\n  white-space: nowrap;')
    css = css.replace('.school-sub {', '.school-sub {\n  white-space: nowrap;')
    css = css.replace('.school-authority {', '.school-authority {\n  white-space: nowrap;')
    
    # We also need to add a brand-text class just in case the HTML uses it as a wrapper
    if '.brand-text {' not in css:
        css += '\n.brand-text {\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n'

    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Fixed layout")

fix_layout()
