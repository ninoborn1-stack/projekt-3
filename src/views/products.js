function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a }

const PRODUCTS = [
  { name: 'Merino Wool Sweater',    cat: 'Clothing',     price: 89.90,  img: '🧥' },
  { name: 'Leather Weekender Bag',  cat: 'Accessories',  price: 149.00, img: '👜' },
  { name: 'Wireless Earbuds Pro',   cat: 'Electronics',  price: 129.00, img: '🎧' },
  { name: 'Ceramic Mug Set',        cat: 'Kitchen',      price: 34.90,  img: '☕' },
  { name: 'Linen Shirt',            cat: 'Clothing',     price: 59.90,  img: '👕' },
  { name: 'Running Shorts Elite',   cat: 'Sports',       price: 44.90,  img: '🩳' },
  { name: 'Bamboo Cutting Board',   cat: 'Kitchen',      price: 29.90,  img: '🪵' },
  { name: 'Smart Water Bottle',     cat: 'Sports',       price: 39.90,  img: '💧' },
  { name: 'Canvas Sneakers',        cat: 'Footwear',     price: 79.90,  img: '👟' },
  { name: 'Yoga Mat Premium',       cat: 'Sports',       price: 69.90,  img: '🧘' },
  { name: 'Coffee Grinder',         cat: 'Kitchen',      price: 54.90,  img: '☕' },
  { name: 'Notebook — Hardcover',   cat: 'Stationery',   price: 19.90,  img: '📓' },
  { name: 'Wool Beanie',            cat: 'Accessories',  price: 24.90,  img: '🧢' },
  { name: 'Desk Lamp Minimal',      cat: 'Home',         price: 69.90,  img: '💡' },
  { name: 'Linen Tote Bag',         cat: 'Accessories',  price: 22.90,  img: '🛍️' },
  { name: 'Bamboo Toothbrush Set',  cat: 'Care',         price: 12.90,  img: '🪥' },
]

const CATS = ['All', 'Clothing', 'Accessories', 'Electronics', 'Kitchen', 'Sports', 'Footwear', 'Home', 'Stationery', 'Care']

function gen() {
  return PRODUCTS.map(p => ({
    ...p,
    stock: rnd(0, 180),
    sales: rnd(12, 340),
    trend: +(Math.random() * 40 - 12).toFixed(1),
    rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
  }))
}

function stars(r) {
  const full = Math.floor(r)
  const half = r - full >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half)
}

export function renderProductsView(container) {
  const products = gen()
  let active = 'All'

  function render(filter) {
    const list = filter === 'All' ? products : products.filter(p => p.cat === filter)
    return list.map(p => {
      const stockCls = p.stock === 0 ? 'stock-out' : p.stock < 20 ? 'stock-low' : 'stock-ok'
      const trendCls = p.trend >= 0 ? 'up' : 'down'
      const trendSign = p.trend >= 0 ? '+' : ''
      return `
        <div class="product-card panel">
          <div class="product-emoji">${p.img}</div>
          <div class="product-cat-badge">${p.cat}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-price mono">€${p.price.toFixed(2)}</div>
          <div class="product-meta">
            <span class="product-sales">${p.sales} verkauft</span>
            <span class="product-trend ${trendCls}">${trendSign}${p.trend}%</span>
          </div>
          <div class="product-stock-row">
            <span class="stock-label ${stockCls}">
              ${p.stock === 0 ? 'Ausverkauft' : `${p.stock} Stk.`}
            </span>
            <span class="product-rating">${stars(p.rating)} ${p.rating}</span>
          </div>
          <div class="product-stock-bar">
            <div class="product-stock-fill ${stockCls}" style="width:${Math.min(p.stock / 180 * 100, 100).toFixed(0)}%"></div>
          </div>
        </div>
      `
    }).join('')
  }

  container.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Produkte</h1>
        <p class="view-subtitle">${products.length} Produkte im Sortiment</p>
      </div>
      <div class="view-actions">
        <div class="search-box">
          <span data-lucide="search" class="search-icon"></span>
          <input type="text" class="search-input" placeholder="Suchen…" id="products-search">
        </div>
        <button class="btn-accent">
          <span data-lucide="plus"></span>
          Neu
        </button>
      </div>
    </div>

    <div class="cat-filters" id="cat-filters">
      ${CATS.map(c => `<button class="cat-btn ${c === 'All' ? 'active' : ''}" data-cat="${c}">${c === 'All' ? 'Alle' : c}</button>`).join('')}
    </div>

    <div class="products-grid" id="products-grid">
      ${render('All')}
    </div>
  `

  // Category filter
  container.querySelector('#cat-filters').addEventListener('click', e => {
    const btn = e.target.closest('.cat-btn')
    if (!btn) return
    container.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    active = btn.dataset.cat
    container.querySelector('#products-grid').innerHTML = render(active)
  })

  // Search
  container.querySelector('#products-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase()
    container.querySelectorAll('.product-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none'
    })
  })
}
