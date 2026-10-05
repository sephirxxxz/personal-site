const names = ['阅读长卷', '档案目录', '叙事工作台'];
const variants = ['reader','archive','studio'].map((slug,i) => () => `<iframe src="/prototypes/full-layout/${slug}/" title="${names[i]} · 完整网站预览"></iframe>`);
// `variants` is an array of render functions, one per variant, in picker order.
const stage = document.getElementById('stage')!;
const picker = document.querySelector<HTMLElement>('.proto-picker')!;
const highlight = picker.querySelector<HTMLElement>('.proto-picker-highlight')!;
const items = [...picker.querySelectorAll<HTMLButtonElement>('.proto-picker-item:not(.proto-picker-replay)')];
const replay = picker.querySelector('.proto-picker-replay');
let current = 0;

function moveHighlight() {
  const el = items[current];
  highlight.style.width = el.offsetWidth + 'px';
  highlight.style.transform = `translateX(${el.offsetLeft}px)`;
}

function mount(i: number) {
  stage.innerHTML = '';
  // Clear first, render next frame, so entrance animations re-run.
  requestAnimationFrame(() => { stage.innerHTML = variants[i](); });
}

function setActive(i: number) {
  if (i < 0 || i >= variants.length) return;
  current = i;
  items.forEach((el, j) => {
    el.toggleAttribute('data-active', j === i);
    if (j === i) el.setAttribute('aria-current', 'true');
    else el.removeAttribute('aria-current');
  });
  moveHighlight();
  const url = new URL(location.href);
  url.searchParams.set('v', i + 1);
  history.replaceState(null, '', url);
  mount(i);
}

items.forEach((el, i) => el.addEventListener('click', () => setActive(i)));
replay?.addEventListener('click', () => mount(current));
window.addEventListener('resize', moveHighlight);

document.addEventListener('keydown', (e) => {
  const target = e.target as HTMLElement;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= variants.length) setActive(num - 1);
  else if (e.key === 'ArrowRight') setActive((current + 1) % variants.length);
  else if (e.key === 'ArrowLeft') setActive((current - 1 + variants.length) % variants.length);
  else if (e.key === 'r' || e.key === 'R') mount(current);
});

const requested = parseInt(new URLSearchParams(location.search).get('v') ?? '1', 10);
setActive(requested >= 1 && requested <= variants.length ? requested - 1 : 0);
// Enable the slide only after first paint, so load doesn't animate.
requestAnimationFrame(() => requestAnimationFrame(() => picker.setAttribute('data-ready', '')));

// Same keyboard wiring inside the isolated preview frame.
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== document.querySelector('iframe')?.contentWindow) return;
  if (event.data?.type === 'prototype-key') {
    const key = event.data.key;
    const num = parseInt(key,10);
    if (num >= 1 && num <= variants.length) setActive(num-1);
    else if (key === 'ArrowRight') setActive((current+1)%variants.length);
    else if (key === 'ArrowLeft') setActive((current-1+variants.length)%variants.length);
    else if (key === 'r' || key === 'R') mount(current);
  }
});
