<script setup>
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps({
    recipeId: {
        type: [Number, String],
        required: true
    },
    size: {
        type: String,
        default: 'md' // 'sm', 'md', 'lg'
    },
    showText: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['toggled'])

const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0()
const favoritesStore = useFavoritesStore()

const isLoading = ref(false)
const localError = ref(null)

// Normalisierte Recipe ID (immer Number)
const normalizedRecipeId = computed(() => {
    return typeof props.recipeId === 'string' ? parseInt(props.recipeId, 10) : props.recipeId
})

// Computed: Ist das Rezept ein Favorit?
const isFavorite = computed(() => {
    return favoritesStore.isFavorite(normalizedRecipeId.value)
})

// Computed: Button-Text
const buttonText = computed(() => {
    if (isLoading.value) return 'Lädt...'
    return isFavorite.value ? 'Gespeichert' : 'Merken'
})

// Computed: Tooltip-Text
const tooltipText = computed(() => {
    if (!isAuthenticated.value) return 'Anmelden um zu merken'
    return isFavorite.value ? 'Aus Merkliste entfernen' : 'Zur Merkliste hinzufügen'
})

// Computed: Icon-Klassen
const iconClass = computed(() => {
    return isFavorite.value ? 'bi-heart-fill text-danger' : 'bi-heart'
})

// Computed: Button-Größe
const sizeClass = computed(() => {
    switch (props.size) {
        case 'sm': return 'btn-sm'
        case 'lg': return 'btn-lg'
        default: return ''
    }
})

// Toggle Funktion
async function toggleFavorite(event) {
    event.preventDefault()
    event.stopPropagation()
    
    localError.value = null
    
    // Wenn nicht eingeloggt, zum Login weiterleiten
    if (!isAuthenticated.value) {
        await loginWithRedirect({
            appState: { targetUrl: window.location.pathname }
        })
        return
    }
    
    isLoading.value = true
    
    try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        console.log('Toggling favorite for recipe:', normalizedRecipeId.value)
        
        const result = await favoritesStore.toggleFavorite(
            normalizedRecipeId.value,
            getAccessTokenSilently,
            apiBaseUrl
        )
        
        console.log('Toggle result:', result)
        emit('toggled', { recipeId: normalizedRecipeId.value, isFavorite: result.isFavorite })
    } catch (error) {
        console.error('Fehler beim Umschalten des Favoriten:', error)
        localError.value = error.message
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <button 
        @click="toggleFavorite"
        :class="['btn btn-favorite', sizeClass, { 'is-favorite': isFavorite, 'is-loading': isLoading }]"
        :disabled="isLoading"
        :title="tooltipText"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
    >
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>
        <i v-else :class="['bi', iconClass]"></i>
        <span v-if="showText" class="ms-1">{{ buttonText }}</span>
    </button>
</template>

<style scoped>
.btn-favorite {
    background-color: transparent;
    border: 2px solid #e54c4c;
    color: #e54c4c;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 1.1rem;
}

.btn-favorite:hover:not(:disabled) {
    background-color: #e54c4c;
    color: #ffffff;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(229, 76, 76, 0.3);
}

.btn-favorite.is-favorite {
    background-color: #fff0f0;
    border-color: #e54c4c;
}

.btn-favorite.is-favorite:hover:not(:disabled) {
    background-color: #e54c4c;
}

.btn-favorite.is-favorite .bi-heart-fill {
    animation: heartbeat 0.3s ease-in-out;
}

/* Button mit Text */
.btn-favorite:has(span:not(.spinner-border)) {
    border-radius: 8px;
    width: auto;
    padding: 0.5rem 1rem;
}

/* Größen */
.btn-favorite.btn-sm {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
}

.btn-favorite.btn-sm:has(span:not(.spinner-border)) {
    width: auto;
    padding: 0.25rem 0.75rem;
}

.btn-favorite.btn-lg {
    width: 52px;
    height: 52px;
    font-size: 1.3rem;
}

.btn-favorite.btn-lg:has(span:not(.spinner-border)) {
    width: auto;
    padding: 0.75rem 1.25rem;
}

/* Loading State */
.btn-favorite.is-loading {
    opacity: 0.7;
    cursor: wait;
}

/* Animation */
@keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
}

/* Text Farbe */
.text-danger {
    color: #e54c4c !important;
}
</style>