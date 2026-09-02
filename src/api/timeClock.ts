import { mockUsers } from '@/mocks/users'
import { getDayState, setDayState } from '@/mocks/dayState'
import { PinError, type SubmitPinResult } from '@/types/timeClock'

const MIN_STAMP_INTERVAL_MS = 60_000

function tooSoon(lastStampAt: string | null, now: number): boolean {
  if (!lastStampAt) return false
  return now - new Date(lastStampAt).getTime() < MIN_STAMP_INTERVAL_MS
}

export async function submitPin(pin: string): Promise<SubmitPinResult> {
  if (!pin.trim()) {
    throw new PinError('E1', 'Bitte PIN eingeben.')
  }

  const user = mockUsers.find((u) => u.pin === pin)
  if (!user) {
    throw new PinError('E2', 'PIN nicht erkannt. Bitte erneut versuchen.')
  }

  const day = getDayState(user.id)
  const now = Date.now()

  if (tooSoon(day.lastStampAt, now)) {
    throw new PinError('E3', 'Zu schnell. Bitte eine Minute warten und erneut versuchen.')
  }

  if (day.checkoutAt) {
    throw new PinError(
      'E4',
      'Pro Tag nur ein Checkin möglich. Sie waren heute bereits eingecheckt.',
    )
  }

  const nowIso = new Date(now).toISOString()

  if (!day.checkinAt) {
    setDayState(user.id, { checkinAt: nowIso, lastStampAt: nowIso })
    return { user, action: 'checkin' }
  }

  if (day.pauseStartAt && !day.pauseEndAt) {
    return { user, action: 'pause' }
  }

  return { user, action: 'menu' }
}

export async function startPause(userId: string): Promise<void> {
  const now = new Date().toISOString()
  setDayState(userId, { pauseStartAt: now, pauseEndAt: null, lastStampAt: now })
}

export async function endPause(userId: string): Promise<void> {
  const day = getDayState(userId)
  const now = Date.now()
  const nowIso = new Date(now).toISOString()

  const elapsed = day.pauseStartAt ? now - new Date(day.pauseStartAt).getTime() : 0

  setDayState(userId, {
    pauseEndAt: nowIso,
    pauseSeconds: day.pauseSeconds + Math.max(elapsed, 0) / 1000,
    lastStampAt: nowIso,
  })
}

export async function checkout(userId: string): Promise<void> {
  const now = new Date().toISOString()
  setDayState(userId, { checkoutAt: now, lastStampAt: now })
}
