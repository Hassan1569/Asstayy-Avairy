
  /* ── PAGE ROUTER ── */
  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-pill').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    const navEl = document.getElementById('nav-' + id);
    if (navEl) navEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── GALLERY FILTER ── */
  function filterGallery(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.gallery-card').forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.style.display = '';
        card.style.animation = 'fadeUp 0.4s ease both';
      } else {
        card.style.display = 'none';
      }
    });
  }

  /* ── CONTACT FORM ── */
  function submitForm() {
    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    if (!name || !email) {
      alert('Please fill in at least your name and email.');
      return;
    }
    document.getElementById('form-success').style.display = 'block';
    ['f-name','f-phone','f-email','f-bird','f-budget','f-msg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 5000);
  }

  /* ── PRODUCTS FILTER ENGINE ── */
  function getCheckedValues(selector) {
    return [...document.querySelectorAll(selector)]
      .filter(cb => cb.checked).map(cb => cb.value);
  }

  function updatePriceDisplay(val) {
    document.getElementById('price-display').textContent = 'Rs ' + Number(val).toLocaleString();
    // Update slider gradient
    const range = document.getElementById('price-range');
    const pct = ((val - range.min) / (range.max - range.min)) * 100;
    range.style.setProperty('--val', pct + '%');
  }

  function runFilter() {
    const query      = (document.getElementById('prod-search').value || '').toLowerCase().trim();
    const maxPrice   = parseInt(document.getElementById('price-range').value);
    const cats       = getCheckedValues('#filter-sidebar input[type="checkbox"][value="dove"], #filter-sidebar input[type="checkbox"][value="lovebird"], #filter-sidebar input[type="checkbox"][value="cockatiel"], #filter-sidebar input[type="checkbox"][value="accessory"], #filter-sidebar input[type="checkbox"][value="food"], #filter-sidebar input[type="checkbox"][value="bundle"]');
    const availModes = getCheckedValues('#filter-sidebar input[type="checkbox"][value="instock"], #filter-sidebar input[type="checkbox"][value="order"]');
    const sortMode   = document.getElementById('prod-sort').value;

    // Toggle search clear btn
    document.getElementById('search-clear-btn').style.display = query ? 'block' : 'none';

    let items = [...document.querySelectorAll('.prod-item')];

    // Filter
    items.forEach(item => {
      const cat   = item.dataset.cat;
      const price = parseInt(item.dataset.price);
      const name  = item.dataset.name.toLowerCase();
      const avail = item.dataset.avail;

      const catOk   = cats.includes(cat);
      const priceOk = price <= maxPrice;
      const availOk = availModes.includes(avail);
      const queryOk = !query || name.includes(query) || cat.includes(query);

      if (catOk && priceOk && availOk && queryOk) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    // Sort visible items
    const grid    = document.getElementById('prod-grid');
    let visible   = items.filter(i => !i.classList.contains('hidden'));
    let invisible = items.filter(i =>  i.classList.contains('hidden'));

    if (sortMode === 'price-asc')  visible.sort((a,b) => a.dataset.price - b.dataset.price);
    if (sortMode === 'price-desc') visible.sort((a,b) => b.dataset.price - a.dataset.price);
    if (sortMode === 'name-asc')   visible.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name));
    if (sortMode === 'rating')     visible.sort((a,b) => b.dataset.rating - a.dataset.rating);

    // Re-append in sorted order
    [...visible, ...invisible].forEach(el => grid.appendChild(el));

    // Update count
    const count = visible.length;
    document.getElementById('result-num').textContent = count;

    // Show/hide no-results
    document.getElementById('no-results').style.display = count === 0 ? 'block' : 'none';
  }

  function resetFilters() {
    document.querySelectorAll('#filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = true);
    const range = document.getElementById('price-range');
    range.value = range.max;
    updatePriceDisplay(range.max);
    document.getElementById('prod-search').value = '';
    document.getElementById('prod-sort').value = 'default';
    document.getElementById('search-clear-btn').style.display = 'none';
    runFilter();
  }

  function clearSearch() {
    document.getElementById('prod-search').value = '';
    document.getElementById('search-clear-btn').style.display = 'none';
    runFilter();
  }

  /* Mobile filter drawer */
  function openMobileFilter() {
    document.getElementById('filter-sidebar').classList.add('open');
    document.getElementById('filter-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileFilter() {
    document.getElementById('filter-sidebar').classList.remove('open');
    document.getElementById('filter-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Enquiry shortcut → contact page */
  function enquire(name) {
    showPage('contact');
    const sel = document.getElementById('f-bird');
    if (sel) {
      for (let i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text.toLowerCase().includes(name.split(' ')[0].toLowerCase())) {
          sel.selectedIndex = i;
          break;
        }
      }
    }
  }

  /* Init price slider gradient on load */
  window.addEventListener('DOMContentLoaded', () => {
    const range = document.getElementById('price-range');
    if (range) updatePriceDisplay(range.value);
  });
