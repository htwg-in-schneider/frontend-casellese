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


# frontend-casellese

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Environment Configuration

The project uses environment-specific `.env` files to manage the API base URL and Auth0 configuration:

### `.env.development` (for local development)
```
VITE_API_BASE_URL=http://localhost:8081
VITE_AUTH0_DOMAIN=dev-xtay6xv00u4qv7bp.us.auth0.com
VITE_AUTH0_CLIENT_ID=4R7WR2XtkQmB0BQRPkapEKhiuGvInvvz
VITE_AUTH0_AUDIENCE=https://api.casellese.local
```

### `.env.production` (for production deployment)
```
VITE_API_BASE_URL=https://backend-casellese.onrender.com
VITE_AUTH0_DOMAIN=dev-xtay6xv00u4qv7bp.us.auth0.com
VITE_AUTH0_CLIENT_ID=4R7WR2XtkQmB0BQRPkapEKhiuGvInvvz
VITE_AUTH0_AUDIENCE=https://api.casellese.local
```

### Usage in Components
Use `import.meta.env.VITE_API_BASE_URL` for API calls:
```javascript
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
```

Vite automatically loads the appropriate `.env` file based on the mode:
- `npm run dev` → loads `.env.development`
- `npm run build` → loads `.env.production`

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```



-----
Notizen:
H2 Datenbank mit einer eingebauten Web-Console: http://localhost:8081/h2-console
