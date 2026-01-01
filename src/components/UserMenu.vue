<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()

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
</script>

<template>
  <div v-if="!isLoading">
    <button v-if="!isAuthenticated" @click="handleLogin" class="btn btn-accent">
      Anmelden
    </button>

    <div v-else class="dropdown">
      <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1"
        data-bs-toggle="dropdown" aria-expanded="false">
        <img :src="user.picture" :alt="user.name" width="32" height="32" class="rounded-circle">
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
