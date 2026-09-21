// Theme handling. Dark is the default look; the toggle in the top bar
// switches to light and remembers the choice on this device.
const THEME_KEY = 'second-take-theme'

export function readTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch (err) {
    console.warn('Could not read the saved theme.', err)
  }

  // No choice saved yet. If the page this app is embedded in already
  // declares a theme, follow that. Otherwise start dark.
  const hostTheme = document.documentElement.getAttribute('data-theme')
  if (hostTheme === 'light' || hostTheme === 'dark') return hostTheme
  return 'dark'
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    window.localStorage.setItem(THEME_KEY, theme)
  } catch (err) {
    console.warn('Could not save the theme choice.', err)
  }
}
