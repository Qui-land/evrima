const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

let mutFilter = "all";
let cardMode = "normal";
const dietTR = { carnivore: "Carnivore", herbivore: "Herbivore", omnivore: "Omnivore" };
const esc = (s) => String(s ?? "").replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function hydrateCounts() {
  $("#dinoCount").textContent = DINOS.length;
  $("#mutCount").textContent = MUTATIONS.length;
  $("#countMutations").textContent = MUTATIONS.length;

  const dietCounts = DINOS.reduce((acc, d) => {
    acc[d.diet] = (acc[d.diet] || 0) + 1;
    return acc;
  }, {});

  $("#countCarnivore").textContent = dietCounts.carnivore || 0;
  $("#countHerbivore").textContent = dietCounts.herbivore || 0;
  $("#countOmnivore").textContent = dietCounts.omnivore || 0;
}

function imageCandidates(path) {
  const stem = String(path).replace(/\.(webp|png|jpe?g)$/i, "");
  return [stem + ".webp", stem + ".png", stem + ".jpg", stem + ".jpeg"];
}

function imageBlock(d, cls = "") {
  const candidates = imageCandidates(d.image);
  const encoded = esc(JSON.stringify(candidates));
  return `<div class="${cls} dino-media" data-images="${encoded}">
    <img src="${candidates[0]}" alt="${esc(d.name)} görseli" loading="lazy" onerror="window.tryNextDinoImage(this)">
    <div class="image-fallback"><span>GÖRSEL BEKLENİYOR</span><b>${esc(d.name)}</b><small>assets/dinos klasörüne ekran görüntüsünü ekle</small></div>
  </div>`;
}

window.tryNextDinoImage = function (img) {
  const box = img.closest('.dino-media');
  const list = JSON.parse(box.dataset.images || '[]');
  const current = img.getAttribute('src');
  const i = list.indexOf(current);
  if (i >= 0 && i < list.length - 1) {
    img.src = list[i + 1];
    return;
  }
  img.style.display = 'none';
  const fallback = img.nextElementSibling;
  if (fallback) fallback.style.display = 'grid';
};

function statMode(d, mode = "normal") {
  return d.stats?.[mode] || d.stats.normal;
}

function dinoCard(d) {
  const s = statMode(d, cardMode);
  return `<article class="dino-card" data-name="${d.name.toLowerCase()}" tabindex="0">
    ${imageBlock(d, "dino-image")}
    <div class="dino-body">
      <div class="dino-head">
        <div><h3>${d.name}</h3><small>${d.tier}</small></div>
        <span class="diet ${d.diet}">${dietTR[d.diet]}</span>
      </div>
      <div class="mode-hint">${cardMode === 'prime' ? (d.primeLabel || 'PRIME') : 'NORMAL ADULT'}</div>
      <div class="mini">
        <span>Ağırlık<b>${s.weight}</b></span>
        <span>Hız<b>${s.speed}</b></span>
        <span>Bite Force<b>${s.biteForce}</b></span>
      </div>
    </div>
  </article>`;
}

function getSortValue(d, sort) {
  if (sort === 'diet') return dietTR[d.diet] || d.diet;
  if (sort === 'tier') return d.tier || '';
  return d.name || '';
}

function renderDinos() {
  const q = $("#dinoSearch").value.toLowerCase().trim();
  const sort = $("#sortDino").value;
  const filter = $("#dietSelect").value;

  const arr = DINOS
    .filter((d) => (filter === "all" || d.diet === filter) && d.name.toLowerCase().includes(q))
    .sort((a, b) => String(getSortValue(a, sort)).localeCompare(String(getSortValue(b, sort)), "tr"));

  $("#dinoGrid").innerHTML = arr.map(dinoCard).join("");
  $$("#dinoGrid .dino-card").forEach((el, i) => {
    const open = () => openDino(arr[i]);
    el.onclick = open;
    el.onkeydown = (e) => e.key === "Enter" && open();
  });
}

function statsHtml(d, mode) {
  const s = statMode(d, mode);
  return `
    <div class="stat-grid mode-stats">
      <div><span>Ağırlık</span><b>${s.weight}</b></div>
      <div><span>Büyüme Süresi</span><b>${d.growth}</b></div>
      <div><span>Koşu Hızı</span><b>${s.speed}</b></div>
      <div><span>Bite Force</span><b>${s.biteForce}</b></div>
      <div><span>Zorluk</span><b>${d.difficulty}</b></div>
      <div><span>Sınıf</span><b>${d.tier}</b></div>
    </div>`;
}

function guideText(value) {
  return esc(value || "").replace(/\n/g, "<br>");
}

function hasGuideContent(content) {
  if (!content) return false;
  return Boolean(
    content.playstyle ||
    content.combatBasics ||
    (content.techniques && content.techniques.length) ||
    (content.matchups && content.matchups.length) ||
    (content.mistakes && content.mistakes.length)
  );
}

function resolveCombatGuide(d, mode) {
  const guide = d.combatGuide;
  if (!guide || guide.status !== "ready") return { guide, content: null, scope: "pending" };

  if (hasGuideContent(guide[mode])) {
    return { guide, content: guide[mode], scope: mode };
  }
  if (hasGuideContent(guide.shared)) {
    return { guide, content: guide.shared, scope: "shared" };
  }
  return { guide, content: null, scope: "pending" };
}

function techniqueHtml(items = []) {
  if (!items.length) return "";
  return `<section class="combat-section"><div class="combat-section-title"><span>TECHNIQUES</span><b>TEKNİKLER</b></div><div class="combat-techniques">${items.map((item) => {
    if (typeof item === "string") return `<div class="combat-technique">${guideText(item)}</div>`;
    const title = item.name || item.title || "Teknik";
    const body = item.description || item.text || item.notes || "";
    return `<div class="combat-technique"><b>${guideText(title)}</b>${body ? `<p>${guideText(body)}</p>` : ""}</div>`;
  }).join("")}</div></section>`;
}

function matchupHtml(items = []) {
  if (!items.length) return "";
  return `<section class="combat-section"><div class="combat-section-title"><span>MATCHUPS</span><b>EŞLEŞMELER</b></div><div class="combat-matchups">${items.map((item) => {
    if (typeof item === "string") {
      return `<details class="combat-matchup"><summary><span>${guideText(item)}</span><i>+</i></summary><p>Bu eşleşmenin notları henüz eklenmedi.</p></details>`;
    }
    const opponent = item.opponent || item.name || item.title || "Rakip";
    const body = item.strategy || item.guide || item.text || item.notes || "";
    return `<details class="combat-matchup"><summary><span>VS ${guideText(opponent)}</span><i>+</i></summary><p>${body ? guideText(body) : "Bu eşleşmenin notları henüz eklenmedi."}</p></details>`;
  }).join("")}</div></section>`;
}

function mistakesHtml(items = []) {
  if (!items.length) return "";
  return `<section class="combat-section"><div class="combat-section-title"><span>COMMON MISTAKES</span><b>YAYGIN HATALAR</b></div><ul class="combat-mistakes">${items.map((item) => {
    const value = typeof item === "string" ? item : (item.text || item.description || item.name || "");
    return `<li>${guideText(value)}</li>`;
  }).join("")}</ul></section>`;
}

function contributorHtml(contributors = []) {
  if (!contributors.length) return "";
  const names = contributors.map((c) => c?.name).filter(Boolean);
  const roles = contributors.map((c) => c?.role).filter(Boolean);
  if (!names.length) return "";
  return `<div class="combat-contributor">
    <span>FIELD NOTES CONTRIBUTOR</span>
    <small>Combat Guide by</small>
    <strong>— ${names.map(guideText).join(" & ")}</strong>
    ${roles.length ? `<em>${roles.map(guideText).join(" • ")}</em>` : ""}
  </div>`;
}

function combatGuideBodyHtml(d, mode) {
  const { guide, content, scope } = resolveCombatGuide(d, mode);
  if (!content) {
    return `<div class="combat-unavailable">
      <span>FIELD NOTES UNAVAILABLE</span>
      <b>Combat Guide hazırlanıyor.</b>
      <p>Bu dinozorun savaş rehberi henüz hazırlanıyor.</p>
    </div>`;
  }

  const modeLabel = scope === "shared" ? "ORTAK REHBER" : (scope === "prime" ? (d.primeLabel || "PRIME") : "NORMAL ADULT");
  return `<div class="combat-guide-scroll">
    <div class="combat-guide-meta"><span>${guideText(d.name)}</span><b>${guideText(modeLabel)}</b></div>
    ${content.playstyle ? `<section class="combat-section"><div class="combat-section-title"><span>PLAYSTYLE</span><b>OYNANIŞ TARZI</b></div><p>${guideText(content.playstyle)}</p></section>` : ""}
    ${content.combatBasics ? `<section class="combat-section"><div class="combat-section-title"><span>COMBAT BASICS</span><b>SAVAŞ MANTIĞI</b></div><p>${guideText(content.combatBasics)}</p></section>` : ""}
    ${techniqueHtml(content.techniques)}
    ${matchupHtml(content.matchups)}
    ${mistakesHtml(content.mistakes)}
    ${contributorHtml(guide.contributors)}
  </div>`;
}

function closeCombatGuidePanel() {
  const shell = $(".dossier-shell");
  const trigger = $("#combatGuideToggle");
  if (shell) shell.classList.remove("combat-open");
  $("#modal").classList.remove("combat-open");
  if (trigger) {
    trigger.classList.remove("active");
    trigger.setAttribute("aria-expanded", "false");
  }
}

function openDino(d) {
  let activeMode = cardMode;
  const caption = (mode) => mode === 'prime' ? (d.primeLabel || 'Prime değerleri') : 'Normal Adult değerleri';

  $("#modal").classList.remove("combat-open");
  $("#modalInner").innerHTML = `<div class="dossier-shell">
    <div class="dossier">
      ${imageBlock(d, "dossier-art")}
      <div class="dossier-copy">
        <div class="modal-sub">${dietTR[d.diet]} • ${d.tier}</div>
        <div class="dossier-title-row">
          <h3>${d.name}</h3>
          <button class="combat-guide-trigger" id="combatGuideToggle" type="button" aria-expanded="false" aria-controls="combatGuidePanel"><span>⚔</span> COMBAT GUIDE</button>
        </div>
        <div class="prime-switch" role="group" aria-label="Stat modu">
          <button class="${activeMode === 'normal' ? 'active' : ''}" data-mode="normal">NORMAL</button>
          <button class="${activeMode === 'prime' ? 'active' : ''}" data-mode="prime">PRIME</button>
        </div>
        <div class="mode-caption" id="modeCaption">${caption(activeMode)}</div>
        <div id="modalStats">${statsHtml(d, activeMode)}</div>
        <div class="ability"><b>İmza Yeteneği</b>${d.ability}</div>
        <div class="ability" style="margin-top:10px"><b>Öne Çıkan Özellik</b>${d.highlight}</div>
        ${d.dataNote ? `<div class="data-note">⚑ ${d.dataNote}</div>` : ""}
        <div class="source-line">${d.source}</div>
      </div>
    </div>
    <aside class="combat-guide-panel" id="combatGuidePanel" aria-label="${esc(d.name)} Combat Guide">
      <div class="combat-panel-head">
        <div><span>QUI EVRIMA // FIELD DOSSIER</span><b>COMBAT GUIDE</b></div>
        <button class="combat-panel-close" id="closeCombatGuide" type="button" aria-label="Combat Guide panelini kapat">×</button>
      </div>
      <div id="combatGuideBody">${combatGuideBodyHtml(d, activeMode)}</div>
    </aside>
  </div>`;

  $$(".prime-switch button").forEach((btn) => {
    btn.onclick = () => {
      $$(".prime-switch button").forEach((x) => x.classList.remove('active'));
      btn.classList.add('active');
      activeMode = btn.dataset.mode;
      $("#modalStats").innerHTML = statsHtml(d, activeMode);
      $("#modeCaption").textContent = caption(activeMode);
      const guideBody = $("#combatGuideBody");
      if (guideBody) guideBody.innerHTML = combatGuideBodyHtml(d, activeMode);
    };
  });

  $("#combatGuideToggle").onclick = () => {
    const shell = $(".dossier-shell");
    const willOpen = !shell.classList.contains("combat-open");
    shell.classList.toggle("combat-open", willOpen);
    $("#modal").classList.toggle("combat-open", willOpen);
    $("#combatGuideToggle").classList.toggle("active", willOpen);
    $("#combatGuideToggle").setAttribute("aria-expanded", String(willOpen));
    if (willOpen) $("#combatGuideBody").innerHTML = combatGuideBodyHtml(d, activeMode);
  };

  $("#closeCombatGuide").onclick = closeCombatGuidePanel;
  $("#modal").showModal();
}

function mutCard(m) {
  return `<article class="mut-card" data-group="${m.group}">
    <div class="mut-val">${m.value}</div>
    <h3>${m.name}<span>(${m.tr})</span></h3>
    <p>${m.effect}</p>
    <div class="tags"><span class="tag">${m.restriction}</span><span class="tag source">${m.source}</span></div>
  </article>`;
}

function renderMuts() {
  const q = $("#mutSearch").value.toLowerCase().trim();
  const arr = MUTATIONS.filter((m) =>
    (mutFilter === "all" || m.group === mutFilter) &&
    (`${m.name} ${m.tr} ${m.effect} ${m.restriction}`).toLowerCase().includes(q)
  );
  $("#mutGrid").innerHTML = arr.map(mutCard).join("");
}

$("#closeModal").onclick = () => { closeCombatGuidePanel(); $("#modal").close(); };
$("#modal").onclick = (e) => { if (e.target === $("#modal")) { closeCombatGuidePanel(); $("#modal").close(); } };
$("#modal").addEventListener("cancel", (e) => {
  if ($("#modal").classList.contains("combat-open")) {
    e.preventDefault();
    closeCombatGuidePanel();
  }
});

$$("#globalMode button").forEach((b) => {
  b.onclick = () => {
    $$("#globalMode button").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    cardMode = b.dataset.mode;
    renderDinos();
  };
});

$("#dinoSearch").oninput = renderDinos;
$("#sortDino").onchange = renderDinos;
$("#dietSelect").onchange = renderDinos;

$$(".cat[data-diet]").forEach((b) => {
  b.onclick = () => {
    $("#dietSelect").value = b.dataset.diet;
    renderDinos();
    $("#dinosaurs").scrollIntoView({ behavior: "smooth" });
  };
});

$('.cat[data-go="mutations"]').onclick = () => $("#mutations").scrollIntoView({ behavior: "smooth" });

$("#mutSearch").oninput = renderMuts;
$$("#mutFilters button").forEach((b) => {
  b.onclick = () => {
    $$("#mutFilters button").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    mutFilter = b.dataset.filter;
    renderMuts();
  };
});

$("#menuBtn").onclick = () => $("#nav").classList.toggle("open");
$$("#nav a").forEach((a) => a.onclick = () => $("#nav").classList.remove("open"));

hydrateCounts();
renderDinos();
renderMuts();
