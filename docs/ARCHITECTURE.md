# Architektur-Dokumentation

Diese Dokumentation beschreibt die Architektur des **Ricetti in Pittari** Frontends.

---

## 📁 Projektstruktur

```
frontend-casellese/
├── public/                    # Statische Assets (werden nicht von Vite verarbeitet)
│   └── favicon.ico
│
├── src/
│   ├── assets/               # CSS, Bilder (werden von Vite verarbeitet)
│   │   └── style.css         # Globale Styles
│   │
│   ├── components/           # Wiederverwendbare Vue-Komponenten
│   │   ├── Button.vue        # Generischer Button (Primary, Secondary, Danger)
│   │   ├── FavoriteButton.vue # Merklisten-Toggle mit Auth-Integration
│   │   ├── Footer.vue        # Globaler Footer mit Links
│   │   ├── Navbar.vue        # Navigation mit Suche und User-Menu
│   │   ├── NavButton.vue     # Router-Link als Button
│   │   ├── ProductCard.vue   # Rezept-Vorschau-Karte
│   │   ├── ProductFilter.vue # Such- und Kategorie-Filter
│   │   ├── ShareButton.vue   # Social-Share Funktionalität
│   │   ├── SpecialBanner.vue # Promo-Banner (schließbar)
│   │   └── UserMenu.vue      # Login/Logout mit Avatar
│   │
│   ├── config/               # Konfiguration & Konstanten
│   │   └── constants.js      # Zentrale Werte (Farben, URLs, Timeouts)
│   │
│   ├── models/               # TypeScript-ähnliche Datenmodelle
│   │   ├── Category.js       # Enum für Kategorien
│   │   ├── Product.js        # Produkt-Klasse mit Factory-Methoden
│   │   ├── Recipe.js         # Rezept-Klasse
│   │   └── index.js          # Zentrale Exports
│   │
│   ├── router/               # Vue Router Konfiguration
│   │   └── index.js          # Routen mit Lazy Loading & Guards
│   │
│   ├── services/             # API-Kommunikation (optional)
│   │   └── api.js            # Zentraler API-Service
│   │
│   ├── stores/               # Pinia State Management
│   │   ├── banner.js         # Banner-Sichtbarkeit
│   │   ├── favorites.js      # Merkliste mit Backend-Sync
│   │   ├── user.js           # User-Profil und Rollen
│   │   └── index.js          # Zentrale Exports
│   │
│   ├── views/                # Seiten-Komponenten (eine pro Route)
│   │   ├── HomeView.vue      # Startseite
│   │   ├── ProductCatalog.vue# Rezept-Übersicht
│   │   ├── ProductDetail.vue # Rezept-Details
│   │   ├── CreateProduct.vue # Admin: Rezept erstellen
│   │   ├── EditProduct.vue   # Admin: Rezept bearbeiten
│   │   ├── FavoritesView.vue # Merkliste
│   │   ├── Profile.vue       # Nutzerprofil
│   │   ├── AdminUsersView.vue# Admin: Nutzerverwaltung
│   │   ├── AdminFavoritesView.vue # Admin: Alle Favoriten
│   │   ├── KontaktView.vue   # Kontaktformular
│   │   ├── AboutView.vue     # Über uns
│   │   ├── TeamView.vue      # Team-Seite
│   │   ├── NewsletterView.vue# Newsletter-Anmeldung
│   │   ├── AGBView.vue       # AGB
│   │   ├── DatenschutzView.vue # Datenschutz
│   │   ├── WiderrufView.vue  # Widerrufsbelehrung
│   │   ├── VersandView.vue   # Versandinformationen
│   │   └── ImpressumView.vue # Impressum
│   │
│   ├── App.vue               # Root-Komponente
│   └── main.js               # Vue App Bootstrap
│
├── docs/                     # Dokumentation
│   ├── ARCHITECTURE.md       # Diese Datei
│   └── SEO_PERFORMANCE.md    # SEO & Performance
│
├── index.html                # HTML Entry Point
├── vite.config.js            # Vite Build-Konfiguration
├── package.json              # Abhängigkeiten
└── README.md                 # Projekt-Übersicht
```

---

## 🧱 Komponenten-Hierarchie

```
App.vue
├── SpecialBanner.vue         # Konditionell (Store: banner.isVisible)
├── Navbar.vue
│   ├── UserMenu.vue          # Login/Logout
│   └── [Search Form]
├── <router-view>             # Dynamisch basierend auf Route
│   ├── HomeView.vue          # /
│   ├── ProductCatalog.vue    # /rezepte
│   │   ├── ProductFilter.vue
│   │   └── ProductCard.vue (n)
│   ├── ProductDetail.vue     # /product/:id
│   │   ├── FavoriteButton.vue
│   │   └── ShareButton.vue
│   ├── FavoritesView.vue     # /merkliste (geschützt)
│   │   └── ProductCard.vue (n)
│   └── [Weitere Views...]
└── Footer.vue
```

---

## 🔄 State Management (Pinia)

### Store-Übersicht

| Store | Zweck | Persistenz |
|-------|-------|------------|
| `user` | User-Profil, Rolle, Auth-Status | Session |
| `favorites` | Merkliste mit IDs und Details | Backend-Sync |
| `banner` | Banner-Sichtbarkeit | Session |

### Datenfluss

```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTH0 (OAuth)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Token
┌─────────────────────────────────────────────────────────────────┐
│                       App.vue (Bootstrap)                       │
│  - Watch isAuthenticated                                        │
│  - fetchProfile() bei Login                                     │
│  - clearProfile() bei Logout                                    │
└─────────────────────────────────────────────────────────────────┘
          │                          │
          ▼                          ▼
   ┌──────────────┐          ┌──────────────────┐
   │  userStore   │          │  favoritesStore  │
   │  - profile   │          │  - favoriteIds   │
   │  - isAdmin   │          │  - favorites     │
   └──────────────┘          └──────────────────┘
          │                          │
          ▼                          ▼
   ┌──────────────┐          ┌──────────────────┐
   │  Navbar.vue  │          │ FavoriteButton   │
   │  UserMenu    │          │ FavoritesView    │
   └──────────────┘          └──────────────────┘
```

---

## 🛡️ Authentifizierung & Autorisierung

### Auth-Flow

1. **Login**: Auth0 Universal Login → OAuth Token → Backend `/api/profile`
2. **Token Storage**: Auth0 SDK (Memory/Cookie)
3. **API Calls**: Bearer Token im Authorization Header
4. **Logout**: Auth0 Logout → Store Reset

### Route Guards

```js
// Einfacher Auth Guard (Auth0)
beforeEnter: authGuard

// Admin Guard (Custom)
beforeEnter: adminGuard  // authGuard + Role Check
```

### Rollen

| Rolle | Rechte |
|-------|--------|
| `REGULAR` | Rezepte ansehen, Merkliste verwalten |
| `ADMIN` | Alles + CRUD auf Rezepte/User |

---

## 🌐 API-Integration

### Backend-Kommunikation

Das Frontend kommuniziert mit einem Spring Boot Backend über REST.

**Base URL**: `import.meta.env.VITE_API_BASE_URL`

### Endpunkte

| Methode | Endpoint | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/product` | Alle Rezepte | - |
| GET | `/api/product?name=X&category=Y` | Gefilterte Rezepte | - |
| GET | `/api/product/:id` | Einzelnes Rezept | - |
| POST | `/api/product` | Rezept erstellen | Admin |
| PUT | `/api/product/:id` | Rezept bearbeiten | Admin |
| DELETE | `/api/product/:id` | Rezept löschen | Admin |
| GET | `/api/profile` | User-Profil | User |
| GET | `/api/favorites` | Merkliste | User |
| POST | `/api/favorites/toggle/:id` | Favorit umschalten | User |
| GET | `/api/users` | Alle User | Admin |

---

## 🔧 Entwicklungshinweise

### Umgebungsvariablen

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8081
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=xxxxx
VITE_AUTH0_AUDIENCE=https://your-api

# .env.production
VITE_API_BASE_URL=https://api.ricetti-pittari.de
```

### Code-Konventionen

1. **Komponenten**: PascalCase (`ProductCard.vue`)
2. **Stores**: camelCase mit `use` Prefix (`useUserStore`)
3. **CSS**: Scoped Styles, BEM-ähnliche Klassen
4. **Imports**: `@/` Alias für `src/`

### Testing

```bash
# Unit Tests (geplant)
npm run test:unit

# E2E Tests (geplant)
npm run test:e2e
```

---

*Letzte Aktualisierung: Januar 2025*
