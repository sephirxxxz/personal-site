const nav = document.querySelector<HTMLElement>('.glass-nav')!;
const dialog = document.querySelector<HTMLDialogElement>('.chapter-directory')!;
const trigger = document.querySelector<HTMLButtonElement>('.index-trigger')!;
const label = document.querySelector<HTMLElement>('[data-current-label]')!;
const percent = document.querySelector<HTMLElement>('[data-percent]');
const ring = document.querySelector<SVGCircleElement>('.ring-fill');
const axisFill = document.querySelector<HTMLElement>('[data-axis-fill]');
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-chapter]'));
const sections = Array.from(new Set(links.map(link => document.getElementById(link.dataset.chapter ?? '')!)));
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let frame = 0;
sections.forEach(section => section.setAttribute('tabindex','-1'));

function navigate(target: HTMLElement, pointer: boolean) {
  history.pushState(null,'','#'+target.id);
  target.scrollIntoView({behavior:pointer && !reduced.matches ? 'smooth' : 'instant', block:'start'});
  target.focus({preventScroll:true});
}
function update() {
  frame=0;
  const max=document.documentElement.scrollHeight-innerHeight;
  const progress=max>0 ? Math.max(0,Math.min(1,scrollY/max)) : 1;
  if (ring) ring.style.strokeDashoffset=String(69.115*(1-progress));
  if (axisFill) axisFill.style.transform=`scaleX(${progress})`;
  nav.querySelector('[role="progressbar"]')?.setAttribute('aria-valuenow',String(Math.round(progress*100)));
  if (percent) percent.textContent=Math.round(progress*100)+'%';
  const boundary=nav.getBoundingClientRect().bottom+innerHeight*.2;
  let selected=0;
  sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<=boundary) selected=i;});
  if(progress>=.999) selected=sections.length-1;
  current=selected;
  const active=links.find(link=>link.dataset.chapter===sections[current].id)!;
  label.textContent=active.getAttribute('aria-label') ?? active.textContent?.replace(/^\s*\d+\s*/,'').trim() ?? '';
  links.forEach(link=>{
    const selected=link.dataset.chapter===sections[current].id;
    link.classList.toggle('active',selected);
    if(selected) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  });
  document.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(button=>{
    button.disabled=current+Number(button.dataset.step)<0 || current+Number(button.dataset.step)>=sections.length;
  });
  const rail=document.querySelector<HTMLElement>('.chapter-ticks');
  const tick=rail?.querySelector<HTMLElement>('.active');
  if(rail && tick && !rail.contains(document.activeElement)){
    const rect=tick.getBoundingClientRect(), view=rail.getBoundingClientRect();
    if(rect.left<view.left || rect.right>view.right) rail.scrollLeft+=rect.left-view.left-(view.width-rect.width)/2;
  }
}
function schedule() { if(!frame) frame=requestAnimationFrame(update); }
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
new ResizeObserver(schedule).observe(document.body);
trigger.addEventListener('click',event=>{
  dialog.dataset.instant=String(event.detail===0 || reduced.matches);
  dialog.showModal();
});
document.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  if(event.target===dialog){
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close();
  }
});
links.forEach(link=>link.addEventListener('click',event=>{
  if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target=document.getElementById(link.dataset.chapter ?? '');
  if(!target) return;
  event.preventDefault();
  if(dialog.open) dialog.close();
  navigate(target,event.detail>0);
}));
document.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(button=>button.addEventListener('click',event=>{
  const target=sections[current+Number(button.dataset.step)];
  if(target) navigate(target,event.detail>0);
}));
document.addEventListener('keydown',event=>{
  const target=event.target as HTMLElement;
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  if(/^[1-3]$/.test(event.key) || ['ArrowLeft','ArrowRight','r','R'].includes(event.key)){
    if(dialog.open) return;
    event.preventDefault();
    parent.postMessage({type:'prototype-key',key:event.key},location.origin);
  }
});
update();
