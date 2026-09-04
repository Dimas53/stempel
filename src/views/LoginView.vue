<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Lock } from '@lucide/vue'
import { submitPin } from '@/api/timeClock'
import { useLayoutMode } from '@/composables/useLayoutMode'
import { ROUTE_DELAY_MS, useRippleEffect } from '@/composables/useRippleEffect'
import { useSession } from '@/composables/useSession'
import { useStatusCard } from '@/composables/useStatusCard'
import { PinError } from '@/types/timeClock'

const router = useRouter()
const { setCurrentUser } = useSession()
const { setStatusCard, setErrorStatusCard, scheduleRevert, tone } = useStatusCard()
const { layoutMode } = useLayoutMode()

const panelViewRef = ref<HTMLElement | null>(null)
const { spawnRipple } = useRippleEffect(panelViewRef)

const IDLE_EYEBROW = 'Anmeldung'
const IDLE_MESSAGE = 'Bitte geben Sie Ihren PIN ein, um sich anzumelden.'

const pin = ref('')
const errorMessage = ref('')
// Local to this file, not routed through useStatusCard's pendingRevert —
// this only ever clears errorMessage (a plain view-local ref), it never
// touches the shared strip card, so it doesn't need that shared
// bookkeeping. Tracked anyway so a second E3 in quick succession cancels
// the first one's clear instead of two competing timers both firing.
let bottomErrorClearTimer: ReturnType<typeof setTimeout> | null = null

// Clears as soon as the user edits the field at all (typing further OR
// deleting), not only once a new PIN is successfully submitted — leaving
// a stale "PIN nicht erkannt" under a field the user has already started
// correcting reads as if nothing they're typing now matters yet. Same
// trigger reverts the strip card up top — but only while it's showing
// something from THIS flow (error red, or E3's "Bereit" green follow-up):
// this watcher also fires on the pin.value = '' resets this file does
// itself after a successful checkin/submit, and that path already has
// its own "Eingecheckt" message to protect (tone is 'default' there,
// never 'error'/'positive', so this check leaves it alone).
watch(pin, () => {
  errorMessage.value = ''
  if (tone.value === 'error' || tone.value === 'positive') {
    setStatusCard({ eyebrow: IDLE_EYEBROW, message: IDLE_MESSAGE })
  }
})

setStatusCard({ screenLabel: 'Login', eyebrow: IDLE_EYEBROW, message: IDLE_MESSAGE })

async function onSubmit() {
  errorMessage.value = ''

  try {
    const result = await submitPin(pin.value)
    setCurrentUser(result.user)

    if (result.action === 'checkin') {
      pin.value = ''
      setStatusCard({
        eyebrow: 'Eingecheckt',
        message: `Herzlich willkommen, ${result.user.firstName} — Sie sind jetzt eingecheckt.`,
        active: true,
      })
      scheduleRevert({ eyebrow: IDLE_EYEBROW, message: IDLE_MESSAGE }, 3500)
      return
    }

    pin.value = ''
    // Full mode only: hold the route change until the ripple has had time
    // to visually land (see ROUTE_DELAY_MS) — without this, the content
    // crossfade starts covering the button/form almost the instant it's
    // clicked, so the ripple barely gets to grow before it's gone. Card
    // mode has no ripple, so it navigates immediately.
    if (layoutMode.value === 'full') {
      await new Promise((resolve) => setTimeout(resolve, ROUTE_DELAY_MS))
    }
    router.push('/chronology/check')
  } catch (err) {
    const idle = { eyebrow: IDLE_EYEBROW, message: IDLE_MESSAGE }
    if (err instanceof PinError) {
      errorMessage.value = err.message
      setErrorStatusCard(err.code, idle, { retryAfterMs: err.retryAfterMs })

      // E3 only: the field-level text is redundant with the strip card
      // the moment it's shown (both say "too soon"), and unlike the
      // other error codes there's nothing for the user to go fix in the
      // field itself — waiting is the only thing that resolves it, and
      // the strip card is what tracks that wait. So this one clears
      // itself quickly rather than sitting there until the field is
      // edited (which is often "never" here — retyping the same correct
      // PIN isn't "fixing" anything, it's just waiting).
      if (err.code === 'E3') {
        if (bottomErrorClearTimer) clearTimeout(bottomErrorClearTimer)
        bottomErrorClearTimer = setTimeout(() => {
          errorMessage.value = ''
        }, 2500)
      }
    } else {
      errorMessage.value = 'Verbindung fehlgeschlagen. Bitte erneut versuchen.'
      setErrorStatusCard('E5', idle)
    }
  }
}
</script>

<template>
  <div ref="panelViewRef" class="panel-view">
    <form class="pin-form" @submit.prevent="onSubmit">
      <div class="pin-field" :class="{ 'has-error': errorMessage }">
        <Lock :size="18" class="pin-icon" />
        <input
          v-model="pin"
          type="tel"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="off"
          placeholder="PIN"
          class="pin-input"
        />
      </div>
      <Transition name="error-text">
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      </Transition>

      <button type="submit" class="btn-gold" @click="spawnRipple">Anmelden</button>
    </form>

    <p class="credits">© pepito 2026 · mit ♥ gemacht von Ducito &amp; Solvi</p>
  </div>
</template>
