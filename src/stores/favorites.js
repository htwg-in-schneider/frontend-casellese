import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        favorites: [],           // Liste aller Favoriten mit Details
        favoriteIds: [],         // Array der Rezept-IDs für Lookups (reaktiv)
        isLoading: false,
        error: null
    }),
    
    getters: {
        // Prüft ob ein Rezept ein Favorit ist
        isFavorite: (state) => (recipeId) => {
            const id = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId
            return state.favoriteIds.includes(id)
        },
        
        // Anzahl der Favoriten
        count: (state) => state.favoriteIds.length,
        
        // Alle Favoriten sortiert nach Datum
        sortedFavorites: (state) => {
            return [...state.favorites].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            )
        }
    },
    
    actions: {
        // Alle Favoriten vom Backend laden
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
                    // IDs in Array aktualisieren
                    this.favoriteIds = this.favorites.map(f => f.recipeId)
                    console.log('Loaded favorites:', this.favorites)
                    console.log('Favorite IDs:', this.favoriteIds)
                } else {
                    this.error = `Fehler: ${response.status} ${response.statusText}`
                    console.error('Error fetching favorites:', this.error)
                }
            } catch (e) {
                this.error = e.message
                console.error('Error fetching favorites:', e)
            } finally {
                this.isLoading = false
            }
        },
        
        // Nur die IDs laden (schneller, für initiales Laden)
        async fetchFavoriteIds(getAccessTokenSilently, apiBaseUrl) {
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/favorites/ids`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                
                if (response.ok) {
                    const ids = await response.json()
                    this.favoriteIds = ids
                    console.log('Loaded favorite IDs:', this.favoriteIds)
                }
            } catch (e) {
                console.error('Error fetching favorite IDs:', e)
            }
        },
        
        // Favoriten-Status umschalten
        async toggleFavorite(recipeId, getAccessTokenSilently, apiBaseUrl) {
            const id = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId
            console.log('toggleFavorite called with ID:', id)
            
            try {
                const token = await getAccessTokenSilently()
                console.log('Got token, making request to:', `${apiBaseUrl}/api/favorites/toggle/${id}`)
                
                const response = await fetch(`${apiBaseUrl}/api/favorites/toggle/${id}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                
                console.log('Response status:', response.status)
                
                // Response-Text zuerst als Text lesen
                const responseText = await response.text()
                console.log('Response text:', responseText)
                
                if (response.ok) {
                    // Versuche JSON zu parsen
                    let result
                    try {
                        result = JSON.parse(responseText)
                    } catch (e) {
                        console.error('Failed to parse JSON:', e)
                        throw new Error('Ungültige Server-Antwort')
                    }
                    
                    console.log('Toggle result:', result)
                    
                    if (result.isFavorite) {
                        // Zu Favoriten hinzugefügt
                        if (!this.favoriteIds.includes(id)) {
                            this.favoriteIds.push(id)
                        }
                    } else {
                        // Aus Favoriten entfernt
                        const index = this.favoriteIds.indexOf(id)
                        if (index > -1) {
                            this.favoriteIds.splice(index, 1)
                        }
                        // Auch aus der Detail-Liste entfernen
                        this.favorites = this.favorites.filter(f => f.recipeId !== id)
                    }
                    
                    console.log('Updated favoriteIds:', this.favoriteIds)
                    return result
                } else {
                    console.error('Error response:', responseText)
                    throw new Error(responseText || `Fehler: ${response.status}`)
                }
            } catch (e) {
                console.error('Error toggling favorite:', e)
                throw e
            }
        },
        
        // Favorit hinzufügen
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
                console.error('Error adding favorite:', e)
                throw e
            }
        },
        
        // Favorit entfernen
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
                console.error('Error removing favorite:', e)
                throw e
            }
        },
        
        // Store zurücksetzen (z.B. beim Logout)
        clearFavorites() {
            this.favorites = []
            this.favoriteIds = []
            this.error = null
        }
    }
})