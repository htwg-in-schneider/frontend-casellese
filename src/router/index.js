/**
 * @fileoverview Vue Router Konfiguration
 * 
 * Definiert alle Routen der Applikation mit:
 * - Lazy Loading für bessere Performance
 * - Navigation Guards für Authentifizierung
 * - Rollenbasierte Zugriffskontrolle (Admin)
 * 
 * @module router
 */

import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'
import { useUserStore } from '@/stores/user'
import { TIMING } from '@/config/constants'

// ============================================
// EAGER LOADED VIEWS (Kritisch für First Load)
// ============================================
import HomeView from '@/views/HomeView.vue'

// ============================================
// LAZY LOADED VIEWS (Code-Splitting)
// Werden erst geladen wenn die Route besucht wird
// ============================================

/**
 * Lädt die Rezept-Übersichtsseite
 * @returns {Promise<Component>}
 */
const ProductCatalog = () => import('@/views/ProductCatalog.vue')

/**
 * Lädt die Rezept-Detailseite
 * @returns {Promise<Component>}
 */
const ProductDetail = () => import('@/views/ProductDetail.vue')

/**
 * Lädt die Kontaktseite
 * @returns {Promise<Component>}
 */
const KontaktView = () => import('@/views/KontaktView.vue')

// Rechtliche Seiten (Footer)
const AGBView = () => import('@/views/AGBView.vue')
const DatenschutzView = () => import('@/views/DatenschutzView.vue')
const WiderrufView = () => import('@/views/WiderrufView.vue')
const VersandView = () => import('@/views/VersandView.vue')
const ImpressumView = () => import('@/views/ImpressumView.vue')

// Informationsseiten
const TeamView = () => import('@/views/TeamView.vue')
const NewsletterView = () => import('@/views/NewsletterView.vue')
const AboutView = () => import('@/views/AboutView.vue')

// Geschützte Seiten (erfordern Login)
const FavoritesView = () => import('@/views/FavoritesView.vue')
const Profile = () => import('@/views/Profile.vue')

// Admin-Seiten (erfordern Login + Admin-Rolle)
const CreateProduct = () => import('@/views/CreateProduct.vue')
const EditProduct = () => import('@/views/EditProduct.vue')
const AdminUsersView = () => import('@/views/AdminUsersView.vue')
const AdminFavoritesView = () => import('@/views/AdminFavoritesView.vue')


// ============================================
// NAVIGATION GUARDS
// ============================================

/**
 * Admin Guard: Prüft ob User eingeloggt UND Admin ist
 * 
 * Workflow:
 * 1. Führt erst den Auth0 authGuard aus (Login-Check)
 * 2. Prüft dann den Admin-Status aus dem User Store
 * 3. Wartet ggf. bis das Profil geladen ist
 * 
 * @param {Object} to - Ziel-Route
 * @returns {Promise<boolean|Object>} true wenn erlaubt, sonst Redirect
 */
const adminGuard = async (to) => {
  // Schritt 1: Auth0 Login-Check
  const authResult = await authGuard(to)
  if (authResult === false) {
    return false // Nicht eingeloggt -> Auth0 Login Redirect
  }
  
  // Schritt 2: Admin-Status prüfen
  const userStore = useUserStore()
  
  // Warte auf Profil-Laden (max. 2 Sekunden)
  const maxAttempts = TIMING.ADMIN_GUARD_TIMEOUT / TIMING.ADMIN_GUARD_INTERVAL
  let attempts = 0
  
  while (userStore.isLoading && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, TIMING.ADMIN_GUARD_INTERVAL))
    attempts++
  }
  
  // Schritt 3: Zugriff prüfen
  if (!userStore.isAdmin) {
    alert('Zugriff verweigert. Nur Administratoren haben Zugriff auf diese Seite.')
    return { name: 'home' }
  }
  
  return true
}


// ============================================
// ROUTEN-DEFINITION
// ============================================

/**
 * @typedef {Object} RouteConfig
 * @property {string} path - URL-Pfad
 * @property {string} [name] - Eindeutiger Routen-Name
 * @property {Component|Function} component - Vue Component (eager oder lazy)
 * @property {boolean} [props] - Route-Params als Props übergeben
 * @property {Function} [beforeEnter] - Navigation Guard
 * @property {Object} [meta] - Zusätzliche Meta-Daten
 */

/** @type {RouteConfig[]} */
const routes = [
  // ----------------------------------------
  // ÖFFENTLICHE ROUTEN
  // Ohne Authentifizierung zugänglich
  // ----------------------------------------
  { 
    path: '/', 
    name: 'home',
    component: HomeView,
    meta: { 
      title: 'Ricetti in Pittari - Traditionelle Rezepte',
      description: 'Entdecken Sie authentische italienische Rezepte aus Caselle in Pittari'
    }
  },
  { 
    path: '/rezepte', 
    name: 'rezepte',
    component: ProductCatalog,
    meta: { title: 'Rezepte - Ricetti in Pittari' }
  },
  { 
    path: '/kontakt', 
    name: 'kontakt',
    component: KontaktView,
    meta: { title: 'Kontakt - Ricetti in Pittari' }
  },
  { 
    path: '/product/:id', 
    name: 'product',
    component: ProductDetail,
    props: true,
    meta: { title: 'Rezept Details - Ricetti in Pittari' }
  },
  
  // ----------------------------------------
  // RECHTLICHE SEITEN (Footer-Links)
  // ----------------------------------------
  {
    path: '/agb',
    name: 'agb',
    component: AGBView,
    meta: { title: 'AGB - Ricetti in Pittari' }
  },
  {
    path: '/datenschutz',
    name: 'datenschutz',
    component: DatenschutzView,
    meta: { title: 'Datenschutz - Ricetti in Pittari' }
  },
  {
    path: '/widerruf',
    name: 'widerruf',
    component: WiderrufView,
    meta: { title: 'Widerruf - Ricetti in Pittari' }
  },
  {
    path: '/versand',
    name: 'versand',
    component: VersandView,
    meta: { title: 'Versand & Lieferung - Ricetti in Pittari' }
  },
  {
    path: '/impressum',
    name: 'impressum',
    component: ImpressumView,
    meta: { title: 'Impressum - Ricetti in Pittari' }
  },
  
  // ----------------------------------------
  // INFORMATIONSSEITEN
  // ----------------------------------------
  {
    path: '/team',
    name: 'team',
    component: TeamView,
    meta: { title: 'Unser Team - Ricetti in Pittari' }
  },
  {
    path: '/newsletter',
    name: 'newsletter',
    component: NewsletterView,
    meta: { title: 'Newsletter - Ricetti in Pittari' }
  },
  {
    path: '/ueber-uns',
    name: 'about',
    component: AboutView,
    meta: { title: 'Über uns - Ricetti in Pittari' }
  },

  // ----------------------------------------
  // GESCHÜTZTE ROUTEN (erfordern Login)
  // ----------------------------------------
  {
    path: '/merkliste',
    name: 'favorites',
    component: FavoritesView,
    beforeEnter: authGuard,
    meta: { 
      title: 'Meine Merkliste - Ricetti in Pittari',
      requiresAuth: true 
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: authGuard,
    meta: { 
      title: 'Mein Profil - Ricetti in Pittari',
      requiresAuth: true 
    }
  },
  
  // ----------------------------------------
  // ADMIN-ROUTEN (erfordern Login + Admin)
  // ----------------------------------------
  {
    path: '/product/create',
    name: 'create-product',
    component: CreateProduct,
    beforeEnter: adminGuard,
    meta: { 
      title: 'Neues Rezept erstellen - Admin',
      requiresAuth: true,
      requiresAdmin: true 
    }
  },
  {
    path: '/product/edit/:id',
    name: 'edit-product',
    component: EditProduct,
    beforeEnter: adminGuard,
    meta: { 
      title: 'Rezept bearbeiten - Admin',
      requiresAuth: true,
      requiresAdmin: true 
    }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsersView,
    beforeEnter: adminGuard,
    meta: { 
      title: 'Nutzerverwaltung - Admin',
      requiresAuth: true,
      requiresAdmin: true 
    }
  },
  {
    path: '/admin/favorites',
    name: 'admin-favorites',
    component: AdminFavoritesView,
    beforeEnter: adminGuard,
    meta: { 
      title: 'Alle Favoriten - Admin',
      requiresAuth: true,
      requiresAdmin: true 
    }
  }
]


// ============================================
// ROUTER INSTANZ
// ============================================

/**
 * Vue Router Instanz mit HTML5 History Mode
 * 
 * Features:
 * - Scroll-Wiederherstellung bei Browser-Navigation
 * - Smooth Scroll zu Seitenanfang bei Routenwechsel
 */
const router = createRouter({ 
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes,
  
  /**
   * Scroll-Verhalten bei Navigation
   * @param {Object} to - Ziel-Route
   * @param {Object} from - Ausgangs-Route  
   * @param {Object|null} savedPosition - Gespeicherte Scroll-Position
   * @returns {Object} Scroll-Position
   */
  scrollBehavior(to, from, savedPosition) {
    // Bei Browser Zurück/Vorwärts: Gespeicherte Position wiederherstellen
    if (savedPosition) {
      return savedPosition
    }
    // Sonst: Smooth Scroll nach oben
    return { top: 0, behavior: TIMING.SCROLL_BEHAVIOR }
  }
})

// ============================================
// GLOBALE NAVIGATION GUARDS
// ============================================

/**
 * After-Each Hook: Setzt den Dokumententitel
 */
router.afterEach((to) => {
  // Setze Dokumententitel aus Meta-Daten
  const title = to.meta?.title || 'Ricetti in Pittari'
  document.title = title
})

export default router


