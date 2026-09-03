import { ref } from 'vue'

export type LayoutMode = 'full' | 'card'

// Shared across every screen (all views render through KioskShell) so the
// toggle button in one place flips the look everywhere consistently.
const layoutMode = ref<LayoutMode>('full')

export function useLayoutMode() {
  function toggleLayoutMode() {
    layoutMode.value = layoutMode.value === 'full' ? 'card' : 'full'
  }

  return { layoutMode, toggleLayoutMode }
}
