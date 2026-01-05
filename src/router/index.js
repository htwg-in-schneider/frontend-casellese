// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@auth0/auth0-vue';
import ProductCatalog from '@/views/ProductCatalog.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import CreateProduct from '@/views/CreateProduct.vue';
import EditProduct from '@/views/EditProduct.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  // Öffentliche Routen
  { 
    path: '/', 
    component: ProductCatalog 
  },
  { 
    path: '/product/:id', 
    name: 'product',
    component: ProductDetail,
    props: true
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
