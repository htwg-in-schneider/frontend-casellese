// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@auth0/auth0-vue';
import HomeView from '../views/HomeView.vue';
import ProductCatalog from '../views/ProductCatalog.vue';
import ProductDetail from '../views/ProductDetail.vue';
import CreateProduct from '../views/CreateProduct.vue';
import EditProduct from '../views/EditProduct.vue';
import Profile from '../views/Profile.vue';
import KontaktView from '../views/KontaktView.vue';
import AGBView from '../views/AGBView.vue';
import DatenschutzView from '../views/DatenschutzView.vue';
import WiderrufView from '../views/WiderrufView.vue';
import VersandView from '../views/VersandView.vue';
import TeamView from '@/views/TeamView.vue';
import NewsletterView from '@/views/NewsletterView.vue';
import AboutView from '@/views/AboutView.vue';
import FavoritesView from '@/views/FavoritesView.vue'
import { useUserStore } from '@/stores/user';

// Admin Guard: Prüft ob User eingeloggt UND Admin ist
const adminGuard = async (to) => {
  // Erst den normalen Auth-Guard ausführen
  const authResult = await authGuard(to);
  if (authResult === false) {
    return false; // Nicht eingeloggt -> Auth0 Login
  }
  
  // Prüfe Admin-Status aus dem Store
  const userStore = useUserStore();
  
  // Warte kurz, falls das Profil noch lädt
  let attempts = 0;
  while (userStore.isLoading && attempts < 20) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (!userStore.isAdmin) {
    alert('Zugriff verweigert. Nur Administratoren haben Zugriff auf diese Seite.');
    return { name: 'home' }; // Zur Startseite umleiten
  }
  
  return true;
};

const routes = [
  // Öffentliche Routen
  { 
    path: '/', 
    name: 'home',
    component: HomeView 
  },
  { 
    path: '/rezepte', 
    name: 'rezepte',
    component: ProductCatalog 
  },
  { 
    path: '/kontakt', 
    name: 'kontakt',
    component: KontaktView 
  },
  { 
    path: '/product/:id', 
    name: 'product',
    component: ProductDetail,
    props: true
  },
  
  // Rechtliche Seiten (Footer-Links)
  {
    path: '/agb',
    name: 'agb',
    component: AGBView
  },
  {
    path: '/datenschutz',
    name: 'datenschutz',
    component: DatenschutzView
  },
  {
    path: '/widerruf',
    name: 'widerruf',
    component: WiderrufView
  },
  {
    path: '/versand',
    name: 'versand',
    component: VersandView
  },
  {
    path: '/team',
    name: 'team',
    component: TeamView
  },
  {
    path: '/newsletter',
    name: 'newsletter',
    component: NewsletterView
  },
  {
    path: '/ueber-uns',
    name: 'about',
    component: AboutView
  },
  {
  path: '/favoriten',
  name: 'favorites',
  component: FavoritesView
  },

  // Geschützte Routen (erfordern Login)
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: authGuard  // Nur eingeloggte User
  },
  
  // Admin-Routen (erfordern Login UND Admin-Rolle)
  {
    path: '/product/create',
    name: 'create-product',
    component: CreateProduct,
    beforeEnter: adminGuard  // Nur Admins
  },
  {
    path: '/product/edit/:id',
    name: 'edit-product',
    component: EditProduct,
    beforeEnter: adminGuard  // Nur Admins
  }
];

const router = createRouter({ 
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes,
  // Bei jedem Seitenwechsel nach oben scrollen
  scrollBehavior(to, from, savedPosition) {
    // Wenn der User den Zurück-Button nutzt, zur gespeicherten Position
    if (savedPosition) {
      return savedPosition;
    }
    // Ansonsten immer nach oben scrollen
    return { top: 0, behavior: 'smooth' };
  }
});

export default router;

