<script setup>
</script>

<template>
    <!-- Footer -->
    <footer class="bg-dark text-light py-4 footer-accent">
        <div class="container d-flex flex-wrap justify-content-between">
            <div>
                <h6>Informationen</h6>
                <ul class="list-unstyled">
                    <li><router-link to="/impressum" class="footer-link">Impressum</router-link></li>
                    <li><router-link to="/agb" class="footer-link">AGB</router-link></li>
                    <li><router-link to="/datenschutz" class="footer-link">Datenschutz</router-link></li>
                    <li><router-link to="/widerruf" class="footer-link">Widerrufsrecht</router-link></li>
                    <li><router-link to="/versand" class="footer-link">Versand</router-link></li>
                </ul>
            </div>
            <div>
                <h6>Über uns</h6>
                <ul class="list-unstyled">
                    <li><router-link to="/team" class="footer-link">Team</router-link></li>
                    <li><router-link to="/kontakt" class="footer-link">Kontakt</router-link></li>
                </ul>
            </div>
            <div>
                <h6>Service</h6>
                <ul class="list-unstyled">
                    <li><router-link to="/newsletter" class="footer-link">Newsletter</router-link></li>
                </ul>
            </div>
            <div>
                <h6>Folge uns</h6>
                <a href="#" class="me-2 footer-link"><i class="bi bi-facebook"></i></a>
                <a href="#" class="footer-link"><i class="bi bi-instagram"></i></a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer-accent {
    border-top: 5px solid #e54c4c;
}

.footer-link {
    color: #ccc;
    text-decoration: none;
}

.footer-link:hover {
    color: #e54c4c;
}
</style>
