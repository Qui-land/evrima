const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
$("#dinoCount").textContent=DINOS.length; $("#mutCount").textContent=MUTATIONS.length;
let dinoFilter="all", mutFilter="all";

const dietTR={carnivore:"Carnivore",herbivore:"Herbivore",omnivore:"Omnivore"};

function dinoCard(d){
return `<article class="dino-card" data-name="${d.name.toLowerCase()}" tabindex="0">
<div class="dino-image"><img src="${d.image}" alt="${d.name} specimen görseli"></div>
<div class="dino-body"><div class="dino-head"><div><h3>${d.name}</h3><small>${d.tier}</small></div><span class="diet ${d.diet}">${dietTR[d.diet]}</span></div>
<div class="mini"><span>Ağırlık<b>${d.weight}</b></span><span>Hız<b>${d.speed}</b></span><span>Hasar<b>${d.damage}</b></span></div></div></article>`;
}
function renderDinos(){
 let q=$("#dinoSearch").value.toLowerCase().trim(), sort=$("#sortDino").value;
 let arr=DINOS.filter(d=>(dinoFilter==="all"||d.diet===dinoFilter)&&d.name.toLowerCase().includes(q));
 arr.sort((a,b)=>String(a[sort]).localeCompare(String(b[sort]),"tr"));
 $("#dinoGrid").innerHTML=arr.map(dinoCard).join("");
 $$("#dinoGrid .dino-card").forEach((el,i)=>{let open=()=>openDino(arr[i]);el.onclick=open;el.onkeydown=e=>e.key==="Enter"&&open()});
}
function openDino(d){
 $("#modalInner").innerHTML=`<div class="dossier"><div class="dossier-art"><img src="${d.image}" alt="${d.name}"></div><div class="dossier-copy">
 <div class="modal-sub">${dietTR[d.diet]} • ${d.tier}</div><h3>${d.name}</h3><div class="verifyline ${[d.weight,d.growth,d.speed,d.damage].includes("Doğrulanmadı")?"warn":"ok"}">${[d.weight,d.growth,d.speed,d.damage].includes("Doğrulanmadı")?"▲ Bazı istatistikler henüz doğrulanmadı":"● Ana statlar doğrulandı"}</div>
 <div class="stat-grid"><div><span>Ağırlık</span><b>${d.weight}</b></div><div><span>Büyüme Süresi</span><b>${d.growth}</b></div><div><span>Koşu Hızı</span><b>${d.speed}</b></div><div><span>Hasar</span><b>${d.damage}</b></div><div><span>Zorluk</span><b>${d.difficulty}</b></div><div><span>Sınıf</span><b>${d.tier}</b></div></div>
 <div class="ability"><b>İmza Yeteneği</b>${d.ability}</div><div class="ability" style="margin-top:10px"><b>Öne Çıkan Özellik</b>${d.highlight}</div>
 </div></div>`; $("#modal").showModal();
}
$("#closeModal").onclick=()=>$("#modal").close(); $("#modal").onclick=e=>e.target===$("#modal")&&$("#modal").close();

$("#dinoSearch").oninput=renderDinos; $("#sortDino").onchange=renderDinos;
$$('#dinoFilters button').forEach(b=>b.onclick=()=>{$$('#dinoFilters button').forEach(x=>x.classList.remove("active"));b.classList.add("active");dinoFilter=b.dataset.filter;renderDinos()});
$$('.cat[data-diet]').forEach(b=>b.onclick=()=>{dinoFilter=b.dataset.diet;$$('#dinoFilters button').forEach(x=>x.classList.toggle("active",x.dataset.filter===dinoFilter));renderDinos();$("#dinosaurs").scrollIntoView({behavior:"smooth"})});
$('.cat[data-go="mutations"]').onclick=()=>$("#mutations").scrollIntoView({behavior:"smooth"});

function mutCard(m){return `<article class="mut-card" data-group="${m.group}">
<div class="mut-val">${m.value}</div><h3>${m.name}<span>(${m.tr})</span></h3><p>${m.effect}</p>
<div class="tags"><span class="tag">${m.restriction}</span><span class="tag source">${m.source}</span></div></article>`}
function renderMuts(){let q=$("#mutSearch").value.toLowerCase().trim();let arr=MUTATIONS.filter(m=>(mutFilter==="all"||m.group===mutFilter)&&(`${m.name} ${m.tr} ${m.effect} ${m.restriction}`).toLowerCase().includes(q));$("#mutGrid").innerHTML=arr.map(mutCard).join("")}
$("#mutSearch").oninput=renderMuts;
$$('#mutFilters button').forEach(b=>b.onclick=()=>{$$('#mutFilters button').forEach(x=>x.classList.remove("active"));b.classList.add("active");mutFilter=b.dataset.filter;renderMuts()});

$("#menuBtn").onclick=()=>$("#nav").classList.toggle("open"); $$("#nav a").forEach(a=>a.onclick=()=>$("#nav").classList.remove("open"));
renderDinos();renderMuts();