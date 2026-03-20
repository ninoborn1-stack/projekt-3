export const translations = {
  de: {
    brand: 'Storefront',
    'nav.overview':   'Übersicht',
    'nav.orders':     'Bestellungen',
    'nav.products':   'Produkte',
    'nav.customers':  'Kunden',
    'nav.analytics':  'Analytics',
    'header.live':    'Live',
    'header.title':   'Analytics Übersicht',
    'kpi.revenue':    'Umsatz',
    'kpi.orders':     'Bestellungen',
    'kpi.conversion': 'Conversion Rate',
    'kpi.aov':        'Ø Bestellwert',
    'chart.revenue.title':   'Umsatz im Zeitverlauf',
    'chart.revenue.subtitle':'Tagesumsatz in EUR',
    'chart.traffic.title':   'Traffic-Quellen',
    'chart.products.title':  'Top-Produkte',
    'feed.title':    'Live Bestellungen',
    'feed.subtitle': 'Eingehende Bestellungen in Echtzeit',
    'funnel.title':  'Conversion Funnel',
    'geo.title':     'Top Märkte',
    'funnel.visit':  'Besucher',
    'funnel.pdp':    'Produktseite',
    'funnel.cart':   'Warenkorb',
    'funnel.checkout':'Kasse',
    'funnel.order':  'Bestellung',
    'trend.vs':      'ggü. Vorperiode',
    'status.new':      'Neu',
    'status.paid':     'Bezahlt',
    'status.shipping': 'Versandt',
  },
  en: {
    brand: 'Storefront',
    'nav.overview':   'Overview',
    'nav.orders':     'Orders',
    'nav.products':   'Products',
    'nav.customers':  'Customers',
    'nav.analytics':  'Analytics',
    'header.live':    'Live',
    'header.title':   'Analytics Overview',
    'kpi.revenue':    'Revenue',
    'kpi.orders':     'Orders',
    'kpi.conversion': 'Conversion Rate',
    'kpi.aov':        'Avg. Order Value',
    'chart.revenue.title':   'Revenue over Time',
    'chart.revenue.subtitle':'Daily totals in EUR',
    'chart.traffic.title':   'Traffic Sources',
    'chart.products.title':  'Top Products',
    'feed.title':    'Live Orders',
    'feed.subtitle': 'Real-time incoming orders',
    'funnel.title':  'Conversion Funnel',
    'geo.title':     'Top Markets',
    'funnel.visit':  'Visitors',
    'funnel.pdp':    'Product Page',
    'funnel.cart':   'Cart',
    'funnel.checkout':'Checkout',
    'funnel.order':  'Order',
    'trend.vs':      'vs. prior period',
    'status.new':      'New',
    'status.paid':     'Paid',
    'status.shipping': 'Shipped',
  }
}

let currentLang = 'de'

export function getLang() { return currentLang }

export function setLang(lang) {
  currentLang = lang
  document.documentElement.lang = lang
  applyTranslations()
}

export function t(key) {
  return translations[currentLang]?.[key] ?? translations.en[key] ?? key
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n
    el.textContent = t(key)
  })
}
