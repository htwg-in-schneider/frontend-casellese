/**
 * @fileoverview Pinia Store für User-Profil und Authentifizierung
 * 
 * Verwaltet den globalen User-State inklusive:
 * - User-Profil aus dem Backend
 * - Admin-Rolle Prüfung
 * - Loading und Error States
 * 
 * @module stores/user
 */

import { defineStore } from 'pinia'
import { ROLES } from '@/config/constants'

/**
 * @typedef {Object} UserProfile
 * @property {number} id - User ID
 * @property {string} name - Anzeigename
 * @property {string} email - E-Mail Adresse
 * @property {string} role - Rolle (ADMIN oder REGULAR)
 * @property {string} oauthId - OAuth Provider ID
 */

/**
 * @typedef {Object} UserState
 * @property {UserProfile|null} profile - Aktuelles User-Profil
 * @property {boolean} isLoading - Wird gerade geladen
 * @property {string|null} error - Fehlermeldung
 */

/**
 * User Store
 * 
 * @example
 * // In einer Vue Komponente
 * import { useUserStore } from '@/stores/user'
 * 
 * const userStore = useUserStore()
 * 
 * // Profil laden
 * await userStore.fetchProfile(getAccessTokenSilently, apiBaseUrl)
 * 
 * // Admin-Check
 * if (userStore.isAdmin) {
 *   // Admin-spezifische Logik
 * }
 */
export const useUserStore = defineStore('user', {
  /**
   * Initialer State
   * @returns {UserState}
   */
  state: () => ({
    /** @type {UserProfile|null} */
    profile: null,
    /** @type {boolean} */
    isLoading: false,
    /** @type {string|null} */
    error: null
  }),
  
  getters: {
    /**
     * Prüft ob der User Admin ist
     * @param {UserState} state
     * @returns {boolean}
     */
    isAdmin: (state) => state.profile?.role === ROLES.ADMIN,
    
    /**
     * Prüft ob ein User eingeloggt ist
     * @param {UserState} state
     * @returns {boolean}
     */
    isLoggedIn: (state) => state.profile !== null,
    
    /**
     * Gibt den Anzeigenamen zurück
     * @param {UserState} state
     * @returns {string}
     */
    userName: (state) => state.profile?.name || '',
    
    /**
     * Gibt die E-Mail Adresse zurück
     * @param {UserState} state
     * @returns {string}
     */
    userEmail: (state) => state.profile?.email || ''
  },
  
  actions: {
    /**
     * Lädt das User-Profil vom Backend
     * 
     * @param {Function} getAccessTokenSilently - Auth0 Token-Funktion
     * @param {string} apiBaseUrl - Backend API URL
     * @returns {Promise<void>}
     */
    async fetchProfile(getAccessTokenSilently, apiBaseUrl) {
      this.isLoading = true
      this.error = null
      
      try {
        const token = await getAccessTokenSilently()
        const response = await fetch(`${apiBaseUrl}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          this.profile = await response.json()
        } else {
          this.error = `Fehler: ${response.status} ${response.statusText}`
          this.profile = null
        }
      } catch (e) {
        this.error = e.message
        this.profile = null
        console.error('[UserStore] Fehler beim Laden des Profils:', e)
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Setzt das Profil zurück (z.B. bei Logout)
     */
    clearProfile() {
      this.profile = null
      this.error = null
    }
  }
})
