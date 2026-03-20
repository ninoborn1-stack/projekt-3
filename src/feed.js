import { generateOrder } from './data.js'
import { t } from './i18n.js'

const MAX_ITEMS = 12
let feedInterval = null

function initials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

function statusLabel(status) {
  const map = { new: 'status.new', paid: 'status.paid', shipping: 'status.shipping' }
  return t(map[status] || status)
}

function createOrderRow(order) {
  const row = document.createElement('div')
  row.className = 'order-row'
  row.innerHTML = `
    <div class="order-avatar">${initials(order.name)}</div>
    <div class="order-info">
      <div class="order-name">${order.name}</div>
      <div class="order-product">${order.product}</div>
    </div>
    <div class="order-amount">€${order.amount.toFixed(2)}</div>
    <div class="order-status status-${order.status}">${statusLabel(order.status)}</div>
  `
  return row
}

export function initFeed() {
  const feed = document.getElementById('orders-feed')
  if (!feed) return

  // Seed with initial orders
  for (let i = 0; i < 6; i++) {
    const row = createOrderRow(generateOrder())
    row.style.animation = 'none'
    feed.appendChild(row)
  }

  // Live update
  if (feedInterval) clearInterval(feedInterval)
  feedInterval = setInterval(() => {
    const order = generateOrder()
    const row = createOrderRow(order)

    feed.prepend(row)

    // Remove oldest
    while (feed.children.length > MAX_ITEMS) {
      feed.removeChild(feed.lastChild)
    }
  }, 3500)
}

export function destroyFeed() {
  if (feedInterval) {
    clearInterval(feedInterval)
    feedInterval = null
  }
}
