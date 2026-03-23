// 1. Cursor
(function() {
  const cur = document.createElement('div');
  cur.id = 'cur';
  const curRing = document.createElement('div');
  curRing.id = 'cur-ring';
  
  document.body.appendChild(cur);
  document.body.appendChild(curRing);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Snappy
    cur.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function render() {
    // Lerp
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    curRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  const watchHoverElements = () => {
    const hoverElements = document.querySelectorAll('a, button, .clickable');
    hoverElements.forEach(el => {
      // Avoid attaching multiple times event handlers normally, but keeping it simple
      if(el.dataset.hoverwatched) return;
      el.dataset.hoverwatched = true;
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  };
  
  watchHoverElements();
  // Call once after a small delay in case of dynamic elements (e.g., pdf modal buttons)
  setTimeout(watchHoverElements, 500);
})();

// 2. Nav scroll class
(function() {
  const nav = document.querySelector('nav');
  if(!nav) return;
  window.addEventListener('scroll', () => {
    if(window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
})();

// 3. Active link
(function() {
  const links = document.querySelectorAll('.nav-links a');
  const path = window.location.pathname;
  let hasActive = false;
  links.forEach(link => {
    const href = link.getAttribute('href');
    if(href && path.includes(href)) {
      link.classList.add('active');
      hasActive = true;
    }
  });
  if (!hasActive && (path.endsWith('/') || path.endsWith('index.html'))) {
      const homeLink = document.querySelector('.nav-links a[href="index.html"]');
      if (homeLink) homeLink.classList.add('active');
  }
})();

// 4. Scroll reveal
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Run on dom ready
  document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  });
  // Also run immediately for dynamically added things
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
