// Single seam between the app and "the backend" — nothing outside this
// file should import from mocks/ directly. See notes/NOTES-real-api.md.
import { mockUsers } from '@/mocks/users'
import { getDayState, setDayState } from '@/mocks/dayState'
import { PinError, type DayState, type SubmitPinResult } from '@/types/timeClock'

const MS_PER_MINUTE = 60_000

// Rate limit is "once per calendar minute": 09:22:45 -> next allowed at
// 09:23:00, not 09:23:45. Minute-since-epoch comparison also handles
// hour/day rollover for free.
function sameMinute(a: number, b: number): boolean {
  return Math.floor(a / MS_PER_MINUTE) === Math.floor(b / MS_PER_MINUTE)
}

function tooSoon(lastStampAt: string | null, now: number): boolean {
  if (!lastStampAt) return false
  return sameMinute(new Date(lastStampAt).getTime(), now)
}

// Time left until the current minute rolls over — same for everyone,
// doesn't depend on when within the minute the last stamp landed.
function msUntilNextStamp(now: number): number {
  return MS_PER_MINUTE - (now % MS_PER_MINUTE)
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

  // Checked before the rate limit: checkout() also stamps lastStampAt, so
  // retrying right after would otherwise trip E3 and mask the more
  // specific E4.
  if (day.checkoutAt) {
    throw new PinError(
      'E4',
      'Pro Tag ist nur ein Checkin möglich. Sie waren heute bereits eingecheckt.',
    )
  }

  if (tooSoon(day.lastStampAt, now)) {
    throw new PinError(
      'E3',
      'Bitte warten Sie kurz und versuchen Sie es gleich noch einmal. Sie haben in kurzer Zeit mehrfach gestempelt.',
      msUntilNextStamp(now),
    )
  }

  const nowIso = new Date(now).toISOString()

  if (!day.checkinAt) {
    setDayState(user.id, { checkinAt: nowIso, lastStampAt: nowIso })
    return { user, action: 'checkin', stampedAt: nowIso }
  }

  if (day.pauseStartAt && !day.pauseEndAt) {
    return { user, action: 'pause', stampedAt: nowIso }
  }

  return { user, action: 'menu', stampedAt: nowIso }
}

// stampedAt is the PIN-entry moment (see SubmitPinResult), not necessarily
// "now" — the caller may only tap Pause a while after that.
export async function startPause(userId: string, stampedAt: string): Promise<string> {
  setDayState(userId, { pauseStartAt: stampedAt, pauseEndAt: null, lastStampAt: stampedAt })
  return stampedAt
}

export async function endPause(userId: string, stampedAt: string): Promise<string> {
  const day = getDayState(userId)

  const elapsed = day.pauseStartAt
    ? new Date(stampedAt).getTime() - new Date(day.pauseStartAt).getTime()
    : 0

  setDayState(userId, {
    pauseEndAt: stampedAt,
    pauseSeconds: day.pauseSeconds + Math.max(elapsed, 0) / 1000,
    lastStampAt: stampedAt,
  })
  return stampedAt
}

// Same stampedAt convention as startPause. Checkout's own button just
// saves the Notiz — this timestamp is already written by then.
export async function checkout(userId: string, stampedAt: string): Promise<string> {
  setDayState(userId, { checkoutAt: stampedAt, lastStampAt: stampedAt })
  return stampedAt
}

// Separate from checkout() — a real backend would likely expose this as
// its own endpoint (PATCH the day's note) rather than bundle it in.
export async function saveNotiz(userId: string, notiz: string): Promise<void> {
  setDayState(userId, { notiz })
}

// async on purpose, even though the mock answers instantly — CheckView
// and CheckoutView already read this via onMounted + a loading state,
// ready for real network latency.
export async function getCurrentDayState(userId: string): Promise<DayState> {
  return getDayState(userId)
}
