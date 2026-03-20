import { generateFunnelData, GEO_DATA } from './data.js'
import { t } from './i18n.js'

export function renderFunnel() {
  const container = document.getElementById('funnel')
  if (!container) return

  const data = generateFunnelData(Math.floor(Math.random() * 4000 + 10000))
  const max  = data[0].count

  container.innerHTML = data.map(step => {
    const pct = ((step.count / max) * 100).toFixed(0)
    return `
      <div class="funnel-step">
        <div class="funnel-label-row">
          <span class="funnel-label">${t(step.key)}</span>
          <span class="funnel-count">${step.count.toLocaleString('de-DE')}</span>
        </div>
        <div class="funnel-bar-track">
          <div class="funnel-bar-fill" data-pct="${pct}" style="width:0%"></div>
        </div>
      </div>
    `
  }).join('')

  // Animate bars after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.querySelectorAll('.funnel-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%'
      })
    })
  })
}

export function renderGeo() {
  const container = document.getElementById('geo-list')
  if (!container) return

  const max = GEO_DATA[0].pct

  container.innerHTML = GEO_DATA.map(item => `
    <div class="geo-item">
      <div class="geo-label-row">
        <span class="geo-label">
          <span class="geo-flag">${item.flag}</span>
          ${item.label}
        </span>
        <span class="geo-value">${item.pct.toFixed(1)}%</span>
      </div>
      <div class="geo-bar-track">
        <div class="geo-bar-fill" data-pct="${((item.pct / max) * 100).toFixed(0)}" style="width:0%"></div>
      </div>
    </div>
  `).join('')

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.querySelectorAll('.geo-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%'
      })
    })
  })
}
