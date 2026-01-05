<script setup>
import ProductCard from '@/components/ProductCard.vue';
import { ref, onMounted } from 'vue';

const products = ref([]);
const isLoading = ref(true);
const error = ref('');

async function fetchProducts() {
  try {
    isLoading.value = true;
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product`); //Tippfehler behoben
    
    if (response.ok) {
      products.value = await response.json();
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

  <!-- Product Grid -->
  <div v-else class="container py-4">
    <div class="row g-4">
      <div v-for="product in products" :key="product.id" class="col-md-4">
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
