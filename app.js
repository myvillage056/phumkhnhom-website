
async function loadStories() {
  try {
    const res = await fetch('content/stories.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('stories.json not found');
    return await res.json();
  } catch (e) {
    return window.STORIES_FALLBACK || [];
  }
}
function icon(cat){ return (window.CATEGORY_ICONS && window.CATEGORY_ICONS[cat]) || "✦"; }
function card(s){
  const img=s.img||'assets/cover.png', ic=icon(s.cat);
  return `<article class="card"><div class="thumb" style="background-image:url('${img}')"><div class="card-icon">${ic}</div></div><div class="card-body"><div class="card-topline"><div class="kicker">${s.cat||''}</div></div><h3><span data-km>${s.km||''}</span><span data-en>${s.en||s.km||''}</span></h3><p><span data-km>${s.km_short||''}</span><span data-en>${s.en_short||s.km_short||''}</span></p><a class="read" href="story.html?id=${s.id}"><span data-km>អានបន្ថែម</span><span data-en>Read More</span><span class="arrow">→</span></a></div></article>`;
}
async function renderHome(){
  const el=document.getElementById('homeStories'); if(!el) return;
  const s=await loadStories(); el.innerHTML=s.slice(0,8).map(card).join('');
}
async function renderAll(){
  const grid=document.getElementById('allStories'), filters=document.getElementById('filters'); if(!grid||!filters) return;
  const search=document.getElementById('search'), loadMore=document.getElementById('loadMore'), resultCount=document.getElementById('resultCount');
  const stories=await loadStories(); let cat='All', visible=8;
  const cats=['All',...new Set(stories.map(s=>s.cat).filter(Boolean))];
  filters.innerHTML=cats.map(c=>`<button class="filter ${c==='All'?'active':''}" data-c="${c}"><span>${icon(c)}</span>${c}</button>`).join('');
  function list(){
    const q=(search?.value||'').toLowerCase().trim();
    return stories.filter(s=>(cat==='All'||s.cat===cat)&&(!q||`${s.km||''} ${s.en||''} ${s.cat||''} ${s.km_short||''}`.toLowerCase().includes(q)));
  }
  function draw(){ const a=list(); grid.innerHTML=a.slice(0,visible).map(card).join(''); if(loadMore) loadMore.style.display=visible>=a.length?'none':'inline-block'; if(resultCount) resultCount.innerHTML=`<strong>${a.length}</strong> stories`; }
  filters.onclick=e=>{const b=e.target.closest('.filter'); if(!b) return; cat=b.dataset.c; visible=8; document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active')); b.classList.add('active'); draw();};
  if(search) search.oninput=()=>{visible=8; draw();};
  if(loadMore) loadMore.onclick=()=>{visible+=8; draw();};
  draw();
}
async function renderDetail(){
  const holder=document.getElementById('story'); if(!holder) return;
  const stories=await loadStories(); const id=Number(new URLSearchParams(location.search).get('id')); const s=stories.find(x=>Number(x.id)===id)||stories[0];
  if(!s){ holder.innerHTML='<p>No story found.</p>'; return; }
  const img=s.img||'assets/cover.png', ic=icon(s.cat); document.title=`${s.en||s.km} | Phum Khnhom`;
  holder.innerHTML=`<div class="story-hero" style="background-image:url('${img}')"></div><div class="story-meta"><span class="meta-chip">${ic} ${s.cat||''}</span><span class="meta-chip">📖 Story</span></div><h1><span data-km>${s.km||''}</span><span data-en>${s.en||s.km||''}</span></h1><p><strong><span data-km>${s.km_short||''}</span><span data-en>${s.en_short||s.km_short||''}</span></strong></p><p><span data-km>${s.km_body||''}</span><span data-en>${s.en_body||s.km_body||''}</span></p>${s.youtube?`<p><a class="btn btn-primary" target="_blank" href="${s.youtube}">▶ Watch on YouTube</a></p>`:''}<div class="share-row"><span class="share-label"><span data-km>ចែករំលែករឿងនេះ</span><span data-en>Share this story</span></span><button class="share-btn" onclick="navigator.clipboard.writeText(location.href)">🔗 <span data-km>ចម្លងតំណ</span><span data-en>Copy Link</span></button><a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}" target="_blank">f Facebook</a></div>`;
}
document.addEventListener('DOMContentLoaded',()=>{renderHome();renderAll();renderDetail();});
