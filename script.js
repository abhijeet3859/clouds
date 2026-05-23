const dataUrl = 'data.json';

// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 2000);
  }
});

// Dark/Light Mode Toggle
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    htmlElement.classList.add('dark-mode');
    themeToggle?.querySelector('i')?.classList.replace('fa-moon', 'fa-sun');
  }
  
  themeToggle?.addEventListener('click', () => {
    htmlElement.classList.toggle('dark-mode');
    const isDark = htmlElement.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.querySelector('i').classList.toggle('fa-moon');
    themeToggle.querySelector('i').classList.toggle('fa-sun');
  });
}

// Mobile Menu Toggle
function setupMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navMenu?.classList.toggle('active');
  });
  
  navMenu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });
}

// Smooth Scrolling
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Typing Effect
function setupTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;
  
  const texts = window.portfolioData?.hero?.typingTexts || ['Full Stack Developer', 'Web Developer', 'UI/UX Enthusiast'];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      
      if (charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(() => {}, 500);
      }
    }
    
    setTimeout(type, isDeleting ? 50 : 100);
  }
  
  type();
}

// Animated Counters
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        const duration = 2000;
        const start = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.floor(target * progress);
          entry.target.textContent = value;
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

// Data Loading and Population
async function loadData() {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error(`Failed to load ${dataUrl}: ${response.status}`);
    const data = await response.json();
    window.portfolioData = data;
    populate(data);
  } catch (error) {
    console.error('Failed loading data', error);
    const aboutText = document.getElementById('about-text');
    if (aboutText) aboutText.textContent = 'Unable to load portfolio details right now.';
  }
}

function populate(data) {
  if (!data) return;

  const heroHeadline = document.getElementById('hero-headline');
  const heroSub = document.getElementById('hero-sub');
  const aboutText = document.getElementById('about-text');
  const ownerName = document.getElementById('owner-name');
  const currentYear = document.getElementById('current-year');

  if (heroHeadline) heroHeadline.textContent = data.hero?.headline || 'Hi, I\'m Abhijeet Prasad Shah';
  if (heroSub) heroSub.innerHTML = data.hero?.sub || 'I build modern web experiences.';
  if (aboutText) aboutText.textContent = data.about || aboutText.textContent;
  if (ownerName) ownerName.textContent = data.owner?.name || 'Your Name';
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  const contactPhone = document.getElementById('contact-phone');
  const contactEmail = document.getElementById('contact-email');
  const contactAddress = document.getElementById('contact-address');

  if (contactPhone) contactPhone.textContent = data.contact?.phone || '';
  if (contactEmail) {
    contactEmail.textContent = data.contact?.email || '';
    contactEmail.href = `mailto:${data.contact?.email || ''}`;
  }
  if (contactAddress) contactAddress.textContent = data.contact?.address || '';

  const brandName = document.querySelector('.contact-card-title strong');
  const brandRole = document.querySelector('.contact-card-title span');
  const brandLogo = document.querySelector('.contact-card-logo');
  if (brandName) brandName.textContent = data.owner?.name || 'Your Name';
  if (brandRole) brandRole.textContent = data.owner?.role || 'Developer';
  if (brandLogo && data.owner?.name) brandLogo.textContent = data.owner.name.trim().charAt(0).toUpperCase();

  populateSocialLinks(data.social || {});

  renderHeroStats(data.heroStats || []);
  renderServices(data.services || []);
  renderSkillsWithProgress(data.skills || []);
  renderTimeline(data.experience || []);
  renderProjectCards(data.projects || []);
  renderCertificates(data.certificates || []);
  renderTestimonials(data.testimonials || []);
  
  if (data.resume) {
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) resumeBtn.href = data.resume;
  }
}

// Render Services
function renderServices(services) {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;
  servicesGrid.innerHTML = '';
  
  services.forEach((service, index) => {
    const card = document.createElement('div');
    card.className = 'service-card animate-on-scroll';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', index * 100);
    card.innerHTML = `
      <div class="service-icon">${service.icon}</div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    `;
    servicesGrid.appendChild(card);
  });
}

// Render Skills with Progress Bars
function renderSkillsWithProgress(skills) {
  const skillsList = document.getElementById('skills-list');
  const skillsProgress = document.getElementById('skills-progress');
  
  if (!skillsList || !skillsProgress) return;
  
  skillsList.innerHTML = '';
  skillsProgress.innerHTML = '';
  
  skills.forEach((skill) => {
    // List view
    const li = document.createElement('li');
    li.className = 'skill-item animate-on-scroll';
    li.innerHTML = `
      <span class="skill-icon">${skill.icon || '•'}</span>
      <span class="skill-name">${skill.name}</span>
    `;
    skillsList.appendChild(li);
    
    // Progress bar view
    const progressItem = document.createElement('div');
    progressItem.className = 'skill-progress-item';
    progressItem.innerHTML = `
      <div class="skill-progress-label">
        <span>${skill.name}</span>
        <span>${skill.level}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="--progress-width: ${skill.level}%"></div>
      </div>
    `;
    skillsProgress.appendChild(progressItem);
  });
}

// Render Timeline
function renderTimeline(experiences) {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  timeline.innerHTML = '';
  
  experiences.forEach((exp, index) => {
    const item = document.createElement('div');
    item.className = 'timeline-item animate-on-scroll';
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', index * 100);
    
    item.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <h3>${exp.title}</h3>
        <div class="period">${exp.company} • ${exp.period}</div>
        <p>${exp.description}</p>
      </div>
    `;
    timeline.appendChild(item);
  });
}

// Render Certificates
function renderCertificates(certificates) {
  const certificatesGrid = document.getElementById('certificates-grid');
  if (!certificatesGrid) return;
  certificatesGrid.innerHTML = '';
  
  certificates.forEach((cert, index) => {
    const card = document.createElement('div');
    card.className = 'certificate-card animate-on-scroll';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', index * 100);
    
    card.innerHTML = `
      <div class="certificate-icon">🏆</div>
      <h3>${cert.title}</h3>
      <div class="certificate-issuer">${cert.issuer}</div>
      <div class="certificate-date">${cert.date}</div>
    `;
    certificatesGrid.appendChild(card);
  });
}

// Render Project Cards
function renderProjectCards(projects) {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;
  projectsGrid.innerHTML = '';
  
  projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card animate-on-scroll';
    card.dataset.tags = (project.tags || []).join(' ').toLowerCase();
    card.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description || ''}</p>
      <div class="muted project-tags">${(project.tags || []).join(' • ')}</div>
      <a class="btn" href="${project.url || '#'}" target="_blank" rel="noopener noreferrer">View</a>
    `;
    projectsGrid.appendChild(card);
  });
  setupProjectFilters(projects);
}

// Project Filters
function setupProjectFilters(projects) {
  const filterContainer = document.getElementById('project-filters');
  if (!filterContainer) return;

  const tags = ['All', ...new Set((projects || []).flatMap((project) => project.tags || []))];
  filterContainer.innerHTML = '';
  
  tags.forEach((tag) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-filter';
    button.textContent = tag;
    button.addEventListener('click', () => {
      document.querySelectorAll('.project-filter').forEach((btn) => btn.classList.toggle('active', btn === button));
      applyProjectFilter(tag);
    });
    if (tag === 'All') button.classList.add('active');
    filterContainer.appendChild(button);
  });
}

function applyProjectFilter(tag) {
  const cards = Array.from(document.querySelectorAll('.project-card'));
  cards.forEach((card) => {
    const tags = card.dataset.tags || '';
    card.style.display = tag === 'All' || tags.includes(tag.toLowerCase()) ? '' : 'none';
  });
}

// Render Testimonials
function renderTestimonials(testimonials) {
  const testimonialGrid = document.getElementById('testimonial-grid');
  if (!testimonialGrid) return;
  testimonialGrid.innerHTML = '';
  
  testimonials.forEach((testimonial) => {
    const card = document.createElement('article');
    card.className = 'testimonial-card animate-on-scroll';
    card.innerHTML = `
      <p>"${testimonial.quote}"</p>
      <strong>${testimonial.name}</strong>
      <span>${testimonial.role}</span>
    `;
    testimonialGrid.appendChild(card);
  });
  
  setupTestimonialCarousel();
}

// Testimonial Carousel
function setupTestimonialCarousel() {
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const carousel = document.getElementById('testimonial-carousel');
  
  if (!prevBtn || !nextBtn || !carousel) return;
  
  const cards = document.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  
  function updateCarousel() {
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
  }
  
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  });
  
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  });
}

// Form Validation
function setupFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name');
    const email = document.getElementById('form-email');
    const subject = document.getElementById('form-subject');
    const message = document.getElementById('form-message');
    
    let isValid = true;
    
    // Validate Name
    if (!name?.value.trim()) {
      showError(name, 'error-name', 'Name is required');
      isValid = false;
    } else {
      clearError(name, 'error-name');
    }
    
    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.value || !emailRegex.test(email.value)) {
      showError(email, 'error-email', 'Valid email is required');
      isValid = false;
    } else {
      clearError(email, 'error-email');
    }
    
    // Validate Subject
    if (!subject?.value.trim()) {
      showError(subject, 'error-subject', 'Subject is required');
      isValid = false;
    } else {
      clearError(subject, 'error-subject');
    }
    
    // Validate Message
    if (!message?.value.trim()) {
      showError(message, 'error-message', 'Message is required');
      isValid = false;
    } else {
      clearError(message, 'error-message');
    }
    
    if (isValid) {
      const successMsg = document.getElementById('form-success');
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 3000);
      }
      form.reset();
    }
  });
}

function showError(input, errorId, message) {
  if (!input) return;
  input.classList.add('error');
  const errorMsg = document.getElementById(errorId);
  if (errorMsg) {
    errorMsg.textContent = message;
  }
}

function clearError(input, errorId) {
  if (!input) return;
  input.classList.remove('error');
  const errorMsg = document.getElementById(errorId);
  if (errorMsg) {
    errorMsg.textContent = '';
  }
}

// Scroll to Top Button
function setupScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-to-top');
  if (!scrollTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Social Links
function populateSocialLinks(social) {
  const socialMap = [
    { id: 'github-link', key: 'github' },
    { id: 'facebook-link', key: 'facebook' },
    { id: 'instagram-link', key: 'instagram' },
    { id: 'linkedin-link', key: 'linkedin' },
    { id: 'twitter-link', key: 'twitter' }
  ];
  
  socialMap.forEach(({ id, key }) => {
    const link = document.getElementById(id);
    if (!link) return;
    if (social[key]) {
      link.href = social[key];
      link.style.display = 'inline-flex';
    } else {
      link.style.display = 'none';
    }
  });
}

// Scroll Animation Reveal
function setupScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    observer.observe(element);
  });
}

// Nav Spy
function setupNavSpy() {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);
  
  function updateActiveLink() {
    const offset = window.scrollY + window.innerHeight * 0.35;
    let activeIndex = 0;
    
    sections.forEach((section, index) => {
      if (offset >= section.offsetTop) activeIndex = index;
    });
    
    navLinks.forEach((link, index) => {
      link.classList.toggle('active', index === activeIndex);
    });
  }
  
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink);
}

// Initialize AOS
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupThemeToggle();
  setupMobileMenu();
  setupSmoothScroll();
  setupTypingEffect();
  setupFormValidation();
  setupScrollToTop();
  setupScrollReveal();
  setupNavSpy();
  animateCounters();
  initAOS();
});
