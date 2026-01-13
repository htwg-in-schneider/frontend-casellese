/**
 * @fileoverview Zentrale Exports für alle Pinia Stores
 * 
 * Ermöglicht saubere Imports:
 * ```js
 * import { useUserStore, useFavoritesStore, useBannerStore } from '@/stores'
 * ```
 * 
 * @module stores
 */

export { useUserStore } from './user.js'
export { useFavoritesStore } from './favorites.js'
export { useBannerStore } from './banner.js'