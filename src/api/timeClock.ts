import { mockUsers } from '@/mocks/users'
import { getDayState, setDayState } from '@/mocks/dayState'
import { PinError, type SubmitPinResult } from '@/types/timeClock'

// TEMP(dev-only, revert before demo/final): ticket requires 60_000 (1 minute)
// between stamps. Shortened to 5s here purely so manual click-through
// testing doesn't require actually waiting a full minute between steps.
const MIN_STAMP_INTERVAL_MS = 5_000

function tooSoon(lastStampAt: string | null, now: number): boolean {
  if (!lastStampAt) return false
  return now - new Date(lastStampAt).getTime() < MIN_STAMP_INTERVAL_MS
}

// How much of MIN_STAMP_INTERVAL_MS is actually still left — only called
// once tooSoon() has already confirmed lastStampAt is set and recent, so
// the result is always > 0.
function msUntilNextStamp(lastStampAt: string, now: number): number {
  return Math.max(MIN_STAMP_INTERVAL_MS - (now - new Date(lastStampAt).getTime()), 0)
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

  // Checked before the rate limit on purpose: checkout() also stamps
  // lastStampAt, so immediately retrying right after checking out used to
  // trip tooSoon() first — E3 ("wait a bit") masking E4 ("already done
  // for today"), even though waiting doesn't fix anything here. Already
  // checked out is the more final, more specific state; it should win.
  if (day.checkoutAt) {
    throw new PinError(
      'E4',
      'Pro Tag nur ein Checkin möglich. Sie waren heute bereits eingecheckt.',
    )
  }

  if (tooSoon(day.lastStampAt, now)) {
    throw new PinError(
      'E3',
      'Zu schnell. Bitte eine Minute warten und erneut versuchen.',
      msUntilNextStamp(day.lastStampAt as string, now),
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

// Returns the timestamp actually stamped, so callers display exactly what
// was persisted rather than recomputing `new Date()` a second time.
export async function startPause(userId: string): Promise<string> {
  const now = new Date().toISOString()
  setDayState(userId, { pauseStartAt: now, pauseEndAt: null, lastStampAt: now })
  return now
}

export async function endPause(userId: string): Promise<string> {
  const day = getDayState(userId)
  const now = Date.now()
  const nowIso = new Date(now).toISOString()

  const elapsed = day.pauseStartAt ? now - new Date(day.pauseStartAt).getTime() : 0

  setDayState(userId, {
    pauseEndAt: nowIso,
    pauseSeconds: day.pauseSeconds + Math.max(elapsed, 0) / 1000,
    lastStampAt: nowIso,
  })
  return nowIso
}

export async function checkout(userId: string): Promise<string> {
  const now = new Date().toISOString()
  setDayState(userId, { checkoutAt: now, lastStampAt: now })
  return now
}

// Read-only accessor for views that need to know the current day state
// (e.g. CheckView deciding whether to show the menu or "Pause beenden").
export function getCurrentDayState(userId: string) {
  return getDayState(userId)
}
