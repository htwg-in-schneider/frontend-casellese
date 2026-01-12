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
        <p class="card-text text-secondary">{{ product.description }}</p>
      </div>
    </router-link>
    <!-- Edit Button für Admins (StyleTile Design) -->
    <div v-if="showEditButton" class="card-footer bg-transparent border-0 pb-3 px-3">
      <router-link 
        :to="`/product/edit/${product.id}`" 
        class="btn btn-edit-card w-100"
      >
        <i class="bi bi-pencil me-1"></i>Bearbeiten
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* Stile zur Verbesserung der Benutzererfahrung */
.card {
    transition: transform 0.2s, box-shadow 0.2s;
    border: none;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);
}

.text-dark {
    color: #212529 !important;
}

/* StyleTile Bearbeiten Button */
.btn-edit-card {
  background-color: #ffffff;
  border: 2px solid #e54c4c;
  color: #e54c4c;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.btn-edit-card:hover {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.3);
}
</style>
