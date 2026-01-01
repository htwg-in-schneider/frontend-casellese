# Iteration 9 - Auth0 Integration (Frontend)

## Voraussetzungen
- Backend mit OAuth2/Auth0 läuft auf `http://localhost:8081`
- Auth0 Account mit API "Casellese API" (Audience: `https://api.casellese.local`)

## 1. Auth0 SPA Application erstellen

1. **Auth0 Dashboard** → Applications → Create Application
2. Name: `Casellese Frontend`, Type: **Single Page Web Applications**
3. Settings konfigurieren:
   - Allowed Callback URLs: `http://localhost:5174`
   - Allowed Logout URLs: `http://localhost:5174`
   - Allowed Web Origins: `http://localhost:5174`
   - Initiate Login URI: **(leer lassen!)**
4. **Client ID** kopieren

## 2. Package installieren

```bash
npm install @auth0/auth0-vue
```

## 3. Environment Variables

`.env.development` im Root-Verzeichnis erstellen:

```env
VITE_API_BASE_URL=http://localhost:8081
VITE_AUTH0_DOMAIN=dev-xtay6xv00u4qv7bp.us.auth0.com
VITE_AUTH0_CLIENT_ID=<DEINE_CLIENT_ID>
VITE_AUTH0_AUDIENCE=https://api.casellese.local
```

## 4. Neue/Geänderte Dateien

| Datei | Aktion |
|-------|--------|
| `src/main.js` | Auth0 Plugin registrieren |
| `src/components/UserMenu.vue` | Login/Logout Dropdown |
| `src/components/Navbar.vue` | UserMenu einbinden |
| `src/views/Profile.vue` | Profilseite mit Token-Debug |
| `src/router/index.js` | `authGuard` für geschützte Routen |

## 5. Wichtige Code-Patterns

**Token für API-Calls:**
```js
const { getAccessTokenSilently } = useAuth0()
const token = await getAccessTokenSilently()

fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
  headers: { Authorization: `Bearer ${token}` }
})
```

**Route schützen:**
```js
import { authGuard } from '@auth0/auth0-vue'

{ path: '/profile', component: Profile, beforeEnter: authGuard }
```

## 6. Test

1. `npm run dev`
2. "Anmelden" klicken → Auth0 Login
3. Nach Login: Avatar-Dropdown mit Profil-Link
4. `/profile` zeigt Backend-Daten + Bearer Token


----