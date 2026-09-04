import { createApp } from 'vue'
import App from './App.vue'
import DeviceFrame from './components/DeviceFrame.vue'
import router from './router'
import './styles/main.css'

// Real kiosk hardware is touch and always full-bleed — no frame needed
// there. On a desktop browser (mouse/trackpad, pointer: coarse is false)
// opening the raw link, the real app would otherwise render as an
// unstyled, oddly-proportioned webpage rather than the tablet interface
// it's designed for. `embedded` marks the copy running inside
// DeviceFrame's own <iframe> — that one always gets the real app, not
// another frame around itself.
//
// Two signals, not one: pointer:coarse alone can read as "not touch" on
// some emulated/edge-case setups (e.g. a devtools device preset with
// custom dimensions but no touch capability actually turned on) —
// maxTouchPoints is the fallback for exactly that gap. Either one being
// true is enough to call it a touch device.
const isTouchDevice =
  window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
const isEmbedded = new URLSearchParams(location.search).has('embedded')

if (isTouchDevice || isEmbedded) {
  createApp(App).use(router).mount('#app')
} else {
  createApp(DeviceFrame).mount('#app')
}

// Dev/testing convenience: which app tree got mounted above is decided
// once, at load. Toggling touch emulation in devtools afterwards (no
// navigation, so no fresh script run) doesn't change what's already
// mounted — matchMedia's own change event still fires though, so a
// reload here reruns this file's isTouchDevice check from scratch instead
// of leaving the now-stale choice on screen. Registered unconditionally
// (not just in the "showed the frame" branch above) — otherwise this
// only ever caught touch turning ON, never OFF: switching into touch
// mode reloads into the isTouchDevice/App branch, which never re-arms
// this listener, so toggling back out had nothing left listening for it.
// Skipped only when embedded — inside DeviceFrame's own iframe, the real
// app always mounts regardless of pointer type, so there's nothing for a
// pointer change to react to there.
if (!isEmbedded) {
  window.matchMedia('(pointer: coarse)').addEventListener('change', () => location.reload())
}
