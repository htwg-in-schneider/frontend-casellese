<script setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useUserStore } from '@/stores/user';

const { getAccessTokenSilently } = useAuth0();
const userStore = useUserStore();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// State
const users = ref([]);
const isLoading = ref(true);
const error = ref('');
const successMessage = ref('');

// Edit Modal State
const showEditModal = ref(false);
const editingUser = ref(null);
const editForm = ref({
  name: '',
  email: '',
  role: ''
});
const isSaving = ref(false);

// Alle Nutzer laden
async function fetchUsers() {
  isLoading.value = true;
  error.value = '';
  
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      users.value = await response.json();
    } else if (response.status === 403) {
      error.value = 'Keine Berechtigung. Nur Admins können Nutzer verwalten.';
    } else {
      error.value = `Fehler beim Laden: ${response.status}`;
    }
  } catch (e) {
    error.value = 'Nutzer konnten nicht geladen werden.';
  } finally {
    isLoading.value = false;
  }
}

// Bearbeiten-Modal öffnen
function openEditModal(user) {
  editingUser.value = user;
  editForm.value = {
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'REGULAR'
  };
  showEditModal.value = true;
}

// Modal schließen
function closeEditModal() {
  showEditModal.value = false;
  editingUser.value = null;
}

// Nutzer speichern
async function saveUser() {
  if (!editingUser.value) return;
  
  isSaving.value = true;
  error.value = '';
  successMessage.value = '';
  
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/users/${editingUser.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editForm.value)
    });
    
    if (response.ok) {
      const updatedUser = await response.json();
      // User in Liste aktualisieren
      const index = users.value.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      successMessage.value = 'Nutzer erfolgreich aktualisiert!';
      closeEditModal();
      
      // Erfolgsmeldung nach 3 Sekunden ausblenden
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } else {
      error.value = `Fehler beim Speichern: ${response.status}`;
    }
  } catch (e) {
    error.value = 'Nutzer konnte nicht gespeichert werden.';
  } finally {
    isSaving.value = false;
  }
}

// Rolle als lesbaren Text
function getRoleName(role) {
  switch (role) {
    case 'ADMIN': return 'Administrator';
    case 'REGULAR': return 'Benutzer';
    default: return role;
  }
}

// Rolle Badge Klasse
function getRoleBadgeClass(role) {
  return role === 'ADMIN' ? 'bg-danger' : 'bg-secondary';
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="container py-5" style="min-height: 70vh;">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">
        <i class="bi bi-people me-2"></i>Nutzerverwaltung
      </h2>
      <span class="badge bg-secondary fs-6">{{ users.length }} Nutzer</span>
    </div>
    
    <!-- Erfolgsmeldung -->
    <div v-if="successMessage" class="alert alert-success d-flex align-items-center" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>
      {{ successMessage }}
    </div>
    
    <!-- Fehlermeldung -->
    <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>
    
    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Lade Nutzer...</span>
      </div>
      <p class="mt-3 text-muted">Lade Nutzer...</p>
    </div>
    
    <!-- Nutzer-Tabelle -->
    <div v-else-if="users.length > 0" class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-4">ID</th>
              <th scope="col">Name</th>
              <th scope="col">E-Mail</th>
              <th scope="col">Rolle</th>
              <th scope="col" class="text-end pe-4">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="ps-4">
                <span class="text-muted">#{{ user.id }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar-circle me-2">
                    {{ (user.name || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <span class="fw-medium">{{ user.name || '–' }}</span>
                </div>
              </td>
              <td>
                <span class="text-muted">{{ user.email || '–' }}</span>
              </td>
              <td>
                <span class="badge" :class="getRoleBadgeClass(user.role)">
                  {{ getRoleName(user.role) }}
                </span>
              </td>
              <td class="text-end pe-4">
                <button 
                  class="btn btn-outline-secondary btn-sm"
                  @click="openEditModal(user)"
                  title="Bearbeiten"
                >
                  <i class="bi bi-pencil me-1"></i>Bearbeiten
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Keine Nutzer -->
    <div v-else class="text-center py-5">
      <i class="bi bi-people text-muted" style="font-size: 4rem;"></i>
      <h4 class="mt-3">Keine Nutzer gefunden</h4>
    </div>
    
    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-backdrop" @click.self="closeEditModal">
      <div class="modal-content-custom">
        <div class="modal-header-custom">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-pencil me-2"></i>Nutzer bearbeiten
          </h5>
          <button type="button" class="btn-close" @click="closeEditModal"></button>
        </div>
        
        <div class="modal-body-custom">
          <form @submit.prevent="saveUser">
            <!-- Name -->
            <div class="mb-3">
              <label for="userName" class="form-label fw-medium">Name</label>
              <input 
                type="text" 
                id="userName" 
                class="form-control" 
                v-model="editForm.name"
                placeholder="Name des Nutzers"
              />
            </div>
            
            <!-- Email -->
            <div class="mb-3">
              <label for="userEmail" class="form-label fw-medium">E-Mail</label>
              <input 
                type="email" 
                id="userEmail" 
                class="form-control" 
                v-model="editForm.email"
                placeholder="email@example.com"
              />
            </div>
            
            <!-- Rolle -->
            <div class="mb-4">
              <label for="userRole" class="form-label fw-medium">Rolle</label>
              <select id="userRole" class="form-select" v-model="editForm.role">
                <option value="REGULAR">Benutzer</option>
                <option value="ADMIN">Administrator</option>
              </select>
              <small class="text-muted">
                Admins können Produkte, Rezepte und Nutzer verwalten.
              </small>
            </div>
            
            <!-- Buttons -->
            <div class="d-flex gap-2 justify-content-end">
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                @click="closeEditModal"
              >
                Abbrechen
              </button>
              <button 
                type="submit" 
                class="btn btn-accent"
                :disabled="isSaving"
              >
                <span v-if="isSaving">
                  <span class="spinner-border spinner-border-sm me-1"></span>
                  Speichern...
                </span>
                <span v-else>
                  <i class="bi bi-check-lg me-1"></i>Speichern
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-circle {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #e54c4c 0%, #c94141 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-accent {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: white;
}

.btn-accent:hover {
  background-color: #d43c3c;
  border-color: #d43c3c;
  color: white;
}

.btn-accent:disabled {
  background-color: #e54c4c;
  border-color: #e54c4c;
  opacity: 0.65;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content-custom {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  margin: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-body-custom {
  padding: 1.5rem;
}

/* Table Styles */
.table th {
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;
  border-bottom: 2px solid #e9ecef;
}

.table td {
  vertical-align: middle;
  padding: 1rem 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.9rem;
  }
  
  .avatar-circle {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}
</style>