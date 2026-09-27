def update_css():
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Fix font-heading to fix the '60' vs '6o' issue.
    # Change Playfair Display to Montserrat
    css = css.replace("--font-heading: 'Playfair Display', serif;", "--font-heading: 'Montserrat', 'Be Vietnam Pro', sans-serif;")
    
    # 2. Make Nav bar text fit nicely on desktop (prevent wrapping)
    css = css.replace("gap: 16px;", "gap: 8px;") # In .nav-links
    css = css.replace("padding: 6px 12px;", "padding: 6px 8px;") # In .nav-item
    css = css.replace("font-size: 0.9rem;", "font-size: 0.85rem;") # In .nav-item
    css = css.replace("font-size: 1.05rem;", "font-size: 0.95rem;") # In .school-name

    # 3. Add responsive query for tablet/small desktop
    media_query = """
@media (max-width: 1200px) {
  .nav-item { padding: 4px 6px; font-size: 0.8rem; gap: 4px; }
  .school-name { font-size: 0.85rem; }
  .school-authority { font-size: 0.6rem; }
  .school-sub { font-size: 0.65rem; }
  .brand-logo { gap: 8px; }
  .btn-celebrate { font-size: 0.8rem; padding: 6px 12px; }
  .nav-links { gap: 6px; }
  .header-actions { gap: 6px; }
}
"""
    if '@media (max-width: 1200px)' not in css:
        css = css.replace('/* ==========================================================================\n   Responsive Breakpoints\n   ========================================================================== */', 
                         '/* ==========================================================================\n   Responsive Breakpoints\n   ========================================================================== */\n' + media_query)

    # Enhance overall mobile scaling for a more harmonious look
    css = css.replace('font-size: clamp(1.8rem, 4vw, 2.9rem);', 'font-size: clamp(1.5rem, 4vw, 2.8rem);') # hero title slightly smaller on very small screens
    
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)

update_css()
print("Done updating CSS!")
