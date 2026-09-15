import type { DayState } from '@/types/timeClock'

// In-memory only, resets on reload. Whole file goes away with a real
// backend — see notes/NOTES-real-api.md.
const dayStates = new Map<string, DayState>()

function emptyDayState(userId: string): DayState {
  return {
    userId,
    date: new Date().toISOString().slice(0, 10),
    checkinAt: null,
    checkoutAt: null,
    pauseStartAt: null,
    pauseEndAt: null,
    pauseSeconds: 0,
    lastStampAt: null,
    notiz: null,
  }
}

export function getDayState(userId: string): DayState {
  let state = dayStates.get(userId)
  if (!state) {
    state = emptyDayState(userId)
    dayStates.set(userId, state)
  }
  return state
}

export function setDayState(userId: string, patch: Partial<DayState>): DayState {
  const current = getDayState(userId)
  const next = { ...current, ...patch }
  dayStates.set(userId, next)
  return next
}
