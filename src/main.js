/**
 * @fileoverview Vue Application Bootstrap
 * 
 * Initialisiert die Vue 3 Applikation mit:
 * - Vue Router für Navigation
 * - Pinia für State Management
 * - Auth0 für Authentifizierung
 * - Custom Directives
 * 
 * @module main
 */

import './assets/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'

// ============================================
// PINIA STORE
// ============================================
const pinia = createPinia()

// ============================================
// AUTH0 KONFIGURATION
// ============================================

/**
 * Auth0 Plugin Konfiguration
 * Verwendet Umgebungsvariablen für Domain, Client ID und Audience
 */
const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        // Redirect zurück zur aktuellen Seite nach Login
        redirect_uri: window.location.origin + window.location.pathname
    }
})

// ============================================
// VUE APP INSTANZ
// ============================================
const app = createApp(App)

// ============================================
// CUSTOM DIRECTIVES
// ============================================

/**
 * v-click-outside Direktive
 * Erkennt Klicks außerhalb eines Elements (z.B. für Dropdowns)
 * 
 * @example
 * <div v-click-outside="closeDropdown">
 *   Dropdown Content
 * </div>
 */
app.directive('click-outside', {
    /**
     * Registriert Event Listener beim Mounten
     * @param {HTMLElement} el - Das Element
     * @param {Object} binding - Direktiven-Binding mit Value (Callback)
     */
    mounted(el, binding) {
        el._clickOutside = (event) => {
            // Prüfe ob Klick außerhalb des Elements war
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event)
            }
        }
        document.addEventListener('click', el._clickOutside)
    },
    
    /**
     * Entfernt Event Listener beim Unmounten
     * @param {HTMLElement} el - Das Element
     */
    unmounted(el) {
        document.removeEventListener('click', el._clickOutside)
    }
})

// ============================================
// PLUGINS REGISTRIEREN
// ============================================
app.use(router)
    .use(pinia)
    .use(auth0)
    .mount('#app')

// ============================================
// DEBUG (nur Development)
// ============================================
if (import.meta.env.DEV) {
    console.log('[Ricetti] API Base URL:', import.meta.env.VITE_API_BASE_URL)
    console.log('[Ricetti] Auth0 Domain:', import.meta.env.VITE_AUTH0_DOMAIN)
}
