<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import ShareButton from '@/components/Sharebutton.vue';

const route = useRoute();
const { isAuthenticated, getAccessTokenSilently } = useAuth0();

// Holen Sie die ID aus den Routen-Parametern
const productId = route.params.id;

// Reaktive Daten
const product = ref(null);
const recipes = ref([]);
const isLoading = ref(true);
const error = ref('');
const isGeneratingPdf = ref(false);
const isAdmin = ref(false);

// Aktives Rezept für die Anzeige
const activeRecipe = ref(null);

// Computed URL für Share-Funktion
const shareUrl = computed(() => {
  return window.location.href;
});

// Admin-Check
async function checkAdminRole() {
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      isAdmin.value = data.role === 'ADMIN';
    }
  } catch (err) {
    console.error('Error checking admin role:', err);
    isAdmin.value = false;
  }
}

// Produkt vom Backend laden
async function fetchProduct() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/product/${productId}`);
    
    if (response.ok) {
      product.value = await response.json();
    } else {
      error.value = `Fehler beim Laden des Produkts: ${response.status} ${response.statusText}`;
    }
  } catch (e) {
    error.value = `Fehler beim Laden des Produkts: ${e.message}`;
    console.error('Could not fetch product:', e);
  }
}

// Rezepte für das Produkt laden
async function fetchRecipes() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}/recipes`);
    
    if (response.ok) {
      recipes.value = await response.json();
      console.log('Loaded recipes:', recipes.value);
    } else {
      console.log('No recipes found for product', productId);
      recipes.value = [];
    }
  } catch (e) {
    console.warn('Could not fetch recipes:', e);
    recipes.value = [];
  }
}

// Daten beim Mounten laden
onMounted(async () => {
  isLoading.value = true;
  await Promise.all([fetchProduct(), fetchRecipes()]);
  isLoading.value = false;
  
  // Admin-Status prüfen wenn eingeloggt
  if (isAuthenticated.value) {
    checkAdminRole();
  }
});

function showRecipe(recipe) {
    activeRecipe.value = recipe;
}

function hideRecipe() {
    activeRecipe.value = null;
}

// Markdown zu HTML konvertieren
function formatMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/^## (.+)$/gm, '<h4 class="mt-3 mb-2 fw-bold">$1</h4>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul class="mb-3">$1</ul>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
}

// PDF generieren und herunterladen
async function downloadRecipePdf(recipe) {
  // Falls eine externe PDF-URL existiert, diese direkt öffnen
  if (recipe.pdfUrl) {
    window.open(recipe.pdfUrl, '_blank');
    return;
  }
  
  isGeneratingPdf.value = true;
  
  try {
    // jsPDF dynamisch importieren (muss mit npm install jspdf installiert sein)
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = 25;
    
    // Titel
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(recipe.title, margin, yPosition);
    yPosition += 12;
    
    // Produktname
    if (product.value) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Rezept für: ${product.value.title}`, margin, yPosition);
      yPosition += 8;
    }
    
    // Trennlinie
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    
    // Rezepttext
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    // Text aufbereiten
    const cleanText = recipe.text
      .replace(/^## /gm, '\n▸ ')
      .replace(/^- /gm, '  • ')
      .replace(/^\d+\. /gm, (match) => `  ${match}`);
    
    // Text mit automatischem Umbruch und Seitenumbruch
    const lines = doc.splitTextToSize(cleanText, pageWidth - (margin * 2));
    
    for (const line of lines) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    }
    
    // Footer auf jeder Seite
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        'Ricetti in Pittari - Wo Tradition, Liebe und reine Zutaten zusammenfinden',
        margin,
        pageHeight - 10
      );
      doc.text(`Seite ${i} von ${totalPages}`, pageWidth - margin - 25, pageHeight - 10);
    }
    
    // PDF herunterladen
    const filename = `${recipe.title.replace(/[^a-zA-Z0-9äöüÄÖÜß\s]/g, '').replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
    
  } catch (e) {
    console.error('Fehler beim Generieren des PDFs:', e);
    // Fallback: Als Textdatei herunterladen
    downloadAsText(recipe);
  } finally {
    isGeneratingPdf.value = false;
  }
}

// Fallback: Als Textdatei herunterladen
function downloadAsText(recipe) {
  const content = `${recipe.title}\n${'='.repeat(recipe.title.length)}\n\nRezept für: ${product.value?.title || 'Unbekannt'}\n\n${recipe.text}\n\n---\nRicetti in Pittari - Wo Tradition, Liebe und reine Zutaten zusammenfinden`;
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${recipe.title.replace(/[^a-zA-Z0-9äöüÄÖÜß\s]/g, '').replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="container py-5">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Lade Produkt...</span>
      </div>
      <p class="mt-2">Lade Produkt...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-5">
      <div class="alert alert-danger">
        {{ error }}
      </div>
      <router-link to="/" class="btn btn-accent mt-3">
        Zurück zum Katalog
      </router-link>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="row">
      <div class="col-md-6">
        <img :src="product.imageUrlDetails || product.imageUrl" :alt="product.title" class="img-fluid d-block mx-auto rounded-5" />
      </div>

      <div class="col-md-6">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h1 class="display-6 fw-bold mb-0">{{ product.title }}</h1>
          <ShareButton 
            :title="product.title" 
            :description="product.description"
            :url="shareUrl"
          />
        </div>
        <p class="lead text-secondary">{{ product.description }}</p>

        <div class="mb-4">
            <span class="fs-5 fw-bold text-accent">{{ product.price }} €</span>
        </div>
        
        <p v-if="product.ingredients">
            <span class="fw-bold">Zutaten:</span> {{ product.ingredients }}
        </p>

        <!-- Rezepte Section -->
        <div v-if="recipes && recipes.length > 0" class="mt-4">
          <h3 class="fw-bold mb-3">🍳 Rezepte</h3>
          <div class="d-flex flex-wrap gap-2">
            <button 
              v-for="recipe in recipes" 
              :key="recipe.id"
              @click="showRecipe(recipe)"
              class="btn btn-outline-accent"
            >
              {{ recipe.title }}
            </button>
          </div>
        </div>

        <!-- Aktives Rezept Anzeige -->
        <div v-if="activeRecipe" class="mt-4 p-4 bg-light rounded-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <h4 class="fw-bold mb-0">{{ activeRecipe.title }}</h4>
            <div class="d-flex gap-2 align-items-center">
              <ShareButton 
                :title="`${activeRecipe.title} - ${product.title}`" 
                :description="`Rezept: ${activeRecipe.title} für ${product.title}`"
                :url="shareUrl"
              />
              <button @click="hideRecipe" class="btn-close" aria-label="Schließen"></button>
            </div>
          </div>
          <div v-html="formatMarkdown(activeRecipe.text)" class="recipe-content"></div>
          
          <!-- PDF Download - nur für eingeloggte User -->
          <div class="mt-3">
            <button 
              v-if="isAuthenticated"
              @click="downloadRecipePdf(activeRecipe)"
              class="btn btn-accent"
              :disabled="isGeneratingPdf"
            >
              <span v-if="isGeneratingPdf">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Generiere PDF...
              </span>
              <span v-else>
                📄 Rezept als PDF herunterladen
              </span>
            </button>
            <!-- Hinweis für nicht eingeloggte User -->
            <div v-if="!isAuthenticated" class="alert alert-info mb-0">
              <small>
                <i class="bi bi-info-circle me-1"></i>
                Logge dich ein, um das Rezept als PDF herunterzuladen.
              </small>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 d-flex flex-wrap gap-2">
          <router-link to="/" class="btn btn-outline-secondary-custom">
            ← Zurück zum Katalog
          </router-link>
          
          <!-- Bearbeiten Button - nur für ADMINS (StyleTile Design) -->
          <router-link 
            v-if="isAdmin" 
            :to="`/product/edit/${product.id}`" 
            class="btn btn-edit-admin"
          >
            ✏️ Bearbeiten
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <h1 class="display-5">Produkt nicht gefunden</h1>
      <p class="lead">Das gesuchte Rezept existiert leider nicht.</p>
      <router-link to="/" class="btn btn-accent mt-3">
        Zurück zum Katalog
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   STYLETILE STYLES
   Farben: #ffffff, #f0f0f0, #c9c9c9, #e54c4c
   Font: Inter
   ============================================ */

/* Rezept Buttons (Outline-Stil) */
.btn-outline-accent {
  background-color: #ffffff;
  border: 2px solid #e54c4c;
  color: #e54c4c;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-outline-accent:hover {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.2);
}

/* Primary Button (gefüllt) */
.btn-accent {
  background-color: #e54c4c;
  border: 2px solid #e54c4c;
  color: #ffffff;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-accent:hover:not(:disabled) {
  background-color: #d43c3c;
  border-color: #d43c3c;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.3);
}

.btn-accent:disabled {
  background-color: #c9c9c9;
  border-color: #c9c9c9;
  cursor: not-allowed;
}

/* Zurück Button (Sekundär Outline) */
.btn-outline-secondary-custom {
  background-color: #ffffff;
  border: 2px solid #c9c9c9;
  color: #333;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-decoration: none;
  padding: 0.375rem 1rem;
  transition: all 0.2s ease;
}

.btn-outline-secondary-custom:hover {
  background-color: #f0f0f0;
  border-color: #c9c9c9;
  color: #333;
  transform: translateY(-1px);
}

/* Admin Bearbeiten Button (Outline-Stil wie im StyleTile) */
.btn-edit-admin {
  background-color: #ffffff;
  border: 2px solid #e54c4c;
  color: #e54c4c;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-decoration: none;
  padding: 0.375rem 1rem;
  transition: all 0.2s ease;
}

.btn-edit-admin:hover {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.3);
}

/* Rezept Content */
.recipe-content {
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
}

.recipe-content :deep(h4) {
  color: #e54c4c;
  font-weight: 600;
}

.recipe-content :deep(ul),
.recipe-content :deep(ol) {
  padding-left: 1.5rem;
}

/* Alert im StyleTile-Design */
.alert-info {
  background-color: #f0f0f0;
  border: 1px solid #c9c9c9;
  color: #333;
  border-radius: 8px;
}
</style>