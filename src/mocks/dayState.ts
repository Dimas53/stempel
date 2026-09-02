import type { DayState } from '@/types/timeClock'

// In-memory only — resets on page reload, per phase-1 spec.
const dayStates = new Map<string, DayState>()

function emptyDayState(userId: string): DayState {
  return {
    userId,
    checkinAt: null,
    checkoutAt: null,
    pauseStartAt: null,
    pauseEndAt: null,
    pauseSeconds: 0,
    lastStampAt: null,
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
