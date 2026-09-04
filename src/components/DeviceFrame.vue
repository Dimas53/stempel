<script setup lang="ts">
import { computed, ref } from 'vue'
import { RotateCw } from '@lucide/vue'

// Only mounted at all when main.ts decides we're on a non-touch browser
// viewing the top-level page (see the isTouchDevice/isEmbedded check
// there) — this component IS the "desktop preview" alternative to
// mounting the real kiosk app directly.
// Opens landscape by default — most desks/monitors read wider than
// tall, so this is the orientation a first-time viewer is more likely
// checking, rather than starting them on the one they have to flip.
const orientation = ref<'portrait' | 'landscape'>('landscape')

// Real portrait CSS-viewport dimensions per device, landscape is just
// width/height swapped. The iPad three are the same sizes used
// throughout this project's own responsive testing; Galaxy Tab S4 added
// as one representative Android tablet (Chrome DevTools' own built-in
// device list value) rather than trying to cover every Android size.
// The real app inside reacts to whichever is picked as a genuine
// viewport (it's an <iframe>, a real nested browsing context), so its
// own orientation/breakpoint-based layout responds correctly, not just
// the frame's own visual size.
const DEVICES = {
  mini: { label: 'iPad mini', width: 744, height: 1133 },
  air: { label: 'iPad Air', width: 820, height: 1180 },
  pro: { label: 'iPad Pro', width: 1024, height: 1366 },
  galaxy: { label: 'Galaxy Tab S4', width: 712, height: 1138 },
} as const

const device = ref<keyof typeof DEVICES>('air')

const size = computed(() => {
  const { width, height } = DEVICES[device.value]
  return orientation.value === 'portrait' ? { width, height } : { width: height, height: width }
})

// Same URL the user is actually on (preserves a deep link into
// /chronology/check etc.), plus a marker so main.ts mounts the real app
// instead of this frame again inside the iframe.
const frameUrl = new URL(location.href)
frameUrl.searchParams.set('embedded', '1')
const src = frameUrl.toString()

function toggleOrientation() {
  orientation.value = orientation.value === 'portrait' ? 'landscape' : 'portrait'
}
</script>

<template>
  <div class="device-frame-stage">
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
      </div>
    </div>
  </div>
</template>
