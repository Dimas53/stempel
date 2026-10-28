<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Pause, Play, LogOut, Check } from '@lucide/vue'
import { startPause, endPause, checkout, getCurrentDayState } from '@/api/timeClock'
import { logActivity } from '@/composables/useActivityLog'
import { useLayoutMode } from '@/composables/useLayoutMode'
import { ROUTE_DELAY_MS, useRippleEffect } from '@/composables/useRippleEffect'
import { useSession } from '@/composables/useSession'
import { useStatusCard } from '@/composables/useStatusCard'
import { useToastRedirect } from '@/composables/useToastRedirect'

const router = useRouter()
const { currentUser, pinEnteredAt } = useSession()
const { setStatusCard } = useStatusCard()
const { showToastThenRedirect } = useToastRedirect()
const { layoutMode } = useLayoutMode()

const panelViewRef = ref<HTMLElement | null>(null)
const { spawnRipple } = useRippleEffect(panelViewRef)

const IDLE_EYEBROW_MENU = 'Aktion wählen'
const IDLE_MESSAGE_MENU = 'Pause starten oder auschecken?'
const IDLE_EYEBROW_PAUSE = 'Pause aktiv'
const IDLE_MESSAGE_PAUSE = 'Sie sind aktuell in der Pause.'

// getCurrentDayState is async (real backend later — see NOTES-real-api.md),
// so this has to load in onMounted; isLoading gates the template until then.
const isLoading = ref(true)
const isPaused = ref(false)
// Flips the clicked button's own icon+label instantly and disables it,
// so a second tap can't re-fire the stamp before the redirect happens.
const pauseStarted = ref(false)
const pauseEnded = ref(false)

onMounted(async () => {
  if (currentUser.value) {
    const day = await getCurrentDayState(currentUser.value.id)
    isPaused.value = !!day.pauseStartAt && !day.pauseEndAt
  }
  isLoading.value = false

  // Arriving already mid-pause should show that state immediately, not
  // the generic idle card.
  setStatusCard({
    screenLabel: isPaused.value ? 'Pause' : 'Aktion',
    eyebrow: isPaused.value ? IDLE_EYEBROW_PAUSE : IDLE_EYEBROW_MENU,
    message: isPaused.value ? IDLE_MESSAGE_PAUSE : IDLE_MESSAGE_MENU,
    active: isPaused.value,
    tone: isPaused.value ? 'pause' : 'default',
  })
})

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

async function onPauseStarten() {
  if (!currentUser.value || pauseStarted.value) return
  pauseStarted.value = true
  // Stamps the PIN-entry moment, not this click — see SubmitPinResult.stampedAt.
  const stampedAt = await startPause(currentUser.value.id, pinEnteredAt.value ?? new Date().toISOString())
  logActivity(`${currentUser.value.firstName} ${currentUser.value.lastName}`, 'Pause gestartet', stampedAt) // demo-only, see useActivityLog.ts
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
  // Fallback path (LoginView normally handles this) — no pinEnteredAt here, stamps now.
  const stampedAt = await endPause(currentUser.value.id, new Date().toISOString())
  logActivity(`${currentUser.value.firstName} ${currentUser.value.lastName}`, 'Pause beendet', stampedAt) // demo-only, see useActivityLog.ts
  // TODO(open question, docs/CONTEXT.md): toast text not in the ticket, needs confirmation.
  showToastThenRedirect({
    eyebrow: 'Zurück aus der Pause',
    message: `Willkommen zurück, ${currentUser.value.firstName} — Ihre Pause endet um ${formatTime(stampedAt)}`,
    active: true,
    tone: 'positive',
  })
}

async function onZumCheckout() {
  if (!currentUser.value) return
  // Stamped here, not on Checkout's own button — that button is reached
  // with everything already written, and is a formality that only saves Notiz.
  const stampedAt = await checkout(currentUser.value.id, pinEnteredAt.value ?? new Date().toISOString())
  logActivity(`${currentUser.value.firstName} ${currentUser.value.lastName}`, 'Ausgecheckt', stampedAt) // demo-only, see useActivityLog.ts

  // Full mode only: let the ripple land before the route change covers it.
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

      <p v-if="isLoading" class="panel-loading">Lädt…</p>

      <div v-else-if="isPaused" class="check-actions check-actions--single">
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

  </div>
</template>
