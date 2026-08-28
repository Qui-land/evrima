const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
$("#dinoCount").textContent=DINOS.length; $("#mutCount").textContent=MUTATIONS.length;
let dinoFilter="all", mutFilter="all", cardMode="normal";
const dietTR={carnivore:"Carnivore",herbivore:"Herbivore",omnivore:"Omnivore"};
const esc=s=>String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function imageBlock(d,cls=""){
 return `<div class="${cls} dino-media"><img src="${d.image}" alt="${esc(d.name)} görseli" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><div class="image-fallback"><span>EVRIMA SPECIMEN</span><b>${esc(d.name)}</b><small>Görsel slotu hazır • WEBP bekleniyor</small></div></div>`;
}
function statMode(d,mode="normal"){return d.stats?.[mode]||d.stats.normal}
function dinoCard(d){let s=statMode(d,cardMode);return `<article class="dino-card" data-name="${d.name.toLowerCase()}" tabindex="0">
${imageBlock(d,"dino-image")}
<div class="dino-body"><div class="dino-head"><div><h3>${d.name}</h3><small>${d.tier}</small></div><span class="diet ${d.diet}">${dietTR[d.diet]}</span></div>
<div class="mode-hint">${cardMode==='primePeak'?'PRIME PEAK • 87,5%':'NORMAL ADULT'}</div>
<div class="mini"><span>Ağırlık<b>${s.weight}</b></span><span>Hız<b>${s.speed}</b></span><span>Bite Force<b>${s.biteForce}</b></span></div></div></article>`;}
function renderDinos(){
 let q=$("#dinoSearch").value.toLowerCase().trim(), sort=$("#sortDino").value;
 let arr=DINOS.filter(d=>(dinoFilter==="all"||d.diet===dinoFilter)&&d.name.toLowerCase().includes(q));
 arr.sort((a,b)=>String(a[sort]??a.name).localeCompare(String(b[sort]??b.name),"tr"));
 $("#dinoGrid").innerHTML=arr.map(dinoCard).join("");
 $$("#dinoGrid .dino-card").forEach((el,i)=>{let open=()=>openDino(arr[i]);el.onclick=open;el.onkeydown=e=>e.key==="Enter"&&open()});
}
function statsHtml(d,mode){let s=statMode(d,mode);return `
<div class="stat-grid mode-stats">
<div><span>Ağırlık</span><b>${s.weight}</b></div><div><span>Büyüme Süresi</span><b>${d.growth}</b></div><div><span>Koşu Hızı</span><b>${s.speed}</b></div><div><span>Bite Force</span><b>${s.biteForce}</b></div><div><span>Zorluk</span><b>${d.difficulty}</b></div><div><span>Sınıf</span><b>${d.tier}</b></div></div>`}
function openDino(d){
 const openingMode=cardMode;
 $("#modalInner").innerHTML=`<div class="dossier">${imageBlock(d,"dossier-art")}<div class="dossier-copy">
 <div class="modal-sub">${dietTR[d.diet]} • ${d.tier}</div><h3>${d.name}</h3>
 <div class="prime-switch" role="group" aria-label="Stat modu"><button class="${openingMode==='normal'?'active':''}" data-mode="normal">NORMAL</button><button class="${openingMode==='primePeak'?'active':''}" data-mode="primePeak">PRIME PEAK <small>87,5%</small></button></div>
 <div class="mode-caption" id="modeCaption">${openingMode==='primePeak'?'Prime Elder tepe noktası • 87,5% growth':'Normal Adult değerleri'}</div><div id="modalStats">${statsHtml(d,openingMode)}</div>
 <div class="ability"><b>İmza Yeteneği</b>${d.ability}</div><div class="ability" style="margin-top:10px"><b>Öne Çıkan Özellik</b>${d.highlight}</div>
 ${d.dataNote?`<div class="data-note">⚠ ${d.dataNote}</div>`:""}
 <div class="source-line">${d.source}</div>
 </div></div>`;
 $$('.prime-switch button').forEach(btn=>btn.onclick=()=>{ $$('.prime-switch button').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); const mode=btn.dataset.mode; $('#modalStats').innerHTML=statsHtml(d,mode); $('#modeCaption').textContent=mode==='primePeak'?'Prime Elder tepe noktası • 87,5% growth':'Normal Adult değerleri'; });
 $("#modal").showModal();
}
$("#closeModal").onclick=()=>$("#modal").close(); $("#modal").onclick=e=>e.target===$("#modal")&&$("#modal").close();
$$('#globalMode button').forEach(b=>b.onclick=()=>{ $$('#globalMode button').forEach(x=>x.classList.remove("active")); b.classList.add("active"); cardMode=b.dataset.mode; renderDinos(); });
$("#dinoSearch").oninput=renderDinos; $("#sortDino").onchange=renderDinos;
$$('#dinoFilters button').forEach(b=>b.onclick=()=>{$$('#dinoFilters button').forEach(x=>x.classList.remove("active"));b.classList.add("active");dinoFilter=b.dataset.filter;renderDinos()});
$$('.cat[data-diet]').forEach(b=>b.onclick=()=>{dinoFilter=b.dataset.diet;$$('#dinoFilters button').forEach(x=>x.classList.toggle("active",x.dataset.filter===dinoFilter));renderDinos();$("#dinosaurs").scrollIntoView({behavior:"smooth"})});
$('.cat[data-go="mutations"]').onclick=()=>$("#mutations").scrollIntoView({behavior:"smooth"});
function mutCard(m){return `<article class="mut-card" data-group="${m.group}"><div class="mut-val">${m.value}</div><h3>${m.name}<span>(${m.tr})</span></h3><p>${m.effect}</p><div class="tags"><span class="tag">${m.restriction}</span><span class="tag source">${m.source}</span></div></article>`}
function renderMuts(){let q=$("#mutSearch").value.toLowerCase().trim();let arr=MUTATIONS.filter(m=>(mutFilter==="all"||m.group===mutFilter)&&(`${m.name} ${m.tr} ${m.effect} ${m.restriction}`).toLowerCase().includes(q));$("#mutGrid").innerHTML=arr.map(mutCard).join("")}
$("#mutSearch").oninput=renderMuts;
$$('#mutFilters button').forEach(b=>b.onclick=()=>{$$('#mutFilters button').forEach(x=>x.classList.remove("active"));b.classList.add("active");mutFilter=b.dataset.filter;renderMuts()});
$("#menuBtn").onclick=()=>$("#nav").classList.toggle("open"); $$("#nav a").forEach(a=>a.onclick=()=>$("#nav").classList.remove("open"));
renderDinos();renderMuts();