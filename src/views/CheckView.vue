<script setup lang="ts">
import { useSession } from '@/composables/useSession'

// TODO(M3): full menu (Pause starten / Zum Checkout) + Pause beenden UI,
// branching on the user's DayState. Placeholder for now so the route
// is reachable from the login flow.
const { currentUser } = useSession()
</script>

<template>
  <div class="placeholder-screen">
    <p>Hallo, {{ currentUser?.firstName ?? 'Gast' }}</p>
    <p class="placeholder-hint">Menu / Pause beenden — coming in Milestone 3</p>
  </div>
</template>
