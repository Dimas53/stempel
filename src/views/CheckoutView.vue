<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { LogIn, LogOut, Coffee, Clock, Info, Check } from '@lucide/vue'
import { getCurrentDayState, saveNotiz } from '@/api/timeClock'
import { logActivity } from '@/composables/useActivityLog'
import { useRippleEffect } from '@/composables/useRippleEffect'
import { useSession } from '@/composables/useSession'
import { useStatusCard } from '@/composables/useStatusCard'
import { useToastRedirect } from '@/composables/useToastRedirect'
import type { DayState } from '@/types/timeClock'

const { currentUser } = useSession()
const { setStatusCard } = useStatusCard()
const { showToastThenRedirect } = useToastRedirect()

const panelViewRef = ref<HTMLElement | null>(null)
const { spawnRippleFromCorner } = useRippleEffect(panelViewRef)

setStatusCard({
  screenLabel: 'Checkout',
  eyebrow: 'Checkout-Übersicht',
  message: 'Bitte Zeiten prüfen und optional Notiz hinterlassen.',
})

// getCurrentDayState is async (real backend later), so loads in onMounted — same as CheckView.vue.
const isLoading = ref(true)
const day = ref<DayState | null>(null)

onMounted(async () => {
  if (currentUser.value) {
    day.value = await getCurrentDayState(currentUser.value.id)
  }
  isLoading.value = false
})

function formatTime(iso: string | null): string {
  return iso ? new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '–'
}

// "HH:MM" → minutes since midnight, for the Plan column (MockUser.plan is
// authored as plain time-of-day strings, not durations).
function parseHM(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + m
}

function formatDurationMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)
  return `${hours}:${String(minutes).padStart(2, '0')} h`
}

const planPauseMinutes = currentUser.value ? parseHM(currentUser.value.plan.pause) : 0
const planSummeMinutes = currentUser.value
  ? parseHM(currentUser.value.plan.checkout) - parseHM(currentUser.value.plan.checkin) - planPauseMinutes
  : 0

// Elapsed since checkin minus pause time. Never mid-pause here (CheckView
// only offers checkout outside an active pause), so pauseSeconds is final.
const stempelSummeMinutes = computed(() => {
  if (!day.value?.checkinAt) return 0
  const endMs = day.value.checkoutAt ? new Date(day.value.checkoutAt).getTime() : Date.now()
  const elapsedMs = endMs - new Date(day.value.checkinAt).getTime() - day.value.pauseSeconds * 1000
  return Math.max(elapsedMs, 0) / 60000
})

const summeReached = computed(() => stempelSummeMinutes.value >= planSummeMinutes)

function formatPauseSeconds(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60)
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`
}

const notiz = ref('')
const checkedOut = ref(false)

// No confirm dialog — the toast below already covers "did this register?".
// checkoutAt is already written (by CheckView's button) by the time this
// screen loads; this click just saves the Notiz, if any, and leaves.
async function onCheckoutClick() {
  if (!currentUser.value || checkedOut.value) return
  // Anchored at the panel's corner rather than the tap point — reads
  // better than a glow centered low on the screen.
  spawnRippleFromCorner()
  checkedOut.value = true

  // Empty Notiz just leaves, per feedback — nothing to persist or log.
  if (notiz.value.trim()) {
    await saveNotiz(currentUser.value.id, notiz.value.trim())
    logActivity(`${currentUser.value.firstName} ${currentUser.value.lastName}`, `Notiz: „${notiz.value.trim()}“`) // demo-only, see useActivityLog.ts
  }

  showToastThenRedirect({
    eyebrow: 'Auf Wiedersehen',
    message: `Auf Wiedersehen, ${currentUser.value.firstName} — Sie sind jetzt ausgecheckt, ${formatTime(day.value?.checkoutAt ?? null)}`,
    active: true,
  })
}
</script>

<template>
  <div ref="panelViewRef" class="panel-view">
    <div class="checkout-content">
      <p class="check-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>

      <p v-if="isLoading" class="panel-loading">Lädt…</p>

      <template v-else>
      <!-- Round 1 (plain table) — kept commented, round 2 below was picked. -->
      <!--
      <table class="checkout-table">
        <thead>
          <tr>
            <th></th>
            <th>Plan</th>
            <th>Stempel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="checkout-table-icon"><LogIn :size="18" /></td>
            <td>{{ currentUser?.plan.checkin }}</td>
            <td>{{ formatTime(day?.checkinAt ?? null) }}</td>
          </tr>
          <tr>
            <td class="checkout-table-icon"><LogOut :size="18" /></td>
            <td>{{ currentUser?.plan.checkout }}</td>
            <td>{{ formatTime(day?.checkoutAt ?? null) }}</td>
          </tr>
          <tr>
            <td class="checkout-table-icon"><Coffee :size="18" /></td>
            <td>{{ currentUser?.plan.pause }}</td>
            <td>{{ day ? formatPauseSeconds(day.pauseSeconds) : '–' }}</td>
          </tr>
          <tr class="checkout-table-row--summe">
            <td class="checkout-table-icon"><Clock :size="18" /></td>
            <td>{{ formatDurationMinutes(planSummeMinutes) }}</td>
            <td>{{ formatDurationMinutes(stempelSummeMinutes) }}</td>
          </tr>
        </tbody>
      </table>
      -->

      <!-- Round 2 — frosted-glass summary list, the picked design. -->
      <div class="checkout-summary">
        <div class="checkout-row">
          <span class="checkout-row-icon"><LogIn :size="16" /></span>
          <span class="checkout-row-label">Checkin</span>
          <span class="checkout-row-values">
            <span class="checkout-row-stempel">{{ formatTime(day?.checkinAt ?? null) }}</span>
            <span class="checkout-row-plan">Plan {{ currentUser?.plan.checkin }}</span>
          </span>
        </div>
        <div class="checkout-row">
          <span class="checkout-row-icon"><LogOut :size="16" /></span>
          <span class="checkout-row-label">Checkout</span>
          <span class="checkout-row-values">
            <span class="checkout-row-stempel">{{ formatTime(day?.checkoutAt ?? null) }}</span>
            <span class="checkout-row-plan">Plan {{ currentUser?.plan.checkout }}</span>
          </span>
        </div>
        <div class="checkout-row">
          <span class="checkout-row-icon"><Coffee :size="16" /></span>
          <span class="checkout-row-label">Pause</span>
          <span class="checkout-row-values">
            <span class="checkout-row-stempel">{{ day ? formatPauseSeconds(day.pauseSeconds) : '–' }}</span>
            <span class="checkout-row-plan">Plan {{ currentUser?.plan.pause }}</span>
          </span>
        </div>
        <div class="checkout-row checkout-row--summe">
          <span class="checkout-row-icon"><Clock :size="16" /></span>
          <span class="checkout-row-label">Summe</span>
          <span class="checkout-row-values">
            <span class="checkout-row-stempel summe-value" :class="{ reached: summeReached }">{{
              formatDurationMinutes(stempelSummeMinutes)
            }}</span>
            <span class="checkout-row-plan">Plan {{ formatDurationMinutes(planSummeMinutes) }}</span>
          </span>
        </div>
      </div>

      <div class="notiz-field">
        <span class="notiz-label info-tooltip" tabindex="0">
          <label for="notiz">Notiz</label>
          <Info :size="14" aria-hidden="true" />
          <span class="info-tooltip-bubble" role="tooltip">
            Bitte Gründe für Über- und Unterstunden oder Änderungswünsche von Zeiteinträgen angeben
          </span>
        </span>
        <input id="notiz" v-model="notiz" type="text" class="notiz-input" placeholder="Optional" />
      </div>

      <button type="button" class="btn-green" :disabled="checkedOut" @click="onCheckoutClick">
        <Check v-if="checkedOut" :size="18" />
        <LogOut v-else :size="18" />
        {{ checkedOut ? 'Ausgecheckt' : 'Checkout' }}
      </button>
      </template>
    </div>

  </div>
</template>
