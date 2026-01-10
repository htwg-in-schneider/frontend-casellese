<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, ref, computed } from 'vue'

const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
const profileData = ref(null)
const bearerToken = ref('')
const error = ref('')
const imageError = ref(false)
const copied = ref(false)

function copyToClipboard(event) {
  event.target.select()
  navigator.clipboard.writeText(event.target.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

function getRoleName(constant) {
  switch (constant) {
    case 'ADMIN':
      return 'Administrator'
    case 'REGULAR':
      return 'Regulärer Benutzer'
    default:
      return constant;
  }
}

function getRoleIcon(constant) {
  switch (constant) {
    case 'ADMIN':
      return 'bi-shield-fill-check'
    case 'REGULAR':
      return 'bi-person-fill'
    default:
      return 'bi-person'
  }
}

const handleImageError = () => {
  imageError.value = true
}

const profilePicture = computed(() => {
  if (imageError.value || !user.value?.picture) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.name || 'User')}&background=e54c4c&color=fff&size=256`
  }
  return user.value.picture
})

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
  <div class="profile-page">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner-wrapper">
        <div class="spinner"></div>
        <p class="loading-text">Profil wird geladen...</p>
      </div>
    </div>

    <!-- Authenticated Content -->
    <div v-else-if="isAuthenticated && user" class="profile-container">
      <!-- Hero Section mit Profilbild -->
      <div class="profile-hero">
        <div class="hero-background"></div>
        <div class="profile-avatar-wrapper">
          <div class="avatar-ring">
            <img 
              :src="profilePicture" 
              :alt="user?.name || 'User'" 
              class="profile-avatar"
              @error="handleImageError"
            >
          </div>
          <div v-if="profileData" class="role-badge" :class="{ 'admin': profileData.role === 'ADMIN' }">
            <i class="bi" :class="getRoleIcon(profileData.role)"></i>
            {{ getRoleName(profileData.role) }}
          </div>
        </div>
      </div>

      <!-- Profile Info Card -->
      <div class="profile-card">
        <div v-if="profileData" class="profile-info">
          <h1 class="profile-name">{{ profileData.name }}</h1>
          <p class="profile-email">
            <i class="bi bi-envelope-fill"></i>
            {{ profileData.email }}
          </p>
          
          <!-- Stats / Quick Info -->
          <div class="profile-stats">
            <div class="stat-item">
              <i class="bi bi-calendar3"></i>
              <span>Mitglied seit heute</span>
            </div>
            <div class="stat-item">
              <i class="bi bi-heart-fill"></i>
              <span>Rezepte entdecken</span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="profile-actions">
            <router-link to="/rezepte" class="action-btn primary">
              <i class="bi bi-book"></i>
              Rezepte durchstöbern
            </router-link>
            <router-link to="/merkliste" class="action-btn secondary">
              <i class="bi bi-heart"></i>
              Meine Merkliste
            </router-link>
          </div>
        </div>

        <!-- Loading Profile Data -->
        <div v-else class="profile-loading">
          <div v-if="error" class="error-message">
            <i class="bi bi-exclamation-triangle-fill"></i>
            {{ error }}
          </div>
          <div v-else class="loading-skeleton">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line subtitle"></div>
          </div>
        </div>
      </div>

      <!-- Debug Section (Collapsed) -->
      <details class="debug-section">
        <summary class="debug-toggle">
          <i class="bi bi-code-slash"></i>
          Entwickler-Informationen
          <i class="bi bi-chevron-down toggle-icon"></i>
        </summary>
        <div class="debug-content">
          <div class="debug-block">
            <label>Auth0 User-Objekt:</label>
            <pre><code>{{ JSON.stringify(user, null, 2) }}</code></pre>
          </div>
          <div class="debug-block">
            <label>
              Bearer Token 
              <span v-if="copied" class="copy-feedback">✓ Kopiert!</span>
            </label>
            <textarea 
              class="token-field" 
              rows="3" 
              readonly 
              @click="copyToClipboard"
              placeholder="Klicken zum Kopieren"
            >{{ bearerToken }}</textarea>
          </div>
        </div>
      </details>
    </div>

    <!-- Not Authenticated -->
    <div v-else class="not-authenticated">
      <div class="auth-prompt">
        <i class="bi bi-person-lock"></i>
        <h2>Nicht angemeldet</h2>
        <p>Bitte melden Sie sich an, um Ihr Profil zu sehen.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Variables */
.profile-page {
  --accent: #e54c4c;
  --accent-dark: #c94141;
  --accent-light: #ff6b6b;
  --bg-light: #fafafa;
  --text-dark: #2d3436;
  --text-muted: #636e72;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.12);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.16);
  --radius: 16px;
  --radius-sm: 8px;
}

.profile-page {
  min-height: 70vh;
  background: linear-gradient(135deg, #fff 0%, var(--bg-light) 100%);
  padding-bottom: 3rem;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.spinner-wrapper {
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Profile Container */
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.profile-hero {
  position: relative;
  padding-top: 2rem;
  margin-bottom: -60px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% + 2rem);
  height: 160px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
  border-radius: 0 0 50% 50% / 0 0 30px 30px;
}

.profile-avatar-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
}

.avatar-ring {
  padding: 5px;
  background: white;
  border-radius: 50%;
  box-shadow: var(--shadow-lg);
}

.profile-avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  box-shadow: var(--shadow-sm);
}

.role-badge.admin {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
  color: white;
}

.role-badge i {
  font-size: 1rem;
}

/* Profile Card */
.profile-card {
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  margin-top: 1.5rem;
}

.profile-info {
  text-align: center;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.profile-email {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.profile-email i {
  color: var(--accent);
}

/* Stats */
.profile-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1.25rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.stat-item i {
  color: var(--accent);
}

/* Actions */
.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: var(--accent);
  color: white;
}

.action-btn.primary:hover {
  background: var(--accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.4);
}

.action-btn.secondary {
  background: #f8f9fa;
  color: var(--text-dark);
  border: 1px solid #eee;
}

.action-btn.secondary:hover {
  background: #fff;
  border-color: var(--accent);
  color: var(--accent);
}

/* Error & Loading States */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem;
  background: #fff5f5;
  border-radius: var(--radius-sm);
  color: var(--accent);
  font-size: 0.9rem;
}

.loading-skeleton {
  padding: 1rem 0;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto 0.75rem;
}

.skeleton-line.title {
  width: 60%;
  height: 28px;
}

.skeleton-line.subtitle {
  width: 40%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Debug Section */
.debug-section {
  margin-top: 2rem;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.debug-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  list-style: none;
  transition: background 0.2s;
}

.debug-toggle:hover {
  background: var(--bg-light);
}

.debug-toggle::-webkit-details-marker {
  display: none;
}

.toggle-icon {
  margin-left: auto;
  transition: transform 0.3s;
}

details[open] .toggle-icon {
  transform: rotate(180deg);
}

.debug-content {
  padding: 0 1.25rem 1.25rem;
  border-top: 1px solid #eee;
}

.debug-block {
  margin-top: 1rem;
}

.debug-block label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.copy-feedback {
  color: #27ae60;
  font-weight: normal;
  margin-left: 8px;
}

.debug-block pre {
  background: #f8f9fa;
  border: 1px solid #eee;
  border-radius: var(--radius-sm);
  padding: 1rem;
  font-size: 0.8rem;
  overflow-x: auto;
  margin: 0;
}

.token-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.8rem;
  resize: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.token-field:hover {
  border-color: var(--accent);
}

.token-field:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(229, 76, 76, 0.1);
}

/* Not Authenticated */
.not-authenticated {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.auth-prompt {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  max-width: 400px;
}

.auth-prompt i {
  font-size: 4rem;
  color: var(--accent);
  margin-bottom: 1.5rem;
  display: block;
}

.auth-prompt h2 {
  color: var(--text-dark);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.auth-prompt p {
  color: var(--text-muted);
  margin: 0;
}

/* Responsive */
@media (max-width: 576px) {
  .profile-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .profile-avatar {
    width: 120px;
    height: 120px;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
}
</style>