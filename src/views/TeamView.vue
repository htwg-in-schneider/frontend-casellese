<script setup>
import { ref } from 'vue';

// Team-Mitglieder Daten - können später auch vom Backend geladen werden
const teamMembers = ref([
  {
    id: 1,
    name: 'Maria Rossi',
    role: 'Gründerin & Chefköchin',
    description: 'Mit Leidenschaft für traditionelle süditalienische Küche führt Maria das Team seit 2020.',
    imageUrl: 'https://nucccio.github.io/casellese-images/team/maria.webp',
    fallbackImage: 'https://via.placeholder.com/300x300/e54c4c/ffffff?text=MR'
  },
  {
    id: 2,
    name: 'Giuseppe Conte',
    role: 'Rezeptentwickler',
    description: 'Giuseppe bewahrt die Familienrezepte aus Pittari und entwickelt neue Kreationen.',
    imageUrl: 'https://nucccio.github.io/casellese-images/team/giuseppe.webp',
    fallbackImage: 'https://via.placeholder.com/300x300/d44040/ffffff?text=GC'
  },
  {
    id: 3,
    name: 'Anna Esposito',
    role: 'Community-Managerin',
    description: 'Anna verbindet unsere Rezept-Community und sammelt Feedback aus aller Welt.',
    imageUrl: 'https://nucccio.github.io/casellese-images/team/anna.webp',
    fallbackImage: 'https://via.placeholder.com/300x300/c83636/ffffff?text=AE'
  },
  {
    id: 4,
    name: 'Luca Bianchi',
    role: 'Fotograf & Content Creator',
    description: 'Luca bringt unsere Gerichte mit seiner Kamera zum Leben.',
    imageUrl: 'https://nucccio.github.io/casellese-images/team/luca.webp',
    fallbackImage: 'https://via.placeholder.com/300x300/b82d2d/ffffff?text=LB'
  }
]);

// Fallback für Bilder, falls sie nicht geladen werden können
const handleImageError = (event, member) => {
  event.target.src = member.fallbackImage;
};
</script>

<template>
  <!-- Team Header -->
  <section class="team-header py-5 text-center">
    <div class="container">
      <div class="text-center mb-4">
        <h1 class="fw-bold display-4">Unser Team</h1>
        <p class="lead text-secondary mt-3">
          Die Menschen hinter Ricetti in Pittari – vereint durch die Liebe zur 
          traditionellen süditalienischen Küche
        </p>
      </div>
    </div>
  </section>

  <!-- Team Grid -->
  <section class="team-grid py-5">
    <div class="container">
      <div class="row g-4 justify-content-center">
        <div 
          v-for="member in teamMembers" 
          :key="member.id" 
          class="col-12 col-sm-6 col-lg-3"
        >
          <div class="team-card h-100">
            <div class="team-image-wrapper">
              <img 
                :src="member.imageUrl" 
                :alt="member.name"
                class="team-image"
                @error="(e) => handleImageError(e, member)"
              />
              <div class="team-overlay">
                <span class="team-role-badge">{{ member.role }}</span>
              </div>
            </div>
            <div class="team-info">
              <h3 class="team-name">{{ member.name }}</h3>
              <p class="team-role">{{ member.role }}</p>
              <p class="team-description">{{ member.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Team Story Section -->
  <section class="team-story py-5 bg-light">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h2 class="fw-bold mb-4">Unsere Geschichte</h2>
          <p class="text-secondary">
            Ricetti in Pittari wurde aus der Sehnsucht nach authentischen 
            Familienrezepten geboren. Was in der kleinen Küche von Nonna 
            begann, ist heute eine Sammlung der wertvollsten kulinarischen 
            Schätze des Cilento.
          </p>
          <p class="text-secondary">
            Unser Team verbindet Generationen von Kochwissen mit moderner 
            Präsentation – immer mit dem Ziel, die Tradition lebendig zu halten.
          </p>
          <router-link to="/" class="btn btn-accent mt-3">
            Zu den Rezepten
          </router-link>
        </div>
        <div class="col-lg-6 mt-4 mt-lg-0">
          <div class="story-image-container">
            <img 
              src="https://nucccio.github.io/casellese-images/pittari_village.webp" 
              alt="Pittari Dorf"
              class="story-image rounded-4"
              @error="(e) => e.target.src = 'https://via.placeholder.com/600x400/e54c4c/ffffff?text=Pittari'"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Team Header */
.team-header {
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
}

/* Team Card */
.team-card {
  background: #fff;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(229, 76, 76, 0.15);
}

/* Team Image */
.team-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1 / 1;
}

.team-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.team-card:hover .team-image {
  transform: scale(1.08);
}

.team-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.team-card:hover .team-overlay {
  opacity: 1;
}

.team-role-badge {
  display: inline-block;
  background: #e54c4c;
  color: #fff;
  padding: 0.35rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Team Info */
.team-info {
  padding: 1.5rem;
  text-align: center;
}

.team-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.25rem;
}

.team-role {
  font-size: 0.875rem;
  color: #e54c4c;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.team-description {
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.6;
  margin: 0;
}

/* Story Section */
.team-story {
  background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
}

.story-image-container {
  position: relative;
}

.story-image {
  width: 100%;
  height: auto;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

/* Accent Button */
.btn-accent {
  background-color: #e54c4c;
  color: white;
  border-radius: 30px;
  padding: 0.6rem 1.8rem;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-accent:hover {
  background-color: #d43d3d;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(229, 76, 76, 0.4);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .team-header h1 {
    font-size: 2rem;
  }
  
  .team-info {
    padding: 1rem;
  }
  
  .team-name {
    font-size: 1.1rem;
  }
}
</style>