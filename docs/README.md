# Ricetti in Pittari - Frontend

> **Traditionelle italienische Rezepte aus Caselle in Pittari**

Ein Vue 3 Frontend für die Rezept-Webanwendung mit Auth0 Authentifizierung, Pinia State Management und responsivem Design.

## Features

- **Rezept-Katalog** mit Such- und Filterfunktion
- **Merkliste** (Favoriten) mit Backend-Synchronisation  
- **Benutzer-Authentifizierung** via Auth0
- **Admin-Bereich** für Rezept- und Nutzerverwaltung
- **Responsive Design** für Mobile, Tablet und Desktop
- **Lazy Loading** für optimale Performance

## Tech Stack

| Technologie | Version | Beschreibung |
|-------------|---------|--------------|
| Vue.js | 3.x | Frontend Framework |
| Vue Router | 4.x | Client-Side Routing mit Lazy Loading |
| Pinia | 2.x | State Management |
| Auth0 | Latest | OAuth 2.0 Authentifizierung |
| Vite | 5.x | Build Tool & Dev Server |
| Bootstrap | 5.x | CSS Framework (via CDN) |

## Projektstruktur

```
src/
├── components/     # Wiederverwendbare UI-Komponenten
├── config/         # Konstanten und Konfiguration
├── models/         # Datenmodelle (Product, Recipe, Category)
├── router/         # Vue Router mit Navigation Guards
├── services/       # API-Service Layer
├── stores/         # Pinia Stores (user, favorites, banner)
├── views/          # Seiten-Komponenten
└── docs/           # Dokumentation
```

Detaillierte Architektur: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Installation

### Voraussetzungen

- Node.js >= 18.x
- npm >= 9.x
- Backend läuft unter `http://localhost:8081` (oder konfiguriert)

### Setup

```bash
# Repository klonen
git clone https://github.com/htwg-in-schneider/frontend-casellese.git
cd frontend-casellese

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
```

### Umgebungsvariablen

Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8081

# Auth0 Konfiguration
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

### Development Server

```bash
# Dev Server starten (Hot Reload)
npm run dev

# Server läuft auf http://localhost:5173
```

### Production Build

```bash
# Build erstellen
npm run build

# Preview des Builds
npm run preview
```

## Dokumentation

| Dokument | Beschreibung |
|----------|--------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Projektstruktur, Komponenten, Datenfluss |
| [SEO_PERFORMANCE.md](docs/SEO_PERFORMANCE.md) | SEO-Maßnahmen, Performance-Optimierung |

## Code-Qualität

### Implementierte Best Practices

- **Vue Router**: Lazy Loading für alle Views, Navigation Guards für Auth
- **Komponenten**: Sinnvolle Aufteilung in Views und Components
- **Pinia**: Zentrales State Management für User, Favorites, Banner
- **JSDoc**: Alle Stores und wichtige Funktionen dokumentiert
- **Konstanten**: Zentrale Konfiguration in `config/constants.js`
- **Keine ungenutzten Dateien**: Legacy-Code wurde entfernt

### Architektur-Entscheidungen

| Entscheidung | Begründung |
|--------------|------------|
| Lazy Loading | Kleineres Initial Bundle, schnellere First Load |
| Pinia statt Vuex | Modernerer API, bessere TypeScript-Unterstützung |
| Scoped CSS | Vermeidet CSS-Konflikte, bessere Wartbarkeit |
| Zentrale Konstanten | Einfache Änderung von Farben, URLs, etc. |

## API-Integration

Das Frontend kommuniziert mit einem Spring Boot Backend.

### Wichtige Endpunkte

```
GET    /api/product          # Alle Rezepte (mit Filter)
GET    /api/product/:id      # Einzelnes Rezept
POST   /api/product          # Rezept erstellen (Admin)
PUT    /api/product/:id      # Rezept bearbeiten (Admin)
DELETE /api/product/:id      # Rezept löschen (Admin)
GET    /api/profile          # User-Profil
GET    /api/favorites        # Merkliste
POST   /api/favorites/toggle/:id # Favorit umschalten
```

## Entwicklung

### Code Style

- Vue 3 Composition API mit `<script setup>`
- PascalCase für Komponenten
- camelCase für Variablen und Funktionen
- Deutschen Text für UI, englische Kommentare

### Empfohlene IDE

[VS Code](https://code.visualstudio.com/) mit:
- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Browser DevTools

- [Vue.js DevTools (Chrome)](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Vue.js DevTools (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## Deployment

### GitHub Pages

Das Frontend kann als GitHub Page deployed werden:

```bash
# Build mit korrektem Base Path
npm run build

# Push zu gh-pages Branch
npm run deploy
```

### Vercel / Netlify

```bash
# Build Command
npm run build

# Output Directory
dist
```

## Lizenz

Dieses Projekt ist Teil einer Hochschul-Lehrveranstaltung (HTWG Konstanz).

---

**Entwickelt im Rahmen der Veranstaltung Web-Technologien (WeTe)**  
HTWG Konstanz - Prof. Schneider
