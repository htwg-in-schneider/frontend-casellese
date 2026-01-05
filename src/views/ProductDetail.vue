<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();
const { isAuthenticated } = useAuth0();

// Holen Sie die ID aus den Routen-Parametern
const productId = route.params.id;

// Reaktive Daten
const product = ref(null);
const recipes = ref([]);
const isLoading = ref(true);
const error = ref('');

// Aktives Rezept für die Anzeige
const activeRecipe = ref(null);

// Produkt vom Backend laden
async function fetchProduct() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`);
    
    if (response.ok) {
      product.value = await response.json();
    } else {
      error.value = `Fehler beim Laden des Produkts: ${response.status} ${response.statusText}`;
    }
  } catch (e) {
    error.value = `Fehler beim Laden des Produkts: ${e.message}`;
    console.error('Could not fetch product:', e);
  }
}

// Rezepte für das Produkt laden
async function fetchRecipes() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recipes/product/${productId}`);
    
    if (response.ok) {
      recipes.value = await response.json();
    } else {
      // Keine Rezepte ist kein Fehler
      recipes.value = [];
    }
  } catch (e) {
    console.warn('Could not fetch recipes:', e);
    recipes.value = [];
  }
}

// Daten beim Mounten laden
onMounted(async () => {
  isLoading.value = true;
  await Promise.all([fetchProduct(), fetchRecipes()]);
  isLoading.value = false;
});

function showRecipe(recipe) {
    activeRecipe.value = recipe;
}

function hideRecipe() {
    activeRecipe.value = null;
}

// Markdown zu HTML konvertieren (einfache Version)
function formatMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/^## (.+)$/gm, '<h4 class="mt-3 mb-2 fw-bold">$1</h4>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul class="mb-3">$1</ul>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
}
</script>

<template>
  <Navbar />
  <div class="container py-5">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Lade Produkt...</span>
      </div>
      <p class="mt-2">Lade Produkt...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-5">
      <div class="alert alert-danger">
        {{ error }}
      </div>
      <router-link to="/" class="btn btn-accent mt-3">
        Zurück zum Katalog
      </router-link>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="row">
      <div class="col-md-6">
        <img :src="product.imageUrlDetails || product.imageUrl" :alt="product.title" class="img-fluid d-block mx-auto rounded-5" />
      </div>

      <div class="col-md-6">
        <h1 class="display-6 fw-bold">{{ product.title }}</h1>
        <p class="lead text-secondary">{{ product.description }}</p>

        <div class="mb-4">
            <span class="fs-5 fw-bold text-accent">{{ product.price }} €</span>
        </div>
        
        <p v-if="product.ingredients">
            <span class="fw-bold">Zutaten:</span> {{ product.ingredients }}
        </p>

        <!-- Rezepte Section -->
        <div v-if="recipes && recipes.length > 0" class="mt-4">
          <h3 class="fw-bold mb-3">🍳 Rezepte</h3>
          <div class="d-flex flex-wrap gap-2">
            <button 
              v-for="recipe in recipes" 
              :key="recipe.id"
              @click="showRecipe(recipe)"
              class="btn btn-outline-accent"
            >
              {{ recipe.title }}
            </button>
          </div>
        </div>

        <!-- Aktives Rezept Anzeige -->
        <div v-if="activeRecipe" class="mt-4 p-4 bg-light rounded-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h4 class="fw-bold">{{ activeRecipe.title }}</h4>
            <button @click="hideRecipe" class="btn-close" aria-label="Schließen"></button>
          </div>
          <div v-html="formatMarkdown(activeRecipe.text)" class="recipe-content"></div>
          <a 
            v-if="activeRecipe.pdfUrl" 
            :href="activeRecipe.pdfUrl" 
            target="_blank"
            class="btn btn-accent mt-3"
          >
            📄 PDF herunterladen
          </a>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 d-flex flex-wrap gap-2">
          <router-link to="/" class="btn btn-outline-dark">
            ← Zurück zum Katalog
          </router-link>
          
          <!-- Bearbeiten Button - nur für eingeloggte User -->
          <router-link 
            v-if="isAuthenticated" 
            :to="`/product/edit/${product.id}`" 
            class="btn btn-warning"
          >
            ✏️ Bearbeiten
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <h1 class="display-5">Produkt nicht gefunden</h1>
      <p class="lead">Das gesuchte Rezept existiert leider nicht.</p>
      <router-link to="/" class="btn btn-accent mt-3">
        Zurück zum Katalog
      </router-link>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.btn-outline-accent {
  color: var(--color-accent, #c9a227);
  border-color: var(--color-accent, #c9a227);
}

.btn-outline-accent:hover {
  background-color: var(--color-accent, #c9a227);
  color: white;
}

.btn-accent {
  background-color: var(--color-accent, #c9a227);
  color: white;
  border: none;
}

.btn-accent:hover {
  background-color: #b08d1f;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
  color: #212529;
}

.recipe-content {
  line-height: 1.6;
}

.recipe-content :deep(h4) {
  color: var(--color-accent, #c9a227);
}

.recipe-content :deep(ul),
.recipe-content :deep(ol) {
  padding-left: 1.5rem;
}
</style>
