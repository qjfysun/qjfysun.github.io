const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
let stored;
try { stored = localStorage.getItem('academic-theme'); } catch {}
if (stored === 'dark' || stored === 'light') root.dataset.theme = stored;
const system = matchMedia('(prefers-color-scheme: dark)');
function updateLabel() {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : system.matches;
  toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
}
toggle.hidden = false;
updateLabel();
system.addEventListener('change', updateLabel);
toggle.addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : system.matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('academic-theme', root.dataset.theme); } catch {}
  updateLabel();
});
document.querySelectorAll('.bibtex-toggle').forEach(button => button.addEventListener('click', () => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  panel.hidden = !panel.hidden;
  button.setAttribute('aria-expanded', String(!panel.hidden));
}));
document.querySelectorAll('.copy-citation').forEach(button => button.addEventListener('click', async () => {
  const status = button.parentElement.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText(button.parentElement.querySelector('code').textContent);
    status.textContent = 'Copied.';
  } catch { status.textContent = 'Please select and copy the citation above.'; }
}));
