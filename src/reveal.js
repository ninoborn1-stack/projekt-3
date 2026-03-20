export function initReveal() {
  const items = document.querySelectorAll('.reveal-item')

  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`
  })

  // Trigger after a short initial delay
  setTimeout(() => {
    items.forEach(el => el.classList.add('visible'))
  }, 80)
}
