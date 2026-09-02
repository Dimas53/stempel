<script setup lang="ts">
import { useSession } from '@/composables/useSession'

// TODO(M4): Plan vs Stempel table, Notiz field, confirm dialog. Placeholder
// for now so the route is reachable from the login flow.
const { currentUser } = useSession()
</script>

<template>
  <div class="placeholder-screen">
    <p>Checkout-Übersicht für {{ currentUser?.firstName ?? 'Gast' }}</p>
    <p class="placeholder-hint">Coming in Milestone 4</p>
  </div>
</template>
