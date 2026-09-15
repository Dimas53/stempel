import { ref } from 'vue'
import type { PinErrorCode } from '@/types/timeClock'

type StatusCardTone = 'default' | 'positive' | 'pause' | 'error'

interface StatusCardUpdate {
  screenLabel?: string
  eyebrow: string
  message: string
  active?: boolean
  tone?: StatusCardTone
}

// KioskShell mounts once in App.vue and persists across route changes
// (only the panel content slides), so each view sets this shared state
// directly instead of passing fresh props.
const screenLabel = ref('Login')
const eyebrow = ref('Anmeldung')
const message = ref('Bitte geben Sie Ihren PIN ein, um sich anzumelden.')
const active = ref(false)
// 'positive' = good news (e.g. back from pause), same green as the
// checkout button. 'pause' = gold, for going INTO a pause. 'error' = red,
// for E1-E5.
const tone = ref<StatusCardTone>('default')

// Glance-length summary for the strip card — deliberately different
// wording from the precise message shown under the PIN field.
const ERROR_SUMMARIES: Record<PinErrorCode, string> = {
  E1: 'PIN fehlt.',
  E2: 'PIN unbekannt.',
  E3: 'Bitte kurz warten.',
  E4: 'Tag bereits abgeschlossen.',
  E5: 'Verbindungsproblem.',
}

// Fallback only — the primary clear is the user typing again (LoginView's
// watch(pin, ...)). This is how long it sits if they don't act at all.
const ERROR_CARD_HOLD_MS = 30_000

// E4 only: matches LoginView's bottomErrorClearTimer (2.5s) so the card
// and field text clear at the same moment, not the card lingering behind.
const E4_CARD_HOLD_MS = 2_500

// Tracks the pending auto-revert so a second error cancels the first
// one's stale timer instead of both racing to clear the card.
let pendingRevert: ReturnType<typeof setTimeout> | null = null

export function useStatusCard() {
  function setStatusCard(next: StatusCardUpdate) {
    // Any explicit update cancels a still-pending auto-revert, so it
    // can't fire later and clobber this newer state.
    if (pendingRevert !== null) {
      clearTimeout(pendingRevert)
      pendingRevert = null
    }
    if (next.screenLabel !== undefined) screenLabel.value = next.screenLabel
    eyebrow.value = next.eyebrow
    message.value = next.message
    active.value = next.active ?? false
    tone.value = next.tone ?? 'default'
  }

  // Schedules a later revert to idle, tracked in the same pendingRevert
  // slot setStatusCard clears — so any subsequent update cancels it, not
  // just another call to this function (used by LoginView's checkin toast too).
  function scheduleRevert(next: StatusCardUpdate, delayMs: number) {
    pendingRevert = setTimeout(() => setStatusCard(next), delayMs)
  }

  // Flips the card red with a short summary, reverts after a hold. E3 is
  // special: stays red for exactly the real cooldown left (retryAfterMs),
  // then flips green — the color change itself signals "time's up".
  function setErrorStatusCard(
    code: PinErrorCode,
    idle: { eyebrow: string; message: string },
    options?: { retryAfterMs?: number },
  ) {
    setStatusCard({ eyebrow: 'Fehler', message: ERROR_SUMMARIES[code], active: true, tone: 'error' })

    if (code === 'E3' && options?.retryAfterMs !== undefined) {
      scheduleRevert(
        {
          eyebrow: 'Bereit',
          message: 'Sie können es jetzt erneut versuchen.',
          active: true,
          tone: 'positive',
        },
        options.retryAfterMs,
      )
      return
    }

    scheduleRevert(idle, code === 'E4' ? E4_CARD_HOLD_MS : ERROR_CARD_HOLD_MS)
  }

  return { screenLabel, eyebrow, message, active, tone, setStatusCard, setErrorStatusCard, scheduleRevert }
}
