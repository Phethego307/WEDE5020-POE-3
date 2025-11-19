document.addEventListener('DOMContentLoaded', function () {
  /* Auto-type (hero) */
  const typeEl = document.getElementById('hero-type');
  if (typeEl) {
    const words = ['Planting trees.', 'Educating communities.', 'Protecting habitats.', 'Building green futures.'];
    let wIndex = 0, charIndex = 0, deleting = false;
    const typeSpeed = 90, deleteSpeed = 45, pauseAfter = 1500;

    function tick() {
      const current = words[wIndex];
      if (!deleting) {
        charIndex++;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, pauseAfter);
          return;
        }
      } else {
        charIndex--;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wIndex = (wIndex + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
    }
    tick();
  }

  /* Simple carousel (only for project highlighting) */
  const carousel = document.querySelector('.project-carousel');
  if (carousel) {
    const slidesWrap = carousel.querySelector('.slides');
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    // ensure a dots container exists for this carousel
    let dotsContainer = carousel.querySelector('.carousel-dots');
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';
      carousel.appendChild(dotsContainer);
    }
    let current = 0;
    let autoplayInterval = 4000;
    let autoplayTimer;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slidesWrap.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    }

    function prev() { goTo(current - 1); resetAutoplay(); }
    function next() { goTo(current + 1); resetAutoplay(); }

    // dots
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.addEventListener('click', () => { goTo(i); resetAutoplay(); });
      dotsContainer.appendChild(btn);
    });

    function updateDots() {
      Array.from(dotsContainer.children).forEach((b, i) => {
        b.classList.toggle('active', i === current);
      });
    }

    prevBtn && prevBtn.addEventListener('click', prev);
    nextBtn && nextBtn.addEventListener('click', next);

    function startAutoplay() {
      autoplayTimer = setInterval(() => goTo(current + 1), autoplayInterval);
    }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    goTo(0);
    startAutoplay();

    // optional: support keyboard left/right
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  }

  // Smooth scrolling for anchor links
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              targetElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
          }
      });
  });

  // Image lazy loading
  const images = document.querySelectorAll('img');
  const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
          }
      });
  });

  images.forEach(img => {
      if (!img.complete) {
          imageObserver.observe(img);
      }
  });

  // Stats counter animation
  const statCards = document.querySelectorAll('.stat-card h3');
  const statsSection = document.querySelector('.stats');
  
  const animateStats = (entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              statCards.forEach(stat => {
                  const target = parseInt(stat.textContent.replace('+', ''));
                  const suffix = stat.textContent.includes('+') ? '+' : '';
                  let current = 0;
                  const increment = target / 50;
                  const timer = setInterval(() => {
                      current += increment;
                      if (current >= target) {
                          stat.textContent = target + suffix;
                          clearInterval(timer);
                      } else {
                          stat.textContent = Math.floor(current) + suffix;
                      }
                  }, 30);
              });
              observer.unobserve(entry.target);
          }
      });
  };

  const statsObserver = new IntersectionObserver(animateStats, { threshold: 0.5 });
  if (statsSection) {
      statsObserver.observe(statsSection);
  }

  // Newsletter form validation
  const newsletterForm = document.querySelector('form');
  if (newsletterForm && newsletterForm.querySelector('input[type="email"]')) {
      newsletterForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const emailInput = this.querySelector('input[type="email"]');
          const email = emailInput.value.trim();
          
          if (validateEmail(email)) {
              showMessage('Thank you for subscribing to our newsletter!', 'success');
              emailInput.value = '';
          } else {
              showMessage('Please enter a valid email address.', 'error');
          }
      });
  }

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