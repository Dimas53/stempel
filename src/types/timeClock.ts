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
  checkinAt: string | null
  checkoutAt: string | null
  pauseStartAt: string | null
  pauseEndAt: string | null
  pauseSeconds: number
  lastStampAt: string | null
}

export type PinAction = 'checkin' | 'menu' | 'pause'

export type PinErrorCode = 'E1' | 'E2' | 'E3' | 'E4' | 'E5'

export class PinError extends Error {
  code: PinErrorCode

  constructor(code: PinErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

export interface SubmitPinResult {
  user: MockUser
  action: PinAction
}
