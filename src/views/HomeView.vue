<script setup>
import { ref, onMounted } from 'vue';

// Featured Rezepte für die Homepage
const featuredRecipes = ref([]);
const isLoading = ref(true);

async function fetchFeaturedRecipes() {
  try {
    isLoading.value = true;
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product`);
    
    if (response.ok) {
      const allProducts = await response.json();
      // Nehme die ersten 3 Rezepte als Featured
      featuredRecipes.value = allProducts.slice(0, 3);
    }
  } catch (e) {
    console.error('Could not fetch featured recipes:', e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchFeaturedRecipes();
});
</script>

<template>
  <!-- Hero Banner -->
  <div id="staticBanner" class="hero-banner d-flex align-items-end">
    <div class="container d-flex justify-content-between pb-5">
      <div>
        <p class="lead m-0">Ein kleines Dorf mit Geschmack und Tradition.</p>
        <h1 class="fw-bold m-0 display-3">Caselle in Pittari</h1>
      </div>
      <div class="d-flex align-items-end">
        <router-link to="/rezepte" class="btn btn-accent btn-lg">Erfahre mehr →</router-link>
      </div>
    </div>
  </div>

  <!-- Service Icons Section -->
  <section class="py-5 bg-light feature-section">
    <div class="container">
      <div class="row text-center g-4">
        
        <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
          <div class="card p-4 rounded-4 shadow-sm w-100">
            <div class="mb-3">
              <img src="https://nucccio.github.io/casellese-images/weizen-icon.png" 
                   alt="Icon Zutaten Ähre" 
                   class="feature-icon mx-auto d-block">
            </div>
            <h4 class="fw-bold">Zutaten</h4>
            <p>Handverlesene und ursprüngliche Zutaten, wie z.B.: dem Urdinkelsamen</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
          <div class="card p-4 rounded-4 shadow-sm w-100">
            <div class="mb-3">
              <img src="https://nucccio.github.io/casellese-images/koch-icon.png" 
                   alt="Icon Tradition Kochmütze" 
                   class="feature-icon mx-auto d-block">
            </div>
            <h4 class="fw-bold">Tradition</h4>
            <p>Bewährte Rezepte, die Generationen seit Jahrhunderten prägen</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-12 d-flex align-items-stretch">
          <div class="card p-4 rounded-4 shadow-sm w-100">
            <div class="mb-3">
              <img src="https://nucccio.github.io/casellese-images/liebe-icon.png" 
                   alt="Icon Liebe Herz" 
                   class="feature-icon mx-auto d-block">
            </div>
            <h4 class="fw-bold">Liebe</h4>
            <p>Handgemachte Kochrezepte von Nonna's und Nonno's mit Liebe geprüft</p>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Top-Rezepte Section -->
  <section class="py-5">
    <div class="container recipes-container">
      
      <div class="text-center mb-3">
        <h2 class="fw-bold display-5">Unsere Top-Rezepte</h2>
        <p class="lead text-secondary">Wo Tradition, Liebe und reine Zutaten zusammenfinden</p>
      </div>

      <div class="text-center py-5">
        <router-link to="/rezepte" class="btn btn-accent btn-lg">Alle Rezepte entdecken →</router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Lade Rezepte...</span>
        </div>
      </div>

      <!-- Dynamische Rezept-Karten -->
      <template v-else-if="featuredRecipes.length > 0">
        <div v-for="recipe in featuredRecipes" :key="recipe.id" class="card mb-4 p-3 rounded-4 shadow-sm">
          <div class="row g-0 align-items-center">
            <div class="col-4">
              <img :src="recipe.imageUrl || 'https://nucccio.github.io/casellese-images/placeholder.webp'" 
                   class="img-fluid rounded-3 recipe-image" 
                   :alt="recipe.title">
            </div>
            <div class="col-8">
              <div class="card-body py-0 ps-4 d-flex justify-content-between">
                <div>
                  <h4 class="card-title fw-bold m-0">{{ recipe.title }}</h4>
                  <p class="card-text medium mt-1">{{ recipe.description }}</p>
                </div>
                <div class="d-flex align-items-center">
                  <router-link :to="'/product/' + recipe.id" class="text-danger fs-3">
                    <i class="bi bi-arrow-right"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Fallback: Statische Rezepte wenn keine Daten -->
      <template v-else>
        <div class="card mb-4 p-3 rounded-4 shadow-sm">
          <div class="row g-0 align-items-center">
            <div class="col-4">
              <img src="https://nucccio.github.io/casellese-images/caciocavallo.webp"
                   class="img-fluid rounded-3 recipe-image" 
                   alt="Caciocavallo Käse vor Berglandschaft">
            </div>
            <div class="col-8">
              <div class="card-body py-0 ps-4 d-flex justify-content-between">
                <div>
                  <h4 class="card-title fw-bold m-0">Caciocavallo</h4>
                  <p class="card-text medium mt-1">Caciocavallo ist ein italienischer Kult-Käse mit unverwechselbarer birnenförmiger Gestalt, der traditionell paarweise an der Schnur hängt</p>
                </div>
                <div class="d-flex align-items-center">
                  <router-link to="/rezepte" class="text-danger fs-3"><i class="bi bi-arrow-right"></i></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-4 p-3 rounded-4 shadow-sm">
          <div class="row g-0 align-items-center">
            <div class="col-4">
              <img src="https://nucccio.github.io/casellese-images/salsiccia.webp" 
                   class="img-fluid rounded-3 recipe-image"
                   alt="Salsiccia Würste hängend">
            </div>
            <div class="col-8">
              <div class="card-body py-0 ps-4 d-flex justify-content-between">
                <div>
                  <h4 class="card-title fw-bold m-0">Salsiccia</h4>
                  <p class="card-text medium mt-1">Salsiccia ist eine traditionelle italienische Wurst aus fein gewürztem Schweinefleisch, oft mit Knoblauch, Fenchel oder Chili verfeinert.</p>
                </div>
                <div class="d-flex align-items-center">
                  <router-link to="/rezepte" class="text-danger fs-3"><i class="bi bi-arrow-right"></i></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-3 rounded-4 shadow-sm">
          <div class="row g-0 align-items-center">
            <div class="col-4">
              <img src="https://nucccio.github.io/casellese-images/brot.webp" 
                   class="img-fluid rounded-3 recipe-image"
                   alt="Brot im Ofen gebacken">
            </div>
            <div class="col-8">
              <div class="card-body py-0 ps-4 d-flex justify-content-between">
                <div>
                  <h4 class="card-title fw-bold m-0">Brot</h4>
                  <p class="card-text medium mt-1">Brot ist das zeitlose Grundnahrungsmittel, frisch gebacken mit knuspriger Kruste und weichem Inneren.</p>
                </div>
                <div class="d-flex align-items-center">
                  <router-link to="/rezepte" class="text-danger fs-3"><i class="bi bi-arrow-right"></i></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

    </div>
  </section>

  <!-- Logo CTA Section -->
  <section class="py-5 text-center">
    <div class="container">
      <div class="mb-5">
        <img src="https://nucccio.github.io/casellese-images/logo_ricetti.webp" 
             alt="Ricetti in Pittari Logo"
             class="img-fluid logo-cta">
      </div>
      <router-link to="/kontakt" class="btn btn-accent btn-lg shadow">
        unverbindliche Anfrage
        <i class="bi bi-arrow-right ms-2"></i>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), 
                    url('https://nucccio.github.io/casellese-images/banner_ricetti_in_pittari.webp');
  background-size: cover;
  height: 80vh;
  background-position: center;
  color: white;
}

.feature-section {
  border-top: 3px solid #c9c9c9;
  border-bottom: 3px solid #c9c9c9;
  margin-top: -5px;
  margin-bottom: -5px;
}

.feature-icon {
  height: 100px;
}

.recipes-container {
  max-width: 900px;
}

.recipe-image {
  height: 180px;
  object-fit: cover;
}

.logo-cta {
  max-height: 200px;
}
</style>