// =========================================================
// i18n
// =========================================================
const TRANSLATIONS = {
  de: {
    eyebrow: 'Live Analytics · Simuliert',
    headline: 'Jede Zahl,<br>die zählt.',
    sub: 'Ein interaktives E-Commerce Dashboard mit Echtzeit-Daten, KPI-Tracking und vollständiger Datenvisualisierung.',
    cta: 'Dashboard öffnen',
  },
  en: {
    eyebrow: 'Live Analytics · Simulated',
    headline: 'Every number<br>that matters.',
    sub: 'An interactive e-commerce dashboard with real-time data, KPI tracking and full data visualisation.',
    cta: 'Open Dashboard',
  },
}

let currentLang = localStorage.getItem('landing-lang') || 'de'

function applyLang(lang) {
  currentLang = lang
  localStorage.setItem('landing-lang', lang)
  const t = TRANSLATIONS[lang]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n
    if (t[key] !== undefined) el.innerHTML = t[key]
  })
  const label = document.getElementById('lang-label')
  if (label) label.textContent = lang === 'de' ? 'EN' : 'DE'
  document.documentElement.lang = lang
}

document.getElementById('lang-toggle')?.addEventListener('click', () => {
  applyLang(currentLang === 'de' ? 'en' : 'de')
})

// =========================================================
// Theme
// =========================================================
const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
const SUN_SVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`

function applyTheme(t) {
  document.documentElement.dataset.theme = t
  const btn = document.getElementById('theme-toggle')
  if (btn) btn.innerHTML = t === 'dark' ? SUN_SVG : MOON_SVG
  localStorage.setItem('theme', t)
}

const savedTheme = localStorage.getItem('theme') || 'dark'
applyTheme(savedTheme)

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')
})

// =========================================================
// Boot
// =========================================================
applyLang(currentLang)

// Entrance animations
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.hero-eyebrow, .hero-headline, .hero-sub, .hero-actions, .hero-visual')
  els.forEach((el, i) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 0.65s ease ${i * 90}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }))
  })
})
