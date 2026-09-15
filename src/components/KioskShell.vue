<script setup lang="ts">
import { Maximize2, Minimize2 } from '@lucide/vue'
import logo from '@/assets/pepito-logo.webp'
import { useLayoutMode } from '@/composables/useLayoutMode'
import { useStatusCard } from '@/composables/useStatusCard'

const { layoutMode, toggleLayoutMode } = useLayoutMode()
const { screenLabel, eyebrow, message, active, tone } = useStatusCard()
</script>

<template>
  <div class="kiosk-stage" :class="{ 'kiosk-stage--card': layoutMode === 'card' }">
    <div class="kiosk" :class="{ 'kiosk--card': layoutMode === 'card' }">
      <section class="panel">
        <div class="panel-content">
          <slot />
        </div>

        <!-- Passive orientation label, low-contrast so it doesn't compete
             with the form. After .panel-content in the DOM so it paints
             on top (both position: absolute, no z-index). -->
        <p class="panel-breadcrumb">Zeiterfassung / {{ screenLabel }}</p>
      </section>

      <aside class="strip">
        <div class="strip-content">
          <div class="logo">
            <img :src="logo" alt="pepito" />
          </div>

          <div
            class="strip-card"
            :class="{
              'strip-card--active': active,
              'strip-card--positive': active && tone === 'positive',
              'strip-card--pause': active && tone === 'pause',
              'strip-card--error': active && tone === 'error',
            }"
          >
            <Transition name="strip-msg" mode="out-in">
              <div :key="message">
                <p class="strip-eyebrow">{{ eyebrow }}</p>
                <p class="strip-message">{{ message }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </aside>
    </div>

    <!-- Dev-only toggle: full-bleed split vs. a centered card, for comparison. -->
    <button
      type="button"
      class="layout-toggle"
      :title="layoutMode === 'full' ? 'Kartenansicht' : 'Vollbild'"
      @click="toggleLayoutMode"
    >
      <Minimize2 v-if="layoutMode === 'full'" :size="16" />
      <Maximize2 v-else :size="16" />
    </button>
  </div>
</template>
