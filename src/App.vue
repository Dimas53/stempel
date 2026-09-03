<script setup lang="ts">
import KioskShell from '@/components/KioskShell.vue'
</script>

<template>
  <KioskShell>
    <router-view v-slot="{ Component }">
      <Transition name="panel-slide" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </KioskShell>
</template>
