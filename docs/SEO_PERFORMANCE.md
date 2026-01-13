# SEO & Performance Optimierung

Diese Dokumentation beschreibt die implementierten und geplanten SEO- und Performance-Maßnahmen für **Ricetti in Pittari**.

---

## 📊 SEO-Maßnahmen

### ✅ Implementiert

#### 1. **Semantisches HTML**
- Verwendung von korrekten HTML5-Elementen (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`)
- Logische Überschriften-Hierarchie (H1 → H2 → H3)
- Aussagekräftige `alt`-Attribute für alle Bilder

#### 2. **Meta-Tags (Routing)**
- Dynamische Seitentitel via `router.afterEach()` Hook
- Jede Route hat einen eigenen `meta.title`
- Beschreibungen in `meta.description` für wichtige Seiten

```js
// Beispiel aus router/index.js
{
  path: '/',
  name: 'home',
  component: HomeView,
  meta: { 
    title: 'Ricetti in Pittari - Traditionelle Rezepte',
    description: 'Entdecken Sie authentische italienische Rezepte aus Caselle in Pittari'
  }
}
```

#### 3. **URL-Struktur**
- Sprechende URLs (`/rezepte`, `/kontakt`, `/ueber-uns`)
- SEO-freundliche Pfade ohne Query-Parameter für wichtige Seiten
- Konsistente URL-Benennung (Deutsch für Nutzer-Seiten)

#### 4. **Interne Verlinkung**
- Klare Navigation mit `<router-link>` für alle internen Links
- Breadcrumb-ähnliche Struktur in Detailseiten
- Footer-Links zu wichtigen Seiten

#### 5. **Strukturierte Daten (Schema.org)**
- Rezept-Seiten können mit Recipe-Schema erweitert werden
- Organisation/LocalBusiness Schema für Impressum

### 🔄 Geplant / Empfohlen

#### 1. **Server-Side Rendering (SSR) / Static Site Generation (SSG)**
```bash
# Umstellung auf Nuxt.js für SSR
npm create nuxt-app ricetti-pittari
```
- Aktuell: Single Page Application (SPA) → Crawler sehen initial leere Seite
- Empfohlen: Nuxt.js oder Prerendering für kritische Seiten

#### 2. **robots.txt & sitemap.xml**
```txt
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://ricetti-pittari.de/sitemap.xml
```

#### 3. **Open Graph & Twitter Cards**
```html
<!-- In index.html oder per Plugin -->
<meta property="og:title" content="Ricetti in Pittari">
<meta property="og:description" content="Traditionelle italienische Rezepte">
<meta property="og:image" content="https://...logo.webp">
<meta name="twitter:card" content="summary_large_image">
```

#### 4. **Canonical URLs**
```html
<link rel="canonical" href="https://ricetti-pittari.de/rezepte">
```

---

## ⚡ Performance-Optimierung

### ✅ Implementiert

#### 1. **Code-Splitting / Lazy Loading**
Der Router nutzt dynamische Imports für alle Views außer der Homepage:

```js
// Eager Loading für kritische Seiten
import HomeView from '@/views/HomeView.vue'

// Lazy Loading für alle anderen Seiten
const ProductCatalog = () => import('@/views/ProductCatalog.vue')
const ProductDetail = () => import('@/views/ProductDetail.vue')
const KontaktView = () => import('@/views/KontaktView.vue')
// ...
```

**Vorteile:**
- Initiales Bundle wird kleiner
- Seiten werden erst bei Bedarf geladen
- Bessere Time-to-Interactive (TTI)

#### 2. **Bildoptimierung**
- WebP-Format für alle Produktbilder
- Externe Hosting auf GitHub Pages CDN
- Optimierte Bildgrößen (responsive)

```html
<!-- Beispiel aus HomeView.vue -->
<img src="https://nucccio.github.io/casellese-images/caciocavallo.webp" 
     alt="Caciocavallo Käse"
     loading="lazy">
```

#### 3. **CSS-Optimierung**
- Scoped Styles in Vue-Komponenten (kein globales CSS-Bloating)
- CSS wird nur für geladene Komponenten eingebunden
- Minimale externe CSS-Dependencies (Bootstrap via CDN)

#### 4. **Caching-Strategie**
- Assets auf GitHub Pages haben automatisches Browser-Caching
- Vite generiert gehashte Dateinamen für Cache-Busting
- API-Responses können mit Service Workers gecacht werden (geplant)

### 🔄 Geplante Optimierungen

#### 1. **Preloading kritischer Ressourcen**
```html
<!-- In index.html -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://nucccio.github.io">
```

#### 2. **Bundle-Analyse**
```bash
# Analyse des Bundle-Inhalts
npm run build -- --analyze

# Oder mit rollup-plugin-visualizer
```

#### 3. **Lighthouse-Ziele**

| Metrik | Aktuell | Ziel |
|--------|---------|------|
| Performance | ~75 | >90 |
| Accessibility | ~85 | >95 |
| Best Practices | ~90 | >95 |
| SEO | ~80 | >90 |

#### 4. **Service Worker / PWA**
```js
// vite.config.js mit PWA Plugin
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ricetti in Pittari',
        short_name: 'Ricetti',
        theme_color: '#e54c4c'
      }
    })
  ]
}
```

#### 5. **HTTP/2 Push & Resource Hints**
```html
<link rel="preload" href="/api/product" as="fetch">
<link rel="dns-prefetch" href="https://auth.auth0.com">
```

---

## 📈 Monitoring

### Empfohlene Tools

1. **Google Search Console**
   - Indexierungs-Status überwachen
   - Suchbegriffe analysieren
   - Fehler identifizieren

2. **Google Analytics 4 / Plausible**
   - Nutzerverhalten tracken
   - Core Web Vitals überwachen
   - Conversion-Tracking

3. **Lighthouse CI**
   - Automatische Performance-Tests in CI/CD
   - Regression-Erkennung

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://ricetti-pittari.de/
      https://ricetti-pittari.de/rezepte
```

---

## 📋 Checkliste vor Go-Live

- [ ] Meta-Tags für alle wichtigen Seiten
- [ ] robots.txt erstellt
- [ ] sitemap.xml generiert
- [ ] Google Search Console eingerichtet
- [ ] SSL-Zertifikat aktiv (HTTPS)
- [ ] 404-Seite vorhanden
- [ ] Canonical URLs gesetzt
- [ ] Open Graph Tags für Social Sharing
- [ ] Bilder komprimiert und optimiert
- [ ] Lighthouse Score >90
- [ ] Mobile-Friendly Test bestanden

---

*Letzte Aktualisierung: Januar 2025*
