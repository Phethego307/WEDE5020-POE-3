// Projects page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // ---------- Image lightbox ----------
    const images = Array.from(document.querySelectorAll('section img, article img'));
    if (images.length) {
        const modal = document.createElement('div');
        modal.id = 'img-modal';
        modal.style.cssText = `
            position: fixed; inset: 0; display: none; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.8); z-index: 10000; padding: 20px;
        `;
        const modalImg = document.createElement('img');
        modalImg.style.maxWidth = '95%';
        modalImg.style.maxHeight = '90%';
        modalImg.alt = '';
        const caption = document.createElement('div');
        caption.style.cssText = 'color:#fff; margin-top:12px; text-align:center; max-width:95%;';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.setAttribute('aria-label', 'Close image');
        closeBtn.style.cssText = 'position:absolute; top:18px; right:22px; font-size:28px; color:#fff; background:transparent; border:none; cursor:pointer;';
        modal.appendChild(closeBtn);
        const holder = document.createElement('div');
        holder.style.cssText = 'text-align:center';
        holder.appendChild(modalImg);
        holder.appendChild(caption);
        modal.appendChild(holder);
        document.body.appendChild(modal);

        function openModal(src, alt) {
            modalImg.src = src;
            modalImg.alt = alt || '';
            caption.textContent = alt || '';
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            modalImg.src = ''; // free memory
        }

        images.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                const src = img.dataset.src || img.src;
                openModal(src, img.alt || '');
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target === closeBtn) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ---------- Animate progress (project pledge) ----------
    const progressEl = document.querySelector('progress');
    if (progressEl) {
        const max = parseInt(progressEl.getAttribute('max')) || 100;
        // demo target: if author provided data-pledged use it, otherwise pick a visible demo value (20% of max)
        const demoTarget = parseInt(progressEl.getAttribute('data-pledged')) || Math.min(Math.floor(max * 0.2), max);
        const labelP = Array.from(progressEl.parentElement.querySelectorAll('p')).find(p => /of\s+[\d,]+/i.test(p.textContent)) || null;

        let current = 0;
        const step = Math.max(1, Math.floor(demoTarget / 60));
        const interval = setInterval(() => {
            current += step;
            if (current >= demoTarget) current = demoTarget;
            progressEl.value = current;
            if (labelP) {
                const formatted = current.toLocaleString();
                const maxFormatted = max.toLocaleString();
                labelP.textContent = `${formatted} of ${maxFormatted} trees pledged`;
            }
            if (current >= demoTarget) clearInterval(interval);
        }, 20);
    }

    // ---------- Stats counters ----------
    const statEls = Array.from(document.querySelectorAll('.stats h3, .stats-grid h3, table td h3, .stat-card h3'));
    const numberRegex = /[\d,]+/;
    if (statEls.length) {
        const playCounters = (el) => {
            if (el.dataset.animated) return;
            const text = el.textContent.trim();
            const match = text.match(numberRegex);
            if (!match) return;
            const raw = match[0].replace(/,/g, '');
            const hasPlus = text.includes('+');
            const target = parseInt(raw, 10) || 0;
            let current = 0;
            const steps = 60;
            const inc = Math.max(1, Math.floor(target / steps));
            const timer = setInterval(() => {
                current += inc;
                if (current >= target) current = target;
                el.textContent = current.toLocaleString() + (hasPlus ? '+' : '');
                if (current >= target) {
                    clearInterval(timer);
                    el.dataset.animated = '1';
                }
            }, 25);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    playCounters(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statEls.forEach(el => observer.observe(el));
    }

    // ---------- Simple fade-in images when they enter viewport ----------
    const lazyImgs = Array.from(document.querySelectorAll('img'));
    if ('IntersectionObserver' in window && lazyImgs.length) {
        const imgObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.transition = 'opacity 600ms ease, transform 600ms ease';
                    e.target.style.opacity = 1;
                    e.target.style.transform = 'translateY(0)';
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });

        lazyImgs.forEach(img => {
            img.style.opacity = 0;
            img.style.transform = 'translateY(14px)';
            imgObs.observe(img);
        });
    }

    // ---------- Back to top button ----------
    const topBtn = document.createElement('button');
    topBtn.id = 'back-to-top';
    topBtn.textContent = '↑';
    topBtn.title = 'Back to top';
    topBtn.style.cssText = `
        position: fixed; right: 18px; bottom: 18px; width:44px; height:44px;
        border-radius:6px; border:none; background:#2d5a27; color:#fff; font-size:20px;
        display:none; align-items:center; justify-content:center; cursor:pointer; z-index:10000;
    `;
    document.body.appendChild(topBtn);
    window.addEventListener('scroll', () => {
        topBtn.style.display = (window.scrollY > 300) ? 'flex' : 'none';
    });
    topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- Newsletter form validation (projects page form) ----------
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const email = form.querySelector('input[type="email"]');
            if (!email) return;
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(email.value.trim())) {
                e.preventDefault();
                // simple inline feedback
                const existing = form.querySelector('.form-msg');
                if (!existing) {
                    const msg = document.createElement('div');
                    msg.className = 'form-msg';
                    msg.style.cssText = 'color:#fff; background:#d32f2f; padding:8px; margin-top:8px; border-radius:4px;';
                    msg.textContent = 'Please enter a valid email address.';
                    form.appendChild(msg);
                    setTimeout(() => msg.remove(), 3000);
                }
            } else {
                // allow submit (or show simple thank you)
                e.preventDefault();
                const msg = document.createElement('div');
                msg.className = 'form-msg';
                msg.style.cssText = 'color:#fff; background:#2d5a27; padding:8px; margin-top:8px; border-radius:4px;';
                msg.textContent = 'Merci — vous êtes abonné(e) !';
                form.appendChild(msg);
                setTimeout(() => msg.remove(), 3000);
                form.reset();
            }
        });
    });

    // Progress bar animation
    const progressBars = document.querySelectorAll('progress');
    progressBars.forEach(progress => {
        const targetValue = parseInt(progress.getAttribute('value'));
        const maxValue = parseInt(progress.getAttribute('max'));
        let currentValue = 0;
        
        const animateProgress = () => {
            const increment = targetValue / 100;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    progress.value = targetValue;
                    clearInterval(timer);
                } else {
                    progress.value = currentValue;
                }
            }, 20);
        };
        
        // Start animation when progress bar is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgress();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(progress);
    });

    // Details element enhancement
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                this.style.backgroundColor = '#f8f9fa';
                this.style.borderRadius = '5px';
                this.style.padding = '10px';
            } else {
                this.style.backgroundColor = '';
                this.style.padding = '';
            }
        });
    });

    // Utility functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 10000;
            font-weight: bold;
            transition: all 0.3s ease;
            ${type === 'success' ? 'background: #2d5a27;' : 'background: #d32f2f;'}
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
});