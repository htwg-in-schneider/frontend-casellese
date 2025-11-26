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
/* Button styled to the requested color */
.btn-accent {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: #ffffff;
  text-decoration: none;
}

/* Slightly darker on hover/focus for affordance */
.btn-accent:hover,
.btn-accent:focus {
  background-color: #d44444;
  border-color: #d44444;
  color: #ffffff;
  text-decoration: none;
}

/* Active state */
.btn-accent:active {
  background-color: #c43b3b;
  border-color: #c43b3b;
  color: #ffffff;
}

/* Ensure anchor acting as button has the expected cursor */
.btn-accent {
  cursor: pointer;
}
</style>