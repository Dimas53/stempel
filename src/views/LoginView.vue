<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock } from '@lucide/vue'
import { submitPin } from '@/api/timeClock'
import { useSession } from '@/composables/useSession'
import { PinError } from '@/types/timeClock'
import logo from '@/assets/pepito-logo.webp'
import ScreenLabel from '@/components/ScreenLabel.vue'

const router = useRouter()
const { setCurrentUser } = useSession()

const IDLE_EYEBROW = 'Anmeldung'
const IDLE_MESSAGE = 'Bitte gib deinen PIN ein, um dich anzumelden.'

const pin = ref('')
const errorMessage = ref('')
const stripEyebrow = ref(IDLE_EYEBROW)
const stripMessage = ref(IDLE_MESSAGE)
const stripActive = ref(false)

async function onSubmit() {
  errorMessage.value = ''

  try {
    const result = await submitPin(pin.value)
    setCurrentUser(result.user)

    if (result.action === 'checkin') {
      pin.value = ''
      stripActive.value = true
      stripEyebrow.value = 'Eingecheckt'
      stripMessage.value = `Herzlich Willkommen ${result.user.firstName}, du bist jetzt eingecheckt`
      // TODO(M3): replace with the real Toast overlay component.
      setTimeout(() => {
        stripActive.value = false
        stripEyebrow.value = IDLE_EYEBROW
        stripMessage.value = IDLE_MESSAGE
      }, 2500)
      return
    }

    pin.value = ''
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
  <div class="kiosk">
    <section class="panel">
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
        <button type="submit" class="btn-anmelden">Anmelden</button>
      </form>

      <p class="credits">© pepito 2026 · mit ♥ gemacht von Ducito &amp; Solvi</p>
    </section>

    <aside class="strip">
      <div class="strip-content">
        <div class="logo">
          <img :src="logo" alt="pepito" />
        </div>

        <div class="strip-card" :class="{ 'strip-card--active': stripActive }">
          <Transition name="strip-msg" mode="out-in">
            <div :key="stripMessage">
              <p class="strip-eyebrow">{{ stripEyebrow }}</p>
              <p class="strip-message">{{ stripMessage }}</p>
            </div>
          </Transition>
        </div>

        <div class="strip-divider"></div>

        <ScreenLabel text="Login" />
      </div>
    </aside>
  </div>
</template>
