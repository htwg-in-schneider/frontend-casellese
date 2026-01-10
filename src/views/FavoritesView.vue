<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useFavoritesStore } from '@/stores/favorites'
import FavoriteButton from '@/components/FavoriteButton.vue'

const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0()
const favoritesStore = useFavoritesStore()

const isLoading = ref(true)
const activeRecipe = ref(null)
const isGeneratingPdf = ref(false)
const isGeneratingShoppingList = ref(false)
const showShoppingListModal = ref(false)
const shoppingListItems = ref([])

// Computed: Gefilterte und sortierte Favoriten
const favorites = computed(() => favoritesStore.sortedFavorites)

// Favoriten laden
async function loadFavorites() {
    if (!isAuthenticated.value) {
        isLoading.value = false
        return
    }
    
    isLoading.value = true
    try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        await favoritesStore.fetchFavorites(getAccessTokenSilently, apiBaseUrl)
    } catch (error) {
        console.error('Fehler beim Laden der Favoriten:', error)
    } finally {
        isLoading.value = false
    }
}

// Rezept anzeigen
function showRecipe(favorite) {
    activeRecipe.value = favorite
}

// Rezept schließen
function hideRecipe() {
    activeRecipe.value = null
}

// Markdown formatieren
function formatMarkdown(text) {
    if (!text) return ''
    return text
        .replace(/^## (.+)$/gm, '<h4 class="mt-3 mb-2 fw-bold">$1</h4>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul class="mb-3">$1</ul>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
}

// Zutaten aus Rezepttext extrahieren
function extractIngredients(recipeText) {
    if (!recipeText) return []
    
    const ingredients = []
    const lines = recipeText.split('\n')
    
    let inIngredientsSection = false
    
    for (const line of lines) {
        const trimmedLine = line.trim()
        
        // Prüfe ob wir in einem Zutaten-Abschnitt sind
        if (trimmedLine.toLowerCase().includes('zutaten') || 
            trimmedLine.toLowerCase().includes('ingredients')) {
            inIngredientsSection = true
            continue
        }
        
        // Prüfe ob ein neuer Abschnitt beginnt (z.B. "## Zubereitung")
        if (trimmedLine.startsWith('##') && !trimmedLine.toLowerCase().includes('zutaten')) {
            inIngredientsSection = false
            continue
        }
        
        // Extrahiere Zutaten (Zeilen die mit - oder * oder Zahl beginnen)
        if (inIngredientsSection || trimmedLine.match(/^[-*•]\s/) || trimmedLine.match(/^\d+[\.,]?\s*(g|kg|ml|l|EL|TL|Stück|Prise|Bund|Dose|Packung|Becher|Tasse)/i)) {
            const cleanedLine = trimmedLine
                .replace(/^[-*•]\s*/, '')
                .replace(/^\d+\.\s*/, '')
                .trim()
            
            if (cleanedLine && cleanedLine.length > 1 && !cleanedLine.toLowerCase().startsWith('zubereitung')) {
                ingredients.push(cleanedLine)
            }
        }
    }
    
    return ingredients
}

// Einkaufsliste generieren
function generateShoppingList() {
    const allIngredients = []
    
    for (const favorite of favorites.value) {
        const ingredients = extractIngredients(favorite.recipeText)
        for (const ingredient of ingredients) {
            allIngredients.push({
                ingredient,
                recipe: favorite.recipeTitle
            })
        }
    }
    
    shoppingListItems.value = allIngredients
    showShoppingListModal.value = true
}

// Einkaufsliste als Text herunterladen
function downloadShoppingListAsText() {
    const date = new Date().toLocaleDateString('de-DE')
    let content = `🛒 EINKAUFSLISTE\n`
    content += `Erstellt am: ${date}\n`
    content += `${'='.repeat(40)}\n\n`
    
    // Gruppiere nach Rezept
    const byRecipe = {}
    for (const item of shoppingListItems.value) {
        if (!byRecipe[item.recipe]) {
            byRecipe[item.recipe] = []
        }
        byRecipe[item.recipe].push(item.ingredient)
    }
    
    for (const [recipe, ingredients] of Object.entries(byRecipe)) {
        content += `📖 ${recipe}\n`
        content += `${'-'.repeat(30)}\n`
        for (const ingredient of ingredients) {
            content += `  ☐ ${ingredient}\n`
        }
        content += `\n`
    }
    
    content += `\n${'='.repeat(40)}\n`
    content += `Ricetti in Pittari - Buon appetito! 🍝\n`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Einkaufsliste_${date.replace(/\./g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

// Einkaufsliste als PDF herunterladen
async function downloadShoppingListAsPdf() {
    isGeneratingShoppingList.value = true
    
    try {
        const { jsPDF } = await import('jspdf')
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 20
        let yPosition = 25
        
        const date = new Date().toLocaleDateString('de-DE')
        
        // Titel
        doc.setFontSize(24)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(229, 76, 76) // #e54c4c
        doc.text('Einkaufsliste', margin, yPosition)
        yPosition += 10
        
        // Datum
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 100)
        doc.text(`Erstellt am: ${date}`, margin, yPosition)
        yPosition += 8
        
        // Trennlinie
        doc.setDrawColor(229, 76, 76)
        doc.setLineWidth(0.5)
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 15
        
        // Gruppiere nach Rezept
        const byRecipe = {}
        for (const item of shoppingListItems.value) {
            if (!byRecipe[item.recipe]) {
                byRecipe[item.recipe] = []
            }
            byRecipe[item.recipe].push(item.ingredient)
        }
        
        doc.setTextColor(0, 0, 0)
        
        for (const [recipe, ingredients] of Object.entries(byRecipe)) {
            // Prüfe ob genug Platz für Rezept-Header + mindestens 2 Zutaten
            if (yPosition > pageHeight - 50) {
                doc.addPage()
                yPosition = 25
            }
            
            // Rezept-Titel
            doc.setFontSize(13)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(229, 76, 76)
            doc.text(recipe, margin, yPosition)
            yPosition += 8
            
            // Zutaten
            doc.setFontSize(11)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(0, 0, 0)
            
            for (const ingredient of ingredients) {
                if (yPosition > pageHeight - 25) {
                    doc.addPage()
                    yPosition = 25
                }
                
                // Checkbox zeichnen
                doc.setDrawColor(150, 150, 150)
                doc.setLineWidth(0.3)
                doc.rect(margin, yPosition - 4, 4, 4)
                
                // Zutat
                const lines = doc.splitTextToSize(ingredient, pageWidth - margin - 30)
                doc.text(lines, margin + 8, yPosition)
                yPosition += (lines.length * 6) + 2
            }
            
            yPosition += 8
        }
        
        // Footer auf jeder Seite
        const totalPages = doc.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i)
            doc.setFontSize(9)
            doc.setTextColor(150, 150, 150)
            doc.text(
                'Ricetti in Pittari - Buon appetito!',
                margin,
                pageHeight - 10
            )
            doc.text(`Seite ${i} von ${totalPages}`, pageWidth - margin - 25, pageHeight - 10)
        }
        
        doc.save(`Einkaufsliste_${date.replace(/\./g, '-')}.pdf`)
    } catch (e) {
        console.error('Fehler beim Generieren der Einkaufsliste:', e)
        // Fallback: Als Text herunterladen
        downloadShoppingListAsText()
    } finally {
        isGeneratingShoppingList.value = false
    }
}

// PDF herunterladen
async function downloadRecipePdf(favorite) {
    if (favorite.recipePdfUrl) {
        window.open(favorite.recipePdfUrl, '_blank')
        return
    }
    
    isGeneratingPdf.value = true
    
    try {
        const { jsPDF } = await import('jspdf')
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 20
        let yPosition = 25
        
        // Titel
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        doc.text(favorite.recipeTitle, margin, yPosition)
        yPosition += 12
        
        // Produktname
        if (favorite.productTitle) {
            doc.setFontSize(12)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(100, 100, 100)
            doc.text(`Rezept für: ${favorite.productTitle}`, margin, yPosition)
            yPosition += 8
        }
        
        // Trennlinie
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10
        
        // Rezepttext
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        
        const cleanText = favorite.recipeText
            .replace(/^## /gm, '\n▸ ')
            .replace(/^- /gm, '  • ')
            .replace(/^\d+\. /gm, (match) => `  ${match}`)
        
        const lines = doc.splitTextToSize(cleanText, pageWidth - (margin * 2))
        
        for (const line of lines) {
            if (yPosition > pageHeight - 30) {
                doc.addPage()
                yPosition = 20
            }
            doc.text(line, margin, yPosition)
            yPosition += 6
        }
        
        // Footer
        const totalPages = doc.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i)
            doc.setFontSize(9)
            doc.setTextColor(150, 150, 150)
            doc.text(
                'Ricetti in Pittari - Wo Tradition, Liebe und reine Zutaten zusammenfinden',
                margin,
                pageHeight - 10
            )
            doc.text(`Seite ${i} von ${totalPages}`, pageWidth - margin - 25, pageHeight - 10)
        }
        
        const filename = `${favorite.recipeTitle.replace(/[^a-zA-Z0-9äöüÄÖÜß\s]/g, '').replace(/\s+/g, '_')}.pdf`
        doc.save(filename)
    } catch (e) {
        console.error('Fehler beim Generieren des PDFs:', e)
    } finally {
        isGeneratingPdf.value = false
    }
}

// Handler wenn Favorit entfernt wird
function onFavoriteToggled({ recipeId, isFavorite }) {
    if (!isFavorite && activeRecipe.value?.recipeId === recipeId) {
        hideRecipe()
    }
}

// Login durchführen
async function handleLogin() {
    await loginWithRedirect({
        appState: { targetUrl: '/merkliste' }
    })
}

onMounted(() => {
    loadFavorites()
})
</script>

<template>
    <div class="container py-5">
        <!-- Header -->
        <div class="text-center mb-5">
            <h1 class="display-5 fw-bold">
                <i class="bi bi-heart-fill text-accent me-2"></i>
                Meine Merkliste
            </h1>
            <p class="lead text-secondary">
                Deine gespeicherten Lieblingsrezepte
            </p>
        </div>

        <!-- Nicht eingeloggt -->
        <div v-if="!isAuthenticated" class="text-center py-5">
            <div class="card border-0 shadow-sm mx-auto" style="max-width: 450px;">
                <div class="card-body p-5">
                    <i class="bi bi-heart display-1 text-accent mb-3"></i>
                    <h3 class="fw-bold mb-3">Anmelden erforderlich</h3>
                    <p class="text-secondary mb-4">
                        Melde dich an, um deine Lieblingsrezepte zu speichern und jederzeit darauf zugreifen zu können.
                    </p>
                    <button @click="handleLogin" class="btn btn-accent btn-lg">
                        <i class="bi bi-box-arrow-in-right me-2"></i>
                        Jetzt anmelden
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-else-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-accent" role="status">
                <span class="visually-hidden">Lade Merkliste...</span>
            </div>
            <p class="mt-2">Lade deine Merkliste...</p>
        </div>

        <!-- Leere Merkliste -->
        <div v-else-if="favorites.length === 0" class="text-center py-5">
            <div class="card border-0 shadow-sm mx-auto" style="max-width: 450px;">
                <div class="card-body p-5">
                    <i class="bi bi-bookmark display-1 text-muted mb-3"></i>
                    <h3 class="fw-bold mb-3">Noch keine Rezepte gespeichert</h3>
                    <p class="text-secondary mb-4">
                        Klicke auf das Herz-Symbol bei einem Rezept, um es deiner Merkliste hinzuzufügen.
                    </p>
                    <router-link to="/rezepte" class="btn btn-accent">
                        <i class="bi bi-search me-2"></i>
                        Rezepte entdecken
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Favoriten Liste -->
        <div v-else class="row">
            <!-- Favoriten Cards -->
            <div class="col-lg-6 mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">
                        <i class="bi bi-collection me-2"></i>
                        {{ favorites.length }} {{ favorites.length === 1 ? 'Rezept' : 'Rezepte' }}
                    </h5>
                    <!-- Einkaufsliste Button -->
                    <button 
                        @click="generateShoppingList"
                        class="btn btn-outline-accent btn-sm"
                        :disabled="favorites.length === 0"
                    >
                        <i class="bi bi-cart3 me-1"></i>
                        Einkaufsliste
                    </button>
                </div>
                
                <div class="list-group">
                    <div 
                        v-for="favorite in favorites" 
                        :key="favorite.id"
                        class="list-group-item list-group-item-action d-flex align-items-center p-3"
                        :class="{ 'active-recipe': activeRecipe?.id === favorite.id }"
                        @click="showRecipe(favorite)"
                    >
                        <!-- Produktbild -->
                        <img 
                            v-if="favorite.productImageUrl"
                            :src="favorite.productImageUrl" 
                            :alt="favorite.productTitle"
                            class="rounded me-3"
                            style="width: 60px; height: 60px; object-fit: cover;"
                        />
                        <div v-else class="placeholder-img rounded me-3 d-flex align-items-center justify-content-center bg-light">
                            <i class="bi bi-image text-muted"></i>
                        </div>
                        
                        <!-- Rezept Info -->
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fw-bold">{{ favorite.recipeTitle }}</h6>
                            <small class="text-muted">
                                <router-link 
                                    v-if="favorite.productId"
                                    :to="{ name: 'product', params: { id: favorite.productId } }"
                                    class="text-decoration-none text-accent"
                                    @click.stop
                                >
                                    {{ favorite.productTitle }}
                                </router-link>
                            </small>
                        </div>
                        
                        <!-- Favorit Button -->
                        <FavoriteButton 
                            :recipe-id="favorite.recipeId" 
                            size="sm"
                            @toggled="onFavoriteToggled"
                            @click.stop
                        />
                    </div>
                </div>
            </div>

            <!-- Rezept Detail (Desktop: rechte Seite) -->
            <div class="col-lg-6">
                <div v-if="activeRecipe" class="card border-0 shadow-sm sticky-top" style="top: 100px;">
                    <div class="card-header bg-accent text-white d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 fw-bold">{{ activeRecipe.recipeTitle }}</h5>
                        <button @click="hideRecipe" class="btn-close btn-close-white" aria-label="Schließen"></button>
                    </div>
                    <div class="card-body">
                        <!-- Produktlink -->
                        <div v-if="activeRecipe.productId" class="mb-3">
                            <router-link 
                                :to="{ name: 'product', params: { id: activeRecipe.productId } }"
                                class="text-decoration-none"
                            >
                                <small class="text-accent">
                                    <i class="bi bi-box me-1"></i>
                                    {{ activeRecipe.productTitle }}
                                </small>
                            </router-link>
                        </div>
                        
                        <!-- Rezepttext -->
                        <div v-html="formatMarkdown(activeRecipe.recipeText)" class="recipe-content"></div>
                        
                        <!-- Aktionen -->
                        <div class="mt-4 d-flex gap-2 flex-wrap">
                            <button 
                                @click="downloadRecipePdf(activeRecipe)"
                                class="btn btn-accent"
                                :disabled="isGeneratingPdf"
                            >
                                <span v-if="isGeneratingPdf">
                                    <span class="spinner-border spinner-border-sm me-2"></span>
                                    Generiere PDF...
                                </span>
                                <span v-else>
                                    <i class="bi bi-file-pdf me-1"></i>
                                    Als PDF
                                </span>
                            </button>
                            
                            <router-link 
                                v-if="activeRecipe.productId"
                                :to="{ name: 'product', params: { id: activeRecipe.productId } }"
                                class="btn btn-outline-accent"
                            >
                                <i class="bi bi-arrow-right me-1"></i>
                                Zum Produkt
                            </router-link>
                        </div>
                    </div>
                </div>
                
                <!-- Platzhalter wenn kein Rezept ausgewählt -->
                <div v-else class="card border-0 bg-light text-center p-5">
                    <i class="bi bi-hand-index display-4 text-muted mb-3"></i>
                    <p class="text-muted mb-0">
                        Wähle ein Rezept aus der Liste aus, um es hier anzuzeigen.
                    </p>
                </div>
            </div>
        </div>

        <!-- Einkaufsliste Modal -->
        <div v-if="showShoppingListModal" class="modal-backdrop" @click.self="showShoppingListModal = false">
            <div class="modal-content-custom">
                <div class="modal-header-custom">
                    <h5 class="mb-0 fw-bold">
                        <i class="bi bi-cart3 me-2"></i>
                        Einkaufsliste
                    </h5>
                    <button @click="showShoppingListModal = false" class="btn-close" aria-label="Schließen"></button>
                </div>
                <div class="modal-body-custom">
                    <div v-if="shoppingListItems.length === 0" class="text-center py-4">
                        <i class="bi bi-inbox display-4 text-muted mb-3"></i>
                        <p class="text-muted">Keine Zutaten gefunden. Die Rezepte enthalten möglicherweise keine erkennbaren Zutatenlisten.</p>
                    </div>
                    <div v-else>
                        <p class="text-muted mb-3">
                            <small>{{ shoppingListItems.length }} Zutaten aus {{ favorites.length }} Rezepten</small>
                        </p>
                        <div class="shopping-list-scroll">
                            <div v-for="(item, index) in shoppingListItems" :key="index" class="shopping-item">
                                <i class="bi bi-square me-2 text-muted"></i>
                                <span>{{ item.ingredient }}</span>
                                <small class="text-muted ms-2">({{ item.recipe }})</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer-custom">
                    <button 
                        @click="downloadShoppingListAsText"
                        class="btn btn-outline-accent"
                        :disabled="shoppingListItems.length === 0"
                    >
                        <i class="bi bi-file-text me-1"></i>
                        Als Text
                    </button>
                    <button 
                        @click="downloadShoppingListAsPdf"
                        class="btn btn-accent"
                        :disabled="shoppingListItems.length === 0 || isGeneratingShoppingList"
                    >
                        <span v-if="isGeneratingShoppingList">
                            <span class="spinner-border spinner-border-sm me-1"></span>
                            Generiere...
                        </span>
                        <span v-else>
                            <i class="bi bi-file-pdf me-1"></i>
                            Als PDF
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ============================================
   STYLETILE STYLES
   Farben: #ffffff, #f0f0f0, #c9c9c9, #e54c4c
   ============================================ */

.text-accent {
    color: #e54c4c !important;
}

.bg-accent {
    background-color: #e54c4c !important;
}

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
}

.btn-outline-accent {
    background-color: #ffffff;
    border: 2px solid #e54c4c;
    color: #e54c4c;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    transition: all 0.2s ease;
    text-decoration: none;
}

.btn-outline-accent:hover {
    background-color: #e54c4c;
    border-color: #e54c4c;
    color: #ffffff;
    transform: translateY(-1px);
}

/* Liste */
.list-group-item {
    border: 1px solid #f0f0f0;
    border-radius: 8px !important;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.list-group-item:hover {
    background-color: #f9f9f9;
    transform: translateX(5px);
}

.list-group-item.active-recipe {
    border-color: #e54c4c;
    background-color: #fff5f5;
}

/* Placeholder Image */
.placeholder-img {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
}

/* Card */
.card {
    border-radius: 12px;
}

.card-header {
    border-radius: 12px 12px 0 0 !important;
}

/* Rezept Content */
.recipe-content {
    line-height: 1.6;
    font-family: 'Inter', sans-serif;
    max-height: 400px;
    overflow-y: auto;
}

.recipe-content :deep(h4) {
    color: #e54c4c;
    font-weight: 600;
}

.recipe-content :deep(ul),
.recipe-content :deep(ol) {
    padding-left: 1.5rem;
}

/* Modal */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    padding: 1rem;
}

.modal-content-custom {
    background: #ffffff;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header-custom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f0f0f0;
    background-color: #e54c4c;
    color: #ffffff;
    border-radius: 12px 12px 0 0;
}

.modal-header-custom .btn-close {
    filter: brightness(0) invert(1);
}

.modal-body-custom {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
}

.modal-footer-custom {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid #f0f0f0;
}

/* Shopping List Items */
.shopping-list-scroll {
    max-height: 350px;
    overflow-y: auto;
}

.shopping-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    align-items: flex-start;
}

.shopping-item:last-child {
    border-bottom: none;
}

.shopping-item small {
    font-size: 0.75rem;
    white-space: nowrap;
}
</style>