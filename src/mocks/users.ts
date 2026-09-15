import type { MockUser } from '@/types/timeClock'

// WHOLE FILE goes away once there's a real backend — see
// notes/NOTES-real-api.md. Only submitPin() in api/timeClock.ts reads
// this; PIN lookup there becomes a POST to the server instead of
// searching this array.
export const mockUsers: MockUser[] = [
  {
    id: 'u1',
    pin: '1234',
    firstName: 'Thomas',
    lastName: 'Weber',
    plan: { checkin: '09:00', checkout: '17:00', pause: '00:30' },
  },
  {
    id: 'u2',
    pin: '5678',
    firstName: 'Klaus',
    lastName: 'Müller',
    plan: { checkin: '08:00', checkout: '16:30', pause: '00:30' },
  },
  {
    id: 'u3',
    pin: '9090',
    firstName: 'Anna',
    lastName: 'Schneider',
    plan: { checkin: '09:30', checkout: '18:00', pause: '00:45' },
  },
]
