import { ref } from 'vue'
import type { MockUser } from '@/types/timeClock'

// Single shared ref, module-scoped — plain composable is enough for a
// kiosk with one active user at a time (no need for Pinia yet).
const currentUser = ref<MockUser | null>(null)

// The PIN-entry moment (set by LoginView on action 'menu') — CheckView's
// Pause/Checkout buttons stamp THIS, not the tap. See SubmitPinResult.stampedAt.
const pinEnteredAt = ref<string | null>(null)

export function useSession() {
  function setCurrentUser(user: MockUser | null) {
    currentUser.value = user
  }

  function setPinEnteredAt(stampedAt: string | null) {
    pinEnteredAt.value = stampedAt
  }

  return { currentUser, setCurrentUser, pinEnteredAt, setPinEnteredAt }
}
