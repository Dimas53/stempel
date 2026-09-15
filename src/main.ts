import { createApp } from 'vue'
import App from './App.vue'
import DeviceFrame from './components/DeviceFrame.vue'
import router from './router'
import './styles/main.css'

// Real kiosk hardware is touch; a desktop browser gets DeviceFrame's
// preview instead of the raw unstyled app. `embedded` marks the copy
// already running inside DeviceFrame's own iframe, so it always gets the
// real app. maxTouchPoints is a fallback for edge cases where
// pointer:coarse alone misreads as "not touch".
const isTouchDevice =
  window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
const isEmbedded = new URLSearchParams(location.search).has('embedded')

if (isTouchDevice || isEmbedded) {
  createApp(App).use(router).mount('#app')
} else {
  createApp(DeviceFrame).mount('#app')
}

// Dev convenience: mounted tree is decided once at load, so toggling touch
// emulation in devtools needs a reload to re-run the check. Skipped when
// embedded — the iframe always mounts the real app regardless.
if (!isEmbedded) {
  window.matchMedia('(pointer: coarse)').addEventListener('change', () => location.reload())
}
