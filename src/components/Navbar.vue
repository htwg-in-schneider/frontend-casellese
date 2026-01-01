<script setup>
import UserMenu from './UserMenu.vue'
</script>

<template>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold text-accent" href="/">
                <img src="https://nucccio.github.io/casellese-images/logo_ricetti.webp" alt="Logo Ricetti" height="100" class="me-2">
            </a>

            <div class="d-flex align-items-center order-lg-last">
                <UserMenu class="me-2 me-lg-0" />
                <button class="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-4 fs-5">
                    <li class="nav-item">
                        <router-link class="nav-link active" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Rezepte</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Kontakt</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>

</style>
