export interface MockUser {
  id: string
  pin: string
  firstName: string
  lastName: string
  plan: {
    checkin: string // "09:00"
    checkout: string // "17:00"
    pause: string // "00:30"
  }
}

export interface DayState {
  userId: string
  // "YYYY-MM-DD" — a real backend must key records by (userId, date), not
  // userId alone, or a new day's stamps collide with an old record. See
  // notes/NOTES-real-api.md.
  date: string
  checkinAt: string | null
  checkoutAt: string | null
  pauseStartAt: string | null
  pauseEndAt: string | null
  pauseSeconds: number
  lastStampAt: string | null
  notiz: string | null
}

export type PinAction = 'checkin' | 'menu' | 'pause'

export type PinErrorCode = 'E1' | 'E2' | 'E3' | 'E4' | 'E5'

export class PinError extends Error {
  code: PinErrorCode
  // E3 only — ms until the next stamp is actually allowed.
  retryAfterMs?: number

  constructor(code: PinErrorCode, message: string, retryAfterMs?: number) {
    super(message)
    this.code = code
    this.retryAfterMs = retryAfterMs
  }
}

export interface SubmitPinResult {
  user: MockUser
  action: PinAction
  // The moment THIS PIN was entered. For 'menu', this is what later gets
  // written into pauseStartAt/checkoutAt — the eventual button tap only
  // picks which field, it doesn't generate a new timestamp.
  stampedAt?: string
}
