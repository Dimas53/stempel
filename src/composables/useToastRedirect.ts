import { useRouter } from 'vue-router'
import { useStatusCard } from '@/composables/useStatusCard'

// Third view to need "show the status card, then leave" (CheckView's two
// call sites, now CheckoutView's) — per toast-system.md's own note to
// revisit extracting this once that happened.
const REDIRECT_DELAY_MS = 2500

export function useToastRedirect() {
  const router = useRouter()
  const { setStatusCard } = useStatusCard()

  function showToastThenRedirect(card: Parameters<typeof setStatusCard>[0], to = '/chronology') {
    setStatusCard(card)
    setTimeout(() => router.push(to), REDIRECT_DELAY_MS)
  }

  return { showToastThenRedirect }
}
