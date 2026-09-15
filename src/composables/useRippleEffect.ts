import type { Ref } from 'vue'
import { useLayoutMode } from '@/composables/useLayoutMode'

// Full-bleed screens only — a burst from the tap point reads better than
// moving the whole colored panel. Card mode never spawns this.
const RIPPLE_GLOW_DURATION_MS = 4000
// Tuned by feel to when the glow reads as "arrived"; also times
// .panel-complete-flash and, via ROUTE_DELAY_MS below, the route change.
export const RIPPLE_VISUALLY_DONE_MS = RIPPLE_GLOW_DURATION_MS * 0.17
const PANEL_FLASH_DURATION_MS = 700
// Own tuned fraction, not reused from RIPPLE_VISUALLY_DONE_MS — how long
// to hold before the next screen appears.
export const ROUTE_DELAY_MS = RIPPLE_VISUALLY_DONE_MS * 0.6

// Shared by every full-bleed screen's buttons — same tap-point glow +
// panel-edge flash everywhere.
export function useRippleEffect(panelViewRef: Ref<HTMLElement | null>) {
  const { layoutMode } = useLayoutMode()

  // x/y are already relative to panelViewRef's own box (0,0 = its top-left
  // corner), not viewport coordinates.
  function spawnRippleAt(x: number, y: number) {
    if (layoutMode.value !== 'full' || !panelViewRef.value) return

    const rect = panelViewRef.value.getBoundingClientRect()
    // Farthest corner from the tap point, plus margin, so the glow overshoots the edges.
    const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 1.3

    const ring = document.createElement('span')
    ring.className = 'ripple-ring'
    ring.style.left = `${x}px`
    ring.style.top = `${y}px`
    ring.style.setProperty('--ripple-diameter', `${radius * 2}px`)
    // Fallback cleanup in case animationend never fires (e.g. backgrounded tab).
    const cleanup = () => ring.remove()
    ring.addEventListener('animationend', cleanup)
    setTimeout(cleanup, RIPPLE_GLOW_DURATION_MS + 200)
    panelViewRef.value.appendChild(ring)

    // "Action landed" cue — inset edge flash, timed to the glow's
    // perceptual end rather than its full animation length.
    const flash = document.createElement('span')
    flash.className = 'panel-complete-flash'
    flash.style.animationDelay = `${RIPPLE_VISUALLY_DONE_MS}ms`
    const cleanupFlash = () => flash.remove()
    flash.addEventListener('animationend', cleanupFlash)
    setTimeout(cleanupFlash, RIPPLE_VISUALLY_DONE_MS + PANEL_FLASH_DURATION_MS + 200)
    panelViewRef.value.appendChild(flash)
  }

  function spawnRipple(event: MouseEvent) {
    if (!panelViewRef.value) return
    const rect = panelViewRef.value.getBoundingClientRect()
    spawnRippleAt(event.clientX - rect.left, event.clientY - rect.top)
  }

  // Anchored at the panel's top-left corner instead of the tap point —
  // for buttons where a centered glow reads badly (e.g. low on the screen).
  function spawnRippleFromCorner() {
    spawnRippleAt(0, 0)
  }

  return { spawnRipple, spawnRippleFromCorner }
}
