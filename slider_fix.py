def add_slider():
    # 1. Update index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    slider_html = '''
    <!-- Background Slider (Ken Burns Effect) -->
    <div class="hero-bg-slider">
      <div class="slide slide-1"></div>
      <div class="slide slide-2"></div>
    </div>
    <div class="hero-overlay"></div>
'''

    if 'hero-bg-slider' not in html:
        html = html.replace('<section class="hero-section" id="countdown">', 
                            '<section class="hero-section" id="countdown">\n' + slider_html)
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Updated HTML")

    # 2. Update styles.css
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # Make hero-section transparent so slider is visible
    css = css.replace('background: linear-gradient(180deg, #e4f3fd 0%, #f0f8ff 70%, #ffffff 100%);', 'background: transparent;')

    slider_css = '''
/* ==========================================================================
   Moving Background (Slideshow & Ken Burns)
   ========================================================================== */
.hero-bg-slider {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  overflow: hidden;
  z-index: 0;
}

.hero-bg-slider .slide {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  animation: slideFade 16s infinite ease-in-out;
}

.hero-bg-slider .slide-1 {
  background-image: url('assets/school_bg1.jpg');
  animation-delay: 0s;
}

.hero-bg-slider .slide-2 {
  background-image: url('assets/school_bg2.jpg');
  animation-delay: 8s;
}

@keyframes slideFade {
  0% { opacity: 0; transform: scale(1); }
  10% { opacity: 1; }
  45% { opacity: 1; }
  55% { opacity: 0; }
  100% { opacity: 0; transform: scale(1.15); }
}

.hero-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  /* Light frosted gradient so text remains highly readable */
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(240, 248, 255, 0.85) 70%, var(--bg-body) 100%);
  z-index: 1;
}
'''
    if '.hero-bg-slider' not in css:
        css += slider_css
        with open('styles.css', 'w', encoding='utf-8') as f:
            f.write(css)
        print("Updated CSS")

add_slider()
