/**
 * @fileoverview Pinia Store für den Special Banner
 * 
 * Einfacher Store zur Verwaltung der Banner-Sichtbarkeit.
 * Der Banner kann einmal pro Session geschlossen werden.
 * 
 * @module stores/banner
 */

import { defineStore } from 'pinia'

/**
 * @typedef {Object} BannerState
 * @property {boolean} isVisible - Ist der Banner sichtbar
 */

/**
 * Banner Store
 * 
 * @example
 * // In einer Komponente
 * const bannerStore = useBannerStore()
 * 
 * // Banner ausblenden
 * bannerStore.hideBanner()
 * 
 * // Sichtbarkeit prüfen
 * if (bannerStore.isVisible) {
 *   // Banner anzeigen
 * }
 */
export const useBannerStore = defineStore('banner', {
  /**
   * Initialer State
   * @returns {BannerState}
   */
  state: () => ({
    /** @type {boolean} */
    isVisible: true
  }),
  
  actions: {
    /**
     * Blendet den Banner aus
     * Der Banner bleibt für die aktuelle Session ausgeblendet
     */
    hideBanner() {
      this.isVisible = false
    },
    
    /**
     * Zeigt den Banner wieder an
     * Kann für Reset-Funktionen verwendet werden
     */
    showBanner() {
      this.isVisible = true
    }
  }
})
