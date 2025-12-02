<template>
  <router-link :to="to" :class="buttonClass">
    <slot />
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  to: { type: [String, Object], required: true },
  variant: { type: String, default: 'accent' }
});

const buttonClass = `btn btn-${props.variant}`;
</script>