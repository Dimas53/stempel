import { ref } from 'vue'

// Demo-only, shows a client that stamps get recorded without a real
// backend yet. Safe to delete this file + the logActivity(...) call
// sites + DeviceFrame.vue's panel together, any time.
const STORAGE_KEY = 'stempelmaske-activity-log'

export interface ActivityLogEntry {
  time: string
  user: string
  action: string
}

function readLog(): ActivityLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Appends, never overwrites. stampedAt should be the actual persisted
// timestamp (e.g. startPause/checkout's return value) — Pause/Checkout
// stamp the PIN-entry moment, not the click, so "now" would be wrong.
export function logActivity(user: string, action: string, stampedAt?: string) {
  const entries = readLog()
  entries.push({
    time: (stampedAt ? new Date(stampedAt) : new Date()).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    user,
    action,
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

// Used by DeviceFrame.vue only. Entries are written from inside its
// <iframe> — a different browsing context — so the "storage" event
// fires here for free, no polling needed.
export function useActivityLog() {
  const entries = ref<ActivityLogEntry[]>(readLog())

  function refresh() {
    entries.value = readLog()
  }

  // Clearing happens in this same context, so "storage" won't fire for
  // it — update entries.value directly instead.
  function clearLog() {
    localStorage.removeItem(STORAGE_KEY)
    entries.value = []
  }

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY || e.key === null) refresh()
  })

  return { entries, refresh, clearLog }
}
