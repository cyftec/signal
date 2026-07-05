
const search = document.getElementById('search');
const nav = document.getElementById('nav');
const doc = document.querySelector('.doc');
const copyButtons = document.querySelectorAll('.copy-button');
const toggle = document.querySelector('.nav-toggle');
const searchStatus = document.getElementById('searchStatus');

copyButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const code = btn.parentElement.querySelector('code');
    await navigator.clipboard.writeText(code.textContent);
    const old = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => btn.textContent = old, 1200);
  });
});

toggle?.addEventListener('click', () => {
  const sidebar = document.querySelector('.sidebar');
  const collapsed = sidebar?.getAttribute('data-collapsed') === 'true';
  sidebar?.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
  toggle.textContent = collapsed ? 'Hide symbols' : 'Browse symbols';
});

search?.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  let visible = 0;
  let firstVisible = null;
  document.querySelectorAll('.nav-link').forEach((link) => {
    const text = link.textContent.toLowerCase();
    const match = q ? text.includes(q) : true;
    link.hidden = !match;
    link.style.display = match ? '' : 'none';
    if (match) {
      visible++;
      if (!firstVisible) firstVisible = link;
    }
  });
  document.querySelectorAll('.nav-group').forEach((group) => {
    const hasVisible = !!group.querySelector('.nav-link:not([hidden])');
    group.hidden = q ? !hasVisible : false;
    group.style.display = q && !hasVisible ? 'none' : '';
  });
  if (searchStatus) {
    searchStatus.textContent = q ? (visible + ' symbol' + (visible === 1 ? '' : 's') + " match '" + search.value.trim() + "'") : '';
  }
  if (firstVisible instanceof HTMLElement) firstVisible.scrollIntoView({ block: 'nearest' });
  doc?.querySelectorAll('section,article,header,p,li,blockquote,.code-block,h1,h2,h3,h4,h5,h6').forEach((el) => {
    el.hidden = false;
  });
});
