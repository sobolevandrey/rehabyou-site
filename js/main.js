function openModal() { document.getElementById('modal').classList.add('open'); document.body.style.overflow='hidden'; return false; }
function closeModal() { document.getElementById('modal').classList.remove('open'); document.body.style.overflow=''; }
function closeModalOutside(e) { if(e.target===document.getElementById('modal')) closeModal(); }
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, {threshold: 0.1, rootMargin: '0px 0px -40px 0px'});
revealEls.forEach(el => obs.observe(el));

// Sticky CTA — only on pages that have both #stickyCta and .hero-v2
(function(){
  const sticky = document.getElementById('stickyCta');
  const heroSection = document.querySelector('.hero-v2');
  if(!sticky || !heroSection) return;
  window.addEventListener('scroll', () => {
    if(heroSection.getBoundingClientRect().bottom < 0) {
      sticky.classList.add('visible');
    } else {
      sticky.classList.remove('visible');
    }
  });
})();

// FAQ
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if(!isOpen) item.classList.add('open');
  });
});

// Nav scroll effect
(function(){
  const nav = document.querySelector('nav');
  if(!nav) return;
  function updateNav() {
    if (window.scrollY > 20) { nav.classList.add('scrolled'); }
    else { nav.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', updateNav, {passive:true});
  updateNav();
})();

// Hero slider v2
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hvd');
  if(!slides.length) return;
  let idx = 0;
  window.goToSlide = function(n){
    slides[idx].classList.remove('active');
    if(dots[idx]) dots[idx].classList.remove('active');
    idx = n;
    slides[idx].classList.add('active');
    if(dots[idx]) dots[idx].classList.add('active');
  };
  setInterval(() => goToSlide((idx+1) % slides.length), 5000);
})();

// Team slider
(function(){
  const track = document.getElementById('teamTrack');
  if(!track) return;
  const cards = track.querySelectorAll('.team-card');
  const total = cards.length;
  const totalEl = document.getElementById('teamTotal');
  const currentEl = document.getElementById('teamCurrent');
  if(totalEl) totalEl.textContent = total;
  const cardW = () => cards[0].offsetWidth;
  let current = 0;

  function scrollTo(i){
    current = Math.max(0, Math.min(i, total-1));
    track.scrollTo({left: current * cardW(), behavior:'smooth'});
    if(currentEl) currentEl.textContent = current+1;
  }

  const nextBtn = document.getElementById('teamNext');
  const prevBtn = document.getElementById('teamPrev');
  if(nextBtn) nextBtn.addEventListener('click', () => scrollTo(current+1));
  if(prevBtn) prevBtn.addEventListener('click', () => scrollTo(current-1));

  let isDown=false, startX=0, scrollLeft=0;
  track.addEventListener('mousedown', e=>{isDown=true; track.classList.add('dragging'); startX=e.pageX-track.offsetLeft; scrollLeft=track.scrollLeft;});
  track.addEventListener('mouseleave',()=>{isDown=false;track.classList.remove('dragging');});
  track.addEventListener('mouseup',()=>{isDown=false;track.classList.remove('dragging');});
  track.addEventListener('mousemove',e=>{if(!isDown)return;e.preventDefault();const x=e.pageX-track.offsetLeft;track.scrollLeft=scrollLeft-(x-startX)*1.2;});
  track.addEventListener('scroll',()=>{
    const i=Math.round(track.scrollLeft/cardW());
    if(i!==current){current=i;if(currentEl) currentEl.textContent=current+1;}
  });
})();

// Ambassadors slider
(function(){
  const track = document.querySelector('.amb-track');
  if(!track) return;
  const cards = track.querySelectorAll('.amb-card');
  const total = cards.length;
  const totalEl = document.getElementById('ambTotal');
  const currentEl = document.getElementById('ambCurrent');
  if(totalEl) totalEl.textContent = total;
  const cardW = () => cards[0].offsetWidth;
  let current = 0;

  function scrollTo(i){
    current = Math.max(0, Math.min(i, total-1));
    track.scrollTo({left: current * cardW(), behavior:'smooth'});
    if(currentEl) currentEl.textContent = current+1;
  }

  const nextBtn = document.getElementById('ambNext');
  const prevBtn = document.getElementById('ambPrev');
  if(nextBtn) nextBtn.addEventListener('click', () => scrollTo(current+1));
  if(prevBtn) prevBtn.addEventListener('click', () => scrollTo(current-1));

  let isDown=false, startX=0, scrollLeft=0;
  track.addEventListener('mousedown', e=>{isDown=true;track.classList.add('dragging');startX=e.pageX-track.offsetLeft;scrollLeft=track.scrollLeft;});
  track.addEventListener('mouseleave',()=>{isDown=false;track.classList.remove('dragging');});
  track.addEventListener('mouseup',()=>{isDown=false;track.classList.remove('dragging');});
  track.addEventListener('mousemove',e=>{if(!isDown)return;e.preventDefault();const x=e.pageX-track.offsetLeft;track.scrollLeft=scrollLeft-(x-startX)*1.2;});
  track.addEventListener('scroll',()=>{
    const i=Math.round(track.scrollLeft/cardW());
    if(i!==current){current=i;if(currentEl) currentEl.textContent=current+1;}
  });
})();

// Quiz modal
(function(){
  const modal = document.getElementById('quizModal');
  const openBtn = document.getElementById('openQuiz');
  const closeBtn = document.getElementById('closeQuiz');
  const bar = document.getElementById('quizBar');
  const content = document.getElementById('quizContent');
  const result = document.getElementById('quizResult');
  if(!modal || !openBtn) return;

  const answers = {};

  const masters = [
    {name:'Егор Зайковский', spec:'Спортивный массаж', url:'https://b643828.yclients.com/company/193162/personal/menu?o=m1805072',
     tags:['sport','daily','deep','regular']},
    {name:'Марк Мазур', spec:'Лечебный, спортивный', url:'https://b643828.yclients.com/company/1067623/personal/menu?o=m3401476',
     tags:['pain','rehab','daily','deep','regular']},
    {name:'Кирилл Тимофеев', spec:'Спортивный, антицеллюлитный', url:'https://b643828.yclients.com/company/193162/personal/menu?o=m3729069',
     tags:['sport','regular','daily','deep']},
    {name:'Арина Порфирьева', spec:'Классический, расслабляющий', url:'https://b643828.yclients.com/company/193162/personal/menu?o=m2352358',
     tags:['relax','rare','gentle','any']},
    {name:'Степан Тулынин', spec:'Классический, лечебный', url:'https://b643828.yclients.com/company/193162/personal/menu?o=m4581654',
     tags:['pain','relax','gentle','any','rare']},
    {name:'Павел Репин', spec:'Спортивный, реабилитация', url:'https://b643828.yclients.com/company/193162/personal/menu?o=m4581687',
     tags:['rehab','sport','deep','regular']},
  ];

  const reasons = {
    'Егор Зайковский': 'Работает со спортсменами и активными людьми. Понимает тело в нагрузке и умеет готовить к старту — твой формат.',
    'Марк Мазур': 'Системный подход, работа с болью и последствиями перегрузок. Он разберётся в твоей ситуации и выстроит протокол.',
    'Кирилл Тимофеев': 'Интенсивная, результативная работа с телом. Для тех, кто хочет видеть изменения — он именно такой.',
    'Арина Порфирьева': 'Специализируется на глубоком расслаблении и восстановлении после хронического стресса. Мягко, но эффективно.',
    'Степан Тулынин': 'Мягкий, но глубокий — работает с напряжением, которое копится месяцами. Идеально под твой запрос.',
    'Павел Репин': 'Специалист по реабилитации и восстановлению. Работает точечно, системно, с пониманием твоей истории.',
  };

  openBtn.addEventListener('click', ()=>{ modal.classList.add('open'); document.body.style.overflow='hidden'; });
  if(closeBtn) closeBtn.addEventListener('click', closeQuizModal);
  modal.addEventListener('click', e=>{ if(e.target===modal) closeQuizModal(); });

  function closeQuizModal(){
    modal.classList.remove('open');
    document.body.style.overflow='';
    setTimeout(()=>{ resetQuiz(); }, 400);
  }

  function resetQuiz(){
    Object.keys(answers).forEach(k=>delete answers[k]);
    if(content) content.style.display='block';
    if(result) result.classList.remove('active');
    if(content) content.querySelectorAll('.quiz-step').forEach((s,i)=>{ s.classList.toggle('active',i===0); });
    if(content) content.querySelectorAll('.quiz-option').forEach(o=>o.classList.remove('selected'));
    if(bar) bar.style.width='33%';
  }

  if(content) content.addEventListener('click', e=>{
    const opt = e.target.closest('.quiz-option');
    if(!opt) return;
    const q = opt.dataset.q;
    const val = opt.dataset.val;
    answers[q] = val;
    content.querySelectorAll(`[data-q="${q}"]`).forEach(o=>o.classList.remove('selected'));
    opt.classList.add('selected');
    const step = parseInt(q);
    setTimeout(()=>{
      if(step < 3){
        content.querySelectorAll('.quiz-step').forEach(s=>s.classList.remove('active'));
        content.querySelector(`[data-step="${step+1}"]`).classList.add('active');
        if(bar) bar.style.width = (step+1)/3*100+'%';
      } else {
        showResult();
      }
    }, 350);
  });

  function showResult(){
    if(bar) bar.style.width='100%';
    const vals = Object.values(answers);
    let best = masters[0], bestScore = -1;
    masters.forEach(m=>{
      const score = vals.filter(v=>m.tags.includes(v)).length;
      if(score>bestScore){ bestScore=score; best=m; }
    });
    if(content) content.style.display='none';
    const nameEl = document.getElementById('resultName');
    const specEl = document.getElementById('resultSpec');
    const reasonEl = document.getElementById('resultReason');
    const btnEl = document.getElementById('resultBtn');
    if(nameEl) nameEl.textContent = best.name;
    if(specEl) specEl.textContent = best.spec;
    if(reasonEl) reasonEl.textContent = reasons[best.name] || '';
    if(btnEl) btnEl.href = best.url;
    if(result) result.classList.add('active');
  }
})();

// Telegram popup
(function(){
  const popup = document.getElementById('tgPopup');
  const closeBtn = document.getElementById('tgClose');
  if(!popup) return;
  if(sessionStorage.getItem('tgPopupClosed')) return;
  setTimeout(()=>{ popup.classList.add('visible'); }, 3000);
  if(closeBtn) closeBtn.addEventListener('click', ()=>{
    popup.classList.remove('visible');
    sessionStorage.setItem('tgPopupClosed', '1');
  });
})();

// Передача ClientId Метрики в Yclients
(function(){
  function getYmClientId(){
    var match = document.cookie.match(/_ym_uid=([^;]+)/);
    return match ? match[1] : null;
  }
  function injectClientId(){
    var clientId = getYmClientId();
    if(!clientId) return;
    var links = document.querySelectorAll('a[href*="yclients.com"]');
    links.forEach(function(link){
      try {
        var url = new URL(link.href);
        url.searchParams.set('utm_content', 'ym_' + clientId);
        link.href = url.toString();
      } catch(e){}
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', injectClientId);
  } else {
    injectClientId();
  }
})();
