<script setup>
import { watch } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';
import SpecialBanner from './components/SpecialBanner.vue';
import { useUserStore } from './stores/user';

const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
const userStore = useUserStore();

// Beobachte Auth-Status und lade Profil automatisch
watch([isAuthenticated, isLoading], async ([authenticated, loading]) => {
  if (!loading) {
    if (authenticated) {
      await userStore.fetchProfile(getAccessTokenSilently, import.meta.env.VITE_API_BASE_URL);
    } else {
      userStore.clearProfile();
    }
  }
}, { immediate: true });
</script>

<template>
  <div class="app-wrapper">
    <!-- Special Banner -->
    <SpecialBanner text="Sehen Sie unsere neuen Rezepte an ->" />

    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style>
/* Sticky Footer Layout */
html, body {
  height: 100%;
  margin: 0;
}

#app {
  min-height: 100%;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1 0 auto;
}

footer, .footer {
  flex-shrink: 0;
}
</style>

<!-- Iteration 7 - Pinia State Management -->
