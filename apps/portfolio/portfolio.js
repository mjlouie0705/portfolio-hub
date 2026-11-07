import { scatter } from '../../assets/stickers.js';

// 모든 데이터는 이 브라우저의 localStorage에만 저장됩니다. 서버 전송 없음.
const KEY = 'portfolio-hub:portfolio:v1';
const COVERS = ['#8a5a36', '#4f86f7', '#f39bc4', '#7fcf98'];
const MAX_IMAGE_SIDE = 720;

const SAMPLE = () => ({
  profile: {
    name: '하늘(예시)',
    klass: '2학년 3반',
    no: '7',
    greeting: 'dear 선생님,',
    intro: '궁금한 건 직접 만들어 보는 학생이에요. 실험하고, 그리고, 코딩하면서 배우는 게 진짜 재밌어요!',
    highlight: '진짜',
    goal: '한 달에 하나씩 작품을 완성하고, 만들면서 배운 점을 꼭 기록하기.',
  },
  skills: ['그림 그리기', '과학 실험', '발표', '블록 코딩', '친구 돕기'],
  projects: [
    { id: uid(), title: '우리 동네 식물 지도', category: '과학', date: '2026-05-12', desc: '학교 주변에서 찾은 식물 24종을 사진과 함께 지도로 정리했어요.', link: '', image: '' },
    { id: uid(), title: '구름 관찰 그림일기', category: '미술', date: '2026-07-03', desc: '2주 동안 매일 하늘을 보고 구름 모양을 수채화로 그렸어요.', link: '', image: '' },
    { id: uid(), title: '분리수거 퀴즈 게임', category: '코딩', date: '2026-09-20', desc: '엔트리로 만든 퀴즈 게임. 반 친구 20명이 플레이해 봤어요.', link: '', image: '' },
  ],
  journal: [
    { id: uid(), date: '2026-03-04', title: '포트폴리오 시작!', text: '올해는 내가 만든 것들을 한곳에 모아 보기로 했다.' },
    { id: uid(), date: '2026-06-18', title: '발표를 끝까지 해냈다', text: '떨렸지만 식물 지도를 반 친구들 앞에서 소개했다. 질문도 3개나 받았다.' },
  ],
  updated: '',
});

function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }
const $ = (s, r = document) => r.querySelector(s);
const str = (v, max) => (typeof v === 'string' ? v : '').slice(0, max);

/* ---------- storage ---------- */
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return sanitize(JSON.parse(raw));
  } catch { /* corrupted or storage blocked → fall back */ }
  return SAMPLE();
}
function save() {
  state.updated = new Date().toISOString();
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { toast('저장 공간이 부족해요. 사진 개수를 줄여 보세요.'); }
}

/** 불러온 JSON을 허용된 필드·길이로만 정리 (외부 파일은 신뢰하지 않음) */
function sanitize(d) {
  if (!d || typeof d !== 'object') throw new Error('bad');
  const p = d.profile || {};
  return {
    profile: {
      name: str(p.name, 30), klass: str(p.klass, 20), no: str(p.no, 10),
      greeting: str(p.greeting, 40), intro: str(p.intro, 300),
      highlight: str(p.highlight, 20), goal: str(p.goal, 200),
    },
    skills: (Array.isArray(d.skills) ? d.skills : []).map(s => str(s, 30)).filter(Boolean).slice(0, 30),
    projects: (Array.isArray(d.projects) ? d.projects : []).slice(0, 60).map(x => ({
      id: str(x?.id, 20) || uid(), title: str(x?.title, 60), category: str(x?.category, 20),
      date: safeDate(x?.date), desc: str(x?.desc, 600), link: safeUrl(x?.link),
      image: safeImage(x?.image),
    })),
    journal: (Array.isArray(d.journal) ? d.journal : []).slice(0, 200).map(x => ({
      id: str(x?.id, 20) || uid(), date: safeDate(x?.date), title: str(x?.title, 60), text: str(x?.text, 600),
    })),
    updated: str(d.updated, 40),
  };
}
function safeDate(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v : ''; }
function safeUrl(v) {
  try { const u = new URL(String(v)); return (u.protocol === 'https:' || u.protocol === 'http:') ? u.href.slice(0, 300) : ''; }
  catch { return ''; }
}
function safeImage(v) {
  return typeof v === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v) && v.length < 600_000 ? v : '';
}

let state = load();
let filter = '전체';

/* ---------- render (textContent only, never innerHTML with user data) ---------- */
function h(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderIntro(target, text, word) {
  target.replaceChildren();
  const i = word ? text.indexOf(word) : -1;
  if (i < 0) { target.textContent = text; return; }
  target.append(text.slice(0, i), h('span', 'marker', word), text.slice(i + word.length));
}

function fmtDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${y}. ${Number(m)}. ${Number(day)}.`;
}

function render() {
  const p = state.profile;
  $('#greeting').textContent = p.greeting || 'hello,';
  $('#hello').textContent = '';
  $('#hello').append('안녕, 나는', document.createElement('br'), p.name || '이름을 적어 주세요');
  renderIntro($('#intro'), p.intro, p.highlight);
  $('#lbl-name').textContent = p.name || '-';
  $('#lbl-class').textContent = p.klass || '-';
  $('#lbl-no').textContent = p.no || '-';
  $('#goal').textContent = p.goal || '목표를 적어 보세요.';
  $('#goal-card').hidden = !p.goal && !document.body.classList.contains('editing');
  $('#updated').textContent = state.updated ? `마지막 수정 ${new Date(state.updated).toLocaleDateString('ko-KR')}` : '예시 내용이에요 · ‘편집하기’로 내 이야기로 바꿔 보세요';
  document.title = p.name ? `${p.name}의 포트폴리오` : '학생 포트폴리오';

  const skills = $('#skills');
  skills.replaceChildren(...state.skills.map(s => h('li', '', s)));

  renderFilters();
  renderWorks();
  renderTimeline();

  const cats = [...new Set(state.projects.map(x => x.category).filter(Boolean))];
  $('#cat-list').replaceChildren(...cats.map(c => { const o = document.createElement('option'); o.value = c; return o; }));
}

function renderFilters() {
  const cats = ['전체', ...new Set(state.projects.map(x => x.category).filter(Boolean))];
  if (!cats.includes(filter)) filter = '전체';
  const box = $('#filters');
  box.hidden = cats.length < 3;
  box.replaceChildren(...cats.map(c => {
    const b = h('button', 'tag', c);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(c === filter));
    b.addEventListener('click', () => { filter = c; renderFilters(); renderWorks(); });
    return b;
  }));
}

function renderWorks() {
  const list = [...state.projects]
    .filter(x => filter === '전체' || x.category === filter)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const grid = $('#work-grid');
  grid.replaceChildren();
  $('#works-empty').hidden = state.projects.length > 0;
  list.forEach((x, i) => {
    const li = h('li', 'card work');
    const thumb = h('div', 'thumb');
    if (x.image) {
      const img = new Image(); img.src = x.image; img.alt = `${x.title} 사진`; img.loading = 'lazy';
      thumb.append(img);
    } else {
      thumb.style.backgroundColor = COVERS[hash(x.title) % COVERS.length];
      thumb.append(h('span', 'ph', (x.title || '?').trim().charAt(0)));
    }
    const meta = h('div', 'meta');
    if (x.category) meta.append(h('span', 'tag', x.category));
    if (x.date) meta.append(h('span', 'date', fmtDate(x.date)));
    li.append(thumb, meta, h('h3', '', x.title), h('p', '', x.desc));
    if (x.link) {
      const a = h('a', 'ext', '작품 보러 가기 →');
      a.href = x.link; a.target = '_blank'; a.rel = 'noopener noreferrer';
      li.append(a);
    }
    li.append(editRow(() => openProject(x), () => {
      if (confirm(`‘${x.title}’ 작품을 지울까요?`)) { state.projects = state.projects.filter(p => p.id !== x.id); save(); render(); }
    }));
    grid.append(li);
    if (i === 0) scatter(li, [{ name: 'star', top: '-14px', right: '-10px', size: 46, r: 12 }]);
  });
}

function renderTimeline() {
  const ol = $('#timeline');
  const items = [...state.journal].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  ol.replaceChildren(...items.map(x => {
    const li = h('li');
    li.append(h('span', 'date', fmtDate(x.date)), h('h3', '', x.title), h('p', '', x.text));
    li.append(editRow(() => openLog(x), () => {
      if (confirm('이 기록을 지울까요?')) { state.journal = state.journal.filter(j => j.id !== x.id); save(); render(); }
    }));
    return li;
  }));
  if (!items.length) ol.append(h('li', 'fine', '첫 기록을 남겨 보세요.'));
}

function editRow(onEdit, onDelete) {
  const row = h('div', 'edit-row edit-only');
  const e = h('button', 'pill small', '수정'); e.type = 'button'; e.addEventListener('click', onEdit);
  const d = h('button', 'pill small danger', '삭제'); d.type = 'button'; d.addEventListener('click', onDelete);
  row.append(e, d);
  return row;
}

function hash(s) { let n = 0; for (const c of s || '') n = (n * 31 + c.charCodeAt(0)) >>> 0; return n; }

function toast(msg) {
  const t = h('div', 'toast', msg);
  t.setAttribute('role', 'status');
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}

/* ---------- dialogs ---------- */
function bindDialog(dlg, form, onOk) {
  form.addEventListener('submit', (e) => {
    if (e.submitter?.value === 'ok') onOk(new FormData(form));
  });
}

const dProfile = $('#dlg-profile'), fProfile = $('#form-profile');
function openProfile() {
  const p = state.profile, f = fProfile.elements;
  for (const k of ['name', 'klass', 'no', 'greeting', 'intro', 'highlight', 'goal']) f[k].value = p[k] || '';
  f.skills.value = state.skills.join(', ');
  dProfile.showModal();
}
bindDialog(dProfile, fProfile, (fd) => {
  const g = k => String(fd.get(k) || '').trim();
  state.profile = { name: g('name'), klass: g('klass'), no: g('no'), greeting: g('greeting'), intro: g('intro'), highlight: g('highlight'), goal: g('goal') };
  state.skills = g('skills').split(',').map(s => s.trim()).filter(Boolean).slice(0, 30);
  save(); render(); toast('프로필을 저장했어요');
});

const dProject = $('#dlg-project'), fProject = $('#form-project');
let editingProject = null, pendingImage = '';
function openProject(x = null) {
  editingProject = x;
  fProject.reset();
  $('#project-dlg-title').textContent = x ? '작품 수정' : '작품 추가';
  const f = fProject.elements;
  if (x) { f.title.value = x.title; f.category.value = x.category; f.date.value = x.date; f.desc.value = x.desc; f.link.value = x.link; }
  else f.date.value = new Date().toISOString().slice(0, 10);
  setPreview(x?.image || '');
  dProject.showModal();
}
function setPreview(src) {
  pendingImage = src;
  const box = $('#img-preview');
  box.hidden = !src;
  if (src) $('img', box).src = src;
}
$('#img-remove').addEventListener('click', () => { setPreview(''); fProject.elements.image.value = ''; });
fProject.elements.image.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try { setPreview(await shrinkImage(file)); }
  catch { toast('사진을 읽을 수 없어요'); e.target.value = ''; }
});
bindDialog(dProject, fProject, (fd) => {
  const g = k => String(fd.get(k) || '').trim();
  const link = g('link') ? safeUrl(g('link')) : '';
  const data = { title: g('title'), category: g('category'), date: safeDate(g('date')), desc: g('desc'), link, image: safeImage(pendingImage) };
  if (editingProject) Object.assign(state.projects.find(p => p.id === editingProject.id), data);
  else state.projects.push({ id: uid(), ...data });
  save(); render(); toast('작품을 저장했어요');
});

/** 사진은 캔버스로 다시 그려 크기를 줄입니다 (EXIF 위치정보 등 메타데이터도 함께 제거됨) */
function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('type'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load')); };
    img.src = url;
  });
}

const dLog = $('#dlg-log'), fLog = $('#form-log');
let editingLog = null;
function openLog(x = null) {
  editingLog = x;
  fLog.reset();
  const f = fLog.elements;
  f.date.value = x?.date || new Date().toISOString().slice(0, 10);
  f.title.value = x?.title || ''; f.text.value = x?.text || '';
  dLog.showModal();
}
bindDialog(dLog, fLog, (fd) => {
  const g = k => String(fd.get(k) || '').trim();
  const data = { date: safeDate(g('date')), title: g('title'), text: g('text') };
  if (editingLog) Object.assign(state.journal.find(j => j.id === editingLog.id), data);
  else state.journal.push({ id: uid(), ...data });
  save(); render(); toast('기록을 남겼어요');
});

/* ---------- toolbar ---------- */
const toggle = $('#toggle-edit');
toggle.addEventListener('click', () => {
  const on = document.body.classList.toggle('editing');
  toggle.setAttribute('aria-pressed', String(on));
  toggle.textContent = on ? '편집 완료' : '편집하기';
  $('#toolbar').hidden = !on;
  render();
});

const actions = {
  profile: openProfile,
  'add-project': () => openProject(),
  'add-log': () => openLog(),
  print: () => window.print(),
  export: () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  reset: () => {
    if (!confirm('이 기기에 저장된 포트폴리오를 모두 지우고 예시로 되돌릴까요? (먼저 내보내기를 해 두면 안전해요)')) return;
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    state = SAMPLE(); render(); toast('초기화했어요');
  },
};
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (b && actions[b.dataset.act]) actions[b.dataset.act]();
});

$('#import-file').addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  if (file.size > 8_000_000) return toast('파일이 너무 커요');
  try {
    const next = sanitize(JSON.parse(await file.text()));
    if (!confirm('지금 내용을 불러온 파일로 바꿀까요?')) return;
    state = next; save(); render(); toast('불러왔어요');
  } catch { toast('포트폴리오 파일이 아니에요'); }
});

/* ---------- go ---------- */
render();
scatter($('.p-hero-art'), [
  { name: 'bolt', top: '4%', right: '10%', size: 70, r: 14 },
  { name: 'ghost', bottom: '6%', left: '8%', size: 66, r: -8 },
  { name: 'sparkle', top: '16%', left: '4%', size: 40, r: 10 },
]);
scatter($('.p-hero-copy'), [{ name: 'heart', top: '-6px', right: '4%', size: 50, r: -12 }]);
