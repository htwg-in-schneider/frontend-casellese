<script setup>
const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'accent' },
  onClick: { type: Function, default: null }
});

const buttonClass = `btn btn-${props.variant}`;
</script>

<template>
  <button :type="type" :class="buttonClass" @click="onClick">
    <slot />
  </button>
</template>

<style scoped>
/* ============================================
   STYLETILE BUTTON STYLES
   Farben: #ffffff, #f0f0f0, #c9c9c9, #e54c4c
   Font: Inter
   ============================================ */

/* Basis-Styles für alle Buttons */
.btn {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* PRIMARY BUTTON (gefüllt) - Hauptaktionen wie "Speichern" */
.btn-accent {
  background-color: #e54c4c;
  border: 2px solid #e54c4c;
  color: #ffffff;
}

.btn-accent:hover,
.btn-accent:focus {
  background-color: #d43c3c;
  border-color: #d43c3c;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.3);
}

.btn-accent:active {
  background-color: #c43030;
  border-color: #c43030;
  transform: translateY(0);
}

.btn-accent:disabled {
  background-color: #c9c9c9;
  border-color: #c9c9c9;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* SECONDARY/OUTLINE BUTTON - Sekundäre Aktionen wie "Abbrechen" */
.btn-secondary,
.btn-outline {
  background-color: #ffffff;
  border: 2px solid #e54c4c;
  color: #e54c4c;
}

.btn-secondary:hover,
.btn-secondary:focus,
.btn-outline:hover,
.btn-outline:focus {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.2);
}

.btn-secondary:active,
.btn-outline:active {
  background-color: #d43c3c;
  border-color: #d43c3c;
  color: #ffffff;
  transform: translateY(0);
}

.btn-secondary:disabled,
.btn-outline:disabled {
  background-color: #f0f0f0;
  border-color: #c9c9c9;
  color: #c9c9c9;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* DANGER BUTTON - Destruktive Aktionen wie "Löschen" */
.btn-danger {
  background-color: #ffffff;
  border: 2px solid #e54c4c;
  color: #e54c4c;
}

.btn-danger:hover,
.btn-danger:focus {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 76, 76, 0.3);
}

.btn-danger:active {
  background-color: #d43c3c;
  border-color: #d43c3c;
  color: #ffffff;
  transform: translateY(0);
}

.btn-danger:disabled {
  background-color: #f0f0f0;
  border-color: #c9c9c9;
  color: #c9c9c9;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* LIGHT BUTTON - für Banner etc. */
.btn-light {
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-light:hover,
.btn-light:focus {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  color: #ffffff;
}

.btn-light:active {
  background-color: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
  color: #ffffff;
}
</style>
