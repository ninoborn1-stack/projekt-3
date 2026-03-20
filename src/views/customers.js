function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a }
function rndF(a, b) { return +(Math.random() * (b - a) + a).toFixed(2) }

const FIRST = ['Sophie', 'Luca', 'Emma', 'Noah', 'Mia', 'Felix', 'Hannah', 'Jan', 'Laura', 'Tim', 'Sara', 'Max', 'Anna', 'Paul', 'Lea', 'Finn', 'Clara', 'Jonas', 'Nina', 'Ben']
const LAST  = ['Müller', 'Bauer', 'Wagner', 'Klein', 'Hoffmann', 'Richter', 'Schmidt', 'Thomas', 'Peters', 'Graf', 'Lehmann', 'Drescher', 'Fischer', 'Ernst', 'Neumann', 'Orth', 'Vogel', 'Zimmermann']
const CITIES = ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Wien', 'Zürich', 'Stuttgart', 'Düsseldorf', 'Leipzig']
const DOMAINS = ['gmail.com', 'web.de', 'gmx.de', 'icloud.com', 'outlook.com']
const SEGMENTS = ['VIP', 'Aktiv', 'Aktiv', 'Aktiv', 'Inaktiv', 'Neu', 'Neu']

function genCustomers(n = 35) {
  const customers = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    const first = FIRST[rnd(0, FIRST.length - 1)]
    const last  = LAST[rnd(0, LAST.length - 1)]
    const orders = rnd(1, 24)
    const spent  = rndF(orders * 30, orders * 180)
    const joined = new Date(now)
    joined.setDate(joined.getDate() - rnd(10, 730))
    customers.push({
      first, last,
      email:   `${first.toLowerCase()}.${last.toLowerCase().slice(0,3)}@${DOMAINS[rnd(0, DOMAINS.length-1)]}`,
      city:    CITIES[rnd(0, CITIES.length - 1)],
      orders,
      spent,
      aov:    +(spent / orders).toFixed(2),
      segment: SEGMENTS[rnd(0, SEGMENTS.length - 1)],
      joined,
    })
  }
  return customers.sort((a, b) => b.spent - a.spent)
}

const SEG_CLS = {
  'VIP':    'seg-vip',
  'Aktiv':  'seg-active',
  'Inaktiv':'seg-inactive',
  'Neu':    'seg-new',
}

export function renderCustomersView(container) {
  const customers = genCustomers(38)
  const totalSpent = customers.reduce((s, c) => s + c.spent, 0)
  const vips = customers.filter(c => c.segment === 'VIP').length

  container.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Kunden</h1>
        <p class="view-subtitle">${customers.length} registrierte Kunden</p>
      </div>
      <div class="view-actions">
        <div class="search-box">
          <span data-lucide="search" class="search-icon"></span>
          <input type="text" class="search-input" placeholder="Suchen…" id="customers-search">
        </div>
        <button class="btn-accent">
          <span data-lucide="download"></span>
          Export
        </button>
      </div>
    </div>

    <div class="table-summary-row">
      <div class="summary-stat">
        <span class="summary-label">Gesamt-Umsatz</span>
        <span class="summary-value">€${totalSpent.toLocaleString('de-DE', { maximumFractionDigits: 0 })}</span>
      </div>
      <div class="summary-stat">
        <span class="summary-label">Kunden</span>
        <span class="summary-value">${customers.length}</span>
      </div>
      <div class="summary-stat">
        <span class="summary-label">VIP Kunden</span>
        <span class="summary-value accent">${vips}</span>
      </div>
      <div class="summary-stat">
        <span class="summary-label">Ø Umsatz/Kunde</span>
        <span class="summary-value">€${(totalSpent / customers.length).toFixed(0)}</span>
      </div>
    </div>

    <div class="panel table-panel">
      <table class="data-table" id="customers-table">
        <thead>
          <tr>
            <th>Kunde</th>
            <th>Stadt</th>
            <th>Bestellungen</th>
            <th>Ø Bestellwert</th>
            <th>Gesamt</th>
            <th>Segment</th>
            <th>Seit</th>
          </tr>
        </thead>
        <tbody>
          ${customers.map((c, i) => `
            <tr class="table-row">
              <td>
                <div class="cell-user">
                  <div class="cell-avatar" style="background:${i < 3 ? 'var(--accent)' : 'var(--accent-dim)'}; color:${i < 3 ? '#fff' : 'var(--accent)'}">
                    ${c.first[0]}${c.last[0]}
                  </div>
                  <div>
                    <div class="cell-name">${c.first} ${c.last}</div>
                    <div class="cell-sub">${c.email}</div>
                  </div>
                </div>
              </td>
              <td>${c.city}</td>
              <td class="mono">${c.orders}</td>
              <td class="mono">€${c.aov.toFixed(2)}</td>
              <td class="mono bold">€${c.spent.toLocaleString('de-DE', { maximumFractionDigits: 0 })}</td>
              <td><span class="badge ${SEG_CLS[c.segment]}">${c.segment}</span></td>
              <td class="cell-date">${c.joined.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `

  const searchInput = container.querySelector('#customers-search')
  const tbody = container.querySelector('#customers-table tbody')
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase()
    tbody.querySelectorAll('.table-row').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none'
    })
  })
}
