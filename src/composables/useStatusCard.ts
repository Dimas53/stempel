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

// KioskShell is now mounted once (in App.vue) and persists across route
// changes — see main.css's "Route/panel transitions" section for why
// (only the panel content should slide, not the whole shell). Since
// KioskShell no longer gets fresh props from a per-view instance, each
// view sets this shared state directly instead.
const screenLabel = ref('Login')
const eyebrow = ref('Anmeldung')
const message = ref('Bitte geben Sie Ihren PIN ein, um sich anzumelden.')
const active = ref(false)
// 'positive' is for messages that are good news for the employee (e.g.
// returning from a pause) — it swaps the card to the same green used for
// the checkout button instead of the generic active blue. 'pause' is the
// gold counterpart for going INTO a pause, so starting and ending a pause
// read as two distinct, color-coded states rather than one generic blue
// "something happened" flash for both. 'error' is the red counterpart for
// E1-E5 — previously the strip card never reacted to an error at all, only
// the text under the PIN field did.
const tone = ref<StatusCardTone>('default')

// Short, human-register summary for the strip card — deliberately NOT the
// same wording as the exact ticket text shown under the PIN field (see
// each PinError's own message in api/timeClock.ts). Two different
// registers for two different jobs: this is a glance-length status update
// in the always-visible card, the other is the precise detail anchored
// right at the field that caused it.
const ERROR_SUMMARIES: Record<PinErrorCode, string> = {
  E1: 'PIN fehlt.',
  E2: 'PIN unbekannt.',
  E3: 'Bitte kurz warten.',
  E4: 'Tag bereits abgeschlossen.',
  E5: 'Verbindungsproblem.',
}

// A fallback, not the primary way this clears — the primary way is the
// user acting again (see LoginView's watch(pin, ...), which reverts the
// card immediately once they start typing a new attempt). This is just
// how long it's allowed to sit there if they don't do anything at all —
// long enough to actually read and react to, not a quick flash.
const ERROR_CARD_HOLD_MS = 30_000

// Module-scoped, same as the refs above (one shared card, singleton
// state) — tracks the pending auto-revert from the most recent
// setErrorStatusCard call. Without this, every call scheduled its own
// setTimeout and none of them ever got cancelled: trigger a second error
// shortly after a first one, and the FIRST error's now-stale timer could
// still fire and wipe the second, still-current error off the card early
// — reads as it "randomly" disappearing too fast, no relation to how
// long the second error had actually been showing.
let pendingRevert: ReturnType<typeof setTimeout> | null = null

export function useStatusCard() {
  function setStatusCard(next: StatusCardUpdate) {
    // Any explicit card update — a new error, a new toast, a screen's own
    // idle state — supersedes whatever auto-revert a previous error may
    // still have pending, so that stale timer can't fire later and
    // clobber this newer state.
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
  // slot setStatusCard itself clears — so ANY subsequent card update
  // (another error, a toast, a screen's own mount-time idle call)
  // cancels it, not just another call to this same function. Used by
  // setErrorStatusCard below, and by LoginView for its "Herzlich
  // Willkommen" checkin toast — that one used to schedule its own
  // untracked setTimeout, which is exactly what let a still-pending
  // checkin-toast revert wipe out a genuinely current error card shown
  // moments later (e.g. immediately retrying too soon after that same
  // checkin — E3 — triggers exactly inside that toast's own hold window).
  function scheduleRevert(next: StatusCardUpdate, delayMs: number) {
    pendingRevert = setTimeout(() => setStatusCard(next), delayMs)
  }

  // Flips the strip card red with a short summary for the given error
  // code, then reverts after a hold — so an error doesn't sit there red
  // forever if the user doesn't act again.
  //
  // E3 (rate limit) is a special case, given retryAfterMs: instead of the
  // generic fixed hold + reverting to plain idle, the card stays red for
  // exactly as long as the cooldown genuinely has left, then flips green
  // with a "you can go again" cue — the color change itself doubles as
  // the "time's up" signal, rather than the user having to guess whether
  // a minute has actually passed.
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

    scheduleRevert(idle, ERROR_CARD_HOLD_MS)
  }

  return { screenLabel, eyebrow, message, active, tone, setStatusCard, setErrorStatusCard, scheduleRevert }
}
