import { ref } from 'vue'
import type { MockUser } from '@/types/timeClock'

// Single shared ref, module-scoped — plain composable is enough for a
// kiosk with one active user at a time (no need for Pinia yet).
const currentUser = ref<MockUser | null>(null)

export function useSession() {
  function setCurrentUser(user: MockUser | null) {
    currentUser.value = user
  }

  return { currentUser, setCurrentUser }
}
