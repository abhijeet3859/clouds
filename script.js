const dataUrl = 'data.json';

async function loadData() {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error(`Failed to load ${dataUrl}: ${response.status}`);
    const data = await response.json();
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

  if (heroHeadline) heroHeadline.textContent = data.hero?.headline || heroHeadline.textContent;
  if (heroSub) heroSub.textContent = data.hero?.sub || heroSub.textContent;
  if (aboutText) aboutText.textContent = data.about || aboutText.textContent;
  if (ownerName) ownerName.textContent = data.owner?.name || ownerName.textContent;
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

  renderHeroStats(data.heroStats || []);
  renderFeatures(data.features || []);
  renderSkills(data.skills || []);
  renderProjectCards(data.projects || []);
  renderTestimonials(data.testimonials || []);
}

function renderHeroStats(stats) {
  const heroStats = document.getElementById('hero-stats');
  if (!heroStats) return;
  heroStats.innerHTML = '';
  stats.forEach((stat) => {
    const card = document.createElement('div');
    card.className = 'hero-stat animate-on-scroll';
    card.innerHTML = `<strong>${stat.value}</strong><span>${stat.label}</span>`;
    heroStats.appendChild(card);
  });
}

function renderFeatures(features) {
  const featureGrid = document.getElementById('feature-grid');
  if (!featureGrid) return;
  featureGrid.innerHTML = '';
  features.forEach((feature) => {
    const card = document.createElement('article');
    card.className = 'feature-card animate-on-scroll';
    card.innerHTML = `
      <div class="feature-icon">${feature.icon}</div>
      <h3>${feature.title}</h3>
      <p>${feature.description}</p>
    `;
    featureGrid.appendChild(card);
  });
}

function renderSkills(skills) {
  const skillsList = document.getElementById('skills-list');
  if (!skillsList) return;
  skillsList.innerHTML = '';
  skills.forEach((skill) => {
    const li = document.createElement('li');
    li.className = 'animate-on-scroll';
    li.textContent = skill;
    skillsList.appendChild(li);
  });
}

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

function renderTestimonials(testimonials) {
  const testimonialGrid = document.getElementById('testimonial-grid');
  if (!testimonialGrid) return;
  testimonialGrid.innerHTML = '';
  testimonials.forEach((testimonial) => {
    const card = document.createElement('article');
    card.className = 'testimonial-card animate-on-scroll';
    card.innerHTML = `
      <p>“${testimonial.quote}”</p>
      <strong>${testimonial.name}</strong>
      <span>${testimonial.role}</span>
    `;
    testimonialGrid.appendChild(card);
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('form-name')?.value.trim();
  const email = document.getElementById('form-email')?.value.trim();
  const message = document.getElementById('form-message')?.value.trim();
  const contactEmail = document.getElementById('contact-email')?.textContent || 'contact@example.com';
  const formNote = document.getElementById('form-note');
  if (!name || !email || !message) {
    alert('Please complete all fields before sending.');
    return;
  }
  if (formNote) {
    formNote.textContent = `Demo form submitted. Message not sent. Reach out directly at ${contactEmail}.`;
    formNote.style.color = '#d1fae5';
  }
  event.target.reset();
}

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
    navLinks.forEach((link, index) => link.classList.toggle('active', index === activeIndex));
  }
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink);
}

function setupScrollReveal() {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.animate-on-scroll').forEach((element) => observer.observe(element));
}

function init() {
  loadData();
  const form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', handleFormSubmit);
  setupNavSpy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

