<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useUserStore } from '@/stores/user'
import { useFavoritesStore } from '@/stores/favorites'
import UserMenu from './UserMenu.vue'

const router = useRouter()
const { isAuthenticated, getAccessTokenSilently } = useAuth0()
const userStore = useUserStore()
const favoritesStore = useFavoritesStore()

// Suchbegriff
const searchQuery = ref('')

// Favoriten laden wenn eingeloggt
async function loadFavoriteIds() {
    if (isAuthenticated.value) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        await favoritesStore.fetchFavoriteIds(getAccessTokenSilently, apiBaseUrl)
    }
}

// Bei Login/Logout Favoriten aktualisieren
watch(isAuthenticated, (newVal) => {
    if (newVal) {
        loadFavoriteIds()
    } else {
        favoritesStore.clearFavorites()
    }
})

// Initial laden
onMounted(() => {
    loadFavoriteIds()
})

// Suche ausführen
function handleSearch() {
  const query = searchQuery.value.trim()
  if (query) {
    // Zur Rezepte-Seite navigieren mit Suchparameter
    router.push({ path: '/rezepte', query: { search: query } })
  } else {
    // Ohne Suchbegriff einfach zur Rezepte-Seite
    router.push('/rezepte')
  }
  searchQuery.value = '' // Suchfeld leeren
}
</script>

<template>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm navbar-accent">
        <div class="container">
            <router-link class="navbar-brand fw-bold text-accent" to="/">
                <img src="https://nucccio.github.io/casellese-images/logo_ricetti.webp" alt="Logo Ricetti" class="navbar-logo me-2">
            </router-link>

            <div class="d-flex align-items-center order-lg-last">
                <UserMenu class="me-2 me-lg-0" />
                <button class="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>

            <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul class="navbar-nav ms-auto fs-5">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/rezepte">Rezepte</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/kontakt">Kontakt</router-link>
                    </li>
                    <li v-if="isAuthenticated" class="nav-item">
                        <router-link class="nav-link d-flex align-items-center" to="/merkliste">
                            <i class="bi bi-heart-fill text-accent me-1"></i>
                            Merkliste
                            <span v-if="favoritesStore.count > 0" class="badge bg-accent ms-1">
                                {{ favoritesStore.count }}
                            </span>
                        </router-link>
                    </li>
                </ul>
                <form class="d-flex ms-auto" @submit.prevent="handleSearch">
                    <input 
                      v-model="searchQuery"
                      class="form-control me-2" 
                      type="search" 
                      placeholder="Rezept suchen..."
                      @keyup.enter="handleSearch"
                    >
                    <button class="btn btn-accent" type="submit">Suchen</button>
                </form>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar-accent {
    border-bottom: 5px solid #e54c4c;
}

/* Responsive Logo */
.navbar-logo {
    height: 100px;
    transition: height 0.2s ease;
}

@media (max-width: 991px) {
    .navbar-logo {
        height: 70px;
    }
}

@media (max-width: 576px) {
    .navbar-logo {
        height: 55px;
    }
}

.text-success {
    color: #198754 !important;
}

.text-accent {
    color: #e54c4c !important;
}

.bg-accent {
    background-color: #e54c4c !important;
}

.badge {
    font-size: 0.7rem;
    padding: 0.25em 0.5em;
    border-radius: 50%;
    min-width: 1.2em;
}
</style>
