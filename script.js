const body = document.body;
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

const toggleMobileMenu = (open) => {
  if (!mobileMenu || !burger) return;
  const isOpen = open ?? !mobileMenu.classList.contains('is-open');
  mobileMenu.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  body.style.overflow = isOpen ? 'hidden' : '';
};

if (burger) {
  burger.addEventListener('click', () => toggleMobileMenu());
}

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => toggleMobileMenu(false));
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let currentIndex = 0;

const openLightbox = (index = 0) => {
  if (!lightbox || !lightboxImage || galleryItems.length === 0) return;
  currentIndex = index;
  const target = galleryItems[currentIndex];
  const src = target?.getAttribute('data-full') || target?.querySelector('img')?.src;
  if (src) {
    lightboxImage.src = src;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  }
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
};

const showNext = (direction = 1) => {
  if (galleryItems.length === 0) return;
  currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
  const target = galleryItems[currentIndex];
  const src = target?.getAttribute('data-full') || target?.querySelector('img')?.src;
  if (src) {
    lightboxImage.classList.add('is-fading');
    window.setTimeout(() => {
      lightboxImage.src = src;
      lightboxImage.classList.remove('is-fading');
    }, 180);
  }
};

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

const openAllBtn = document.querySelector('[data-open-lightbox]');
if (openAllBtn) {
  openAllBtn.addEventListener('click', () => openLightbox(0));
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', () => showNext(-1));
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', () => showNext(1));
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', (event) => {
  if (!lightbox || !lightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') showNext(1);
  if (event.key === 'ArrowLeft') showNext(-1);
});

const momentsStrip = document.querySelector('.moments-strip');
const momentsPrev = document.querySelector('.moments-prev');
const momentsNext = document.querySelector('.moments-next');

const initMomentsCarousel = () => {
  if (!momentsStrip) return;
  if (momentsStrip.dataset.inited === 'true') return;

  const originals = Array.from(momentsStrip.querySelectorAll('img'));
  if (originals.length < 2) return;

  const firstClone = originals[0].cloneNode(true);
  const lastClone = originals[originals.length - 1].cloneNode(true);
  firstClone.dataset.clone = 'true';
  lastClone.dataset.clone = 'true';
  momentsStrip.insertBefore(lastClone, originals[0]);
  momentsStrip.appendChild(firstClone);

  let index = 1;
  const gap = 20;

  const getItemWidth = () => {
    const item = momentsStrip.querySelector('img');
    if (!item) return 0;
    return item.getBoundingClientRect().width + gap;
  };

  const setTransform = (withTransition = true) => {
    if (withTransition) {
      momentsStrip.style.transition = 'transform 0.45s ease';
    } else {
      momentsStrip.style.transition = 'none';
    }
    const itemWidth = getItemWidth();
    momentsStrip.style.transform = `translateX(${-index * itemWidth}px)`;
  };

  const move = (direction) => {
    index += direction;
    setTransform(true);
  };

  momentsStrip.addEventListener('transitionend', () => {
    if (index === originals.length + 1) {
      index = 1;
      setTransform(false);
      requestAnimationFrame(() => setTransform(true));
    }
    if (index === 0) {
      index = originals.length;
      setTransform(false);
      requestAnimationFrame(() => setTransform(true));
    }
  });

  if (momentsPrev) {
    momentsPrev.addEventListener('click', () => move(-1));
  }

  if (momentsNext) {
    momentsNext.addEventListener('click', () => move(1));
  }

  window.addEventListener('resize', () => setTransform(false));
  setTransform(false);
  momentsStrip.dataset.inited = 'true';
};

initMomentsCarousel();

const toggleButtons = document.querySelectorAll('.toggle-btn');
const priceNodes = document.querySelectorAll('.price[data-weekday]');
const toggleIndicator = document.querySelector('.toggle-indicator');

const updatePrices = (day) => {
  toggleButtons.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.day === day);
  });
  if (toggleIndicator) {
    toggleIndicator.style.transform = day === 'weekend' ? 'translateX(100%)' : 'translateX(0)';
  }
  priceNodes.forEach((price) => {
    const value = price.dataset[day];
    if (!value) return;
    price.classList.add('is-animating');
    window.setTimeout(() => {
      price.textContent = value;
      price.classList.remove('is-animating');
    }, 180);
  });
};

toggleButtons.forEach((btn) => {
  btn.addEventListener('click', () => updatePrices(btn.dataset.day));
});

if (toggleButtons.length) {
  updatePrices(toggleButtons[0].dataset.day);
}

const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.15 }
);

sections.forEach((section) => observer.observe(section));

const revealTargets = document.querySelectorAll('.card, .price-card, .review-card, .glass-panel, .pet-avatar');
revealTargets.forEach((target) => {
  target.classList.add('reveal');
  observer.observe(target);
});

galleryItems.forEach((item) => observer.observe(item));

const petButtons = document.querySelectorAll('.pet-avatar');
const petName = document.getElementById('pet-name');
const petDesc = document.getElementById('pet-desc');
const petTags = document.getElementById('pet-tags');
const petPanel = document.getElementById('pet-panel');

const setActivePet = (button) => {
  if (!button || !petName || !petDesc || !petTags) return;
  if (petPanel) {
    petPanel.classList.add('is-updating');
    window.setTimeout(() => petPanel.classList.remove('is-updating'), 220);
  }
  petButtons.forEach((btn) => {
    btn.classList.remove('is-active');
    btn.setAttribute('aria-selected', 'false');
  });
  button.classList.add('is-active');
  button.setAttribute('aria-selected', 'true');
  petName.textContent = button.dataset.name || '';
  petDesc.textContent = button.dataset.desc || '';
  const tags = (button.dataset.tags || '').split(',').filter(Boolean);
  petTags.innerHTML = '';
  tags.forEach((tag) => {
    const span = document.createElement('span');
    span.textContent = tag.trim();
    petTags.appendChild(span);
  });
};

petButtons.forEach((button) => {
  button.addEventListener('mouseenter', () => setActivePet(button));
  button.addEventListener('focus', () => setActivePet(button));
  button.addEventListener('click', () => setActivePet(button));
});

if (petButtons.length) {
  setActivePet(petButtons[0]);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const heroCanvas = document.querySelector('.hero-dust');
if (heroCanvas && !prefersReducedMotion) {
  const ctx = heroCanvas.getContext('2d');
  const hero = document.querySelector('.hero');
  let particles = [];
  let canvasWidth = 0;
  let canvasHeight = 0;

  const resizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    canvasWidth = hero.offsetWidth;
    canvasHeight = hero.offsetHeight;
    heroCanvas.width = canvasWidth * dpr;
    heroCanvas.height = canvasHeight * dpr;
    heroCanvas.style.width = `${canvasWidth}px`;
    heroCanvas.style.height = `${canvasHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const createParticles = () => {
    const count = Math.min(80, Math.floor(canvasWidth / 28));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      r: 1 + Math.random() * 2.2,
      speed: 0.2 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.3,
      alpha: 0.08 + Math.random() * 0.12,
    }));
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'rgba(255, 236, 210, 0.8)';
    particles.forEach((p) => {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) {
        p.y = canvasHeight + 10;
        p.x = Math.random() * canvasWidth;
      }
      if (p.x < -10) p.x = canvasWidth + 10;
      if (p.x > canvasWidth + 10) p.x = -10;
    });
    requestAnimationFrame(animate);
  };

  resizeCanvas();
  createParticles();
  animate();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });
}

const siteCanvas = document.querySelector('.site-dust');
if (siteCanvas && !prefersReducedMotion) {
  const ctx = siteCanvas.getContext('2d');
  let particles = [];
  let width = 0;
  let height = 0;

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    siteCanvas.width = width * dpr;
    siteCanvas.height = height * dpr;
    siteCanvas.style.width = `${width}px`;
    siteCanvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const seed = () => {
    const count = Math.min(120, Math.floor(width / 10));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.6,
      speed: 0.08 + Math.random() * 0.2,
      drift: (Math.random() - 0.5) * 0.12,
      alpha: 0.04 + Math.random() * 0.08,
    }));
  };

  const tick = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 226, 196, 0.8)';
    particles.forEach((p) => {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
    });
    requestAnimationFrame(tick);
  };

  resize();
  seed();
  tick();
  window.addEventListener('resize', () => {
    resize();
    seed();
  });
}
