<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'

const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()
const userStore = useUserStore()
const imageError = ref(false)

const handleLogin = () => {
  loginWithRedirect()
}

const handleLogout = () => {
  // Für GitHub Pages: origin + pathname base
  const baseUrl = import.meta.env.BASE_URL || '/'
  logout({
    logoutParams: {
      returnTo: window.location.origin + baseUrl
    }
  })
}

const handleImageError = () => {
  imageError.value = true
}

const profilePicture = computed(() => {
  if (imageError.value || !user.value?.picture) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.name || 'User')}&background=0D8ABC&color=fff&size=128`
  }
  return user.value.picture
})

// Prüfe ob User Admin ist
const isAdmin = computed(() => userStore.isAdmin)
</script>

<template>
  <div v-if="!isLoading">
    <button v-if="!isAuthenticated" @click="handleLogin" class="btn btn-accent">
      Anmelden
    </button>

    <div v-else class="dropdown">
      <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1"
        data-bs-toggle="dropdown" aria-expanded="false">
        <img :src="profilePicture" :alt="user?.name || 'User'" width="32" height="32" class="rounded-circle" @error="handleImageError">
      </a>
      <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser1" style="right: 0; left: auto;">
        <li>
          <router-link class="dropdown-item" to="/profile">
            <i class="bi bi-person me-2"></i>Profil
          </router-link>
        </li>
        <!-- Admin-Bereich -->
        <template v-if="isAdmin">
          <li><hr class="dropdown-divider"></li>
          <li class="dropdown-header text-muted small">Administration</li>
          <li>
            <router-link class="dropdown-item" to="/admin/users">
              <i class="bi bi-people me-2"></i>Nutzerverwaltung
            </router-link>
          </li>
          <!-- NEU: Link zur Transaktionsansicht -->
          <li>
            <router-link class="dropdown-item" to="/admin/favorites">
              <i class="bi bi-heart-fill me-2"></i>Transaktionen
            </router-link>
          </li>
          <li>
            <router-link class="dropdown-item" to="/product/create">
              <i class="bi bi-plus-circle me-2"></i>Produkt erstellen
            </router-link>
          </li>
        </template>
        <li>
          <hr class="dropdown-divider">
        </li>
        <li>
          <button class="dropdown-item" @click="handleLogout">
            <i class="bi bi-box-arrow-right me-2"></i>Abmelden
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dropdown-toggle::after {
  display: none;
}
</style>