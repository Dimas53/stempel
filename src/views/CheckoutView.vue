<script setup lang="ts">
import { computed, ref } from 'vue'
import { LogIn, LogOut, Coffee, Clock, Info, Check } from '@lucide/vue'
import { checkout, getCurrentDayState } from '@/api/timeClock'
import { useRippleEffect } from '@/composables/useRippleEffect'
import { useSession } from '@/composables/useSession'
import { useStatusCard } from '@/composables/useStatusCard'
import { useToastRedirect } from '@/composables/useToastRedirect'

const { currentUser } = useSession()
const { setStatusCard } = useStatusCard()
const { showToastThenRedirect } = useToastRedirect()

const panelViewRef = ref<HTMLElement | null>(null)
const { spawnRippleFromCorner } = useRippleEffect(panelViewRef)

setStatusCard({
  screenLabel: 'Checkout',
  eyebrow: 'Checkout-Übersicht',
  message: 'Bitte Zeiten prüfen und auschecken.',
})

const day = currentUser.value ? getCurrentDayState(currentUser.value.id) : null

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

// Actual worked time so far: elapsed since checkin, minus finalized pause
// time. By the time a user can reach this screen they're never mid-pause
// (CheckView only offers "Zum Checkout" outside an active pause), so
// `pauseSeconds` is already the day's final total, not a partial one.
const stempelSummeMinutes = computed(() => {
  if (!day?.checkinAt) return 0
  const endMs = day.checkoutAt ? new Date(day.checkoutAt).getTime() : Date.now()
  const elapsedMs = endMs - new Date(day.checkinAt).getTime() - day.pauseSeconds * 1000
  return Math.max(elapsedMs, 0) / 60000
})

const summeReached = computed(() => stempelSummeMinutes.value >= planSummeMinutes)

function formatPauseSeconds(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60)
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`
}

const notiz = ref('')
const checkedOut = ref(false)

// No confirm dialog — tried it, turned out redundant: the toast below is
// already the "did this register?" feedback, and a second modal asking
// to confirm before showing it just added a step.
async function onCheckoutClick() {
  if (!currentUser.value || checkedOut.value) return
  // Anchored at the panel's top-left corner, not the tap point — a glow
  // centered on this specific button (sitting low on the screen) read
  // badly, tried and rejected. This still gives the press a reaction.
  spawnRippleFromCorner()
  checkedOut.value = true
  const stampedAt = await checkout(currentUser.value.id)
  showToastThenRedirect({
    eyebrow: 'Auf Wiedersehen',
    message: `Auf Wiedersehen, ${currentUser.value.firstName} — Sie sind jetzt ausgecheckt, ${formatTime(stampedAt)}`,
    active: true,
  })
}
</script>

<template>
  <div ref="panelViewRef" class="panel-view">
    <div class="checkout-content">
      <p class="check-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>

      <!-- Round 1 (plain table) — user compared both live and picked round
           2 below. Kept here commented rather than deleted. -->
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

      <!-- Round 2 — frosted-glass summary list. Active again; user liked
           this one better after comparing, plans to revisit the icons and
           the time formatting further later. -->
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
    </div>

    <p class="credits">© pepito 2026 · mit ♥ gemacht von Ducito &amp; Solvi</p>
  </div>
</template>
