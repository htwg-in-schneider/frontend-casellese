<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: () => window.location.href
  }
});

const showDropdown = ref(false);
const showCopiedToast = ref(false);

// Prüfe ob Web Share API verfügbar ist
const canUseWebShare = computed(() => {
  return navigator.share !== undefined;
});

// Native Share API nutzen (Mobile)
async function nativeShare() {
  try {
    await navigator.share({
      title: props.title,
      text: props.description || `Schau dir dieses Rezept an: ${props.title}`,
      url: props.url
    });
    showDropdown.value = false;
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Fehler beim Teilen:', err);
    }
  }
}

// WhatsApp teilen
function shareWhatsApp() {
  const text = encodeURIComponent(`${props.title}\n\n${props.description}\n\n${props.url}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
  showDropdown.value = false;
}

// Per E-Mail teilen
function shareEmail() {
  const subject = encodeURIComponent(`Rezept: ${props.title}`);
  const body = encodeURIComponent(`Hallo!\n\nSchau dir dieses leckere Rezept an:\n\n${props.title}\n${props.description}\n\n${props.url}\n\nGuten Appetit! 🍝`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  showDropdown.value = false;
}

// Facebook teilen
function shareFacebook() {
  const url = encodeURIComponent(props.url);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  showDropdown.value = false;
}

// Twitter/X teilen
function shareTwitter() {
  const text = encodeURIComponent(`${props.title} - ${props.description}`);
  const url = encodeURIComponent(props.url);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
  showDropdown.value = false;
}

// Link kopieren
async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url);
    showCopiedToast.value = true;
    setTimeout(() => {
      showCopiedToast.value = false;
    }, 2000);
    showDropdown.value = false;
  } catch (err) {
    // Fallback für ältere Browser
    const textArea = document.createElement('textarea');
    textArea.value = props.url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showCopiedToast.value = true;
    setTimeout(() => {
      showCopiedToast.value = false;
    }, 2000);
    showDropdown.value = false;
  }
}

// Dropdown toggle
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

// Dropdown schließen bei Klick außerhalb
function closeDropdown() {
  showDropdown.value = false;
}
</script>

<template>
  <div class="share-container" v-click-outside="closeDropdown">
    <!-- Share Button -->
    <button 
      @click="toggleDropdown" 
      class="btn btn-share"
      :class="{ 'active': showDropdown }"
      title="Teilen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      <span class="ms-2">Teilen</span>
    </button>

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div v-if="showDropdown" class="share-dropdown">
        <!-- Native Share (nur auf unterstützten Geräten) -->
        <button v-if="canUseWebShare" @click="nativeShare" class="share-option">
          <span class="share-icon">📱</span>
          <span>Teilen via...</span>
        </button>
        
        <button @click="shareWhatsApp" class="share-option">
          <span class="share-icon">💬</span>
          <span>WhatsApp</span>
        </button>
        
        <button @click="shareEmail" class="share-option">
          <span class="share-icon">✉️</span>
          <span>E-Mail</span>
        </button>
        
        <button @click="shareFacebook" class="share-option">
          <span class="share-icon">📘</span>
          <span>Facebook</span>
        </button>
        
        <button @click="shareTwitter" class="share-option">
          <span class="share-icon">🐦</span>
          <span>X (Twitter)</span>
        </button>
        
        <hr class="share-divider">
        
        <button @click="copyLink" class="share-option">
          <span class="share-icon">🔗</span>
          <span>Link kopieren</span>
        </button>
      </div>
    </Transition>

    <!-- Toast für "Link kopiert" -->
    <Transition name="toast">
      <div v-if="showCopiedToast" class="copy-toast">
        ✓ Link kopiert!
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ============================================
   STYLETILE STYLES
   Farben: #ffffff, #f0f0f0, #c9c9c9, #e54c4c
   Font: Inter
   ============================================ */

.share-container {
  position: relative;
  display: inline-block;
}

/* Share Button */
.btn-share {
  display: inline-flex;
  align-items: center;
  background-color: #ffffff;
  border: 2px solid #e54c4c;
  color: #e54c4c;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  padding: 0.375rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-share:hover,
.btn-share.active {
  background-color: #e54c4c;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.3);
}

/* Dropdown */
.share-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background-color: #ffffff;
  border: 1px solid #c9c9c9;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 1000;
}

.share-option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.15s ease;
  text-align: left;
}

.share-option:hover {
  background-color: #f0f0f0;
}

.share-icon {
  width: 24px;
  margin-right: 12px;
  font-size: 16px;
}

.share-divider {
  margin: 8px 16px;
  border: none;
  border-top: 1px solid #c9c9c9;
}

/* Toast */
.copy-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
}

/* Animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}
</style>