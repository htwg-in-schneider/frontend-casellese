<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  href: {
    type: String,
    required: false,
    default: '#'
  },
});
</script>

<template>
  <a :href="href" class="footer-link" :aria-label="label">
    {{ text }}
  </a>
</template>

<style scoped>
.footer-link {
    color: #000000;
    text-decoration: #e54c4c;
}

.footer-link:hover {
    color: #e54c4c;
}
</style>