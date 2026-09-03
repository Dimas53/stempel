<script setup lang="ts">
import { Maximize2, Minimize2 } from '@lucide/vue'
import logo from '@/assets/pepito-logo.webp'
import ScreenLabel from '@/components/ScreenLabel.vue'
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
            }"
          >
            <Transition name="strip-msg" mode="out-in">
              <div :key="message">
                <p class="strip-eyebrow">{{ eyebrow }}</p>
                <p class="strip-message">{{ message }}</p>
              </div>
            </Transition>
          </div>

          <div class="strip-status">
            <div class="strip-divider"></div>
            <ScreenLabel :text="screenLabel" />
          </div>


        </div>
      </aside>
    </div>

    <!-- Dev-only toggle to compare the full-bleed split against a
         centered fixed-size card on a neutral backdrop, per the user's
         "let's try it as an option, not a commitment" request. -->
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
