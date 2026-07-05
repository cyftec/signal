async function loadApiDocs() {
  try {
    const response = await fetch('/assets/_meta.json');
    if (!response.ok) throw new Error('Failed to load _meta.json');
    const meta = await response.json();
    
    const nav = document.getElementById('nav');
    if (!nav) return;
    
    // Update stats
    const statsDiv = document.querySelector('.stats');
    if (statsDiv) {
      const coreCount = meta.categories.core?.symbols?.length || 0;
      const apiCount = meta.categories.api?.symbols?.length || 0;
      statsDiv.innerHTML = `
        <div><strong>${coreCount}</strong><span>core symbols</span></div>
        <div><strong>${apiCount}</strong><span>api symbols</span></div>
      `;
    }
    
    // Build navigation
    let navHtml = '';
    for (const [categoryKey, category] of Object.entries(meta.categories)) {
      if (!category.symbols || category.symbols.length === 0) continue;
      
      navHtml += `<section class="nav-group"><h2>${categoryKey}</h2>`;
      
      for (const symbolName of category.symbols) {
        const symbolKey = `${categoryKey}:${symbolName}`;
        const symbol = meta.symbols[symbolKey];
        if (!symbol) continue;
        
        const slug = symbolName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const href = `/${categoryKey}/${slug}/`;
        const summary = symbol.tsdoc?.summary || '';
        
        navHtml += `<a class="nav-link" href="${href}"><span>${symbolName}</span><small>${summary}</small></a>`;
      }
      
      navHtml += '</section>';
    }
    
    nav.innerHTML = navHtml;
    
    // Initialize search functionality
    const searchInput = document.getElementById('search');
    const searchStatus = document.getElementById('searchStatus');
    
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
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
          searchStatus.textContent = q ? (visible + ' symbol' + (visible === 1 ? '' : 's') + " match '" + searchInput.value.trim() + "'") : '';
        }
        
        if (firstVisible instanceof HTMLElement) firstVisible.scrollIntoView({ block: 'nearest' });
      });
    }
    
    // Initialize nav toggle
    const toggle = document.querySelector('.nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        const collapsed = sidebar?.getAttribute('data-collapsed') === 'true';
        sidebar?.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
        toggle.textContent = collapsed ? 'Hide symbols' : 'Browse symbols';
      });
    }
    
  } catch (error) {
    console.error('Failed to load API docs:', error);
  }
}

// Load when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadApiDocs);
} else {
  loadApiDocs();
}
