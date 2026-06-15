document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
      
      const icon = mobileMenuBtn.querySelector('ion-icon');
      if(isExpanded) {
        icon.setAttribute('name', 'close-outline');
      } else {
        icon.setAttribute('name', 'menu-outline');
      }
    });
  }

  // Sticky Navbar
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // Active Navigation Highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navAnchors = document.querySelectorAll('.nav-links a');
  navAnchors.forEach(a => {
    // Exact match or active for blog-posts
    if (a.getAttribute('href') === currentPath || (currentPath.includes('blog-post') && a.getAttribute('href') === 'blog.html')) {
      a.classList.add('active');
    }
  });

  // Scroll To Top Button
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.classList.add('scroll-top');
  scrollTopBtn.innerHTML = '<ion-icon name="arrow-up-outline"></ion-icon>';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Counter Animation
  const counters = document.querySelectorAll('.counter-num');
  const speed = 200;

  const animateCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target.toLocaleString(); // Add commas
        }
      };
      updateCount();
    });
  };

  // Intersection Observer for Counters
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  // Lightbox Functionality
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');

  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
    <button class="lightbox-prev" aria-label="Previous Image">&#10094;</button>
    <img src="" alt="Lightbox Image" class="lightbox-img">
    <button class="lightbox-next" aria-label="Next Image">&#10095;</button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;
  const validImages = Array.from(galleryItems).map(item => item.querySelector('img')).filter(img => img !== null);

  if (validImages.length > 0) {
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentIndex = index;
        openLightbox();
      });
    });

    const openLightbox = () => {
      lightboxImg.src = validImages[currentIndex].src;
      lightboxImg.alt = validImages[currentIndex].alt;
      lightbox.classList.add('active');
    };

    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : validImages.length - 1;
      openLightbox();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < validImages.length - 1) ? currentIndex + 1 : 0;
      openLightbox();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  const accordionItems = document.querySelectorAll('.accordion-item');
  if (accordionItems.length > 0) {
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        accordionItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  // Simple CSS Reveal logic instead of GSAP to ensure no conflicts
  const elementsToReveal = document.querySelectorAll('.card, .section-title, .about-preview-img, .about-preview-text, .stat-item, .impact-card, .blog-featured-img');
  elementsToReveal.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(index % 4) * 0.15}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('active');
        // revealObserver.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});
