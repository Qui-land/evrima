
const dinoGrid = document.querySelector('#dinoGrid');
const mutationGrid = document.querySelector('#mutationGrid');
const dinoSearch = document.querySelector('#dinoSearch');
const mutationSearch = document.querySelector('#mutationSearch');
const dinoResultCount = document.querySelector('#dinoResultCount');
const modal = document.querySelector('#dinoModal');
const modalContent = document.querySelector('#modalContent');

document.querySelector('#dinoCount').textContent = DINOS.length;
document.querySelector('#mutationCount').textContent = MUTATIONS.length;

let dinoFilter = 'all';
let mutationFilter = 'all';

const dietLabel = {
  carnivore: 'Carnivore',
  herbivore: 'Herbivore',
  omnivore: 'Omnivore'
};

function dinoCard(d) {
  return `
  <article class="dino-card" data-name="${d.name.toLowerCase()}" data-diet="${d.diet}" tabindex="0">
    <div class="dino-image"><img src="${d.image}" alt="${d.name} için stilize specimen görseli"></div>
    <div class="dino-body">
      <div class="dino-top">
        <div>
          <h3>${d.name}</h3>
          <div class="dino-tag">${d.tag}</div>
        </div>
        <span class="diet-badge ${d.diet}">${dietLabel[d.diet]}</span>
      </div>
      <p class="dino-desc">${d.desc}</p>
    </div>
  </article>`;
}

function renderDinos() {
  const q = dinoSearch.value.trim().toLowerCase();
  const list = DINOS.filter(d => (dinoFilter === 'all' || d.diet === dinoFilter) && d.name.toLowerCase().includes(q));
  dinoGrid.innerHTML = list.map(dinoCard).join('');
  dinoResultCount.textContent = `${list.length} kayıt gösteriliyor`;

  dinoGrid.querySelectorAll('.dino-card').forEach((card, i) => {
    const open = () => openDino(list[i]);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  });
}

function openDino(d) {
  modalContent.innerHTML = `
    <div class="modal-hero">
      <div class="modal-art"><img src="${d.image}" alt="${d.name} specimen"></div>
      <div class="modal-copy">
        <div class="modal-kicker">${dietLabel[d.diet]} • ${d.tag}</div>
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <div class="modal-list">
          <span>Bu profil sayfasına ileride <b>Diet</b> bilgileri eklenecek.</span>
          <span><b>Combat</b> ipuçları ve güçlü/zayıf eşleşmeler eklenebilir.</span>
          <span>Önerilen <b>Mutation Build</b> alanı eklenebilir.</span>
          <span>Sunucuya özel veriler ayrı bir rozetle gösterilebilir.</span>
        </div>
      </div>
    </div>`;
  modal.showModal();
}

document.querySelector('#closeModal').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

function mutationTypeLabel(type) {
  return ({all:'Genel', carnivore:'Carnivore', female:'Female Only', slot2:'Slot 2 Exclusive'})[type] || type;
}

function renderMutations() {
  const q = mutationSearch.value.trim().toLowerCase();
  const list = MUTATIONS.filter(m => {
    const hay = `${m.name} ${m.tr} ${m.effect}`.toLowerCase();
    return (mutationFilter === 'all' || m.type === mutationFilter) && hay.includes(q);
  });
  mutationGrid.innerHTML = list.map(m => `
    <article class="mutation-card" data-type="${m.type}">
      <div class="mutation-value">${m.value}</div>
      <h3>${m.name} <span>(${m.tr})</span></h3>
      <p>${m.effect}</p>
      <span class="mutation-type">${mutationTypeLabel(m.type)}</span>
    </article>`).join('');
}

document.querySelectorAll('#dinoFilters button').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('#dinoFilters button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  dinoFilter = btn.dataset.filter;
  renderDinos();
}));

document.querySelectorAll('#mutationFilters button').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('#mutationFilters button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  mutationFilter = btn.dataset.filter;
  renderMutations();
}));

document.querySelectorAll('.category-card[data-filter]').forEach(btn => btn.addEventListener('click', () => {
  dinoFilter = btn.dataset.filter;
  document.querySelectorAll('#dinoFilters button').forEach(b => b.classList.toggle('active', b.dataset.filter === dinoFilter));
  renderDinos();
  document.querySelector('#dinosaurs').scrollIntoView({behavior:'smooth'});
}));

document.querySelector('.category-card[data-go="mutations"]').addEventListener('click', () => {
  document.querySelector('#mutations').scrollIntoView({behavior:'smooth'});
});

dinoSearch.addEventListener('input', renderDinos);
mutationSearch.addEventListener('input', renderMutations);

document.querySelector('#menuBtn').addEventListener('click', () => document.querySelector('#nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => document.querySelector('#nav').classList.remove('open')));

renderDinos();
renderMutations();
