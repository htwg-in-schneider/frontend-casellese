<script setup>
import { ref, onMounted } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import ProductFilter from '@/components/ProductFilter.vue';

// Reactive state
const products = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentFilter = ref({ name: '', category: '' });

/**
 * Fetches products from the backend API with optional filter parameters
 * @param {Object} filter - Filter parameters { name: string, category: string }
 */
async function fetchProducts(filter = {}) {
  isLoading.value = true;
  error.value = null;
  
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
    
    // Build query parameters
    const params = new URLSearchParams();
    if (filter.name && filter.name.trim()) {
      params.append('name', filter.name.trim());
    }
    if (filter.category && filter.category.trim()) {
      params.append('category', filter.category.trim());
    }
    
    // Construct URL with query parameters
    const queryString = params.toString();
    const url = queryString 
      ? `${apiBaseUrl}/api/product?${queryString}`
      : `${apiBaseUrl}/api/product`;
    
    console.log('Fetching products from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    products.value = data;
    
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = 'Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.';
    products.value = [];
  } finally {
    isLoading.value = false;
  }
}

/**
 * Handles filter events from ProductFilter component
 * @param {Object} filter - Filter parameters from child component
 */
function handleFilter(filter) {
  currentFilter.value = filter;
  fetchProducts(filter);
}

// Fetch all products on component mount
onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <!-- Category Header -->
  <section class="py-5 text-center">
    <div class="container">
      <div class="text-center mb-3">
        <h2 class="fw-bold display-5">Rezepte</h2>
        <p class="lead text-secondary">Wo Tradition, Liebe und reine Zutaten zusammenfinden</p>
      </div>
    </div>
  </section>
  
  <!-- Product Filter -->
  <div class="container">
    <ProductFilter @filter="handleFilter" />
  </div>
  
  <!-- Loading State -->
  <div v-if="isLoading" class="container py-4">
    <div class="text-center py-5">
      <div class="spinner-border text-accent" role="status">
        <span class="visually-hidden">Laden...</span>
      </div>
      <p class="mt-3 text-secondary">Produkte werden geladen...</p>
    </div>
  </div>
  
  <!-- Error State -->
  <div v-else-if="error" class="container py-4">
    <div class="alert alert-danger rounded-4" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
    </div>
  </div>
  
  <!-- Empty State -->
  <div v-else-if="products.length === 0" class="container py-4">
    <div class="text-center py-5">
      <i class="bi bi-search display-1 text-secondary opacity-50"></i>
      <h4 class="mt-3 text-secondary">Keine Produkte gefunden</h4>
      <p class="text-muted">
        Versuchen Sie es mit anderen Suchbegriffen oder setzen Sie den Filter zurück.
      </p>
    </div>
  </div>
  
  <!-- Product Grid -->
  <div v-else class="container py-4">
    <div class="row g-4">
      <div v-for="product in products" :key="product.id" class="col-md-4">
        <ProductCard :product="product" />
      </div>
    </div>
    
    <!-- Results count -->
    <div class="text-center mt-4 text-secondary">
      <small>{{ products.length }} Produkt(e) gefunden</small>
    </div>
  </div>
</template>

<style scoped>
.spinner-border.text-accent {
  color: #e54c4c !important;
}

.alert-danger {
  background-color: #fff5f5;
  border-color: #fecaca;
  color: #dc2626;
}
</style>
