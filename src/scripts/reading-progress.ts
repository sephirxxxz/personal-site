const nav = document.querySelector<HTMLElement>('.section-progress');
const rail = document.querySelector<HTMLElement>('.section-progress__links');
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.section-progress a'));
const sections = links
  .map(link => document.getElementById(link.dataset.section ?? ''))
  .filter((section): section is HTMLElement => section !== null);
const fill = document.querySelector<HTMLElement>('.section-progress__fill');
const track = document.querySelector<HTMLElement>('.section-progress__track');
const percent = document.querySelector<HTMLElement>('[data-reading-percent]');
const label = document.querySelector<HTMLElement>('[data-current-section]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let activeId = '';
let frame = 0;
sections.forEach(section => section.setAttribute('tabindex', '-1'));

function update() {
  frame = 0;
  if (!nav || !rail) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 1;
  const value = Math.round(progress * 100);
  if (fill) fill.style.transform = `scaleX(${progress})`;
  track?.setAttribute('aria-valuenow', String(value));
  if (percent) percent.textContent = `${value}%`;

  const boundary = nav.getBoundingClientRect().bottom + window.innerHeight * 0.2;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= boundary) current = section;
  }
  if (progress >= 0.999) current = sections.at(-1);
  if (!current || current.id === activeId) return;
  activeId = current.id;

  for (const link of links) {
    const active = link.dataset.section === activeId;
    link.classList.toggle('active', active);
    if (active) {
      link.setAttribute('aria-current', 'location');
      if (label) label.textContent = link.getAttribute('aria-label') ?? '';
      // Only scroll the navigation rail. Never move the reader's page or focus.
      if (!rail.contains(document.activeElement)) {
        const item = link.getBoundingClientRect();
        const viewport = rail.getBoundingClientRect();
        if (item.left < viewport.left || item.right > viewport.right) {
          rail.scrollLeft += item.left - viewport.left - (viewport.width - item.width) / 2;
        }
      }
    } else {
      link.removeAttribute('aria-current');
    }
  }
}

function scheduleUpdate() {
  if (!frame) frame = requestAnimationFrame(update);
}

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate, { passive: true });
// Covers late-loading covers and viewport/font reflow.
const resizeObserver = new ResizeObserver(scheduleUpdate);
resizeObserver.observe(document.body);

for (const link of links) {
  link.addEventListener('click', event => {
    // Keyboard and modified clicks retain native anchor behavior (no animation).
    if (event.detail === 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.dataset.section ?? '');
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  });
}

update();
