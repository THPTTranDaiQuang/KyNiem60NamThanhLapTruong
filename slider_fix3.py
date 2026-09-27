def add_slide_3():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace('<div class="slide slide-2"></div>', '<div class="slide slide-2"></div>\n      <div class="slide slide-3"></div>')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    css = css.replace('.hero-bg-slider .slide-2 {\n  background-image: url(\'assets/school_bg2.jpg\');\n  animation-delay: 8s;\n}', 
'''.hero-bg-slider .slide-2 {
  background-image: url('assets/school_bg2.jpg');
  animation-delay: 8s;
}

.hero-bg-slider .slide-3 {
  background-image: url('assets/school_bg3.jpg');
  animation-delay: 16s;
}''')

    css = css.replace('animation: slideFade 16s infinite ease-in-out;', 'animation: slideFade 24s infinite ease-in-out;')
    
    # Adjust keyframes for 3 images (each image visible for 1/3 of the time => 33.33%)
    # Let's rewrite the slideFade animation keyframes to fit 3 slides
    old_keyframes = '''@keyframes slideFade {
  0% { opacity: 0; transform: scale(1); }
  10% { opacity: 1; }
  45% { opacity: 1; }
  55% { opacity: 0; }
  100% { opacity: 0; transform: scale(1.15); }
}'''
    
    new_keyframes = '''@keyframes slideFade {
  0% { opacity: 0; transform: scale(1); }
  8% { opacity: 1; }
  25% { opacity: 1; }
  33% { opacity: 0; }
  100% { opacity: 0; transform: scale(1.15); }
}'''
    css = css.replace(old_keyframes, new_keyframes)

    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)

add_slide_3()
