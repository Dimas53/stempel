<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Lock } from '@lucide/vue'
import { endPause, submitPin } from '@/api/timeClock'
import { logActivity } from '@/composables/useActivityLog'
import { useLayoutMode } from '@/composables/useLayoutMode'
import { ROUTE_DELAY_MS, useRippleEffect } from '@/composables/useRippleEffect'
import { useSession } from '@/composables/useSession'
import { useStatusCard } from '@/composables/useStatusCard'
import { PinError } from '@/types/timeClock'

const router = useRouter()
const { setCurrentUser, setPinEnteredAt } = useSession()
const { setStatusCard, setErrorStatusCard, scheduleRevert, tone } = useStatusCard()
const { layoutMode } = useLayoutMode()

const panelViewRef = ref<HTMLElement | null>(null)
const { spawnRipple } = useRippleEffect(panelViewRef)

const IDLE_EYEBROW = 'Anmeldung'
const IDLE_MESSAGE = 'Bitte geben Sie Ihren PIN ein, um sich anzumelden.'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

const pin = ref('')
const errorMessage = ref('')
// View-local timer, separate from useStatusCard's own revert — cancels a
// prior pending clear if a second E3/E4 fires quickly.
let bottomErrorClearTimer: ReturnType<typeof setTimeout> | null = null

// Clears on any edit to the field, not just on next submit. Also reverts
// the strip card, but only while it's showing this flow's error/positive
// state — leaves the checkin toast alone (tone stays 'default' there).
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
      logActivity(`${result.user.firstName} ${result.user.lastName}`, 'Eingecheckt', result.stampedAt) // demo-only, see useActivityLog.ts
      setStatusCard({
        eyebrow: 'Eingecheckt',
        message: `Herzlich willkommen, ${result.user.firstName} — Sie sind eingecheckt um ${formatTime(result.stampedAt!)}`,
        active: true,
      })
      scheduleRevert({ eyebrow: IDLE_EYEBROW, message: IDLE_MESSAGE }, 3500)
      return
    }

    // Re-entering the PIN mid-pause ends it immediately, no separate
    // "Pause beenden" tap needed — CheckView's own button stays as a
    // fallback for anyone already sitting on that screen.
    if (result.action === 'pause') {
      pin.value = ''
      const stampedAt = await endPause(result.user.id, result.stampedAt!)
      logActivity(`${result.user.firstName} ${result.user.lastName}`, 'Pause beendet', stampedAt) // demo-only, see useActivityLog.ts
      setStatusCard({
        eyebrow: 'Zurück aus der Pause',
        message: `Willkommen zurück, ${result.user.firstName} — Ihre Pause endet um ${formatTime(stampedAt)}`,
        active: true,
        tone: 'positive',
      })
      scheduleRevert({ eyebrow: IDLE_EYEBROW, message: IDLE_MESSAGE }, 3500)
      return
    }

    pin.value = ''
    // Stored so CheckView's Pause/Checkout buttons stamp THIS moment,
    // not whenever they're actually clicked — see SubmitPinResult.stampedAt.
    setPinEnteredAt(result.stampedAt!)
    // Full mode only: let the ripple land before the route change covers it.
    if (layoutMode.value === 'full') {
      await new Promise((resolve) => setTimeout(resolve, ROUTE_DELAY_MS))
    }
    router.push('/chronology/check')
  } catch (err) {
    const idle = { eyebrow: IDLE_EYEBROW, message: IDLE_MESSAGE }
    if (err instanceof PinError) {
      errorMessage.value = err.message
      setErrorStatusCard(err.code, idle, { retryAfterMs: err.retryAfterMs })

      // E3/E4 only — retyping the PIN can't fix either, so they need a
      // timed auto-clear instead of waiting for an edit.
      if (err.code === 'E3' || err.code === 'E4') {
        if (bottomErrorClearTimer) clearTimeout(bottomErrorClearTimer)
        bottomErrorClearTimer = setTimeout(() => {
          errorMessage.value = ''
          // E4 only: E3's card is still mid-countdown to its own green
          // "Bereit" reveal (up to a minute out) — clearing pin here
          // would cut that short via the watch(pin) below.
          if (err.code === 'E4') pin.value = ''
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

      <button type="submit" class="btn-gold" @click="spawnRipple">Absenden</button>
    </form>

  </div>
</template>
