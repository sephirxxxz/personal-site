const mode = document.body.dataset.layout;
const nav = document.querySelector<HTMLElement>('.compact-nav')!;
const directory = document.querySelector<HTMLDialogElement>('.layout-index')!;
const openIndex = document.querySelector<HTMLButtonElement>('[data-open-index]')!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const ease = getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim();
const sections = [document.getElementById('hero')!, ...document.querySelectorAll<HTMLElement>('#main-content > section')];
const destinations = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-destination]'));
const label = document.querySelector<HTMLElement>('[data-current-label]')!;
const percent = document.querySelector<HTMLElement>('[data-percent]')!;
const fill = document.querySelector<HTMLElement>('[data-progress-fill]')!;
let frame = 0;
let suppressEnterUntil = 0;
const animations = new Set<Animation>();
function enter(element: HTMLElement, distance=8, duration=220) {
  if (reduced.matches || performance.now() < suppressEnterUntil) return;
  const animation = element.animate(
    [{opacity:0.65,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}],
    {duration,easing:ease}
  );
  animations.add(animation);
  animation.finished.finally(()=>animations.delete(animation)).catch(()=>{});
}
reduced.addEventListener('change',()=>{
  if(reduced.matches) {
    animations.forEach(animation=>animation.cancel());
    // Changing the preference during an exit must never leave a modal stuck.
    if(directory.hasAttribute('data-motion-closing')) finishDirectoryClose();
  }
});
sections.forEach(section=>section.setAttribute('tabindex','-1'));

function update() {
  frame=0;
  const max=document.documentElement.scrollHeight-innerHeight;
  const progress=max>0 ? Math.min(1,Math.max(0,scrollY/max)) : 1;
  fill.style.transform=`scaleX(${progress})`;
  percent.textContent=Math.round(progress*100)+'%';
  nav.querySelector('[role="progressbar"]')!.setAttribute('aria-valuenow',String(Math.round(progress*100)));
  const boundary=nav.getBoundingClientRect().bottom+innerHeight*.18;
  let active=sections[0];
  sections.forEach(section=>{ if(section.getBoundingClientRect().top<=boundary) active=section; });
  if(progress>=.999) active=sections.at(-1)!;
  const match=directory.querySelector<HTMLAnchorElement>(`[data-destination="${active.id}"]`);
  if(match) label.textContent=match.textContent?.replace(/^\s*\d+\s*/,'').trim() ?? '';
  destinations.forEach(link=>{
    if(link.dataset.destination===active.id) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  });
}
function schedule() { if(!frame) frame=requestAnimationFrame(update); }
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
const sizeObserver=new ResizeObserver(schedule);
sizeObserver.observe(document.body);

let exitTimer: ReturnType<typeof setTimeout> | undefined;
let exitResolve: ((completed: boolean) => void) | undefined;

function cancelDirectoryExit() {
  clearTimeout(exitTimer);
  exitTimer=undefined;
  const resolve=exitResolve;
  exitResolve=undefined;
  directory.removeAttribute('data-motion-closing');
  resolve?.(false);
}
function finishDirectoryClose() {
  clearTimeout(exitTimer);
  exitTimer=undefined;
  const resolve=exitResolve;
  exitResolve=undefined;
  if(directory.open) directory.close();
  directory.removeAttribute('data-motion-open');
  directory.removeAttribute('data-motion-closing');
  resolve?.(true);
}
function closeDirectory(pointer: boolean): Promise<boolean> {
  cancelDirectoryExit();
  if(!directory.open) return Promise.resolve(true);
  if(mode!=='reader' || !pointer) {
    directory.setAttribute('data-motion-instant','');
    finishDirectoryClose();
    return Promise.resolve(true);
  }
  directory.removeAttribute('data-motion-instant');
  directory.setAttribute('data-motion-closing','');
  directory.removeAttribute('data-motion-open');
  return new Promise(resolve=>{
    exitResolve=resolve;
    exitTimer=setTimeout(finishDirectoryClose,120);
  });
}

openIndex.addEventListener('click',event=>{
  cancelDirectoryExit();
  if(mode==='reader') {
    const instant=event.detail===0;
    directory.toggleAttribute('data-motion-instant',instant);
    if(!directory.open) {
      directory.removeAttribute('data-motion-open');
      directory.showModal();
      // Flush only on opening; transitions own subsequent frames.
      directory.getBoundingClientRect();
    }
    directory.setAttribute('data-motion-open','');
  } else {
    if(!directory.open) directory.showModal();
    if(event.detail>0) enter(directory,4,160);
  }
});
document.querySelector('[data-close-index]')?.addEventListener('click',event=>{void closeDirectory((event as MouseEvent).detail>0);});
directory.addEventListener('cancel',event=>{
  event.preventDefault();
  void closeDirectory(false); // Escape is immediate, even during a pointer exit.
});
directory.addEventListener('click',event=>{
  if(event.target!==directory) return;
  const r=directory.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) void closeDirectory(true);
});
destinations.forEach(link=>link.addEventListener('click',async event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
  const target=document.getElementById(link.dataset.destination??'');
  if(!target) return;
  event.preventDefault();
  if(directory.open && !await closeDirectory(event.detail>0)) return;
  if(event.detail===0) suppressEnterUntil=performance.now()+400;
  history.pushState(null,'','#'+target.id);
  target.scrollIntoView({behavior:event.detail>0&&!reduced.matches?'smooth':'instant',block:'start'});
  target.focus({preventScroll:true});
}));

// Archive: progressive enhancement. Every original paragraph remains in the DOM.
if(mode==='archive') {
  document.querySelectorAll<HTMLElement>('#main-content .card').forEach(card=>{
    const heading=card.querySelector<HTMLElement>(':scope > h3');
    if(!heading) return;
    const first=card===card.parentElement?.querySelector('.card');
    const details=document.createElement('details');
    const summary=document.createElement('summary');
    const body=document.createElement('div');body.className='file-content';
    for(const node of Array.from(card.childNodes)){
      summary.append(node);
      if(node===heading) break;
    }
    while(card.firstChild) body.append(card.firstChild);
    details.append(summary,body);details.open=first;
    card.append(details);card.classList.add('file-card');
    let pointer=false;
    summary.addEventListener('click',event=>{pointer=event.detail>0;});
    details.addEventListener('toggle',()=>{
      if(details.open&&pointer) enter(body,4,180);
      pointer=false;schedule();
    });
  });
}

// Studio: a horizontal, reader-controlled project deck. Never intercept the wheel.
const deck=mode==='studio'?document.querySelector<HTMLElement>('#doing .card-grid'):null;
if(deck){
  deck.classList.add('project-deck');
  deck.tabIndex=0;
  deck.setAttribute('aria-label','项目浏览，使用左右方向键或下方按钮切换');
  const cards=Array.from(deck.querySelectorAll<HTMLElement>(':scope > .card'));
  const controls=document.createElement('div');
  controls.className='project-controls';
  controls.setAttribute('data-proto-ui','');
  controls.innerHTML='<output aria-label="当前项目">1 / '+cards.length+'</output><button type="button" data-project-step="-1" aria-label="上一个项目">←</button><button type="button" data-project-step="1" aria-label="下一个项目">→</button>';
  deck.after(controls);
  const status=controls.querySelector('output')!;
  const previous=controls.querySelector<HTMLButtonElement>('[data-project-step="-1"]')!;
  const next=controls.querySelector<HTMLButtonElement>('[data-project-step="1"]')!;
  let current=0;
  function sync(){
    const origin=deck!.getBoundingClientRect().left;
    current=cards.reduce((best,card,i)=>Math.abs(card.getBoundingClientRect().left-origin)<Math.abs(cards[best].getBoundingClientRect().left-origin)?i:best,0);
    if(deck!.scrollLeft+deck!.clientWidth>=deck!.scrollWidth-3) current=cards.length-1;
    status.textContent=(current+1)+' / '+cards.length;
    previous.disabled=current===0;next.disabled=current===cards.length-1;
  }
  function go(step:number,pointer:boolean){
    const card=cards[Math.max(0,Math.min(cards.length-1,current+step))];
    const offset=card.getBoundingClientRect().left-deck!.getBoundingClientRect().left;
    deck!.scrollBy({left:offset,behavior:pointer&&!reduced.matches?'smooth':'instant'});
  }
  controls.querySelectorAll<HTMLButtonElement>('[data-project-step]').forEach(button=>button.addEventListener('click',event=>go(Number(button.dataset.projectStep),event.detail>0)));
  deck.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();event.stopPropagation();go(event.key==='ArrowLeft'?-1:1,false);
    }
  });
  deck.addEventListener('scroll',sync,{passive:true});
  sizeObserver.observe(deck);addEventListener('resize',sync,{passive:true});sync();
}

// One-time entrance highlights spatial hierarchy; no content is hidden to await animation.
const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting) continue;
    const element=entry.target as HTMLElement;
    enter(element,mode==='studio'?12:6,mode==='studio'?260:180);
    observer.unobserve(element);
  }
},{threshold:.2});
document.querySelectorAll<HTMLElement>('.chapter-heading').forEach(heading=>observer.observe(heading));
const heroEntrance = document.querySelector<HTMLElement>('.identity') ?? document.querySelector<HTMLElement>('.profile-statement');
if(!location.hash && heroEntrance) enter(heroEntrance,8,260);
if(mode==='reader' && !location.hash && !reduced.matches) {
  document.querySelectorAll<HTMLAnchorElement>('.hero-jumps a').forEach((button,index)=>{
    const animation=button.animate(
      [{opacity:0.65,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:220,delay:index*40,easing:ease,fill:'backwards'}
    );
    animations.add(animation);
    animation.finished.finally(()=>animations.delete(animation)).catch(()=>{});
  });
}

document.addEventListener('pointerdown',()=>{
  document.body.dataset.input='pointer';
  // Initial flourish must yield immediately to a real action.
  animations.forEach(animation=>animation.cancel());
});
document.addEventListener('keydown',event=>{
  document.body.dataset.input='keyboard';
  animations.forEach(animation=>animation.cancel());
  if(mode==='reader' && directory.open) directory.setAttribute('data-motion-instant','');
  const target=event.target as HTMLElement;
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)||target.isContentEditable||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey||directory.open) return;
  if(/^[1-3]$/.test(event.key)||['ArrowLeft','ArrowRight','r','R'].includes(event.key)){
    // A project deck owns its own arrow keys; they never switch prototypes.
    if(target.closest('.project-deck,.project-controls')) return;
    event.preventDefault();parent.postMessage({type:'prototype-key',key:event.key},location.origin);
  }
});
update();
