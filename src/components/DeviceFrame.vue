<script setup lang="ts">
import { computed, ref } from 'vue'
import { RotateCw, Tablet } from '@lucide/vue'
import { useActivityLog } from '@/composables/useActivityLog'

// Demo-only, delete together with useActivityLog.ts + the log panel below.
const { entries: logEntries, clearLog } = useActivityLog()

// "Thomas Weber" -> "TW", so it fits on one log line.
function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

// Desktop-preview alternative to mounting the real app (see main.ts's
// isTouchDevice check). Starts landscape — most monitors are wider than tall.
const orientation = ref<'portrait' | 'landscape'>('landscape')

// Portrait CSS px per device; landscape just swaps width/height. Real app
// inside reacts to these as a genuine iframe viewport, so its own
// orientation/breakpoint CSS responds correctly.
const DEVICES = {
  mini: { label: 'iPad mini', width: 744, height: 1133 },
  air: { label: 'iPad Air', width: 820, height: 1180 },
  pro: { label: 'iPad Pro', width: 1024, height: 1366 },
  galaxy: { label: 'Galaxy Tab S4', width: 712, height: 1138 },
} as const

const device = ref<keyof typeof DEVICES>('air')

// 'computer' drops the bezel entirely — plain full-width page, not a
// simulated tablet. device/orientation stay untouched so switching back
// to 'tablet' resumes the last-picked device.
const viewMode = ref<'tablet' | 'computer'>('tablet')

const size = computed(() => {
  const { width, height } = DEVICES[device.value]
  return orientation.value === 'portrait' ? { width, height } : { width: height, height: width }
})

// Same URL, plus a marker so main.ts mounts the real app inside the
// iframe instead of this frame again.
const frameUrl = new URL(location.href)
frameUrl.searchParams.set('embedded', '1')
const src = frameUrl.toString()

function toggleOrientation() {
  orientation.value = orientation.value === 'portrait' ? 'landscape' : 'portrait'
}
</script>

<template>
  <!-- 'computer': no bezel/controls/log, just the app full-width. Floating
       button is the only way back to the tablet controls. -->
  <div v-if="viewMode === 'computer'" class="device-frame-computer">
    <iframe class="device-frame-computer-screen" :src="src" title="Stempelmaske Vorschau" />
    <button
      type="button"
      class="device-frame-computer-back"
      title="Zurück zur Tablet-Ansicht"
      @click="viewMode = 'tablet'"
    >
      <Tablet :size="18" />
    </button>
  </div>

  <div v-else class="device-frame-stage">
    <div class="device-frame" :style="{ width: size.width + 'px', height: size.height + 'px' }">
      <iframe class="device-frame-screen" :src="src" title="Stempelmaske Vorschau" />
      <div class="device-frame-home-indicator"></div>
    </div>

    <div class="device-frame-controls">
      <button
        type="button"
        class="device-frame-rotate"
        title="Ausrichtung wechseln"
        @click="toggleOrientation"
      >
        <RotateCw :size="18" />
      </button>

      <div class="device-frame-sizes">
        <button
          v-for="(config, key) in DEVICES"
          :key="key"
          type="button"
          class="device-frame-size-btn"
          :class="{ 'device-frame-size-btn--active': device === key }"
          @click="device = key"
        >
          {{ config.label }}
        </button>
        <button type="button" class="device-frame-size-btn" @click="viewMode = 'computer'">
          Computer
        </button>
      </div>

      <!-- Demo-only activity log, see useActivityLog.ts — oldest on top. -->
      <div class="device-frame-log">
        <div class="device-frame-log-header">
          <p class="device-frame-log-title">Aktivitätslog</p>
          <button
            v-if="logEntries.length"
            type="button"
            class="device-frame-log-clear"
            title="Log leeren"
            @click="clearLog"
          >
            Leeren
          </button>
        </div>
        <p v-if="!logEntries.length" class="device-frame-log-empty">Noch keine Einträge.</p>
        <ul v-else class="device-frame-log-list">
          <li v-for="(entry, i) in logEntries" :key="i" class="device-frame-log-entry">
            <span class="device-frame-log-who">{{ initials(entry.user) }}</span>
            <span class="device-frame-log-text">{{ entry.action }}</span>
            <span class="device-frame-log-time">{{ entry.time }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
