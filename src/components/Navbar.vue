<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import UserMenu from './UserMenu.vue'

const { isAuthenticated } = useAuth0()
</script>

<template>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm navbar-accent">
        <div class="container">
            <router-link class="navbar-brand fw-bold text-accent" to="/">
                <img src="https://nucccio.github.io/casellese-images/logo_ricetti.webp" alt="Logo Ricetti" height="100" class="me-2">
            </router-link>

            <div class="d-flex align-items-center order-lg-last">
                <UserMenu class="me-2 me-lg-0" />
                <button class="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>

            <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul class="navbar-nav ms-auto fs-5">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/rezepte">Rezepte</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/kontakt">Kontakt</router-link>
                    </li>
                    <!-- Admin Link - nur für eingeloggte User sichtbar -->
                    <li v-if="isAuthenticated" class="nav-item">
                        <router-link class="nav-link text-success fw-bold" to="/product/create">
                            ➕ Neues Produkt
                        </router-link>
                    </li>
                </ul>
                <form class="d-flex ms-auto">
                    <input class="form-control me-2" type="search" placeholder="Suche...">
                    <button class="btn btn-accent" type="submit">Suchen</button>
                </form>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar-accent {
    border-bottom: 5px solid #e54c4c;
}

.text-success {
    color: #198754 !important;
}
</style>
