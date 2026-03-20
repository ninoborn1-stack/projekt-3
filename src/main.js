import { createIcons, icons } from 'lucide'
import { setLang, getLang, applyTranslations, t } from './i18n.js'
import { generateRevenueSeries, calcKPIs, generateTrafficData, generateProductsData } from './data.js'
import { initRevenueChart, updateRevenueChart, initTrafficChart, initProductsChart, destroyCharts } from './charts.js'
import { initFeed, destroyFeed } from './feed.js'
import { renderKPIs } from './kpi.js'
import { renderFunnel, renderGeo } from './panels.js'
import { initReveal } from './reveal.js'
import { renderOrdersView } from './views/orders.js'
import { renderProductsView } from './views/products.js'
import { renderCustomersView } from './views/customers.js'
import { renderAnalyticsView, destroyAnalyticsCharts } from './views/analytics.js'

/* =========================================================
   State
   ========================================================= */
let activePeriod = 7
let activeView   = 'overview'

/* =========================================================
   Icons
   ========================================================= */
function refreshIcons() {
  createIcons({ icons, nameAttr: 'data-lucide' })
}

/* =========================================================
   Theme
   ========================================================= */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark'
  document.documentElement.dataset.theme = saved
  updateThemeIcon(saved)
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon')
  if (icon) {
    icon.dataset.lucide = theme === 'dark' ? 'sun' : 'moon'
    refreshIcons()
  }
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  localStorage.setItem('theme', next)
  updateThemeIcon(next)
}

/* =========================================================
   Language
   ========================================================= */
function initLang() {
  const saved = localStorage.getItem('lang') || 'de'
  setLang(saved)
  updateLangBtn(saved)
}

function updateLangBtn(lang) {
  const btn = document.getElementById('lang-label')
  if (btn) btn.textContent = lang === 'de' ? 'EN' : 'DE'
}

function toggleLang() {
  const next = getLang() === 'de' ? 'en' : 'de'
  setLang(next)
  updateLangBtn(next)
  localStorage.setItem('lang', next)
  renderFunnel()
  renderGeo()
  updatePageTitle(activeView)
}

/* =========================================================
   View Router
   ========================================================= */
const VIEW_TITLES = {
  overview:  'header.title',
  orders:    'nav.orders',
  products:  'nav.products',
  customers: 'nav.customers',
  analytics: 'nav.analytics',
}

function updatePageTitle(view) {
  const el = document.querySelector('.page-title')
  if (el) el.textContent = t(VIEW_TITLES[view] || 'header.title')
}

function showPeriodFilter(show) {
  const el = document.querySelector('.period-filters')
  if (el) el.style.display = show ? 'flex' : 'none'
}

function showLive(show) {
  const el = document.querySelector('.live-indicator')
  if (el) el.style.visibility = show ? '' : 'hidden'
}

function switchView(view) {
  if (view === activeView) return
  activeView = view

  // Teardown previous view
  destroyFeed()
  destroyAnalyticsCharts()

  // Nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === view)
  })

  updatePageTitle(view)
  showPeriodFilter(view === 'overview')
  showLive(view === 'overview')

  const main = document.getElementById('main-content')
  if (!main) return

  // Clear & render
  main.innerHTML = ''

  if (view === 'overview') {
    main.innerHTML = overviewHTML()
    applyTranslations()
    refreshIcons()
    loadDashboard(activePeriod)
    initFeed()
    initReveal()
  } else if (view === 'orders') {
    renderOrdersView(main)
    refreshIcons()
    revealView(main)
  } else if (view === 'products') {
    renderProductsView(main)
    refreshIcons()
    revealView(main)
  } else if (view === 'customers') {
    renderCustomersView(main)
    refreshIcons()
    revealView(main)
  } else if (view === 'analytics') {
    renderAnalyticsView(main)
    refreshIcons()
    revealView(main)
  }

  // Scroll to top
  main.scrollTop = 0
  document.querySelector('.main-wrap')?.scrollTo(0, 0)
}

function revealView(container) {
  container.style.opacity = '0'
  container.style.transform = 'translateY(10px)'
  container.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
  requestAnimationFrame(() => requestAnimationFrame(() => {
    container.style.opacity = '1'
    container.style.transform = 'translateY(0)'
  }))
}

/* =========================================================
   Overview HTML template
   ========================================================= */
function overviewHTML() {
  return `
    <section class="kpi-grid reveal-group">
      <div class="kpi-card reveal-item" id="kpi-revenue">
        <div class="kpi-header">
          <span class="kpi-label" data-i18n="kpi.revenue">Revenue</span>
          <span class="kpi-icon" data-lucide="euro"></span>
        </div>
        <div class="kpi-value" id="kpi-revenue-value">—</div>
        <div class="kpi-trend" id="kpi-revenue-trend"></div>
      </div>
      <div class="kpi-card reveal-item" id="kpi-orders">
        <div class="kpi-header">
          <span class="kpi-label" data-i18n="kpi.orders">Orders</span>
          <span class="kpi-icon" data-lucide="shopping-bag"></span>
        </div>
        <div class="kpi-value" id="kpi-orders-value">—</div>
        <div class="kpi-trend" id="kpi-orders-trend"></div>
      </div>
      <div class="kpi-card reveal-item" id="kpi-conversion">
        <div class="kpi-header">
          <span class="kpi-label" data-i18n="kpi.conversion">Conversion Rate</span>
          <span class="kpi-icon" data-lucide="percent"></span>
        </div>
        <div class="kpi-value" id="kpi-conversion-value">—</div>
        <div class="kpi-trend" id="kpi-conversion-trend"></div>
      </div>
      <div class="kpi-card reveal-item" id="kpi-aov">
        <div class="kpi-header">
          <span class="kpi-label" data-i18n="kpi.aov">Avg. Order Value</span>
          <span class="kpi-icon" data-lucide="trending-up"></span>
        </div>
        <div class="kpi-value" id="kpi-aov-value">—</div>
        <div class="kpi-trend" id="kpi-aov-trend"></div>
      </div>
    </section>

    <section class="chart-panel panel reveal-item">
      <div class="panel-header">
        <div>
          <h2 class="panel-title" data-i18n="chart.revenue.title">Revenue over Time</h2>
          <p class="panel-subtitle" data-i18n="chart.revenue.subtitle">Daily totals in EUR</p>
        </div>
      </div>
      <div class="chart-wrap">
        <canvas id="revenue-chart"></canvas>
      </div>
    </section>

    <div class="secondary-grid">
      <section class="chart-panel panel reveal-item">
        <div class="panel-header">
          <h2 class="panel-title" data-i18n="chart.traffic.title">Traffic Sources</h2>
        </div>
        <div class="chart-wrap chart-wrap--donut">
          <canvas id="traffic-chart"></canvas>
        </div>
        <div class="donut-legend" id="traffic-legend"></div>
      </section>
      <section class="chart-panel panel reveal-item">
        <div class="panel-header">
          <h2 class="panel-title" data-i18n="chart.products.title">Top Products</h2>
        </div>
        <div class="chart-wrap chart-wrap--bar">
          <canvas id="products-chart"></canvas>
        </div>
      </section>
    </div>

    <div class="bottom-grid">
      <section class="panel reveal-item">
        <div class="panel-header">
          <div>
            <h2 class="panel-title" data-i18n="feed.title">Live Orders</h2>
            <p class="panel-subtitle" data-i18n="feed.subtitle">Real-time incoming orders</p>
          </div>
          <div class="live-badge">
            <span class="live-dot"></span>
            <span data-i18n="header.live">Live</span>
          </div>
        </div>
        <div class="orders-feed" id="orders-feed"></div>
      </section>
      <section class="panel reveal-item">
        <div class="panel-header">
          <h2 class="panel-title" data-i18n="funnel.title">Conversion Funnel</h2>
        </div>
        <div class="funnel" id="funnel"></div>
      </section>
      <section class="panel reveal-item">
        <div class="panel-header">
          <h2 class="panel-title" data-i18n="geo.title">Top Markets</h2>
        </div>
        <div class="geo-list" id="geo-list"></div>
      </section>
    </div>
  `
}

/* =========================================================
   Dashboard data
   ========================================================= */
function loadDashboard(period) {
  destroyCharts()
  const series   = generateRevenueSeries(period)
  const kpis     = calcKPIs(series)
  const traffic  = generateTrafficData()
  const products = generateProductsData()
  renderKPIs(kpis)
  initRevenueChart(series)
  initTrafficChart(traffic)
  initProductsChart(products)
  renderFunnel()
  renderGeo()
}

function switchPeriod(period) {
  if (period === activePeriod) return
  activePeriod = period
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.classList.toggle('active', +btn.dataset.period === period)
  })
  const series = generateRevenueSeries(period)
  renderKPIs(calcKPIs(series))
  updateRevenueChart(series)
}

/* =========================================================
   Sidebar (mobile)
   ========================================================= */
function initSidebar() {
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')
  const menuBtn = document.getElementById('mobile-menu-btn')

  const open  = () => { sidebar.classList.add('open'); overlay.classList.add('visible'); document.body.style.overflow = 'hidden' }
  const close = () => { sidebar.classList.remove('open'); overlay.classList.remove('visible'); document.body.style.overflow = '' }

  menuBtn?.addEventListener('click', open)
  overlay?.addEventListener('click', close)

  // Close sidebar on nav click (mobile)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => { if (window.innerWidth < 768) close() })
  })
}

/* =========================================================
   Event Listeners
   ========================================================= */
function bindEvents() {
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme)
  document.getElementById('lang-toggle')?.addEventListener('click', toggleLang)

  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => switchPeriod(+btn.dataset.period))
  })

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault()
      switchView(item.dataset.view)
    })
  })
}

/* =========================================================
   Boot
   ========================================================= */
function boot() {
  // Build initial overview into #main-content
  const main = document.getElementById('main-content')
  if (main) main.innerHTML = overviewHTML()

  initTheme()
  initLang()
  applyTranslations()
  refreshIcons()
  bindEvents()
  initSidebar()

  loadDashboard(activePeriod)
  initFeed()
  initReveal()
}

boot()
