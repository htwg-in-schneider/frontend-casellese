<script setup>
import { ref, onMounted, defineEmits } from 'vue';

const emit = defineEmits(['filter']);

// Filter state
const searchName = ref('');
const selectedCategory = ref('');
const categories = ref([]);
const isLoading = ref(false);

// Category translations (German)
const categoryTranslations = {
  BROT: 'Brot',
  SALAMI: 'Salami & Wurst',
  KAESE: 'Käse'
};

/**
 * Fetches available categories from the backend
 */
async function fetchCategories() {
  isLoading.value = true;
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
    const response = await fetch(`${apiBaseUrl}/api/category`);
    
    if (response.ok) {
      const data = await response.json();
      categories.value = data.map(cat => ({
        value: cat,
        label: categoryTranslations[cat] || cat
      }));
    } else {
      // Fallback to hardcoded categories if API fails
      categories.value = Object.keys(categoryTranslations).map(cat => ({
        value: cat,
        label: categoryTranslations[cat]
      }));
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to hardcoded categories
    categories.value = Object.keys(categoryTranslations).map(cat => ({
      value: cat,
      label: categoryTranslations[cat]
    }));
  } finally {
    isLoading.value = false;
  }
}

/**
 * Emits filter parameters to parent component
 */
function applyFilter() {
  emit('filter', {
    name: searchName.value.trim(),
    category: selectedCategory.value
  });
}

/**
 * Resets all filters and emits empty filter
 */
function resetFilter() {
  searchName.value = '';
  selectedCategory.value = '';
  emit('filter', { name: '', category: '' });
}

// Fetch categories on component mount
onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="product-filter mb-4">
    <div class="card border-0 shadow-sm rounded-4">
      <div class="card-body p-4">
        <div class="row g-3 align-items-end">
          <!-- Search by Name -->
          <div class="col-12 col-md-5">
            <label for="searchName" class="form-label fw-semibold text-secondary">
              <i class="bi bi-search me-2"></i>Rezept suchen
            </label>
            <input
              id="searchName"
              v-model="searchName"
              type="text"
              class="form-control form-control-lg rounded-3"
              placeholder="z.B. Caciocavallo, Brot..."
              @keyup.enter="applyFilter"
            />
          </div>
          
          <!-- Filter by Category -->
          <div class="col-12 col-md-4">
            <label for="categorySelect" class="form-label fw-semibold text-secondary">
              <i class="bi bi-tag me-2"></i>Kategorie
            </label>
            <select
              id="categorySelect"
              v-model="selectedCategory"
              class="form-select form-select-lg rounded-3"
              :disabled="isLoading"
            >
              <option value="">Alle Kategorien</option>
              <option 
                v-for="category in categories" 
                :key="category.value" 
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </div>
          
          <!-- Action Buttons -->
          <div class="col-12 col-md-3">
            <div class="d-flex gap-2">
              <button 
                class="btn btn-accent btn-lg flex-grow-1 rounded-3"
                @click="applyFilter"
                :disabled="isLoading"
              >
                <i class="bi bi-funnel me-2"></i>Filtern
              </button>
              <button 
                class="btn btn-outline-secondary btn-lg rounded-3"
                @click="resetFilter"
                :disabled="isLoading"
                title="Filter zurücksetzen"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-filter .card {
  background: linear-gradient(135deg, #fff 0%, #fafafa 100%);
}

.form-control:focus,
.form-select:focus {
  border-color: #e54c4c;
  box-shadow: 0 0 0 0.2rem rgba(229, 76, 76, 0.15);
}

.btn-accent {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: white;
  transition: all 0.2s ease;
}

.btn-accent:hover {
  background-color: #d43c3c;
  border-color: #d43c3c;
  color: white;
  transform: translateY(-1px);
}

.btn-accent:disabled {
  background-color: #e54c4c;
  border-color: #e54c4c;
  opacity: 0.65;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

/* Loading state animation */
.form-select:disabled {
  background-color: #f8f9fa;
  cursor: wait;
}
</style>