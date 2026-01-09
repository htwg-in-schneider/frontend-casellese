// src/stores/favorites.js
import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        favoriteIds: [],      // Nur IDs für schnelle Checks
        favorites: [],        // Vollständige Produkt-Objekte
        isLoading: false,
        error: null
    }),

    getters: {
        isFavorite: (state) => (productId) => {
            return state.favoriteIds.includes(productId)
        },
        favoriteCount: (state) => state.favoriteIds.length
    },

    actions: {
        async fetchFavoriteIds(getAccessTokenSilently, apiBaseUrl) {
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/favorites/ids`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (response.ok) {
                    this.favoriteIds = await response.json()
                }
            } catch (e) {
                console.error('Error fetching favorite IDs:', e)
            }
        },

        async fetchFavorites(getAccessTokenSilently, apiBaseUrl) {
            this.isLoading = true
            this.error = null
            
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (response.ok) {
                    this.favorites = await response.json()
                    this.favoriteIds = this.favorites.map(f => f.id)
                } else {
                    this.error = 'Fehler beim Laden der Favoriten'
                }
            } catch (e) {
                this.error = e.message
            } finally {
                this.isLoading = false
            }
        },

        async toggleFavorite(productId, getAccessTokenSilently, apiBaseUrl) {
            const isFav = this.favoriteIds.includes(productId)
            
            try {
                const token = await getAccessTokenSilently()
                const method = isFav ? 'DELETE' : 'POST'
                
                const response = await fetch(`${apiBaseUrl}/api/favorites/${productId}`, {
                    method,
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (response.ok) {
                    if (isFav) {
                        this.favoriteIds = this.favoriteIds.filter(id => id !== productId)
                        this.favorites = this.favorites.filter(f => f.id !== productId)
                    } else {
                        this.favoriteIds.push(productId)
                    }
                    return true
                }
                return false
            } catch (e) {
                console.error('Error toggling favorite:', e)
                return false
            }
        },

        clearFavorites() {
            this.favoriteIds = []
            this.favorites = []
            this.error = null
        }
    }
})