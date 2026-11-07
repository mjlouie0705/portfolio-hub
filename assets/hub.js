import { APPS, IDEAS } from '../apps.js';
import { scatter } from './stickers.js';

const grid = document.getElementById('app-grid');

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v; else n.setAttribute(k, v);
  }
  for (const k of kids) n.append(k);
  return n;
}

function label(rows) {
  return el('div', { class: 'name-label' }, ...rows.map(([k, v]) =>
    el('div', { class: 'row' }, el('span', { class: 'k' }, k), el('span', { class: 'v' }, v))));
}

APPS.forEach((app, i) => {
  const no = `no. ${String(i + 1).padStart(2, '0')}`;
  const cover = el('div', { class: `notebook ${app.cover}` }, label([['이름', app.title], ['분류', app.category], ['번호', no]]));
  const li = el('li', { class: 'card app-card' },
    el('a', { class: 'cover-link', href: app.path, 'aria-label': `${app.title} 열기` }, cover),
    el('div', { class: 'meta' },
      el('span', { class: `tag ${app.status === 'live' ? 'live' : ''}` }, app.status === 'live' ? '운영 중' : '준비 중'),
      el('span', { class: 'tag' }, app.stack)),
    el('h3', {}, app.title),
    el('p', {}, app.summary),
    el('a', { class: 'pill small', href: app.path }, '열어보기'));
  grid.append(li);
  scatter(li, [{ name: app.sticker, r: 12 }]);
});

IDEAS.forEach((idea) => {
  const li = el('li', { class: 'card app-card idea' },
    el('div', { class: `notebook ${idea.cover}` }, label([['이름', idea.title], ['분류', '아이디어'], ['번호', 'soon']])),
    el('div', { class: 'meta' }, el('span', { class: 'tag' }, '준비 중')),
    el('h3', {}, idea.title),
    el('p', {}, idea.note));
  grid.append(li);
  scatter(li, [{ name: idea.sticker, r: -9 }]);
});

document.getElementById('live-count').textContent = APPS.filter(a => a.status === 'live').length;

scatter(document.querySelector('.hero-art'), [
  { name: 'bolt', top: '6%', right: '8%', size: 72, r: 14 },
  { name: 'bear', bottom: '4%', left: '6%', size: 80, r: -10 },
  { name: 'sparkle', bottom: '18%', right: '2%', size: 44, r: 6 },
]);
scatter(document.querySelector('.hero-copy'), [{ name: 'heart', top: '-8px', right: '6%', size: 52, r: -12 }]);
