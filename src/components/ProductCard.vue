<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  }
});

function showAlert(description) {
  alert(description);
}
</script>

<template>
  <!-- Product Card -->
      <div v-for="product in getProducts()" :key="product.id" class="col-md-4">
        <div class="card h-100 shadow-sm rounded-5">
          <img :src="product.imageUrl" class="card-img-top" alt="Produktbild">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.title }}</h5>
            <p class="card-text text-accent">{{ product.description }} </p>
            <p v-if="false" class="card-text text-accent fw-bold">{{ product.price }} €</p> <!-- Preis bleibt hidden: v-if="false" -->
            <a class="btn btn-accent mt-auto" @click.prevent="showAlert(product.recipe)">
              Rezept
            </a>
          </div>
        </div>
      </div>
</template>

<style scoped>
/* Button styled to the requested color */
.btn-accent {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: #ffffff;
  text-decoration: none;
}

/* Slightly darker on hover/focus for affordance */
.btn-accent:hover,
.btn-accent:focus {
  background-color: #d44444;
  border-color: #d44444;
  color: #ffffff;
  text-decoration: none;
}

/* Active state */
.btn-accent:active {
  background-color: #c43b3b;
  border-color: #c43b3b;
  color: #ffffff;
}

/* Ensure anchor acting as button has the expected cursor */
.btn-accent {
  cursor: pointer;
}
</style>