<!-- src/components/FavoriteButton.vue -->
<script setup>
import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  },
  showText: {
    type: Boolean,
    default: false
  }
})

const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0()
const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.productId))

const isLoading = computed(() => favoritesStore.isLoading)

async function handleClick() {
  if (!isAuthenticated.value) {
    // Zum Login weiterleiten
    loginWithRedirect({
      appState: { targetUrl: window.location.pathname }
    })
    return
  }
  
  await favoritesStore.toggleFavorite(
    props.productId,
    getAccessTokenSilently,
    import.meta.env.VITE_API_BASE_URL
  )
}

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'btn-sm'
    case 'lg': return 'btn-lg'
    default: return ''
  }
})
</script>

<template>
  <button
    @click.prevent="handleClick"
    :class="[
      'btn-favorite',
      sizeClasses,
      { 'is-favorite': isFavorite, 'is-loading': isLoading }
    ]"
    :disabled="isLoading"
    :title="isFavorite ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
  >
    <span class="heart-icon">
      <svg v-if="isFavorite" viewBox="0 0 24 24" fill="currentColor" class="heart-filled">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="heart-outline">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </span>
    <span v-if="showText" class="btn-text">
      {{ isFavorite ? 'Gespeichert' : 'Merken' }}
    </span>
  </button>
</template>

<style scoped>
.btn-favorite {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 2px solid #e54c4c;
  color: #e54c4c;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.btn-favorite:hover {
  background: rgba(229, 76, 76, 0.1);
  transform: scale(1.05);
}

.btn-favorite.is-favorite {
  background: #e54c4c;
  color: white;
}

.btn-favorite.is-favorite:hover {
  background: #d43c3c;
}

.btn-favorite.is-loading {
  opacity: 0.6;
  cursor: wait;
}

.heart-icon {
  display: flex;
  width: 20px;
  height: 20px;
}

.heart-icon svg {
  width: 100%;
  height: 100%;
}

.btn-favorite.is-favorite .heart-icon {
  animation: heartBeat 0.3s ease;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* Größen */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-sm .heart-icon {
  width: 16px;
  height: 16px;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.btn-lg .heart-icon {
  width: 24px;
  height: 24px;
}
</style>