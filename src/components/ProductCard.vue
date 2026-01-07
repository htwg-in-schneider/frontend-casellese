<script setup>
import { defineProps } from 'vue';

defineProps({
    product: {
        type: Object,
        required: true,
    },
    showEditButton: {
        type: Boolean,
        default: false,
    }
});
</script>

<template>
  <div class="card h-100 rounded-5">
    <router-link 
      :to="{ name: 'product', params: { id: product.id } }" 
      class="text-decoration-none" 
    >
      <img 
        :src="product.imageUrl" 
        class="card-img-top" 
        :alt="product.title"
      />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title fw-bold text-dark">{{ product.title }}</h5>
        <p class="card-text text-secondary">{{ product.description }} </p> 
        <p class="card-text text-accent fw-bold mt-auto">{{ product.price }} €</p>
      </div>
    </router-link>
    <!-- Edit Button für Admins -->
    <div v-if="showEditButton" class="card-footer bg-transparent border-0 pb-3 px-3">
      <router-link 
        :to="`/product/edit/${product.id}`" 
        class="btn btn-outline-warning btn-sm w-100"
      >
        ✏️ Bearbeiten
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* Stile zur Verbesserung der Benutzererfahrung */
.card {
    transition: transform 0.2s, box-shadow 0.2s;
    border: none; /* Entfernt den Standard-Bootstrap-Rand */
}

.card:hover {
  transform: translateY(-3px); /* Leichter Anhebungseffekt */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05); /* Dezenter Schatten */
}

/* Stellt sicher, dass die Textfarbe im Link-Kontext dunkel bleibt */
.text-dark {
    color: #212529 !important;
}
</style>
