import { createIcons, icons } from 'lucide'
import { setLang, getLang, applyTranslations } from './i18n.js'
import { generateRevenueSeries, calcKPIs, generateTrafficData, generateProductsData } from './data.js'
import { initRevenueChart, updateRevenueChart, initTrafficChart, initProductsChart } from './charts.js'
import { initFeed, destroyFeed } from './feed.js'
import { renderKPIs } from './kpi.js'
import { renderFunnel, renderGeo } from './panels.js'
import { initReveal } from './reveal.js'

/* =========================================================
   State
   ========================================================= */
let activePeriod = 7

/* =========================================================
   Icons — init Lucide
   ========================================================= */
function refreshIcons() {
  createIcons({ icons, nameAttr: 'data-lucide' })
}

/* =========================================================
   Theme
   ========================================================= */
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark'
  document.documentElement.dataset.theme = savedTheme
  updateThemeIcon(savedTheme)
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon')
  if (icon) {
    icon.dataset.lucide = theme === 'dark' ? 'sun' : 'moon'
    refreshIcons()
  }
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme
  const next = current === 'dark' ? 'light' : 'dark'
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
  // Re-render dynamic content that uses t()
  renderFunnel()
  renderGeo()
}

/* =========================================================
   Data & Charts
   ========================================================= */
function loadDashboard(period) {
  const series = generateRevenueSeries(period)
  const kpis   = calcKPIs(series)
  const traffic = generateTrafficData()
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

  // Update button states
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.classList.toggle('active', +btn.dataset.period === period)
  })

  // Regenerate data
  const series = generateRevenueSeries(period)
  const kpis   = calcKPIs(series)
  renderKPIs(kpis)
  updateRevenueChart(series)
}

/* =========================================================
   Sidebar (mobile)
   ========================================================= */
function initSidebar() {
  const sidebar  = document.getElementById('sidebar')
  const overlay  = document.getElementById('sidebar-overlay')
  const menuBtn  = document.getElementById('mobile-menu-btn')

  function openSidebar() {
    sidebar.classList.add('open')
    overlay.classList.add('visible')
    document.body.style.overflow = 'hidden'
  }

  function closeSidebar() {
    sidebar.classList.remove('open')
    overlay.classList.remove('visible')
    document.body.style.overflow = ''
  }

  menuBtn?.addEventListener('click', openSidebar)
  overlay?.addEventListener('click', closeSidebar)
}

/* =========================================================
   Nav items (visual only — all show same view in demo)
   ========================================================= */
function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'))
      item.classList.add('active')
    })
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
}

/* =========================================================
   Boot
   ========================================================= */
function boot() {
  initTheme()
  initLang()
  applyTranslations()
  refreshIcons()
  bindEvents()
  initSidebar()
  initNav()

  // Load data & charts
  loadDashboard(activePeriod)

  // Live feed
  initFeed()

  // Reveal animation
  initReveal()
}

boot()
