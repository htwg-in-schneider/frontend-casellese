<script setup>
import ProductCard from '@/components/ProductCard.vue';

import { products } from '@/data.js';

function getProducts() {
  return products;
}
</script>

<template>
  <div class="container py-4">
    <div class="row g-4">
      <div v-for="product in getProducts()" :key="product.id" class="col-md-4">
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>