<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <span class="screen-label">{{ text }}</span>
</template>
