// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@auth0/auth0-vue'
import ProductCatalog from '@/views/ProductCatalog.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  { path: '/', component: ProductCatalog },
  { 
    path: '/product/:id', 
    name: 'product',
    component: ProductDetail,
    props: true
  },
  {
    path: '/profile',
    component: Profile,
    beforeEnter: authGuard  // Geschützte Route - erfordert Login
  }
];

const router = createRouter({ 
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes,
});

export default router;
