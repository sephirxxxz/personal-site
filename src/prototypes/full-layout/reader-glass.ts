// Pointer feedback only. CSS transitions retarget gracefully during repeated presses.
const readerNav = document.body.dataset.layout === 'reader'
  ? document.querySelector<HTMLElement>('.compact-nav') : null;
const rainbow = readerNav?.querySelector<HTMLElement>('.glass-rainbow');
if (readerNav && rainbow) {
  let release: ReturnType<typeof setTimeout> | undefined;
  const clear = () => {
    clearTimeout(release);
    rainbow.removeAttribute('data-lit');
  };
  readerNav.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const bounds = readerNav.getBoundingClientRect();
    // Position once at the actual press; only opacity/transform are animated.
    rainbow.style.left = (event.clientX - bounds.left) + 'px';
    rainbow.style.top = (event.clientY - bounds.top) + 'px';
    clearTimeout(release);
    rainbow.setAttribute('data-lit', '');
    release = setTimeout(clear, 120);
  });
  document.addEventListener('keydown', clear);
  addEventListener('pagehide', clear);
}
