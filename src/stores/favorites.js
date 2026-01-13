/**
 * @fileoverview Pinia Store für Favoriten (Merkliste)
 * 
 * Verwaltet die Favoriten/Merkliste des Users:
 * - Synchronisation mit Backend
 * - Optimistisches UI Update
 * - Lokaler Cache der Favoriten-IDs
 * 
 * @module stores/favorites
 */

import { defineStore } from 'pinia'

/**
 * @typedef {Object} Favorite
 * @property {number} id - Favorit ID
 * @property {number} recipeId - Rezept ID
 * @property {number} userId - User ID
 * @property {string} createdAt - Erstellungszeitpunkt (ISO String)
 * @property {Object} [recipe] - Optionales Rezept-Objekt (wenn mit Lazy Loading)
 */

/**
 * @typedef {Object} FavoritesState
 * @property {Favorite[]} favorites - Liste aller Favoriten mit Details
 * @property {number[]} favoriteIds - Array der Rezept-IDs (für schnelle Lookups)
 * @property {boolean} isLoading - Wird gerade geladen
 * @property {string|null} error - Fehlermeldung
 */

/**
 * @typedef {Object} ToggleResult
 * @property {boolean} isFavorite - Neuer Favoriten-Status
 * @property {number} recipeId - Betroffene Rezept-ID
 */

/**
 * Favorites Store
 * 
 * @example
 * // Favoriten-Status prüfen
 * const favoritesStore = useFavoritesStore()
 * const isFav = favoritesStore.isFavorite(recipeId)
 * 
 * // Toggle Favorit
 * await favoritesStore.toggleFavorite(recipeId, getAccessTokenSilently, apiBaseUrl)
 */
export const useFavoritesStore = defineStore('favorites', {
  /**
   * Initialer State
   * @returns {FavoritesState}
   */
  state: () => ({
    /** @type {Favorite[]} */
    favorites: [],
    /** @type {number[]} */
    favoriteIds: [],
    /** @type {boolean} */
    isLoading: false,
    /** @type {string|null} */
    error: null
  }),
  
  getters: {
    /**
     * Prüft ob ein Rezept in der Merkliste ist
     * @param {FavoritesState} state
     * @returns {Function} Lookup-Funktion
     */
    isFavorite: (state) => (recipeId) => {
      const id = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId
      return state.favoriteIds.includes(id)
    },
    
    /**
     * Anzahl der Favoriten
     * @param {FavoritesState} state
     * @returns {number}
     */
    count: (state) => state.favoriteIds.length,
    
    /**
     * Favoriten sortiert nach Datum (neueste zuerst)
     * @param {FavoritesState} state
     * @returns {Favorite[]}
     */
    sortedFavorites: (state) => {
      return [...state.favorites].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    }
  },
  
  actions: {
    /**
     * Lädt alle Favoriten mit Details vom Backend
     * 
     * @param {Function} getAccessTokenSilently - Auth0 Token-Funktion
     * @param {string} apiBaseUrl - Backend API URL
     * @returns {Promise<void>}
     */
    async fetchFavorites(getAccessTokenSilently, apiBaseUrl) {
      this.isLoading = true
      this.error = null
      
      try {
        const token = await getAccessTokenSilently()
        const response = await fetch(`${apiBaseUrl}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          this.favorites = await response.json()
          this.favoriteIds = this.favorites.map(f => f.recipeId)
        } else {
          this.error = `Fehler: ${response.status} ${response.statusText}`
          console.error('[FavoritesStore] Fehler beim Laden:', this.error)
        }
      } catch (e) {
        this.error = e.message
        console.error('[FavoritesStore] Exception:', e)
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Lädt nur die Favoriten-IDs (schneller, für initiales Laden)
     * Wird für die UI-Anzeige des Favoriten-Status verwendet
     * 
     * @param {Function} getAccessTokenSilently - Auth0 Token-Funktion
     * @param {string} apiBaseUrl - Backend API URL
     * @returns {Promise<void>}
     */
    async fetchFavoriteIds(getAccessTokenSilently, apiBaseUrl) {
      try {
        const token = await getAccessTokenSilently()
        const response = await fetch(`${apiBaseUrl}/api/favorites/ids`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          this.favoriteIds = await response.json()
        }
      } catch (e) {
        console.error('[FavoritesStore] Fehler beim Laden der IDs:', e)
      }
    },
    
    /**
     * Schaltet den Favoriten-Status um (Toggle)
     * 
     * @param {number|string} recipeId - Rezept ID
     * @param {Function} getAccessTokenSilently - Auth0 Token-Funktion
     * @param {string} apiBaseUrl - Backend API URL
     * @returns {Promise<ToggleResult>} Toggle-Ergebnis
     * @throws {Error} Bei API-Fehlern
     */
    async toggleFavorite(recipeId, getAccessTokenSilently, apiBaseUrl) {
      const id = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId
      
      try {
        const token = await getAccessTokenSilently()
        
        const response = await fetch(`${apiBaseUrl}/api/favorites/toggle/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        const responseText = await response.text()
        
        if (response.ok) {
          let result
          try {
            result = JSON.parse(responseText)
          } catch (e) {
            console.error('[FavoritesStore] JSON Parse Error:', e)
            throw new Error('Ungültige Server-Antwort')
          }
          
          // Lokalen State aktualisieren
          if (result.isFavorite) {
            // Hinzugefügt
            if (!this.favoriteIds.includes(id)) {
              this.favoriteIds.push(id)
            }
          } else {
            // Entfernt
            const index = this.favoriteIds.indexOf(id)
            if (index > -1) {
              this.favoriteIds.splice(index, 1)
            }
            this.favorites = this.favorites.filter(f => f.recipeId !== id)
          }
          
          return result
        } else {
          console.error('[FavoritesStore] Toggle Error Response:', responseText)
          throw new Error(responseText || `Fehler: ${response.status}`)
        }
      } catch (e) {
        console.error('[FavoritesStore] Toggle Exception:', e)
        throw e
      }
    },
    
    /**
     * Fügt ein Rezept zur Merkliste hinzu
     * 
     * @param {number|string} recipeId - Rezept ID
     * @param {Function} getAccessTokenSilently - Auth0 Token-Funktion
     * @param {string} apiBaseUrl - Backend API URL
     * @returns {Promise<Favorite>} Erstellter Favorit
     * @throws {Error} Bei API-Fehlern
     */
    async addFavorite(recipeId, getAccessTokenSilently, apiBaseUrl) {
      const id = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId
      
      try {
        const token = await getAccessTokenSilently()
        const response = await fetch(`${apiBaseUrl}/api/favorites/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const favorite = await response.json()
          if (!this.favoriteIds.includes(id)) {
            this.favoriteIds.push(id)
          }
          this.favorites.push(favorite)
          return favorite
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Fehler beim Hinzufügen')
        }
      } catch (e) {
        console.error('[FavoritesStore] Add Error:', e)
        throw e
      }
    },
    
    /**
     * Entfernt ein Rezept aus der Merkliste
     * 
     * @param {number|string} recipeId - Rezept ID
     * @param {Function} getAccessTokenSilently - Auth0 Token-Funktion
     * @param {string} apiBaseUrl - Backend API URL
     * @returns {Promise<boolean>} true wenn erfolgreich
     * @throws {Error} Bei API-Fehlern
     */
    async removeFavorite(recipeId, getAccessTokenSilently, apiBaseUrl) {
      const id = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId
      
      try {
        const token = await getAccessTokenSilently()
        const response = await fetch(`${apiBaseUrl}/api/favorites/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const index = this.favoriteIds.indexOf(id)
          if (index > -1) {
            this.favoriteIds.splice(index, 1)
          }
          this.favorites = this.favorites.filter(f => f.recipeId !== id)
          return true
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Fehler beim Entfernen')
        }
      } catch (e) {
        console.error('[FavoritesStore] Remove Error:', e)
        throw e
      }
    },
    
    /**
     * Setzt den Store zurück (z.B. bei Logout)
     */
    clearFavorites() {
      this.favorites = []
      this.favoriteIds = []
      this.error = null
    }
  }
})