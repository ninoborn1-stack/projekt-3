import Chart from 'chart.js/auto'

let revenueChart = null
let trafficChart = null
let productsChart = null

function getGridColor() {
  const theme = document.documentElement.dataset.theme
  return theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
}

function getTextColor() {
  const theme = document.documentElement.dataset.theme
  return theme === 'dark' ? '#8B8A97' : '#5C5B68'
}

/* ---- Revenue Line/Area Chart ---- */
export function initRevenueChart(series) {
  const ctx = document.getElementById('revenue-chart')
  if (!ctx) return

  if (revenueChart) revenueChart.destroy()

  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: series.labels,
      datasets: [{
        label: 'Revenue',
        data: series.values,
        borderColor: '#E11D6A',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 240)
          gradient.addColorStop(0, 'rgba(225,29,106,0.25)')
          gradient.addColorStop(1, 'rgba(225,29,106,0.0)')
          return gradient
        },
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#E11D6A',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#16161C',
          borderColor: 'rgba(225,29,106,0.3)',
          borderWidth: 1,
          titleColor: '#8B8A97',
          bodyColor: '#F0EFF4',
          bodyFont: { family: 'DM Mono', weight: '700' },
          padding: 12,
          callbacks: {
            label: (ctx) => ` €${ctx.parsed.y.toLocaleString('de-DE')}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: getGridColor(), drawBorder: false },
          ticks: {
            color: getTextColor(),
            font: { family: 'Plus Jakarta Sans', size: 11 },
            maxTicksLimit: 8,
            maxRotation: 0,
          }
        },
        y: {
          grid: { color: getGridColor(), drawBorder: false },
          ticks: {
            color: getTextColor(),
            font: { family: 'DM Mono', size: 11 },
            callback: (v) => `€${(v / 1000).toFixed(1)}k`
          }
        }
      }
    }
  })
}

export function updateRevenueChart(series) {
  if (!revenueChart) return
  revenueChart.data.labels = series.labels
  revenueChart.data.datasets[0].data = series.values
  revenueChart.update('active')
}

/* ---- Traffic Donut ---- */
export function initTrafficChart(data) {
  const ctx = document.getElementById('traffic-chart')
  if (!ctx) return

  if (trafficChart) trafficChart.destroy()

  trafficChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: data.colors,
        borderColor: document.documentElement.dataset.theme === 'dark' ? '#16161C' : '#fff',
        borderWidth: 3,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#16161C',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: '#8B8A97',
          bodyColor: '#F0EFF4',
          bodyFont: { family: 'DM Mono', weight: '700' },
          callbacks: {
            label: (ctx) => ` ${ctx.parsed}%`
          }
        }
      }
    }
  })

  // Build legend
  const legend = document.getElementById('traffic-legend')
  if (legend) {
    legend.innerHTML = data.labels.map((label, i) => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${data.colors[i]}"></span>
        <span>${label}</span>
        <span style="color:var(--text-1);font-weight:600;margin-left:2px">${data.values[i]}%</span>
      </div>
    `).join('')
  }
}

/* ---- Products Bar Chart ---- */
export function initProductsChart(data) {
  const ctx = document.getElementById('products-chart')
  if (!ctx) return

  if (productsChart) productsChart.destroy()

  productsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Sales',
        data: data.values,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(ctx.chart.chartArea?.right || 300, 0, 0, 0)
          gradient.addColorStop(0, 'rgba(225,29,106,0.9)')
          gradient.addColorStop(1, 'rgba(225,29,106,0.35)')
          return gradient
        },
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#16161C',
          borderColor: 'rgba(225,29,106,0.3)',
          borderWidth: 1,
          titleColor: '#8B8A97',
          bodyColor: '#F0EFF4',
          bodyFont: { family: 'DM Mono', weight: '700' },
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.x} sold`
          }
        }
      },
      scales: {
        x: {
          grid: { color: getGridColor(), drawBorder: false },
          ticks: {
            color: getTextColor(),
            font: { family: 'DM Mono', size: 11 },
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            color: getTextColor(),
            font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
          }
        }
      }
    }
  })
}

export function destroyCharts() {
  revenueChart?.destroy()
  trafficChart?.destroy()
  productsChart?.destroy()
  revenueChart = trafficChart = productsChart = null
}
