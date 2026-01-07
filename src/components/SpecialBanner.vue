
<script setup>
import { useBannerStore } from '@/stores/banner';
import Button from '@/components/Button.vue';

const bannerStore = useBannerStore();

defineProps({
    text: {
        type: String,
        default: 'Sehen Sie unsere neuen Rezepte an ->',
    }
});
</script>

<template>
    <div id="specialbanner" class="text-center py-3" v-if="bannerStore.isVisible">
        <router-link to="/" class="banner-link">{{ text }}</router-link>&nbsp;&nbsp;
        <Button variant="light" @click="bannerStore.hideBanner">✕</Button>
    </div>
</template>

<style scoped>
#specialbanner {
    background-color: #e54c4c;
    color: white;
}

.banner-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
}

.banner-link:hover {
    color: #f0f0f0;
    text-decoration: underline;
}
</style>