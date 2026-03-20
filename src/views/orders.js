import { t } from '../i18n.js'

const PRODUCTS = [
  'Merino Wool Sweater', 'Leather Weekender Bag', 'Wireless Earbuds Pro',
  'Ceramic Mug Set', 'Linen Shirt', 'Running Shorts Elite',
  'Bamboo Cutting Board', 'Smart Water Bottle', 'Canvas Sneakers',
  'Yoga Mat Premium', 'Coffee Grinder', 'Notebook — Hardcover'
]
const NAMES = [
  'Sophie Müller', 'Luca Bauer', 'Emma Wagner', 'Noah Klein', 'Mia Hoffmann',
  'Felix Richter', 'Hannah Schmidt', 'Jan Thomas', 'Laura Peters', 'Tim Graf',
  'Sara Lehmann', 'Max Drescher', 'Anna Fischer', 'Paul Ernst', 'Lea Neumann'
]
const CITIES = ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Wien', 'Zürich', 'Stuttgart']
const STATUSES = ['new', 'paid', 'shipping', 'delivered', 'returned']

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a }
function rndF(a, b) { return +(Math.random() * (b - a) + a).toFixed(2) }

function genOrders(n = 40) {
  const orders = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(now)
    d.setHours(d.getHours() - i * rnd(1, 6))
    orders.push({
      id: `#${(10000 + i).toString()}`,
      name: NAMES[rnd(0, NAMES.length - 1)],
      city: CITIES[rnd(0, CITIES.length - 1)],
      product: PRODUCTS[rnd(0, PRODUCTS.length - 1)],
      qty: rnd(1, 3),
      amount: rndF(19, 249),
      status: STATUSES[rnd(0, STATUSES.length - 1)],
      date: d,
    })
  }
  return orders
}

const STATUS_META = {
  new:       { label: 'Neu',      cls: 'status-new' },
  paid:      { label: 'Bezahlt',  cls: 'status-paid' },
  shipping:  { label: 'Versandt', cls: 'status-shipping' },
  delivered: { label: 'Zugestellt', cls: 'status-delivered' },
  returned:  { label: 'Rückgabe', cls: 'status-returned' },
}

function formatDate(d) {
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function renderOrdersView(container) {
  const orders = genOrders(42)
  const total = orders.reduce((s, o) => s + o.amount, 0)

  container.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title" data-i18n="nav.orders">Bestellungen</h1>
        <p class="view-subtitle">${orders.length} Einträge · letzte 7 Tage</p>
      </div>
      <div class="view-actions">
        <div class="search-box">
          <span data-lucide="search" class="search-icon"></span>
          <input type="text" class="search-input" placeholder="Suchen…" id="orders-search">
        </div>
        <button class="btn-accent">
          <span data-lucide="download"></span>
          Export
        </button>
      </div>
    </div>

    <div class="table-summary-row">
      <div class="summary-stat">
        <span class="summary-label">Gesamt</span>
        <span class="summary-value">€${total.toLocaleString('de-DE', { maximumFractionDigits: 0 })}</span>
      </div>
      <div class="summary-stat">
        <span class="summary-label">Bestellungen</span>
        <span class="summary-value">${orders.length}</span>
      </div>
      <div class="summary-stat">
        <span class="summary-label">Ø Bestellwert</span>
        <span class="summary-value">€${(total / orders.length).toFixed(2)}</span>
      </div>
      <div class="summary-stat">
        <span class="summary-label">Offen</span>
        <span class="summary-value accent">${orders.filter(o => o.status === 'new').length}</span>
      </div>
    </div>

    <div class="panel table-panel">
      <table class="data-table" id="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Kunde</th>
            <th>Produkt</th>
            <th>Menge</th>
            <th>Betrag</th>
            <th>Status</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => {
            const m = STATUS_META[o.status]
            return `
              <tr class="table-row">
                <td class="mono accent-text">${o.id}</td>
                <td>
                  <div class="cell-user">
                    <div class="cell-avatar">${o.name.split(' ').map(p=>p[0]).join('')}</div>
                    <div>
                      <div class="cell-name">${o.name}</div>
                      <div class="cell-sub">${o.city}</div>
                    </div>
                  </div>
                </td>
                <td class="cell-product">${o.product}</td>
                <td class="mono">${o.qty}×</td>
                <td class="mono bold">€${o.amount.toFixed(2)}</td>
                <td><span class="badge ${m.cls}">${m.label}</span></td>
                <td class="cell-date">${formatDate(o.date)}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>
    </div>
  `

  // Live search filter
  const searchInput = container.querySelector('#orders-search')
  const tbody = container.querySelector('#orders-table tbody')
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase()
    tbody.querySelectorAll('.table-row').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none'
    })
  })
}
