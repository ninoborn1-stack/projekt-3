import { t } from './i18n.js'

function trendHTML(pct) {
  const up   = pct >= 0
  const icon = up
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
  const cls  = up ? 'up' : 'down'
  const sign = up ? '+' : ''
  return `<span class="kpi-trend ${cls}">${icon} ${sign}${pct}% ${t('trend.vs')}</span>`
}

export function renderKPIs(kpis) {
  const fmt = (n) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 })

  const el = (id, val, trend) => {
    const v = document.getElementById(`kpi-${id}-value`)
    const t = document.getElementById(`kpi-${id}-trend`)
    if (v) v.textContent = val
    if (t) t.innerHTML = trendHTML(trend)
  }

  el('revenue',    `€${fmt(kpis.revenue.value)}`,   kpis.revenue.pct)
  el('orders',     fmt(kpis.orders.value),           kpis.orders.pct)
  el('conversion', `${kpis.conversion.value}%`,     kpis.conversion.pct)
  el('aov',        `€${fmt(kpis.aov.value)}`,        kpis.aov.pct)
}
