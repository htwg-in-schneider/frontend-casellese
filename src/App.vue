<script setup></script>

<template>
 <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold text-accent" href="index.html">
                <img src="https://nucccio.github.io/casellese-images/logo_ricetti.webp" alt="Logo Ricetti" height="100" class="me-2">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-4 fs-5">
                    <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Rezepte</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Kontakt</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Category Header -->
    <section class="py-5 text-center">
        <div class="container">
            <h2 class="fw-bold">Rezepte</h2>
            <p>Rezepte</p>
        </div>
    </section>

    <!-- Product Grid -->
    <div class="container py-4">
        <div class="row g-4">
            <!-- Product Card -->
            <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                    <img src="https://nucccio.github.io/casellese-images/caciocavallo.webp" class="card-img-top"
                        alt="Produktbild">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">Caciocavallo</h5>
                        <p class="card-text text-accent fw-bold">15,00 €</p>
                        <a href="recipe.html" class="btn btn-accent mt-auto">Details</a>
                    </div>
                </div>
            </div>
            <!-- Product Card -->
            <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                    <img src="https://nucccio.github.io/casellese-images/salsiccia.webp" class="card-img-top"
                        alt="Produktbild">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">Salsiccia</h5>
                        <p class="card-text text-accent fw-bold">15,00 €</p>
                        <a href="recipe.html" class="btn btn-accent mt-auto">Details</a>
                    </div>
                </div>
            </div>
            <!-- Product Card -->
            <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                    <img src="https://nucccio.github.io/casellese-images/brot.webp" class="card-img-top"
                        alt="Produktbild">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">Brot</h5>
                        <p class="card-text text-accent fw-bold">5,99 €</p>
                        <a href="recipe.html" class="btn btn-accent mt-auto">Details</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped></style>