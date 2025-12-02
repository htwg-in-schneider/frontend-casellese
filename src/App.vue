<script setup>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';

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

  <!-- Main Content -->
  <router-view></router-view>

  <!-- Footer -->
  <Footer />
</template>
<style scoped>

</style>