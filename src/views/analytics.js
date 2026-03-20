import Chart from 'chart.js/auto'

let charts = []

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a }

function getGridColor() {
  return document.documentElement.dataset.theme === 'dark'
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(0,0,0,0.05)'
}
function getTextColor() {
  return document.documentElement.dataset.theme === 'dark' ? '#8B8A97' : '#5C5B68'
}

function genMonthly() {
  const months = ['Sep', 'Okt', 'Nov', 'Dez', 'Jan', 'Feb', 'Mär']
  const thisYear = months.map(() => rnd(55000, 130000))
  const lastYear = thisYear.map(v => Math.round(v * (0.65 + Math.random() * 0.35)))
  return { months, thisYear, lastYear }
}

function genHourly() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const values = hours.map((_, i) => {
    const base = (i >= 9 && i <= 22) ? rnd(40, 120) : rnd(2, 25)
    return base
  })
  return { hours, values }
}

function genRetention() {
  return {
    weeks: ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4', 'Woche 5', 'Woche 6'],
    values: [100, rnd(38, 52), rnd(22, 35), rnd(16, 26), rnd(12, 20), rnd(8, 15)],
  }
}

export function renderAnalyticsView(container) {
  charts.forEach(c => c.destroy())
  charts = []

  const monthly   = genMonthly()
  const hourly    = genHourly()
  const retention = genRetention()

  const peakHour = hourly.values.indexOf(Math.max(...hourly.values))
  const retDrop  = (100 - retention.values[1]).toFixed(0)

  container.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Analytics</h1>
        <p class="view-subtitle">Vertiefende Auswertungen & Trends</p>
      </div>
    </div>

    <div class="analytics-kpi-row">
      <div class="panel analytics-kpi">
        <div class="akpi-label">Peak-Stunde</div>
        <div class="akpi-value mono">${peakHour}:00</div>
        <div class="akpi-sub">Meiste Bestellungen</div>
      </div>
      <div class="panel analytics-kpi">
        <div class="akpi-label">Week-1 Absprung</div>
        <div class="akpi-value mono">${retDrop}%</div>
        <div class="akpi-sub">Kunden nach 1. Kauf weg</div>
      </div>
      <div class="panel analytics-kpi">
        <div class="akpi-label">YoY Wachstum</div>
        <div class="akpi-value mono accent">+${rnd(14, 38)}%</div>
        <div class="akpi-sub">Vs. Vorjahresschnitt</div>
      </div>
      <div class="panel analytics-kpi">
        <div class="akpi-label">Rücklaufquote</div>
        <div class="akpi-value mono">${rnd(3, 8)}%</div>
        <div class="akpi-sub">Der Bestellungen</div>
      </div>
    </div>

    <div class="analytics-grid">
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Umsatz — Jahresvergleich</h2>
        </div>
        <div class="chart-wrap" style="height:220px">
          <canvas id="chart-monthly"></canvas>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Bestellungen nach Uhrzeit</h2>
        </div>
        <div class="chart-wrap" style="height:220px">
          <canvas id="chart-hourly"></canvas>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-top:20px">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Kunden-Retention</h2>
          <p class="panel-subtitle">Anteil Kunden, die nach Erstkauf wiederkehren</p>
        </div>
      </div>
      <div class="chart-wrap" style="height:200px">
        <canvas id="chart-retention"></canvas>
      </div>
    </div>
  `

  // Monthly comparison
  const ctxM = document.getElementById('chart-monthly')
  if (ctxM) {
    charts.push(new Chart(ctxM, {
      type: 'bar',
      data: {
        labels: monthly.months,
        datasets: [
          {
            label: 'Dieses Jahr',
            data: monthly.thisYear,
            backgroundColor: 'rgba(225,29,106,0.85)',
            borderRadius: 5,
            borderSkipped: false,
          },
          {
            label: 'Vorjahr',
            data: monthly.lastYear,
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 5,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: getTextColor(), font: { family: 'Plus Jakarta Sans' }, boxWidth: 12, padding: 16 }
          },
          tooltip: {
            backgroundColor: '#16161C', borderColor: 'rgba(225,29,106,0.3)', borderWidth: 1,
            titleColor: '#8B8A97', bodyColor: '#F0EFF4',
            callbacks: { label: ctx => ` €${ctx.parsed.y.toLocaleString('de-DE')}` }
          }
        },
        scales: {
          x: { grid: { color: getGridColor() }, ticks: { color: getTextColor() } },
          y: { grid: { color: getGridColor() }, ticks: { color: getTextColor(), callback: v => `€${(v/1000).toFixed(0)}k` } }
        }
      }
    }))
  }

  // Hourly
  const ctxH = document.getElementById('chart-hourly')
  if (ctxH) {
    charts.push(new Chart(ctxH, {
      type: 'bar',
      data: {
        labels: hourly.hours,
        datasets: [{
          data: hourly.values,
          backgroundColor: (ctx) => {
            const v = ctx.raw
            const max = Math.max(...hourly.values)
            const alpha = 0.25 + (v / max) * 0.65
            return `rgba(225,29,106,${alpha.toFixed(2)})`
          },
          borderRadius: 3,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: {
          backgroundColor: '#16161C', borderColor: 'rgba(225,29,106,0.3)', borderWidth: 1,
          titleColor: '#8B8A97', bodyColor: '#F0EFF4',
          callbacks: { label: ctx => ` ${ctx.parsed.y} Bestellungen` }
        }},
        scales: {
          x: { grid: { display: false }, ticks: { color: getTextColor(), maxTicksLimit: 8 } },
          y: { grid: { color: getGridColor() }, ticks: { color: getTextColor() } }
        }
      }
    }))
  }

  // Retention
  const ctxR = document.getElementById('chart-retention')
  if (ctxR) {
    charts.push(new Chart(ctxR, {
      type: 'line',
      data: {
        labels: retention.weeks,
        datasets: [{
          data: retention.values,
          borderColor: '#E11D6A',
          backgroundColor: 'rgba(225,29,106,0.1)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#E11D6A',
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: {
          backgroundColor: '#16161C', borderColor: 'rgba(225,29,106,0.3)', borderWidth: 1,
          titleColor: '#8B8A97', bodyColor: '#F0EFF4',
          callbacks: { label: ctx => ` ${ctx.parsed.y}% Retention` }
        }},
        scales: {
          x: { grid: { color: getGridColor() }, ticks: { color: getTextColor() } },
          y: { grid: { color: getGridColor() }, ticks: { color: getTextColor(), callback: v => `${v}%` }, min: 0, max: 100 }
        }
      }
    }))
  }
}

export function destroyAnalyticsCharts() {
  charts.forEach(c => c.destroy())
  charts = []
}
