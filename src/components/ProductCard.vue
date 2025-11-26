<script setup>
import Button from '@/components/Button.vue';

defineProps({
  product: {
    type: Object,
    required: true,
  }
});

function showAlert(recipe) { // Parameter wurde von description zu recipe geändert
  alert(recipe);
}
</script>

<template>
  <div class="card h-100 shadow-sm rounded-5">
    <img :src="product.imageUrl" class="card-img-top" :alt="product.title">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ product.title }}</h5>
      <p class="card-text text-accent">{{ product.description }} </p>
      <p v-if="false" class="card-text text-accent fw-bold">{{ product.price }} €</p>
      <Button variant="accent" class="mt-auto" :onClick="() => showAlert(product.recipe)">
        Rezept
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>