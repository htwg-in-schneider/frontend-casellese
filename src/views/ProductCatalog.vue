<script setup>
import ProductCard from '@/components/ProductCard.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';

const route = useRoute();
const { isAuthenticated, getAccessTokenSilently } = useAuth0();

const products = ref([]);
const isLoading = ref(true);
const error = ref('');
const isAdmin = ref(false);

const url = `${import.meta.env.VITE_API_BASE_URL}/api/product`;

// Admin-Check
async function checkAdminRole() {
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      isAdmin.value = data.role === 'ADMIN';
    }
  } catch (error) {
    console.error('Error checking admin role:', error);
  }
}

// Produkte mit Filtern laden
async function fetchProducts(filters = {}) {
  try {
    isLoading.value = true;
    error.value = '';
    
    // URL mit Query-Parametern bauen
    const params = new URLSearchParams();
    if (filters.name) {
      params.append('name', filters.name);
    }
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    const response = await fetch(`${url}?${params.toString()}`);
    
    if (response.ok) {
      products.value = await response.json();
      console.log('Loaded products:', products.value);
    } else {
      error.value = `Fehler beim Laden der Produkte: ${response.status} ${response.statusText}`;
    }
  } catch (e) {
    error.value = `Fehler beim Laden der Produkte: ${e.message}`;
    console.error('Could not fetch products:', e);
  } finally {
    isLoading.value = false;
  }
}

// Handler für Filter-Event vom ProductFilter
function handleFilter(filterData) {
  console.log('Filter received:', filterData);
  fetchProducts(filterData);
}

// Bei Kategorie-Änderung in der URL auch filtern
watch(() => route.query.category, (newCategory) => {
  fetchProducts({ category: newCategory });
});

// Admin-Status prüfen wenn authentifiziert
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    checkAdminRole();
  }
});

onMounted(() => {
  fetchProducts({ category: route.query.category });
  if (isAuthenticated.value) {
    checkAdminRole();
  }
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
  
  <!-- Search and Filter -->
  <div class="container">
    <ProductFilter @filter="handleFilter" />
  </div>
  
  <!-- Loading State -->
  <div v-if="isLoading" class="container py-4 text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Lade Produkte...</span>
    </div>
    <p class="mt-2">Lade Produkte...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="container py-4">
    <div class="alert alert-danger text-center">
      {{ error }}
    </div>
  </div>

  <!-- Empty State -->
  <div v-else-if="products.length === 0" class="container py-4">
    <div class="alert alert-info text-center">
      <h5>Keine Produkte gefunden</h5>
      <p class="mb-0">Versuche es mit anderen Suchbegriffen oder Filtern.</p>
    </div>
  </div>

  <!-- Product Grid -->
  <div v-else class="container py-4">
    <div class="row g-4">
      <div v-for="product in products" :key="product.id" class="col-md-4">
        <ProductCard :product="product" :show-edit-button="isAdmin" />
      </div>
    </div>
  </div>

  <!-- Admin: Neues Produkt Button -->
  <div v-if="isAdmin" class="container py-4">
    <div class="row justify-content-center">
      <div class="col-md-4 text-center">
        <router-link to="/product/create" class="btn btn-accent btn-lg">
          + Neues Produkt erstellen
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>