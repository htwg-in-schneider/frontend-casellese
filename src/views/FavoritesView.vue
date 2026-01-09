<!-- src/views/FavoritesView.vue -->
<script setup>
import { onMounted, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useFavoritesStore } from '@/stores/favorites'
import ProductCard from '@/components/ProductCard.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0()
const favoritesStore = useFavoritesStore()

const favorites = computed(() => favoritesStore.favorites)
const isLoading = computed(() => favoritesStore.isLoading)
const error = computed(() => favoritesStore.error)

onMounted(async () => {
  if (isAuthenticated.value) {
    await favoritesStore.fetchFavorites(
      getAccessTokenSilently,
      import.meta.env.VITE_API_BASE_URL
    )
  }
})

function handleLogin() {
  loginWithRedirect({
    appState: { targetUrl: '/favoriten' }
  })
}
</script>

<template>
  <div class="container py-5">
    <h1 class="display-5 fw-bold mb-4">❤️ Meine Favoriten</h1>

    <!-- Nicht eingeloggt -->
    <div v-if="!isAuthenticated" class="text-center py-5">
      <div class="empty-state">
        <span class="empty-icon">🔐</span>
        <h3>Anmeldung erforderlich</h3>
        <p class="text-secondary">Melde dich an, um deine Lieblingsrezepte zu speichern.</p>
        <button @click="handleLogin" class="btn btn-accent btn-lg mt-3">
          Jetzt anmelden
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Lade Favoriten...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Keine Favoriten -->
    <div v-else-if="favorites.length === 0" class="text-center py-5">
      <div class="empty-state">
        <span class="empty-icon">💔</span>
        <h3>Noch keine Favoriten</h3>
        <p class="text-secondary">Entdecke unsere Rezepte und speichere deine Lieblinge!</p>
        <router-link to="/rezepte" class="btn btn-accent btn-lg mt-3">
          Rezepte entdecken →
        </router-link>
      </div>
    </div>

    <!-- Favoriten Liste -->
    <div v-else class="row g-4">
      <div v-for="product in favorites" :key="product.id" class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm rounded-4 overflow-hidden">
          <router-link :to="'/product/' + product.id" class="text-decoration-none">
            <img 
              :src="product.imageUrl || 'https://nucccio.github.io/casellese-images/placeholder.webp'" 
              :alt="product.title"
              class="card-img-top"
              style="height: 200px; object-fit: cover;"
            >
          </router-link>
          <div class="card-body">
            <router-link :to="'/product/' + product.id" class="text-decoration-none text-dark">
              <h5 class="card-title fw-bold">{{ product.title }}</h5>
            </router-link>
            <p class="card-text text-secondary small">{{ product.description }}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="text-accent fw-bold">{{ product.price }} €</span>
              <FavoriteButton :product-id="product.id" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 3rem;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.btn-accent {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: white;
}

.btn-accent:hover {
  background-color: #d43c3c;
  border-color: #d43c3c;
  color: white;
}

.text-accent {
  color: #e54c4c;
}
</style>