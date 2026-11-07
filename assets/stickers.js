// Shared inline-SVG sticker set (decorative only; aria-hidden)
const O = 'stroke="#171717" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
export const STICKERS = {
  bolt: `<svg viewBox="0 0 64 64"><path d="M36 4 12 36h16l-6 24 30-36H34z" fill="#3b82f6" ${O}/></svg>`,
  heart: `<svg viewBox="0 0 64 64"><path d="M32 56S6 40 6 22a13 13 0 0 1 26-4 13 13 0 0 1 26 4c0 18-26 34-26 34z" fill="#ff66cf" ${O}/><circle cx="24" cy="26" r="3" fill="#171717"/><circle cx="40" cy="26" r="3" fill="#171717"/><path d="M27 35q5 4 10 0" fill="none" ${O}/></svg>`,
  bear: `<svg viewBox="0 0 64 64"><circle cx="16" cy="16" r="8" fill="#ff66cf" ${O}/><circle cx="48" cy="16" r="8" fill="#ff66cf" ${O}/><circle cx="32" cy="36" r="22" fill="#ff66cf" ${O}/><ellipse cx="32" cy="44" rx="9" ry="7" fill="#fdfbf9" ${O}/><circle cx="24" cy="32" r="2.6" fill="#171717"/><circle cx="40" cy="32" r="2.6" fill="#171717"/><circle cx="32" cy="41" r="2.4" fill="#171717"/></svg>`,
  ghost: `<svg viewBox="0 0 64 64"><path d="M12 58V28a20 20 0 0 1 40 0v30l-7-6-6 6-7-6-6 6-7-6z" fill="#fdfbf9" ${O}/><circle cx="25" cy="28" r="3" fill="#171717"/><circle cx="39" cy="28" r="3" fill="#171717"/></svg>`,
  sparkle: `<svg viewBox="0 0 64 64"><path d="M32 4c3 16 8 21 24 28-16 7-21 12-24 28-3-16-8-21-24-28C24 25 29 20 32 4z" fill="#3b82f6" ${O}/></svg>`,
  star: `<svg viewBox="0 0 64 64"><path d="m32 6 7.6 16.6 18 2-13.4 12.2 3.8 17.8L32 45.5 16 54.6l3.8-17.8L6.4 24.6l18-2z" fill="#22c55e" ${O}/></svg>`,
  pencil: `<svg viewBox="0 0 64 64"><path d="M10 54 14 40 44 10l10 10-30 30z" fill="#ff6f1e" ${O}/><path d="M14 40l10 10M40 14l10 10" fill="none" ${O}/><path d="M10 54l4-14 10 10z" fill="#fdfbf9" ${O}/></svg>`,
};

/** Place stickers inside `host` (position:relative). items: [{name, top, left|right, size, r}] */
export function scatter(host, items) {
  for (const it of items) {
    const el = document.createElement('span');
    el.className = 'sticker';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = STICKERS[it.name]; // static, trusted markup
    const s = el.style;
    s.setProperty('--r', `${it.r ?? 8}deg`);
    if (it.size) { s.width = s.height = `${it.size}px`; }
    for (const k of ['top', 'left', 'right', 'bottom']) if (it[k] != null) s[k] = it[k];
    host.appendChild(el);
  }
}
