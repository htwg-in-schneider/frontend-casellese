<script setup>
import { defineProps } from 'vue';

defineProps({
    product: {
        type: Object,
        required: true,
    }
});
</script>

<template>
  <router-link 
    :to="{ name: 'product', params: { id: product.id } }" 
    class="card h-100 text-decoration-none rounded-5" 
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
<!--
<script setup>
//import Button from '@/components/Button.vue';
import NavButton from '@/components/NavButton.vue';

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

      <NavButton variant="accent" :to="`/product/${product.id}`" class="mt-auto">
        Rezept
      </NavButton>
      <!--
      <Button variant="accent" class="mt-auto" :onClick="() => showAlert(product.recipe)">
        Rezept
      </Button>
      
      
    </div>
  </div>
</template>
<!--
<style scoped>

</style>
-->