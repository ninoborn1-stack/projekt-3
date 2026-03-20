/* =========================================================
   Simulated data generation
   ========================================================= */

const PRODUCTS = [
  'Merino Wool Sweater', 'Leather Weekender Bag', 'Wireless Earbuds Pro',
  'Ceramic Mug Set', 'Linen Shirt', 'Running Shorts Elite',
  'Bamboo Cutting Board', 'Smart Water Bottle', 'Canvas Sneakers',
  'Yoga Mat Premium', 'Coffee Grinder', 'Notebook — Hardcover'
]

const NAMES = [
  'Sophie M.', 'Luca B.', 'Emma W.', 'Noah K.', 'Mia H.', 'Felix R.',
  'Hannah S.', 'Jan T.', 'Laura P.', 'Tim G.', 'Sara L.', 'Max D.',
  'Anna F.', 'Paul E.', 'Lea N.', 'Finn O.', 'Clara V.', 'Jonas Z.'
]

const STATUSES = ['new', 'paid', 'shipping']

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function rndFloat(min, max, dec = 2) {
  return +(Math.random() * (max - min) + min).toFixed(dec)
}

/* Revenue time-series data */
export function generateRevenueSeries(days) {
  const labels = []
  const values = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }))

    // Simulate weekly pattern + trend + noise
    const dayOfWeek = d.getDay()
    const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1
    const base = days === 7 ? 3200 : days === 30 ? 2800 : 2500
    const trend = (days - i) / days * 0.4
    const noise = rndFloat(0.7, 1.3)
    values.push(Math.round(base * weekendBoost * (1 + trend) * noise))
  }

  return { labels, values }
}

/* KPI calculations from series */
export function calcKPIs(series) {
  const total = series.values.reduce((a, b) => a + b, 0)
  const days = series.values.length
  const orders = Math.round(total / rndFloat(58, 72))
  const visits = Math.round(orders / rndFloat(0.025, 0.04))
  const conversion = ((orders / visits) * 100)
  const aov = total / orders

  // Compare first half vs second half as "prior period"
  const half = Math.floor(days / 2)
  const first = series.values.slice(0, half).reduce((a, b) => a + b, 0)
  const second = series.values.slice(half).reduce((a, b) => a + b, 0)
  const pct = ((second - first) / first * 100).toFixed(1)

  return {
    revenue: { value: total, pct: +pct },
    orders:  { value: orders, pct: +(rndFloat(-8, 18)) },
    conversion: { value: +conversion.toFixed(2), pct: +(rndFloat(-5, 12)) },
    aov: { value: +aov.toFixed(2), pct: +(rndFloat(-6, 14)) },
  }
}

/* Traffic sources */
export function generateTrafficData() {
  return {
    labels: ['Organic', 'Direct', 'Social', 'Email', 'Paid'],
    values: [rnd(30, 40), rnd(18, 26), rnd(14, 22), rnd(8, 14), rnd(6, 12)],
    colors: ['#E11D6A', '#6366f1', '#f59e0b', '#22c55e', '#06b6d4'],
  }
}

/* Top products */
export function generateProductsData() {
  const shuffled = [...PRODUCTS].sort(() => Math.random() - 0.5).slice(0, 6)
  return {
    labels: shuffled,
    values: shuffled.map(() => rnd(40, 240)),
    color: '#E11D6A',
  }
}

/* Funnel */
export function generateFunnelData(visits = 12000) {
  const pdp      = Math.round(visits * rndFloat(0.35, 0.45))
  const cart     = Math.round(pdp   * rndFloat(0.40, 0.55))
  const checkout = Math.round(cart  * rndFloat(0.55, 0.70))
  const order    = Math.round(checkout * rndFloat(0.70, 0.85))

  return [
    { key: 'funnel.visit',    count: visits   },
    { key: 'funnel.pdp',      count: pdp      },
    { key: 'funnel.cart',     count: cart     },
    { key: 'funnel.checkout', count: checkout },
    { key: 'funnel.order',    count: order    },
  ]
}

/* Geo data */
export const GEO_DATA = [
  { flag: '🇩🇪', label: 'Deutschland', pct: rndFloat(32, 40) },
  { flag: '🇦🇹', label: 'Österreich',  pct: rndFloat(14, 20) },
  { flag: '🇨🇭', label: 'Schweiz',     pct: rndFloat(12, 18) },
  { flag: '🇳🇱', label: 'Niederlande', pct: rndFloat(8,  14) },
  { flag: '🇫🇷', label: 'Frankreich',  pct: rndFloat(6,  10) },
].sort((a, b) => b.pct - a.pct)

/* Random order for live feed */
export function generateOrder() {
  return {
    name:    NAMES[rnd(0, NAMES.length - 1)],
    product: PRODUCTS[rnd(0, PRODUCTS.length - 1)],
    amount:  rndFloat(24, 189),
    status:  STATUSES[rnd(0, STATUSES.length - 1)],
  }
}
