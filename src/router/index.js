// router/index.js
import { createRouter, createWebHistory } from 'vue-router'; 
import ProductCatalog from '@/views/ProductCatalog.vue';
import ProductDetail from '@/views/ProductDetail.vue';

const routes = [
  { path: '/', component: ProductCatalog },
  { 
    path: '/product/:id', 
    name: 'product',
    component: ProductDetail,
    props: true
  }
];

const router = createRouter({ 
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes,
});

export default router; 
