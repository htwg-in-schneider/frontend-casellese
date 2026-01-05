<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import Button from '@/components/Button.vue';
import NavButton from '@/components/NavButton.vue';

const router = useRouter();
const { getAccessTokenSilently } = useAuth0();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const product = ref({
  title: '',
  price: 0,
  imageUrl: '',
  imageUrlDetails: '',
  description: '',
  ingredients: '',
  category: '',
});

const categories = ref([]);
const isSubmitting = ref(false);
const errorMessage = ref('');

// Kategorien vom Backend laden
async function fetchCategories() {
  try {
    const response = await fetch(`${apiUrl}/api/category`);
    if (response.ok) {
      categories.value = await response.json();
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Produkt erstellen
async function createProduct() {
  if (!product.value.title || !product.value.category) {
    errorMessage.value = 'Bitte fülle mindestens Titel und Kategorie aus.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product.value),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Keine Berechtigung. Nur Admins können Produkte erstellen.');
      }
      throw new Error(`Fehler beim Erstellen: ${response.status}`);
    }

    alert('Produkt erfolgreich erstellt!');
    router.push('/');
  } catch (error) {
    console.error('Fehler beim Erstellen des Produkts:', error);
    errorMessage.value = error.message || 'Produkt konnte nicht erstellt werden.';
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="container py-5" style="min-height: 70vh;">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h2 class="fw-bold mb-4">🆕 Neues Produkt erstellen</h2>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="createProduct">
          <!-- Titel -->
          <div class="mb-3">
            <label for="productTitle" class="form-label">Titel *</label>
            <input 
              type="text" 
              id="productTitle" 
              class="form-control" 
              v-model="product.title" 
              placeholder="z.B. Caciocavallo"
              required 
            />
          </div>

          <!-- Kategorie -->
          <div class="mb-3">
            <label for="productCategory" class="form-label">Kategorie *</label>
            <select id="productCategory" class="form-select" v-model="product.category" required>
              <option value="">Bitte wählen</option>
              <option v-for="cat in categories" :key="cat.name" :value="cat.name">
                {{ cat.germanName }}
              </option>
            </select>
          </div>

          <!-- Preis -->
          <div class="mb-3">
            <label for="productPrice" class="form-label">Preis (€)</label>
            <input 
              type="number" 
              id="productPrice" 
              class="form-control" 
              v-model="product.price" 
              step="0.01"
              min="0"
            />
          </div>

          <!-- Bild-URL -->
          <div class="mb-3">
            <label for="productImageUrl" class="form-label">Bild-URL (Vorschau)</label>
            <input 
              type="url" 
              id="productImageUrl" 
              class="form-control" 
              v-model="product.imageUrl" 
              placeholder="https://example.com/bild.jpg"
            />
          </div>

          <!-- Detail Bild-URL -->
          <div class="mb-3">
            <label for="productImageUrlDetails" class="form-label">Bild-URL (Detailseite)</label>
            <input 
              type="url" 
              id="productImageUrlDetails" 
              class="form-control" 
              v-model="product.imageUrlDetails" 
              placeholder="https://example.com/bild-detail.jpg"
            />
          </div>

          <!-- Beschreibung -->
          <div class="mb-3">
            <label for="productDescription" class="form-label">Beschreibung</label>
            <textarea 
              id="productDescription" 
              class="form-control" 
              v-model="product.description"
              rows="3"
              placeholder="Beschreibe das Produkt..."
            ></textarea>
          </div>

          <!-- Zutaten -->
          <div class="mb-3">
            <label for="productIngredients" class="form-label">Zutaten</label>
            <textarea 
              id="productIngredients" 
              class="form-control" 
              v-model="product.ingredients"
              rows="2"
              placeholder="z.B. Kuhmilch, Lab, Salz..."
            ></textarea>
          </div>

          <!-- Bildvorschau -->
          <div v-if="product.imageUrl" class="mb-4">
            <label class="form-label">Bildvorschau</label>
            <div class="border rounded p-2">
              <img :src="product.imageUrl" alt="Vorschau" class="img-fluid" style="max-height: 200px;" />
            </div>
          </div>

          <!-- Buttons -->
          <div class="d-flex gap-2">
            <NavButton variant="secondary" to="/">Abbrechen</NavButton>
            <Button type="submit" variant="accent" :disabled="isSubmitting">
              {{ isSubmitting ? 'Erstelle...' : 'Produkt erstellen' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}
</style>