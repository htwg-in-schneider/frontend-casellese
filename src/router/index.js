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
import AGBView from '../views/Agbview.vue';
import DatenschutzView from '../views/Datenschutzview.vue';
import WiderrufView from '../views/WiderrufView.vue';
import VersandView from '../views/Versandview.vue';
import TeamView from '@/views/TeamView.vue';

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

  // Geschützte Routen (erfordern Login)
  {
    path: '/product/create',
    name: 'create-product',
    component: CreateProduct,
    beforeEnter: authGuard  // Nur eingeloggte User
  },
  {
    path: '/product/edit/:id',
    name: 'edit-product',
    component: EditProduct,
    beforeEnter: authGuard  // Nur eingeloggte User
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: authGuard  // Nur eingeloggte User
  }
];

const router = createRouter({ 
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes,
});

export default router;


