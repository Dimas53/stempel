import type { Ref } from 'vue'
import { useLayoutMode } from '@/composables/useLayoutMode'

// Full-bleed screens only, per the "big blue mass moving is unpleasant"
// finding from the panel-slide experiments — a burst from the tap point
// gives the eye a single, anchored thing to track instead of relocating
// the whole colored surface. Card mode keeps its own bounce-drawer
// transition untouched and never spawns this.
const RIPPLE_GLOW_DURATION_MS = 4000
// Growth speed/curve is back to what it was — the lingering-tail fix
// lives in ripple-glow-grow's opacity keyframes now (holds until 57%,
// fades out over the remaining time). This 0.17 is tuned by feel to when
// the glow reads as "arrived" — it's also what times .panel-complete-flash,
// so nudging it changes both that flash's timing and the route-delay below.
// Exported so callers can also hold a route change until the ripple has
// had time to read before a content crossfade starts covering it.
export const RIPPLE_VISUALLY_DONE_MS = RIPPLE_GLOW_DURATION_MS * 0.17
const PANEL_FLASH_DURATION_MS = 700
// Deliberately its own, shorter number rather than reusing
// RIPPLE_VISUALLY_DONE_MS directly — that ratio is tuned specifically for
// the flash and the user asked it not be touched for that. This is the
// separate "how long to hold before the next screen/dialog appears"
// delay, which on its own felt too long/unclear — cut by ~20%, then
// another ~12.5% on top of that (0.8 → 0.7) once it still felt slow.
export const ROUTE_DELAY_MS = RIPPLE_VISUALLY_DONE_MS * 0.7

// Shared by every full-bleed screen's buttons (Login's "Anmelden",
// CheckView's "Pause starten"/"Pause beenden"/"Zum Checkout", CheckoutView's
// "Checkout") — same tap-point glow + panel-edge flash everywhere, so a
// press reads the same regardless of which screen it happens on.
export function useRippleEffect(panelViewRef: Ref<HTMLElement | null>) {
  const { layoutMode } = useLayoutMode()

  // x/y are already relative to panelViewRef's own box (0,0 = its top-left
  // corner), not viewport coordinates.
  function spawnRippleAt(x: number, y: number) {
    if (layoutMode.value !== 'full' || !panelViewRef.value) return

    const rect = panelViewRef.value.getBoundingClientRect()
    // Reach the farthest corner from the tap point, plus a margin, so the
    // glow visibly overshoots the panel's edges rather than just grazing
    // them — a bigger, more assertive bubble.
    const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 1.3

    const ring = document.createElement('span')
    ring.className = 'ripple-ring'
    ring.style.left = `${x}px`
    ring.style.top = `${y}px`
    ring.style.setProperty('--ripple-diameter', `${radius * 2}px`)
    // Belt-and-braces cleanup: animationend should fire, but a fallback
    // timeout still removes the glow if the event ever gets dropped (a
    // backgrounded tab, for instance) so it can't pile up in the DOM.
    const cleanup = () => ring.remove()
    ring.addEventListener('animationend', cleanup)
    setTimeout(cleanup, RIPPLE_GLOW_DURATION_MS + 200)
    panelViewRef.value.appendChild(ring)

    // "Action landed" cue, separate from the glow: an inset flash along the
    // panel's own edges, timed to the glow's perceptual end (see
    // RIPPLE_VISUALLY_DONE_MS above), not its full animation length — a
    // glint tried earlier, layered onto the glow itself, was never visible
    // (it rendered inside an element whose own opacity had already faded to
    // near-zero by then, capping how bright it could get).
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

  // Anchored at the panel's own top-left corner instead of the tap point
  // — for buttons where a glow centered on the click itself read badly
  // (CheckoutView's "Checkout", sitting low on the screen), but the press
  // still wants some reaction. Grows diagonally toward the bottom-right,
  // same as what already happens by accident when Enter submits
  // LoginView's PIN form: the browser's synthesized click on the submit
  // button reports clientX/clientY as 0, which lands almost exactly here.
  function spawnRippleFromCorner() {
    spawnRippleAt(0, 0)
  }

  return { spawnRipple, spawnRippleFromCorner }
}
