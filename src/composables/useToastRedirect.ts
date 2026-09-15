import { useRouter } from 'vue-router'
import { useStatusCard } from '@/composables/useStatusCard'

// Extracted once CheckView + CheckoutView both needed "show card, then leave".
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
