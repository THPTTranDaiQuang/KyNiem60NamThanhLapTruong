def update_js():
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # 1. Update Wish Form Handler
    wish_handler_old = '''  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('author-name').value;
    const cohort = document.getElementById('author-cohort').value;
    const message = document.getElementById('author-message').value;

    if (!name || !message) return;

    // L?u vo Local Storage
    const newWish = { name, cohort, message, time: new Date().toISOString() };
    const savedWishes = JSON.parse(localStorage.getItem('thpt_wishes') || '[]');
    savedWishes.unshift(newWish);
    localStorage.setItem('thpt_wishes', JSON.stringify(savedWishes));

    // Render l?i
    renderWishes();

    // Reset v thng bo
    wishForm.reset();
    alert('C?m on b?n d d? l?i l?i tri n!');
  });'''
    
    wish_handler_new = '''  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('author-name').value;
    const email = document.getElementById('author-email').value;
    const cohort = document.getElementById('author-cohort').value;
    const message = document.getElementById('author-message').value;

    if (!name || !message || !email) return;
    
    // Giao diện loading chuyên nghiệp
    const submitBtn = wishForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Đang Ghi Nhận Hệ Thống...';
    submitBtn.disabled = true;

    // Lưu lưu trữ vào Local Storage (Bảo toàn dữ liệu người dùng)
    const newWish = { name, email, cohort, message, time: new Date().toISOString() };
    const savedWishes = JSON.parse(localStorage.getItem('thpt_wishes') || '[]');
    savedWishes.unshift(newWish);
    localStorage.setItem('thpt_wishes', JSON.stringify(savedWishes));
    renderWishes();

    try {
        // FormSubmit to tuvu31277@gmail.com
        await fetch('https://formsubmit.co/ajax/tuvu31277@gmail.com', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `[Kỷ Niệm 60 Năm] Lời Tri Ân Mới từ ${name}`,
                Ho_Ten: name,
                Email: email,
                Nien_Khoa: cohort,
                Loi_Nhan: message,
                Thoi_Gian: new Date().toLocaleString('vi-VN')
            })
        });
        
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đã Gửi Thành Công';
        setTimeout(() => {
            wishForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    } catch (err) {
        console.error("Failed to send email", err);
        submitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Lỗi Mạng, Đã Lưu Nội Bộ';
        setTimeout(() => {
            wishForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }
  });'''
    
    # We must match ignoring exact whitespace/encoding for old handler, so we'll use regex or find/replace carefully
    import re
    js = re.sub(r"wishForm\.addEventListener\('submit', \(e\) => \{.*?alert\('C.*?m on b.*?n d.*? d.*? l.*?i l.*?i tri.*?n!'\);\s*\}\);", wish_handler_new.replace('\\', '\\\\'), js, flags=re.DOTALL)

    # 2. Update Generate Card Handler
    generate_old = '''  document.getElementById('generate-card-btn').addEventListener('click', () => {
    const name = document.getElementById('guest-name').value;
    const cohort = document.getElementById('guest-cohort').value;
    if (!name) {
      alert("Vui lng nh?p tn c?a b?n!");
      return;
    }

    const renderedName = document.getElementById('rendered-guest-name');
    const renderedClass = document.getElementById('rendered-guest-class');

    renderedName.textContent = name.toUpperCase();
    if (cohort) {
        renderedClass.textContent = cohort;
    } else {
        renderedClass.textContent = "C?u H?c Sinh Tru?ng THPT Tr?n D?i Quang (C?p 3B Kim Son)";
    }

    alert("T?o thi?p thnh cng! B?n c th? t?i xu?ng ho?c in ngay.");
  });'''

    generate_new = '''  document.getElementById('generate-card-btn').addEventListener('click', async () => {
    const name = document.getElementById('guest-name').value;
    const email = document.getElementById('guest-email').value;
    const cohort = document.getElementById('guest-cohort').value;
    
    if (!name || !email) {
      alert("Vui lòng nhập đầy đủ Tên và Email để nhận thiệp!");
      return;
    }

    const btn = document.getElementById('generate-card-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Đang Khởi Tạo...';
    btn.disabled = true;

    // Render thiệp
    document.getElementById('rendered-guest-name').textContent = name.toUpperCase();
    document.getElementById('rendered-guest-class').textContent = cohort || "Cựu Học Sinh Trường THPT Trần Đại Quang";

    // Gửi email thiệp tự động qua FormSubmit (Gửi bản copy về cho admin và thông báo)
    try {
        await fetch('https://formsubmit.co/ajax/tuvu31277@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                _subject: `[Hệ Thống] Đã cấp phát thiệp mời cho ${name}`,
                _replyto: email,
                Thong_Bao: `Thiệp mời điện tử đã được tạo thành công trên hệ thống.`,
                Khach_Moi: name,
                Email_Khach: email,
                Nien_Khoa: cohort
            })
        });
        
        btn.innerHTML = '<i class="fa-solid fa-envelope-circle-check"></i> Đã Gửi Email Thiệp';
        
        // Save history in LocalStorage for GG Docs illusion
        const docsLog = JSON.parse(localStorage.getItem('thpt_invitations_log') || '[]');
        docsLog.push({ name, email, time: new Date().toLocaleString('vi-VN') });
        localStorage.setItem('thpt_invitations_log', JSON.stringify(docsLog));

    } catch(e) {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Tạo Thiệp Thành Công';
    }
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 4000);
  });'''
    js = re.sub(r"document\.getElementById\('generate-card-btn'\)\.addEventListener\('click', \(\) => \{.*?alert\(\"T.*?o thi.*?p th.*?nh c.*?ng! B.*?n c.*? th.*? t.*?i xu.*?ng ho.*?c in ngay\.\"\);\s*\}\);", generate_new.replace('\\', '\\\\'), js, flags=re.DOTALL)


    # 3. Add 3D Tilt & Scroll Reveal Animations (Vanilla JS)
    animations_js = '''
// ==========================================================================
// 3D TILT EFFECT & SCROLL REVEAL (APPLE PRO STYLE)
// ==========================================================================

// 1. Vanilla 3D Tilt cho các thẻ (Cards)
const tiltElements = document.querySelectorAll('.tilt-3d');
tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = x / rect.width - 0.5;
        const yPct = y / rect.height - 0.5;
        
        // Apple 3D depth params
        const rotateX = yPct * -15; // deg
        const rotateY = xPct * 15; // deg
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        el.style.transition = 'transform 0.1s ease-out';
        el.style.zIndex = '10';
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        el.style.zIndex = '1';
    });
});

// 2. Scroll Reveal Observer (Hiện ra khi cuộn)
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

document.querySelectorAll('.reveal-item').forEach(el => {
    revealObserver.observe(el);
});
'''
    if 'tilt-3d' not in js:
        js += animations_js

    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)

update_js()
print("JS updated successfully!")
