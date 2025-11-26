<script setup>
import { products } from './data.js';

function getProducts() {
  return products;
}

function showAlert(description) {
  alert(description);
}
</script>

<template>
  <!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold text-accent" href="index.html">
                <img src="https://nucccio.github.io/casellese-images/logo_ricetti.webp" alt="Logo Ricetti" height="100" class="me-2">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-4 fs-5">
                    <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Rezepte</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Kontakt</a></li>
                </ul>
            </div>
        </div>
    </nav>

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
        <div class="card h-100 shadow-sm">
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