<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { computed, ref } from 'vue'

const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()
const imageError = ref(false)

const handleLogin = () => {
  loginWithRedirect()
}

const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin
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
          <router-link class="dropdown-item" to="/profile">Profil</router-link>
        </li>
        <li>
          <hr class="dropdown-divider">
        </li>
        <li>
          <button class="dropdown-item" @click="handleLogout">Abmelden</button>
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
