<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Pause, Play, LogOut, Check } from '@lucide/vue'
import { startPause, endPause, getCurrentDayState } from '@/api/timeClock'
import { useLayoutMode } from '@/composables/useLayoutMode'
import { ROUTE_DELAY_MS, useRippleEffect } from '@/composables/useRippleEffect'
import { useSession } from '@/composables/useSession'
import { useStatusCard } from '@/composables/useStatusCard'
import { useToastRedirect } from '@/composables/useToastRedirect'

const router = useRouter()
const { currentUser } = useSession()
const { setStatusCard } = useStatusCard()
const { showToastThenRedirect } = useToastRedirect()
const { layoutMode } = useLayoutMode()

const panelViewRef = ref<HTMLElement | null>(null)
const { spawnRipple } = useRippleEffect(panelViewRef)

const IDLE_EYEBROW_MENU = 'Aktion wählen'
const IDLE_MESSAGE_MENU = 'Pause starten oder auschecken?'
const IDLE_EYEBROW_PAUSE = 'Pause aktiv'
const IDLE_MESSAGE_PAUSE = 'Sie sind aktuell in der Pause.'

function isCurrentlyPaused(): boolean {
  if (!currentUser.value) return false
  const day = getCurrentDayState(currentUser.value.id)
  return !!day.pauseStartAt && !day.pauseEndAt
}

const isPaused = ref(isCurrentlyPaused())
// Separate from the status card: this flips the clicked button's own
// icon+label the instant it's pressed, so the confirmation isn't only
// visible far away in the white strip. The button is disabled once
// pressed too — there's nothing left to do on this screen but wait for
// the redirect, so a second tap shouldn't re-fire the stamp.
const pauseStarted = ref(false)
const pauseEnded = ref(false)

// active + tone: 'pause' here too (not just from onPauseStarten's own
// click) — arriving on this screen already mid-pause is the same state,
// so the card should already be showing it, not sitting on the generic
// idle blue until the user acts again.
setStatusCard({
  screenLabel: isPaused.value ? 'Pause' : 'Aktion',
  eyebrow: isPaused.value ? IDLE_EYEBROW_PAUSE : IDLE_EYEBROW_MENU,
  message: isPaused.value ? IDLE_MESSAGE_PAUSE : IDLE_MESSAGE_MENU,
  active: isPaused.value,
  tone: isPaused.value ? 'pause' : 'default',
})

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

async function onPauseStarten() {
  if (!currentUser.value || pauseStarted.value) return
  pauseStarted.value = true
  const stampedAt = await startPause(currentUser.value.id)
  showToastThenRedirect({
    eyebrow: 'Pause gestartet',
    message: `${currentUser.value.firstName} ${currentUser.value.lastName}, Sie sind jetzt in der Pause, ${formatTime(stampedAt)}`,
    active: true,
    tone: 'pause',
  })
}

async function onPauseBeenden() {
  if (!currentUser.value || pauseEnded.value) return
  pauseEnded.value = true
  const stampedAt = await endPause(currentUser.value.id)
  // TODO(open question, docs/CONTEXT.md): toast text not in the ticket,
  // proposed by analogy — needs confirmation.
  showToastThenRedirect({
    eyebrow: 'Zurück aus der Pause',
    message: `Willkommen zurück, ${currentUser.value.firstName} — Ihre Pause endet um ${formatTime(stampedAt)}`,
    active: true,
    tone: 'positive',
  })
}

async function onZumCheckout() {
  // Same reasoning as LoginView.vue's onSubmit: in full mode, hold the
  // route change until the ripple has had time to visually land so the
  // content crossfade doesn't start covering the button before the
  // ripple's had a moment to read. Card mode has no ripple and navigates
  // immediately. Pause starten/beenden don't need this — their own
  // REDIRECT_DELAY_MS (2500ms) already far outlasts the ripple.
  if (layoutMode.value === 'full') {
    await new Promise((resolve) => setTimeout(resolve, ROUTE_DELAY_MS))
  }
  router.push('/chronology/checkout')
}
</script>

<template>
  <div ref="panelViewRef" class="panel-view">
    <div class="check-content">
      <p class="check-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>

      <div v-if="isPaused" class="check-actions check-actions--single">
        <button
          type="button"
          class="btn-gold"
          :disabled="pauseEnded"
          @click="
            (e) => {
              spawnRipple(e)
              onPauseBeenden()
            }
          "
        >
          <Check v-if="pauseEnded" :size="18" />
          <Play v-else :size="18" />
          {{ pauseEnded ? 'Pause beendet' : 'Pause beenden' }}
        </button>
      </div>

      <div v-else class="check-actions">
        <button
          type="button"
          class="btn-gold"
          :disabled="pauseStarted"
          @click="
            (e) => {
              spawnRipple(e)
              onPauseStarten()
            }
          "
        >
          <Check v-if="pauseStarted" :size="18" />
          <Pause v-else :size="18" />
          {{ pauseStarted ? 'Pause gestartet' : 'Pause starten' }}
        </button>
        <button
          type="button"
          class="btn-green"
          @click="
            (e) => {
              spawnRipple(e)
              onZumCheckout()
            }
          "
        >
          <LogOut :size="18" />
          Zum Checkout
        </button>
      </div>
    </div>

    <p class="credits">© pepito 2026 · mit ♥ gemacht von Ducito &amp; Solvi</p>
  </div>
</template>
