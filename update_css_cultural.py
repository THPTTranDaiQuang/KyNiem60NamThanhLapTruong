def update_css():
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    new_css = '''
/* ==========================================================================
   Trống Đồng Background & Lous Divider
   ========================================================================== */
.trong-dong-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 900px;
  height: 900px;
  object-fit: contain;
  opacity: 0.25;
  transform: translate(-50%, -50%);
  animation: spin-slow 180s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes spin-slow {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@media (max-width: 768px) {
  .trong-dong-bg {
    width: 500px;
    height: 500px;
    opacity: 0.2;
  }
}

.lotus-divider {
  display: flex;
  justify-content: center;
  margin-top: -10px;
  margin-bottom: 5px;
}

/* ==========================================================================
   Achievements Section (Bảng Vàng Thành Tích)
   ========================================================================== */
.achievements-section {
  padding: 80px 0;
  background: var(--sea-lightest);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 25px;
  margin-top: 40px;
}

.achieve-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-lg);
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.achieve-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, transparent 100%);
  pointer-events: none;
}

.achieve-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.achieve-card h4 {
  color: var(--sea-900);
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.achieve-card p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}
'''
    if '.trong-dong-bg' not in css:
        css += new_css
        with open('styles.css', 'w', encoding='utf-8') as f:
            f.write(css)
        print("CSS updated")
    else:
        print("CSS already updated")

update_css()
