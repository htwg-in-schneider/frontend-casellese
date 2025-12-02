<script setup>
import { useRoute } from 'vue-router';
import { products } from '../data.js'; // Stellen Sie sicher, dass der Pfad zu Ihrer Datenquelle korrekt ist

const route = useRoute();

// Holen Sie die ID aus den Routen-Parametern
const productId = route.params.id;

// Finden Sie das Produkt anhand der ID
const product = products.find(p => p.id == productId); 

</script>

<template>
  <div v-if="product" class="row">
    <div class="col-md-6">
      <img :src="product.imageUrl" :alt="product.title" class="img-fluid d-block mx-auto rounded-5" />
    </div>

    <div class="col-md-6">
      <h1 class="display-6 fw-bold">{{ product.title }}</h1>
      <p class="lead text-secondary">{{ product.description }}</p>

      <div class="mb-4">
          <span class="fs-5 fw-bold text-success">{{ product.price }}</span>
      </div>
      
      <p>
          <span class="fw-bold">Zutaten:</span> {{ product.ingredients }}
      </p>

      <router-link to="/" class="btn btn-outline-dark mt-3">
        Zurück zum Katalog
      </router-link>
    </div>
  </div>

  <div v-else class="text-center py-5">
    <h1 class="display-5">Produkt nicht gefunden</h1>
    <p class="lead">Das gesuchte Rezept existiert leider nicht.</p>
  </div>
</template>

<style scoped>


</style>
<!-- 
 <script setup>
import NavButton from '@/components/NavButton.vue';
import Button from '@/components/Button.vue';
import { computed } from 'vue';
import { products } from '@/data.js';

const props = defineProps({
    id: {
        type: [String, Number],
        required: true
    }
});

const product = computed(() => {
    return products.find(p => String(p.id) === String(props.id)) || null;
});
</script>

<template>
    <section class="container py-5">
        <div v-if="product" class="row">
            <div class="col-md-6">
                <img :src="product.imageUrl" class="img-fluid" :alt="product.title" />
            </div>
            <div class="col-md-6">
                <h2 class="fw-bold">{{ product.title }}</h2>
                <p class="text-accent fw-bold fs-4">{{ product.price }} €</p>
                <p>{{ product.description }}</p>
                <NavButton variant="secondary" class="me-2" to="/">Zurück</NavButton>
                <Button variant="accent">In den Warenkorb</Button>
            </div>
        </div>
        <div v-else class="text-center">
            <p>Produkt wurde nicht gefunden.</p>
            <NavButton variant="secondary" class="me-2" to="/">Zurück</NavButton>
        </div>
    </section>
</template>
-->
