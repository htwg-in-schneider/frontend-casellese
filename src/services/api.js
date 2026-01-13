/**
 * @fileoverview Zentraler API-Service für Backend-Kommunikation
 * 
 * Dieser Service kapselt alle API-Aufrufe und stellt eine einheitliche
 * Schnittstelle für die Kommunikation mit dem Backend bereit.
 * 
 * @module services/api
 */

import { API_ENDPOINTS } from '@/config/constants.js'

/**
 * Basis-URL für API-Aufrufe aus Umgebungsvariablen
 * @type {string}
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

/**
 * Erstellt die Header für authentifizierte Anfragen
 * @param {string} [token] - Bearer Token für Authentifizierung
 * @returns {Object} Headers Objekt
 */
function createHeaders(token = null) {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

/**
 * Führt einen API-Aufruf durch mit einheitlicher Fehlerbehandlung
 * @param {string} endpoint - API Endpunkt (relativ)
 * @param {Object} options - Fetch Optionen
 * @returns {Promise<Object>} API Response
 * @throws {Error} Bei Netzwerk- oder Server-Fehlern
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    // Prüfe ob Response Body vorhanden ist
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return null
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

/**
 * Product API Service
 */
export const ProductService = {
  /**
   * Lädt alle Produkte mit optionalen Filtern
   * @param {Object} filters - Filter-Parameter
   * @param {string} [filters.name] - Suche nach Name
   * @param {string} [filters.category] - Filter nach Kategorie
   * @returns {Promise<Array>} Liste der Produkte
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams()
    if (filters.name) params.append('name', filters.name)
    if (filters.category) params.append('category', filters.category)
    
    const queryString = params.toString()
    const endpoint = queryString 
      ? `${API_ENDPOINTS.PRODUCTS}?${queryString}` 
      : API_ENDPOINTS.PRODUCTS
    
    return apiCall(endpoint)
  },
  
  /**
   * Lädt ein einzelnes Produkt nach ID
   * @param {number|string} id - Produkt ID
   * @returns {Promise<Object>} Produkt-Objekt
   */
  async getById(id) {
    return apiCall(`${API_ENDPOINTS.PRODUCTS}/${id}`)
  },
  
  /**
   * Erstellt ein neues Produkt (Admin)
   * @param {Object} product - Produkt-Daten
   * @param {string} token - Auth Token
   * @returns {Promise<Object>} Erstelltes Produkt
   */
  async create(product, token) {
    return apiCall(API_ENDPOINTS.PRODUCTS, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(product)
    })
  },
  
  /**
   * Aktualisiert ein Produkt (Admin)
   * @param {number|string} id - Produkt ID
   * @param {Object} product - Aktualisierte Produkt-Daten
   * @param {string} token - Auth Token
   * @returns {Promise<Object>} Aktualisiertes Produkt
   */
  async update(id, product, token) {
    return apiCall(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(product)
    })
  },
  
  /**
   * Löscht ein Produkt (Admin)
   * @param {number|string} id - Produkt ID
   * @param {string} token - Auth Token
   * @returns {Promise<void>}
   */
  async delete(id, token) {
    return apiCall(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE',
      headers: createHeaders(token)
    })
  }
}

/**
 * Category API Service
 */
export const CategoryService = {
  /**
   * Lädt alle Kategorien mit Übersetzungen
   * @returns {Promise<Array>} Liste der Kategorien
   */
  async getAll() {
    return apiCall(API_ENDPOINTS.CATEGORIES)
  }
}

/**
 * User/Profile API Service
 */
export const UserService = {
  /**
   * Lädt das Profil des aktuell eingeloggten Users
   * @param {string} token - Auth Token
   * @returns {Promise<Object>} User-Profil
   */
  async getProfile(token) {
    return apiCall(API_ENDPOINTS.PROFILE, {
      headers: createHeaders(token)
    })
  },
  
  /**
   * Lädt alle User (Admin)
   * @param {string} token - Auth Token
   * @returns {Promise<Array>} Liste aller User
   */
  async getAll(token) {
    return apiCall(API_ENDPOINTS.USERS, {
      headers: createHeaders(token)
    })
  },
  
  /**
   * Aktualisiert einen User (Admin)
   * @param {number|string} id - User ID
   * @param {Object} userData - Aktualisierte User-Daten
   * @param {string} token - Auth Token
   * @returns {Promise<Object>} Aktualisierter User
   */
  async update(id, userData, token) {
    return apiCall(`${API_ENDPOINTS.USERS}/${id}`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(userData)
    })
  }
}

/**
 * Favorites API Service
 */
export const FavoritesService = {
  /**
   * Lädt alle Favoriten des Users
   * @param {string} token - Auth Token
   * @returns {Promise<Array>} Liste der Favoriten
   */
  async getAll(token) {
    return apiCall(API_ENDPOINTS.FAVORITES, {
      headers: createHeaders(token)
    })
  },
  
  /**
   * Lädt nur die IDs der Favoriten (schneller)
   * @param {string} token - Auth Token
   * @returns {Promise<Array>} Liste der Favoriten-IDs
   */
  async getIds(token) {
    return apiCall(API_ENDPOINTS.FAVORITES_IDS, {
      headers: createHeaders(token)
    })
  },
  
  /**
   * Schaltet Favoriten-Status um (Toggle)
   * @param {number|string} recipeId - Rezept ID
   * @param {string} token - Auth Token
   * @returns {Promise<Object>} Toggle-Ergebnis mit isFavorite Status
   */
  async toggle(recipeId, token) {
    return apiCall(`${API_ENDPOINTS.FAVORITES_TOGGLE}/${recipeId}`, {
      method: 'POST',
      headers: createHeaders(token)
    })
  },
  
  /**
   * Fügt einen Favoriten hinzu
   * @param {number|string} recipeId - Rezept ID
   * @param {string} token - Auth Token
   * @returns {Promise<Object>} Erstellter Favorit
   */
  async add(recipeId, token) {
    return apiCall(`${API_ENDPOINTS.FAVORITES}/${recipeId}`, {
      method: 'POST',
      headers: createHeaders(token)
    })
  },
  
  /**
   * Entfernt einen Favoriten
   * @param {number|string} recipeId - Rezept ID
   * @param {string} token - Auth Token
   * @returns {Promise<void>}
   */
  async remove(recipeId, token) {
    return apiCall(`${API_ENDPOINTS.FAVORITES}/${recipeId}`, {
      method: 'DELETE',
      headers: createHeaders(token)
    })
  }
}

export default {
  ProductService,
  CategoryService,
  UserService,
  FavoritesService,
  API_BASE_URL
}