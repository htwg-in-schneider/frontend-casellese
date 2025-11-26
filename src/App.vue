<script setup>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';
import ProductCard from './components/ProductCard.vue';

import { products } from './data.js';

function getProducts() {
  return products;
}

</script>

<template>
  <!-- Navbar -->
  <Navbar />

  <!-- Category Header -->
  <section class="py-5 text-center">
      <div class="container">
          <div class="text-center mb-3">
              <h2 class="fw-bold display-5">Rezepte</h2>
              <p class="lead text-secondary">Wo Tradition, Liebe und reine Zutaten zusammenfinden</p>
          </div>
      </div>
  </section>

  <!-- Product Grid -->
  <div class="container py-4">
    <div class="row g-4">
      <!-- Product Card -->
      <div v-for="product in getProducts()" :key="product.id" class="col-md-4">
        <ProductCard :product="product" />
      </div>
    </div>
  </div>

  <!-- Footer -->
  <Footer />
</template>
<style scoped>

</style>