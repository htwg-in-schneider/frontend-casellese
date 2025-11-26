<script setup>
import FooterLink from './FooterLink.vue';
</script>

<template>
    <footer class="text-center py-4">
        <p>&copy; 2025 Ricetti in Pittari. Alle Rechte vorbehalten.</p>
        <nav>
            <FooterLink text="Kontakt" label="Kontakt" href="/kontakt" />
            <span aria-hidden="true" style="margin: 0 0.5rem">|</span>
            <FooterLink text="Datenschutz" label="Datenschutz" href="/datenschutz" />
            <span aria-hidden="true" style="margin: 0 0.5rem">|</span>
            <FooterLink text="Impressum" label="Impressum" href="/impressum" />
        </nav>
    </footer>
</template>

<script setup>
</script>

<style scoped>

</style>

