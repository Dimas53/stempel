<script setup lang="ts">
import { ref } from 'vue'
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
const { setStatusCard } = useStatusCard()
const { layoutMode } = useLayoutMode()

const panelViewRef = ref<HTMLElement | null>(null)
const { spawnRipple } = useRippleEffect(panelViewRef)

const IDLE_EYEBROW = 'Anmeldung'
const IDLE_MESSAGE = 'Bitte gib deinen PIN ein, um dich anzumelden.'

const pin = ref('')
const errorMessage = ref('')

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
        message: `Herzlich Willkommen ${result.user.firstName}, du bist jetzt eingecheckt`,
        active: true,
      })
      setTimeout(() => {
        setStatusCard({ eyebrow: IDLE_EYEBROW, message: IDLE_MESSAGE })
      }, 3500)
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
    if (err instanceof PinError) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'Verbindung fehlgeschlagen. Bitte erneut versuchen.'
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
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      <button type="submit" class="btn-gold" @click="spawnRipple">Anmelden</button>
    </form>

    <p class="credits">© pepito 2026 · mit ♥ gemacht von Ducito &amp; Solvi</p>
  </div>
</template>
