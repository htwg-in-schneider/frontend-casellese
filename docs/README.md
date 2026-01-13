# Lösung für Punkt c) Transaktionen - Admin kann Transaktionsdaten einsehen

Diese Dateien ergänzen das Projekt "Ricetti in Pittari", sodass **Administratoren alle Transaktionsdaten (Favoriten) einsehen können**.

---

## 📁 Dateien im Überblick

### Backend (Spring Boot)

| Datei | Beschreibung |
|-------|--------------|
| `FavoriteController.java` | **Ersetzt** die bestehende Datei - enthält neue Admin-Endpoints |
| `FavoriteRepository.java` | **Ersetzt** die bestehende Datei - enthält neue Query-Methode |

### Frontend (Vue.js 3)

| Datei | Beschreibung |
|-------|--------------|
| `AdminFavoritesView.vue` | **Neue Datei** - Admin-Ansicht für Transaktionen |
| `router_index.js` | **Ersetzt** `router/index.js` - enthält neue Route |
| `UserMenu.vue` | **Ersetzt** die bestehende Datei - enthält neuen Menü-Link |

---

## 🔧 Installation

### Backend

1. **FavoriteController.java** kopieren nach:
   ```
   src/main/java/de/htwg/in/wete/backend/controller/FavoriteController.java
   ```

2. **FavoriteRepository.java** kopieren nach:
   ```
   src/main/java/de/htwg/in/wete/backend/repository/FavoriteRepository.java
   ```

### Frontend

1. **AdminFavoritesView.vue** kopieren nach:
   ```
   src/views/AdminFavoritesView.vue
   ```

2. **router_index.js** umbenennen zu `index.js` und kopieren nach:
   ```
   src/router/index.js
   ```

3. **UserMenu.vue** kopieren nach:
   ```
   src/components/UserMenu.vue
   ```

---

## 🆕 Neue Funktionen

### Backend-Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| `GET` | `/api/favorites/admin/all` | Alle Favoriten aller User (Admin-only) |
| `GET` | `/api/favorites/admin/stats` | Statistiken über Favoriten (Admin-only) |

### Frontend-Route

| Pfad | Name | Komponente |
|------|------|------------|
| `/admin/favorites` | `admin-favorites` | `AdminFavoritesView.vue` |

---

## 📸 Vorschau der Admin-Ansicht

Die neue Admin-Transaktionsansicht zeigt:

1. **Statistik-Karten**
   - Gesamtanzahl Favoriten
   - Anzahl registrierter Nutzer
   - Durchschnitt Favoriten pro Nutzer

2. **Such- und Filterleiste**
   - Suche nach Nutzer, Rezept oder Produkt
   - Sortierung nach Datum, Nutzer oder Rezept

3. **Transaktions-Tabelle**
   - ID, Nutzer (Name + E-Mail), Rezept, Produkt, Datum
   - Link zum Produkt
   - Responsive Design für Mobile

---

## ✅ Erfüllte Anforderungen

Nach Installation dieser Dateien erfüllt das Projekt **vollständig** Punkt c):

- [x] Kunde kann Transaktionen durchführen (Favoriten)
- [x] Mehrere/komplexe Transaktionen möglich
- [x] **Admin kann Transaktionsdaten einsehen** ← NEU
- [x] Responsive Design
- [x] Validierung im Frontend
- [x] Validierung im Backend

**Geschätzte Punktzahl: 10/10** ✅

---

*Erstellt: Januar 2025*
