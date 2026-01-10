<script setup>
import { ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
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

const { isAuthenticated, loginWithRedirect } = useAuth0();

const showCopiedToast = ref(false);
const showLoginHint = ref(false);

// Link kopieren oder Login-Hinweis zeigen
async function handleClick() {
  // Prüfe ob User eingeloggt ist
  if (!isAuthenticated.value) {
    showLoginHint.value = true;
    setTimeout(() => {
      showLoginHint.value = false;
    }, 3000);
    return;
  }
  
  // User ist eingeloggt - Link kopieren
  await copyLink();
}

// Zum Login weiterleiten
async function goToLogin() {
  showLoginHint.value = false;
  await loginWithRedirect({
    appState: { targetUrl: window.location.pathname }
  });
}

// Link kopieren
async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url);
    showCopiedToast.value = true;
    setTimeout(() => {
      showCopiedToast.value = false;
    }, 2000);
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
  }
}
</script>

<template>
  <div class="share-container">
    <!-- Link kopieren Button -->
    <button 
      @click="handleClick" 
      class="btn btn-share"
      :class="{ 'copied': showCopiedToast }"
      :title="showCopiedToast ? 'Link kopiert!' : 'Link kopieren'"
    >
      <!-- Icon: Link/Kopieren -->
      <svg v-if="!showCopiedToast" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
      <!-- Icon: Checkmark wenn kopiert -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span class="ms-2">{{ showCopiedToast ? 'Kopiert!' : 'Link kopieren' }}</span>
    </button>

    <!-- Login Hinweis -->
    <Transition name="hint">
      <div v-if="showLoginHint" class="login-hint">
        <div class="login-hint-content">
          <i class="bi bi-info-circle me-2"></i>
          <span>Bitte melde dich an, um den Link zu kopieren.</span>
          <button @click="goToLogin" class="btn btn-login-hint ms-3">
            Anmelden
          </button>
          <button @click="showLoginHint = false" class="btn-close-hint" aria-label="Schließen">
            ✕
          </button>
        </div>
      </div>
    </Transition>

    <!-- Toast für "Link kopiert" -->
    <Transition name="toast">
      <div v-if="showCopiedToast" class="copy-toast">
        ✓ Link in Zwischenablage kopiert!
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

.btn-share:hover {
  background-color: #e54c4c;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.3);
}

.btn-share.copied {
  background-color: #28a745;
  border-color: #28a745;
  color: #ffffff;
}

/* Login Hinweis */
.login-hint {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.login-hint-content {
  display: flex;
  align-items: center;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-login-hint {
  background-color: #e54c4c;
  border: none;
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-login-hint:hover {
  background-color: #d43c3c;
}

.btn-close-hint {
  background: none;
  border: none;
  color: #856404;
  font-size: 16px;
  cursor: pointer;
  margin-left: 12px;
  padding: 0 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-close-hint:hover {
  opacity: 1;
}

/* Toast */
.copy-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #28a745;
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
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}

.hint-enter-active,
.hint-leave-active {
  transition: all 0.3s ease;
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translate(-50%, -16px);
}
</style>