import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(readFileSync(resolve(root, 'profile.json'), 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function url(value) {
  if (!value || !/^(https?:\/\/|mailto:|assets\/)/i.test(value) || /[\s\\]/.test(value)) throw new Error(`Unsupported URL: ${value}`);
  return esc(value);
}
const link = (label, href, className = '') => `<a class="${className}" href="${url(href)}">${esc(label)}<span aria-hidden="true"> ↗</span></a>`;
const heading = (id, n, title, aside = '') => `<div class="section-heading"><h2 id="${id}"><span>${n}</span>${title}</h2>${aside}</div>`;
const empty = text => `<p class="empty">${text}</p>`;
const papers = data.publications.map((p, i) => `<article class="paper">
  <div class="paper-index">${String(i + 1).padStart(2, '0')}</div><div class="paper-body">
  <div class="paper-meta">${esc(p.venue)}${p.year ? ` · ${esc(p.year)}` : ''}${p.note ? ` <span class="paper-note">${esc(p.note)}</span>` : ''}</div>
  <h3>${p.url ? `<a href="${url(p.url)}">${esc(p.title)}</a>` : esc(p.title)}</h3>
  <p class="authors">${(p.authors || []).map(a => a === data.name ? `<strong>${esc(a)}</strong>` : esc(a)).join(', ')}</p>
  ${p.summary ? `<p>${esc(p.summary)}</p>` : ''}
  <div class="paper-links">${(p.links || []).map(l => link(l.label, l.url)).join('')}${p.bibtex ? `<button type="button" class="bibtex-toggle" aria-expanded="false" aria-controls="bib-${i}">BibTeX <span aria-hidden="true">+</span></button>` : ''}</div>
  ${p.bibtex ? `<div id="bib-${i}" class="bibtex" hidden><pre><code>${esc(p.bibtex)}</code></pre><button type="button" class="copy-citation">Copy citation</button><span class="copy-status" role="status"></span></div>` : ''}
  </div></article>`).join('');
const advisorSentence = data.advisors?.length ? ` I am advised by ${data.advisors.map(a => `${esc(a.title)} <a class="advisor-link" href="${url(a.url)}">${esc(a.name)}</a>`).join(" and ")}.` : "";
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(data.description)}"><meta name="color-scheme" content="light dark">
<title>${esc(data.name)} · Academic Homepage</title><link rel="icon" href="assets/academic-mark.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/academic.css"><script src="assets/academic.js" defer></script></head>
<body><a class="skip-link" href="#main">Skip to content</a>
<header class="topbar"><a class="wordmark" href="#">${esc(data.name)}<span> / Academic Homepage</span></a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#publications">Publications</a><a href="#contact">Contact</a></nav><button class="theme-toggle" type="button" aria-label="Switch to dark theme" hidden><span aria-hidden="true">◐</span></button></header>
<div class="page"><aside class="profile" aria-label="Profile">
${data.portrait ? `<img class="portrait" src="${url(data.portrait)}" alt="Portrait of ${esc(data.name)}">` : `<div class="monogram" aria-hidden="true">${esc(data.name.slice(0, 1).toUpperCase())}<span>RESEARCH PROFILE</span></div>`}
<h1>${esc(data.name)}</h1>${data.position ? `<p class="position">${esc(data.position)}</p>` : ''}${data.affiliation ? `<p class="affiliation">${data.affiliationUrl ? link(data.affiliation, data.affiliationUrl) : esc(data.affiliation)}</p>` : ''}
<div class="profile-links">${data.email ? link(data.email, `mailto:${data.email}`) : ''}${data.links.map(l => link(l.label, l.url)).join('')}</div>
<div class="sidebar-note"><span class="small-label">RESEARCH FOCUS</span><p>Evaluating multimodal perception for safer autonomous driving.</p></div></aside>
<main id="main"><section class="intro" aria-labelledby="about"><p class="eyebrow">RESEARCH & EXPLORATION</p><h2 id="about">About me<span class="accent">.</span></h2>${data.about.map((p, i) => `<p class="intro-text">${esc(p)}${i === 0 ? advisorSentence : ""}</p>`).join('')}${data.interests.length ? `<div class="interests"><span class="small-label">RESEARCH INTERESTS</span><ul>${data.interests.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}</section>
${data.news.length ? `<section class="section" aria-labelledby="news">${heading('news','01','News')}<ul class="news-list">${data.news.map(n => `<li><time>${esc(n.date)}</time><span>${esc(n.text)}${n.url ? ' '+link('Read more',n.url) : ''}</span></li>`).join('')}</ul></section>` : ''}
<section class="section" aria-labelledby="publications">${heading('publications',data.news.length ? '02' : '01','Publications', `<span class="section-aside">${data.publications.length ? `${data.publications.length} ${data.publications.length === 1 ? 'publication' : 'publications'}` : 'RESEARCH OUTPUT'}</span>`)}${papers || empty('Publication details will be added soon.')}</section>
${data.education.length ? `<section class="section" aria-labelledby="education">${heading('education','03','Education')}<ul class="education-list">${data.education.map(e => `<li><span class="date">${esc(e.period)}</span><div><h3>${esc(e.institution)}</h3><p>${esc(e.degree)}</p>${e.detail ? `<p>${esc(e.detail)}</p>` : ''}</div></li>`).join('')}</ul></section>` : ''}
${data.service.length ? `<section class="section" aria-labelledby="service">${heading('service','04','Academic Service')}<ul class="service-list">${data.service.map(s => `<li>${esc(s)}</li>`).join('')}</ul></section>` : ''}
<section class="section contact" aria-labelledby="contact">${heading('contact','↗','Get in touch')}<p>${data.email ? 'For research discussions and academic correspondence, please reach out by email.' : 'You can find my public work and connect with me on GitHub.'}</p>${data.email ? link('Email me',`mailto:${data.email}`,'contact-link') : link('Visit my GitHub','https://github.com/qjfysun','contact-link')}</section>
<footer><span>© ${new Date().getUTCFullYear()} ${esc(data.name)}</span><a href="#">Back to top ↑</a></footer></main></div></body></html>`;
mkdirSync(resolve(root, 'dist/assets'), { recursive: true });
for (const f of ['academic.css', 'academic.js', 'academic-mark.svg']) cpSync(resolve(root, 'assets', f), resolve(root, 'dist/assets', f));
if (data.portrait?.startsWith('assets/')) cpSync(resolve(root, data.portrait), resolve(root, 'dist', data.portrait), { recursive: true });
for (const l of [...data.links, ...data.publications.flatMap(p => p.links || [])]) {
  if (l.url.startsWith('assets/')) { mkdirSync(resolve(root, 'dist', l.url, '..'), { recursive: true }); cpSync(resolve(root, l.url), resolve(root, 'dist', l.url)); }
}
writeFileSync(resolve(root, 'dist/index.html'), html);
writeFileSync(resolve(root, 'dist/.nojekyll'), '');
console.log(`Built academic homepage: ${data.name}; ${data.publications.length} publications.`);
