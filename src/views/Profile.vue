<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
const profileData = ref(null)
const bearerToken = ref('')
const error = ref('')

function copyToClipboard(event) {
  event.target.select()
  navigator.clipboard.writeText(event.target.value)
}

function getRoleName(constant) {
  switch (constant) {
    case 'ADMIN':
      return 'Administrator'
    case 'REGULAR':
      return 'regulärer Benutzer'
    default:
      return constant;
  }
}

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      const token = await getAccessTokenSilently()
      bearerToken.value = token

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        profileData.value = await response.json()
      } else {
        error.value = `Fehler beim Laden des Profils: ${response.status} ${response.statusText}`
      }
    } catch (e) {
      error.value = `Fehler beim Laden des Profils: ${e.message}`
      console.warn('Could not get token:', e)
    }
  }
})
</script>

<template>
  <Navbar />
  <div class="container mt-5" style="min-height: 60vh;">
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="isAuthenticated && user" class="card mx-auto" style="max-width: 600px;">
      <div class="card-header bg-accent text-white">
        <h3 class="mb-0">Benutzer-Profil</h3>
      </div>
      <div class="card-body text-center">
        <div v-if="profileData">
          <img :src="user.picture" :alt="user.name" class="rounded-circle mb-3 border border-3 border-primary"
            width="150" height="150">
          <h4 class="card-title">{{ profileData.name }}</h4>
          <p class="card-text text-muted">{{ profileData.email }}</p>
          <p><strong>Rolle:</strong> {{ getRoleName(profileData.role) }}</p>
        </div>
        <div v-else>
          <p class="card-text text-muted warning">
            {{ error || 'Lade Profildaten...' }}
          </p>
        </div>

        <div class="mt-4 text-start">
          <details>
            <summary class="btn btn-sm btn-outline-secondary mb-2">OAuth2-Debug-Info</summary>
            <div class="mb-3">
              <label class="form-label">User (Auth0):</label>
              <pre class="bg-light p-3 rounded border"><code>{{ JSON.stringify(user, null, 2) }}</code></pre>
              <label class="form-label">Bearer Token (in das Feld klicken, um Token zu kopieren):</label>
              <textarea class="form-control" rows="3" readonly @click="copyToClipboard">{{ bearerToken }}</textarea>
            </div>
          </details>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning text-center">
      Sie sind nicht eingeloggt.
    </div>
  </div>
  <Footer />
</template>
