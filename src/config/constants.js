/**
 * @fileoverview Zentrale Konfigurationsdatei für Konstanten
 * 
 * Diese Datei enthält alle hartcodierten Werte der Applikation,
 * um sie zentral verwalten und dokumentieren zu können.
 * 
 * @module config/constants
 */

/**
 * Farbpalette der Applikation (Styletile)
 * Verwendet für konsistentes Branding
 */
export const COLORS = {
  /** Primärfarbe (Rot) - für Akzente, CTAs, wichtige Elemente */
  PRIMARY: '#e54c4c',
  /** Primärfarbe Hover/Active */
  PRIMARY_HOVER: '#d43c3c',
  /** Primärfarbe Active/Pressed */
  PRIMARY_ACTIVE: '#c43030',
  /** Hintergrund Weiß */
  WHITE: '#ffffff',
  /** Hintergrund Hellgrau */
  LIGHT_GRAY: '#f0f0f0',
  /** Border/Trennlinien Grau */
  BORDER_GRAY: '#c9c9c9',
  /** Text Schwarz */
  TEXT_BLACK: '#000000'
}

/**
 * Externe Asset URLs (GitHub Pages Hosting)
 * Alle Bilder werden extern gehostet für bessere Performance
 */
export const ASSETS = {
  /** Basis-URL für alle Assets */
  BASE_URL: 'https://nucccio.github.io/casellese-images',
  
  /** Logo der Applikation */
  LOGO: 'https://nucccio.github.io/casellese-images/logo_ricetti.webp',
  
  /** Hero Banner Hintergrundbild */
  HERO_BANNER: 'https://nucccio.github.io/casellese-images/banner_ricetti_in_pittari.webp',
  
  /** Platzhalter für fehlende Bilder */
  PLACEHOLDER: 'https://nucccio.github.io/casellese-images/placeholder.webp',
  
  /** Feature Icons für Homepage */
  ICONS: {
    WHEAT: 'https://nucccio.github.io/casellese-images/weizen-icon.png',
    CHEF: 'https://nucccio.github.io/casellese-images/koch-icon.png',
    HEART: 'https://nucccio.github.io/casellese-images/liebe-icon.png'
  }
}

/**
 * Timing-Konstanten für Animationen und Timeouts
 */
export const TIMING = {
  /** Erfolgs-/Fehlermeldungen automatisch ausblenden (ms) */
  MESSAGE_TIMEOUT: 3000,
  /** Admin Guard - Max. Wartezeit auf Profil-Laden (ms) */
  ADMIN_GUARD_TIMEOUT: 2000,
  /** Admin Guard - Polling Intervall (ms) */
  ADMIN_GUARD_INTERVAL: 100,
  /** Debounce für Suchfeld (ms) */
  SEARCH_DEBOUNCE: 300,
  /** Scroll-Animation Dauer */
  SCROLL_BEHAVIOR: 'smooth'
}

/**
 * Benutzerrollen
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR'
}

/**
 * Kategorien für Produkte/Rezepte
 * Entspricht dem Backend: de.htwg.in.wete.backend.model.Category
 */
export const CATEGORIES = {
  BROT: 'BROT',
  SALAMI: 'SALAMI',
  KAESE: 'KAESE'
}

/**
 * Kategorie-Übersetzungen für die UI
 */
export const CATEGORY_LABELS = {
  BROT: 'Brot',
  SALAMI: 'Salami',
  KAESE: 'Käse'
}

/**
 * Pagination-Einstellungen
 */
export const PAGINATION = {
  /** Anzahl Featured Rezepte auf der Homepage */
  FEATURED_RECIPES: 3,
  /** Standard-Seitengröße für Listen */
  DEFAULT_PAGE_SIZE: 12
}

/**
 * API Endpunkte (relativ zur Base URL)
 */
export const API_ENDPOINTS = {
  PRODUCTS: '/api/product',
  CATEGORIES: '/api/category',
  PROFILE: '/api/profile',
  USERS: '/api/users',
  FAVORITES: '/api/favorites',
  FAVORITES_TOGGLE: '/api/favorites/toggle',
  FAVORITES_IDS: '/api/favorites/ids'
}

/**
 * LocalStorage Keys
 */
export const STORAGE_KEYS = {
  BANNER_HIDDEN: 'ricetti_banner_hidden',
  CART: 'ricetti_cart'
}

export default {
  COLORS,
  ASSETS,
  TIMING,
  ROLES,
  CATEGORIES,
  CATEGORY_LABELS,
  PAGINATION,
  API_ENDPOINTS,
  STORAGE_KEYS
}
