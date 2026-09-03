import { ref } from 'vue'

// KioskShell is now mounted once (in App.vue) and persists across route
// changes — see main.css's "Route/panel transitions" section for why
// (only the panel content should slide, not the whole shell). Since
// KioskShell no longer gets fresh props from a per-view instance, each
// view sets this shared state directly instead.
const screenLabel = ref('Login')
const eyebrow = ref('Anmeldung')
const message = ref('Bitte gib deinen PIN ein, um dich anzumelden.')
const active = ref(false)
// 'positive' is for messages that are good news for the employee (e.g.
// returning from a pause) — it swaps the card to the same green used for
// the checkout button instead of the generic active blue. 'pause' is the
// gold counterpart for going INTO a pause, so starting and ending a pause
// read as two distinct, color-coded states rather than one generic blue
// "something happened" flash for both.
const tone = ref<'default' | 'positive' | 'pause'>('default')

export function useStatusCard() {
  function setStatusCard(next: {
    screenLabel?: string
    eyebrow: string
    message: string
    active?: boolean
    tone?: 'default' | 'positive' | 'pause'
  }) {
    if (next.screenLabel !== undefined) screenLabel.value = next.screenLabel
    eyebrow.value = next.eyebrow
    message.value = next.message
    active.value = next.active ?? false
    tone.value = next.tone ?? 'default'
  }

  return { screenLabel, eyebrow, message, active, tone, setStatusCard }
}
