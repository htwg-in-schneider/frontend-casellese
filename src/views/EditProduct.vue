<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import Button from '@/components/Button.vue';
import NavButton from '@/components/NavButton.vue';

const route = useRoute();
const router = useRouter();
const { getAccessTokenSilently } = useAuth0();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const product = ref({});
const categories = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const errorMessage = ref('');

// Kategorien laden
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

// Produkt laden
async function fetchProduct() {
  const productId = route.params.id;
  try {
    const response = await fetch(`${apiUrl}/api/product/${productId}`);
    if (!response.ok) {
      throw new Error(`Produkt nicht gefunden: ${response.status}`);
    }
    product.value = await response.json();
  } catch (error) {
    console.error('Fehler beim Laden des Produkts:', error);
    errorMessage.value = 'Produkt konnte nicht geladen werden.';
  }
}

// Produkt aktualisieren
async function updateProduct() {
  if (!product.value.title || !product.value.category) {
    errorMessage.value = 'Bitte fülle mindestens Titel und Kategorie aus.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/product/${product.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product.value),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Keine Berechtigung. Nur Admins können Produkte bearbeiten.');
      }
      throw new Error(`Fehler beim Aktualisieren: ${response.status}`);
    }

    alert('Produkt erfolgreich aktualisiert!');
    router.push('/');
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Produkts:', error);
    errorMessage.value = error.message || 'Produkt konnte nicht aktualisiert werden.';
  } finally {
    isSubmitting.value = false;
  }
}

// Produkt löschen
async function deleteProduct() {
  if (!confirm('Möchtest du dieses Produkt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/product/${product.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Keine Berechtigung. Nur Admins können Produkte löschen.');
      }
      throw new Error(`Fehler beim Löschen: ${response.status}`);
    }

    alert('Produkt erfolgreich gelöscht!');
    router.push('/');
  } catch (error) {
    console.error('Fehler beim Löschen des Produkts:', error);
    errorMessage.value = error.message || 'Produkt konnte nicht gelöscht werden.';
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([fetchCategories(), fetchProduct()]);
  isLoading.value = false;
});
</script>

<template>
  <Navbar />
  <div class="container py-5" style="min-height: 70vh;">
    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Lade Produkt...</span>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h2 class="fw-bold mb-4">✏️ Produkt bearbeiten</h2>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <!-- Bildvorschau -->
        <div v-if="product.imageUrl" class="text-center mb-4">
          <img 
            :src="product.imageUrlDetails || product.imageUrl" 
            :alt="product.title" 
            class="img-fluid rounded" 
            style="max-height: 250px;" 
          />
        </div>

        <form @submit.prevent="updateProduct">
          <!-- ID (readonly) -->
          <div class="mb-3">
            <label for="productId" class="form-label">Produkt ID</label>
            <input 
              type="text" 
              id="productId" 
              class="form-control" 
              :value="product.id" 
              readonly 
              disabled
            />
          </div>

          <!-- Titel -->
          <div class="mb-3">
            <label for="productTitle" class="form-label">Titel *</label>
            <input 
              type="text" 
              id="productTitle" 
              class="form-control" 
              v-model="product.title" 
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
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="d-flex flex-wrap gap-2">
            <NavButton variant="secondary" to="/">Abbrechen</NavButton>
            <Button type="submit" variant="accent" :disabled="isSubmitting">
              {{ isSubmitting ? 'Speichere...' : 'Speichern' }}
            </Button>
            <Button 
              type="button" 
              variant="danger" 
              :disabled="isSubmitting"
              :onClick="deleteProduct"
            >
              🗑️ Löschen
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <Footer />
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

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}
</style>