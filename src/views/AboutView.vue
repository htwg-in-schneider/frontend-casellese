<script setup>
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay">
        <div class="container text-center text-white py-5">
          <h1 class="display-3 fw-bold mb-3">Caselle in Pittari</h1>
          <p class="lead fs-4">Ein kleines Dorf mit Geschmack und Tradition</p>
        </div>
      </div>
    </section>

    <!-- Intro Section -->
    <section class="py-5">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <h2 class="fw-bold display-6 mb-4">Das Herz Süditaliens</h2>
            <p class="lead text-secondary">
              Caselle in Pittari ist ein malerisches Dorf im Herzen des Cilento-Nationalparks 
              in der Region Kampanien, Süditalien. Mit seinen etwa 2.000 Einwohnern bewahrt 
              dieses authentische Bergdorf die kulinarischen Traditionen vergangener Jahrhunderte.
            </p>
            <p class="text-secondary">
              Eingebettet zwischen grünen Hügeln und dem kristallklaren Fluss Bussento, 
              bietet Caselle in Pittari eine einzigartige Kombination aus unberührter Natur, 
              reicher Geschichte und einer Küche, die von Generation zu Generation weitergegeben wird.
            </p>
          </div>
          <div class="col-lg-6">
            <img 
              src="https://nucccio.github.io/casellese-images/banner_ricetti_in_pittari.webp" 
              alt="Caselle in Pittari Landschaft" 
              class="img-fluid rounded-4 shadow"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Geschichte Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6 order-lg-2">
            <h2 class="fw-bold display-6 mb-4">Unsere Geschichte</h2>
            <p class="text-secondary">
              Die Geschichte von Caselle in Pittari reicht bis ins Mittelalter zurück. 
              Der Name "Caselle" leitet sich von den kleinen Steinhäusern (caselle) ab, 
              die einst von Hirten als Unterschlupf genutzt wurden.
            </p>
            <p class="text-secondary">
              Über die Jahrhunderte haben die Bewohner eine einzigartige kulinarische 
              Identität entwickelt, geprägt von der Verwendung lokaler Zutaten wie 
              Urdinkel, handgemachtem Käse und traditionell hergestellten Würsten.
            </p>
            <p class="text-secondary">
              Heute ist das Dorf bekannt für seine Gastfreundschaft und die Bewahrung 
              alter Rezepte, die von den Nonnas (Großmüttern) mit Stolz weitergegeben werden.
            </p>
          </div>
          <div class="col-lg-6 order-lg-1">
            <div class="history-card p-4 rounded-4 shadow-sm bg-white">
              <div class="row g-4 text-center">
                <div class="col-6">
                  <div class="history-stat">
                    <span class="display-4 fw-bold text-accent">800+</span>
                    <p class="text-secondary mb-0">Jahre Geschichte</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="history-stat">
                    <span class="display-4 fw-bold text-accent">2.000</span>
                    <p class="text-secondary mb-0">Einwohner</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="history-stat">
                    <span class="display-4 fw-bold text-accent">50+</span>
                    <p class="text-secondary mb-0">Traditionelle Rezepte</p>
                  </div>
                </div>
                <div class="col-6">
                  <div class="history-stat">
                    <span class="display-4 fw-bold text-accent">100%</span>
                    <p class="text-secondary mb-0">Authentisch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kulinarik Section -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold display-6">Unsere Kulinarischen Schätze</h2>
          <p class="lead text-secondary">Handgemacht mit Liebe und Tradition</p>
        </div>

        <div class="row g-4">
          <!-- Käse -->
          <div class="col-lg-4">
            <div class="culinary-card card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <img 
                src="https://nucccio.github.io/casellese-images/caciocavallo.webp" 
                alt="Caciocavallo Käse" 
                class="card-img-top culinary-img"
              >
              <div class="card-body p-4">
                <h4 class="fw-bold">Caciocavallo</h4>
                <p class="text-secondary">
                  Der birnenförmige Käse ist das Wahrzeichen unserer Region. 
                  Aus frischer Kuhmilch hergestellt und monatelang gereift, 
                  entwickelt er seinen unverwechselbaren würzigen Geschmack.
                </p>
              </div>
            </div>
          </div>

          <!-- Wurst -->
          <div class="col-lg-4">
            <div class="culinary-card card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <img 
                src="https://nucccio.github.io/casellese-images/salsiccia.webp" 
                alt="Salsiccia" 
                class="card-img-top culinary-img"
              >
              <div class="card-body p-4">
                <h4 class="fw-bold">Salsiccia</h4>
                <p class="text-secondary">
                  Unsere Salsiccia wird nach jahrhundertealten Rezepten hergestellt. 
                  Gewürzt mit wildem Fenchel und Chili aus eigenem Anbau, 
                  verkörpert sie den Geschmack des Südens.
                </p>
              </div>
            </div>
          </div>

          <!-- Brot -->
          <div class="col-lg-4">
            <div class="culinary-card card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <img 
                src="https://nucccio.github.io/casellese-images/brot.webp" 
                alt="Traditionelles Brot" 
                class="card-img-top culinary-img"
              >
              <div class="card-body p-4">
                <h4 class="fw-bold">Pane Casareccio</h4>
                <p class="text-secondary">
                  Unser Brot wird im Holzofen gebacken, wie es seit Generationen 
                  Tradition ist. Der Urdinkel verleiht ihm einen nussigen Geschmack 
                  und macht es besonders bekömmlich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Werte Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold display-6">Unsere Werte</h2>
        </div>

        <div class="row g-4">
          <div class="col-md-4">
            <div class="value-card text-center p-4">
              <div class="value-icon mb-3">
                <img 
                  src="https://nucccio.github.io/casellese-images/weizen-icon.png" 
                  alt="Zutaten Icon" 
                  class="value-img"
                >
              </div>
              <h4 class="fw-bold">Qualität</h4>
              <p class="text-secondary">
                Nur die besten lokalen Zutaten finden ihren Weg in unsere Küche. 
                Keine Kompromisse bei der Qualität.
              </p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="value-card text-center p-4">
              <div class="value-icon mb-3">
                <img 
                  src="https://nucccio.github.io/casellese-images/koch-icon.png" 
                  alt="Tradition Icon" 
                  class="value-img"
                >
              </div>
              <h4 class="fw-bold">Tradition</h4>
              <p class="text-secondary">
                Unsere Rezepte werden seit Generationen weitergegeben und 
                bewahren das kulinarische Erbe unserer Vorfahren.
              </p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="value-card text-center p-4">
              <div class="value-icon mb-3">
                <img 
                  src="https://nucccio.github.io/casellese-images/liebe-icon.png" 
                  alt="Liebe Icon" 
                  class="value-img"
                >
              </div>
              <h4 class="fw-bold">Leidenschaft</h4>
              <p class="text-secondary">
                Jedes Gericht wird mit Herz und Seele zubereitet. 
                Diese Leidenschaft schmeckt man in jedem Bissen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5 cta-section">
      <div class="container text-center">
        <h2 class="fw-bold display-6 text-white mb-4">Entdecke unsere Rezepte</h2>
        <p class="lead text-white mb-4 opacity-75">
          Tauche ein in die Welt der authentischen italienischen Küche
        </p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <router-link to="/rezepte" class="btn btn-light btn-lg px-4">
            Zu den Rezepten
          </router-link>
          <router-link to="/kontakt" class="btn btn-outline-light btn-lg px-4">
            Kontakt aufnehmen
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ============================================
   STYLETILE DESIGN
   Farben: #ffffff, #f0f0f0, #c9c9c9, #e54c4c
   Font: Inter
   ============================================ */

.about-page {
  font-family: 'Inter', sans-serif;
}

/* Hero Section */
.hero-section {
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), 
                    url('https://nucccio.github.io/casellese-images/banner_ricetti_in_pittari.webp');
  background-size: cover;
  background-position: center;
  min-height: 50vh;
  display: flex;
  align-items: center;
}

.hero-overlay {
  width: 100%;
  padding: 4rem 0;
}

/* Text Accent Color */
.text-accent {
  color: #e54c4c !important;
}

/* History Card */
.history-card {
  border: 2px solid #f0f0f0;
}

.history-stat {
  padding: 1rem;
}

/* Culinary Cards */
.culinary-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.culinary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}

.culinary-img {
  height: 220px;
  object-fit: cover;
}

/* Value Cards */
.value-card {
  background: #ffffff;
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-3px);
}

.value-img {
  height: 80px;
  width: auto;
}

/* CTA Section */
.cta-section {
  background-color: #e54c4c;
}

.btn-light {
  background-color: #ffffff;
  border: 2px solid #ffffff;
  color: #e54c4c;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-light:hover {
  background-color: #f0f0f0;
  border-color: #f0f0f0;
  color: #e54c4c;
  transform: translateY(-2px);
}

.btn-outline-light {
  background-color: transparent;
  border: 2px solid #ffffff;
  color: #ffffff;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-outline-light:hover {
  background-color: #ffffff;
  border-color: #ffffff;
  color: #e54c4c;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    min-height: 40vh;
  }
  
  .display-3 {
    font-size: 2.5rem;
  }
  
  .display-6 {
    font-size: 1.75rem;
  }
}
</style>