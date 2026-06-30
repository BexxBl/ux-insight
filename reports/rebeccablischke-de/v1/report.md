# UX Audit — Portfolio Rebecca Blischke

**Gestalterisch starkes, technisch sauber gebautes Portfolio mit einer klaren Schwachstelle: Barrierefreiheit und die Tastatur-/Fokus-Ebene der Kern-Interaktionen.**

| | |
|---|---|
| **Auditierte URL** | https://rebeccablischke.de/ |
| **Auftraggeber:in** | Rebecca Blischke |
| **Erstellt von** | UX Insight — Senior UX Lead (Expert Review) |
| **Datum** | 30.06.2026 |
| **Report-Typ** | ux_audit · Schema 1.0.0 · Report v1.0 |
| **Standards** | WCAG 2.2 AA, Nielsen 10 Heuristics |
| **Methodik (Quellen)** | source_code, heuristic_expert_review |

> **⚠️ Methodischer Hinweis — Grenzen dieser Analyse**
> - Reale Laufzeit-Performance (LCP, CLS, TBT) wurde NICHT gemessen — erfordert Lighthouse/WebPageTest am Live-System.
> - Rendering auf echten Geräten/Viewports wurde NICHT getestet — Responsive-Aussagen basieren auf CSS-/JS-Code, nicht auf visueller Prüfung.
> - Screenreader-Verhalten wurde NICHT mit AT (NVDA/VoiceOver) verifiziert — A11y-Findings basieren auf Code-Struktur.
> - Inhaltliche/Mockup-Artefakte (z. B. noch nicht final kontrollierte Texte) wurden auf Wunsch der Kundin ausgeschlossen; Fokus liegt auf Struktur, Code-Qualität und Interaktion.

## Gesamtbewertung

### 70 / 100 — Solide

| Kategorie | Score | Bewertung | Gewicht | Begründung |
|---|---|---|---|---|
| Navigation | **64** | Solide | ×1.0 | JS-Slider funktioniert, aber Scroll-Hijacking und fehlender No-JS-/Fokus-Fallback senken den Wert. |
| Barrierefreiheit | **52** | Schwach | ×1.5 | Keine Fokus-Stile, keine Reduced-Motion, kein <main>/Skip-Link, klickbare DIVs ohne Tastaturzugang. |
| Visuelles Design | **84** | Stark | ×1.0 | Eigenständige Markenhandschrift, konsistente Token-Architektur, Light/Dark sauber. |
| Mobile UX | **74** | Solide | ×1.0 | Code-seitig dedizierter Mobile-Pfad (kein Hijack, eigenes Menü); ungemessen auf echten Geräten. |
| Content-Struktur | **78** | Stark | ×1.0 | Klare IA, gute Projekt-/CV-Struktur; Texte ausgeklammert (Mockup-Stand). |
| Konsistenz | **74** | Solide | ×1.0 | Innerhalb der Seite konsistent; Token-Duplizierung über das Seiten-Ökosystem hinweg. |
| Vertrauen | **72** | Solide | ×1.0 | Funktionierendes Formular, Zertifikate, klare Vita; A11y-Lücken mindern Fachglaubwürdigkeit. |

_Der Gesamtwert ist das gewichtete Mittel der Kategorien; die Gewichte sind im Report hinterlegt und reproduzierbar._

## Zusammenfassung

Das Portfolio hinterlässt einen überdurchschnittlichen Gesamteindruck: eigenständige Markenhandschrift, konsequente Token-basierte CSS-Architektur mit Light/Dark-Theme und ein funktionierendes, mit Feedback versehenes Kontaktformular. Die Engineering-Grundlage ist solide — Animationen, Theme-Persistenz und Modal-Logik sind sauber umgesetzt.

Die zentrale Schwäche ist systematisch, nicht zufällig: Die Seite besitzt keinerlei sichtbare Fokus-Stile, respektiert keine Bewegungsreduktion und kapselt ihren Inhalt nicht in Landmark-Regionen. Die wichtigsten Interaktionen — Skill- und Projekt-Karten — sind als klickbare DIVs ohne Tastatur-Zugang gebaut. Für ein Portfolio, das Barrierefreiheit und Nutzerzentrierung als Kernkompetenz verkauft, ist das die mit Abstand wichtigste Baustelle, weil es eine inhaltliche Glaubwürdigkeitsfrage berührt.

Die zweite konzeptionelle Frage ist das horizontale Scroll-Hijacking: gestalterisch markant, aber ein bekannter Usability-Reibungspunkt, der vom UX-Fachpublikum kritisch beurteilt wird. Hier lohnt eine bewusste Entscheidung statt eines Kompromisses.

Die gute Nachricht: Fast alle Befunde sind mit geringem Aufwand behebbar, und die vorhandene Architektur (Design-Tokens, sauberes JS) macht die Korrekturen einfach. Drei kleine Eingriffe heben das Accessibility-Niveau spürbar.

**Kernpunkte:**

- Solide technische Basis: Token-CSS, Light/Dark, funktionierendes Formular, saubere Animations-/Modal-Logik.
- Größtes Risiko ist Accessibility: keine Fokus-Stile, keine Reduced-Motion, kein <main>/Skip-Link, klickbare DIVs ohne Tastatur.
- Scroll-Hijacking ist die einzige größere konzeptionelle Entscheidung — bewusst klären statt halb lösen.
- Hoher Hebel bei niedrigem Aufwand: drei Quick Wins heben A11y auf allen Ebenen.

## Was bereits stark ist

### ✅ Funktionierendes Kontaktformular mit echtem Feedback

Das Formular nutzt ein echtes <form> mit Formspree-Anbindung, Pflichtfeldern, Erfolgs-/Fehler-Boxen und Button-Disable während des Sendens. Es ist das einzige der drei Seiten-Formulare im Ökosystem, das tatsächlich versendet — und damit Referenz-Implementierung für die übrigen.

_Beleg: `script.js 197-217`_

### ✅ Konsequente Design-Token-Architektur mit Light/Dark

Farben, Spacing, Radius und Schatten sind durchgängig als CSS-Custom-Properties definiert und für ein Dark-Theme überschrieben. Das ist eine saubere, wartbare Grundlage und die ideale Basis für ein geteiltes Design-System über alle Projekte.

_Beleg: `style.css 1-60`; `script.js 21-29`_

### ✅ Durchdachte Animations- und Modal-Logik

Count-up-Statistiken laufen performant über requestAnimationFrame, Reveals werden per IntersectionObserver getriggert, Overlays schließen via ESC und Backdrop-Klick. Die Interaktions-Sorgfalt ist erkennbar vorhanden — sie muss nur tastatur- und ARIA-seitig vervollständigt werden.

_Beleg: `script.js 66-135`_

## Quick Wins (hoher Hebel, geringer Aufwand)

| # | Maßnahme | Aufwand | Business-Impact | Finding |
|---|---|---|---|---|
| 1 | Globalen :focus-visible-Stil einführen | Gering | Hoch | F-P1 |
| 2 | prefers-reduced-motion respektieren + Count-ups auf Endwert | Gering | Mittel | F-P2 |
| 3 | <main>-Landmark + Skip-Link ergänzen | Gering | Mittel | F-P3 |
| 4 | Skill-/Projekt-Karten zu echten Buttons machen | Mittel | Hoch | F-P4 |
| 5 | Kontrast von --muted und --green korrigieren | Gering | Mittel | F-P6 |

## Findings im Detail

### F-P1 — Keine sichtbaren Fokus-Stile für Tastaturnutzung

**Kategorie:** Barrierefreiheit  ·  **Severity:** 🔴 Critical  ·  **Business Impact:** Hoch  ·  **Aufwand:** Gering  ·  **Confidence:** Hoch

**Problem.** Die Stylesheet enthält keinen einzigen :focus- oder :focus-visible-Stil. Interaktive Elemente (Navigation, Karten, Formularfelder, Theme-Toggle, Mobile-Menü) zeigen damit keinen erkennbaren Tastaturfokus über den Browser-Default hinaus — und Custom-Styling überdeckt den Default an mehreren Stellen.

**Beleg.** Suche nach ':focus-visible' und ':focus {' in style.css liefert keine echte Fokus-Regel (nur ein zufälliger Substring in '.focus-inner').

- `style.css` — Kein :focus-visible-Selektor im gesamten Stylesheet vorhanden.

**Empfehlung.** Einen globalen, token-basierten Fokus-Stil ergänzen, z. B.: ':focus-visible{ outline:2px solid var(--accent); outline-offset:2px; border-radius:4px; }'. Einmal definiert, wirkt er auf allen interaktiven Elementen. Sicherstellen, dass kein 'outline:none' ohne Ersatz gesetzt ist.

**Nutzen für User:** Tastatur- und Screenreader-Nutzer:innen erkennen jederzeit, wo sie sich befinden, und können die Seite überhaupt navigieren.

**Nutzen fürs Business:** Schließt die größte rechtliche/qualitative A11y-Lücke und schützt die Fach-Glaubwürdigkeit eines UX-Portfolios, das Barrierefreiheit als Kompetenz ausweist.

**UX-Prinzip:** Nielsen #1: Sichtbarkeit des Systemstatus  ·  **WCAG:** 2.4.7 Focus Visible (AA), 2.1.1 Keyboard (A)

> 📷 _Screenshot-Platzhalter: Tab-Durchlauf ohne erkennbaren Fokus-Indikator_

---

### F-P4 — Skill- und Projekt-Karten sind klickbare DIVs ohne Tastaturzugang

**Kategorie:** Barrierefreiheit  ·  **Severity:** 🔴 Critical  ·  **Business Impact:** Hoch  ·  **Aufwand:** Mittel  ·  **Confidence:** Hoch

**Problem.** Die zentralen Interaktionen — Skill-Karten und Projekt-Karten, die Detail-Overlays öffnen — sind als <div> mit click-Listener gebaut, ohne tabindex, ohne role="button", ohne Tastatur-Handler. Per Tastatur sind sie nicht erreichbar und nicht auslösbar. Die geöffneten Overlays haben zudem kein role="dialog"/aria-modal und keinen Fokus-Trap.

**Beleg.** Karten reagieren nur auf 'click'; keine Keyboard-Aktivierung; Overlays ohne Dialog-Semantik und ohne Fokusverwaltung.

- `script.js · Z. 175-176` — `.sk-card[data-skill]` — click-only
- `script.js · Z. 193-194` — `.proj-card[data-proj]` — click-only
- `index.html · Z. 269-294` — Overlays ohne role=dialog/aria-modal/Fokus-Trap

**Empfehlung.** Karten als echte <button> umsetzen (oder role="button" tabindex="0" plus Enter/Space-Handler). Overlays mit role="dialog" aria-modal="true" und aria-labelledby auszeichnen; beim Öffnen Fokus ins Modal setzen, Fokus-Trap aktivieren, beim Schließen Fokus auf die auslösende Karte zurückgeben (ESC ist bereits vorhanden).

**Nutzen für User:** Die Hauptinhalte (Cases, Skills) werden für Tastatur- und Screenreader-Nutzung überhaupt erst zugänglich; der Fokus 'entkommt' nicht mehr in den Hintergrund.

**Nutzen fürs Business:** Macht den wertvollsten Teil des Portfolios — die Projekt-Cases — für alle Recruiter:innen nutzbar, inkl. solcher mit assistiver Technik.

**UX-Prinzip:** Nielsen #4: Konsistenz & Standards (native Semantik)  ·  **WCAG:** 2.1.1 Keyboard (A), 4.1.2 Name, Role, Value (A), 2.4.3 Focus Order (A)

> 📷 _Screenshot-Platzhalter: Projekt-Karten-Grid und geöffnetes Detail-Overlay_

---

### F-P2 — Keine Unterstützung für prefers-reduced-motion

**Kategorie:** Barrierefreiheit  ·  **Severity:** 🟠 High  ·  **Business Impact:** Mittel  ·  **Aufwand:** Gering  ·  **Confidence:** Hoch

**Problem.** Die Seite respektiert die System-Einstellung 'Bewegung reduzieren' nicht. Horizontales Wheel-Scrolling, Count-up-Animationen und Reveal-Transitions laufen für alle Nutzer:innen identisch — ohne reduzierte Variante.

**Beleg.** Keine '@media (prefers-reduced-motion)'-Regel in style.css; Animationen werden unbedingt in script.js gestartet.

- `style.css` — Kein reduced-motion-Media-Query.
- `script.js · Z. 78-135` — Animationen ohne Motion-Guard.

**Empfehlung.** Einen Reduced-Motion-Block ergänzen: '@media (prefers-reduced-motion: reduce){ *{ animation:none!important; transition:none!important; scroll-behavior:auto!important } }'. Count-ups in diesem Fall direkt auf den Endwert setzen, statt hochzuzählen. JS kann window.matchMedia('(prefers-reduced-motion: reduce)') abfragen.

**Nutzen für User:** Nutzer:innen mit vestibulären Beschwerden vermeiden Schwindel/Übelkeit und können die Inhalte ruhig konsumieren.

**Nutzen fürs Business:** Erfüllt ein konkretes WCAG-AA-Kriterium und erweitert die nutzbare Zielgruppe ohne gestalterischen Kompromiss für alle anderen.

**UX-Prinzip:** Inklusives Design / Nutzerkontrolle  ·  **WCAG:** 2.3.3 Animation from Interactions (AAA)

---

### F-P3 — Keine <main>-Landmark und kein Skip-Link

**Kategorie:** Barrierefreiheit  ·  **Severity:** 🟠 High  ·  **Business Impact:** Mittel  ·  **Aufwand:** Gering  ·  **Confidence:** Hoch

**Problem.** Die Seite verwendet <nav> und <footer>, aber kein <main>-Element und keinen 'Zum Inhalt springen'-Link. Screenreader-Nutzer:innen können weder die Hauptregion ansteuern noch die wiederkehrende Navigation überspringen.

**Beleg.** Im HTML kein <main>-Tag; kein Skip-Link als erster fokussierbarer Knoten.

- `index.html` — Landmark <main> fehlt; erster fokussierbarer Knoten ist der Logo-Link.

**Empfehlung.** Den Inhalts-Track in <main id="main"> kapseln und als allerersten Body-Knoten einen visuell versteckten, bei Fokus sichtbaren Skip-Link einfügen: '<a class="skip" href="#main">Zum Inhalt springen</a>'. Optional Sektionen als <section aria-label> auszeichnen.

**Nutzen für User:** Screenreader-Nutzer:innen springen direkt zum Inhalt und navigieren per Landmark-Shortcut, statt sich durch die Navigation zu arbeiten.

**Nutzen fürs Business:** Standard-A11y-Hygiene, die in jedem professionellen Audit erwartet wird — günstig umzusetzen, hohe Signalwirkung.

**UX-Prinzip:** Nielsen #7: Flexibilität & Effizienz  ·  **WCAG:** 1.3.1 Info and Relationships (A), 2.4.1 Bypass Blocks (A)

---

### F-P5 — Horizontales Scroll-Hijacking überschreibt die Scroll-Erwartung

**Kategorie:** Navigation  ·  **Severity:** 🟠 High  ·  **Business Impact:** Mittel  ·  **Aufwand:** Hoch  ·  **Confidence:** Hoch

**Problem.** Auf Desktop fängt ein wheel-Listener das vertikale Mausrad ab (e.preventDefault) und übersetzt es in horizontales Scrollen des Panel-Tracks. Das widerspricht der erlernten Scroll-Erwartung und erschwert präzise Steuerung mit Maus und Trackpad. Zusätzlich funktioniert die Slider-Navigation ausschließlich per JavaScript (href="#" + data-idx); ohne JS gibt es keine Anker-Ziele, und beim Panel-Wechsel wandert der Tastaturfokus nicht mit.

**Beleg.** wheel-Handler mit preventDefault lenkt deltaY in scrollLeft; Nav-Links nutzen scrollIntoView statt echter Anker; kein Fokus-Transfer auf das Zielpanel.

- `script.js · Z. 38-46` — wheel→horizontal, preventDefault
- `script.js · Z. 48-55` — Nav via scrollIntoView, kein href-Ziel
- `index.html · Z. 33-38` — href="#" data-idx

**Empfehlung.** Eine bewusste Entscheidung treffen statt Mittelweg: Variante A — horizontales Konzept beibehalten, aber ohne preventDefault, mit CSS scroll-snap, sichtbaren Vor/Zurück-Controls, korrektem Fokus-Transfer (Zielpanel tabindex="-1" + .focus()) und vertikalem Fallback bei prefers-reduced-motion. Variante B — auf vertikales Layout wechseln und echte Sektions-Anker (#projekte etc.) verwenden, die auch ohne JS funktionieren. Empfehlung: Variante B für ein Bewerbungs-Portfolio, weil Robustheit und Erwartungskonformität hier schwerer wiegen als der Effekt.

**Nutzen für User:** Vorhersehbares Scrollen, verlässliche Navigation auch ohne JS, und Tastaturnutzer:innen behalten nach einem Sprung die Orientierung.

**Nutzen fürs Business:** Entfernt den Reibungspunkt, der von genau der Fachzielgruppe (UX/Recruiting) am ehesten negativ bewertet wird.

**UX-Prinzip:** Nielsen #3: Nutzerkontrolle & Freiheit  ·  **WCAG:** 2.4.3 Focus Order (A)

---

### F-P6 — Textfarben --muted und --green unter dem WCAG-AA-Kontrast

**Kategorie:** Barrierefreiheit  ·  **Severity:** 🟠 High  ·  **Business Impact:** Mittel  ·  **Aufwand:** Gering  ·  **Confidence:** Hoch

**Problem.** Mehrere als Text genutzte Farb-Token unterschreiten das Mindestkontrastverhältnis von 4.5:1 für normalen Text. Betroffen sind verbreitete Sekundärtexte (--muted) in beiden Themes sowie grüner Text (--green) auf hellem Grund.

**Beleg.** Aus den CSS-Token berechnete Kontrastverhältnisse gegen die jeweiligen Hintergründe.

- `style.css · Z. 1-60` — Token-Definitionen --muted / --green

| Messung | Wert | Schwelle | Status |
|---|---|---|---|
| --muted #8284a8 auf Weiß (Light) | 3.61:1 | 4.5:1 | ❌ verfehlt |
| --green #06c48b als Text auf Weiß (Light) | 2.26:1 | 4.5:1 | ❌ verfehlt |
| --muted #5a5878 auf #111633 (Dark) | 2.61:1 | 4.5:1 | ❌ verfehlt |
| --accent #4361ee auf Weiß (Vergleich, OK) | 5.02:1 | 4.5:1 | ✅ erfüllt |

**Empfehlung.** --muted in beiden Themes anpassen (Light z. B. in Richtung #5f6186 abdunkeln, Dark in Richtung #8a88b0 aufhellen) und --green nur für Flächen/Icons verwenden; für grünen Text eine dunklere Variante definieren. Anschließend mit einem Kontrast-Checker gegen alle realen Hintergründe gegenprüfen.

**Nutzen für User:** Sekundärtexte (u. a. Projektbeschreibungen und Labels) werden für Nutzer:innen mit eingeschränktem Sehvermögen und bei schlechten Lichtverhältnissen lesbar.

**Nutzen fürs Business:** Behebt einen häufig automatisiert erkannten AA-Verstoß und erhöht die Lesbarkeit für alle.

**UX-Prinzip:** Lesbarkeit / visuelle Zugänglichkeit  ·  **WCAG:** 1.4.3 Contrast (Minimum) (AA)

---

### F-P7 — Design-Tokens werden je Projekt dupliziert statt geteilt

**Kategorie:** Konsistenz  ·  **Severity:** 🟡 Medium  ·  **Business Impact:** Mittel  ·  **Aufwand:** Mittel  ·  **Confidence:** Hoch

**Problem.** Alle drei Projekte des Ökosystems teilen erkennbar dieselbe Designsprache (Token-CSS, nummerierte Formularfelder, Hero mit hervorgehobenem Schlusswort), implementieren Tokens und Kernkomponenten aber jeweils eigenständig. Das erzeugt dreifachen Pflegeaufwand und Drift-Risiko.

**Beleg.** Token-Sets und Komponenten (Formular, Navigation, Card) sind über die Seiten dupliziert, nicht gemeinsam genutzt.

- `style.css` — Eigenes Token-Set; identische Muster auf den Schwesterseiten dupliziert.

**Empfehlung.** Eine geteilte tokens.css (Farben, Spacing, Typo, Radius) plus 2–3 wiederverwendbare Komponenten (Button, Form-Field, Card) extrahieren und in allen drei Projekten einbinden. Kein Framework nötig — reines CSS/Vanilla reicht.

**Nutzen für User:** Konsistentes Verhalten und Erscheinungsbild über das gesamte Kirchberg-/Portfolio-Ökosystem hinweg.

**Nutzen fürs Business:** Senkt den Wartungsaufwand dauerhaft und verhindert, dass Korrekturen mehrfach nachgezogen werden müssen.

**UX-Prinzip:** Nielsen #4: Konsistenz & Standards

---

### F-P8 — Formular-Status wird Screenreadern nicht angekündigt

**Kategorie:** Vertrauen  ·  **Severity:** 🟡 Medium  ·  **Business Impact:** Mittel  ·  **Aufwand:** Gering  ·  **Confidence:** Hoch

**Problem.** Die Erfolgs- und Fehlermeldungen des Kontaktformulars werden per display:block eingeblendet, sind aber nicht als Live-Region ausgezeichnet. Labels sind nur durch Verschachtelung mit dem Feld verbunden, nicht explizit per for/id. Eine feldspezifische Validierungsmeldung fehlt.

**Beleg.** formSuccess/formError ohne role=status/aria-live; <label> ohne for-Attribut.

- `index.html · Z. 253-260` — Labels ohne for; Status-Boxen ohne aria-live
- `script.js · Z. 210-214` — Status nur visuell umgeschaltet

**Empfehlung.** Status-Container mit role="status" aria-live="polite" auszeichnen und bei Fehler den Fokus dorthin setzen. Labels explizit per for/id mit den Feldern verknüpfen. Optional feldnahe Validierungshinweise ergänzen.

**Nutzen für User:** Screenreader-Nutzer:innen erfahren zuverlässig, ob das Absenden geklappt hat oder fehlschlug.

**Nutzen fürs Business:** Sichert den einzigen direkten Conversion-Pfad (Kontaktaufnahme) auch für assistive Technik ab.

**UX-Prinzip:** Nielsen #9: Fehler erkennen & beheben  ·  **WCAG:** 4.1.3 Status Messages (AA), 3.3.2 Labels or Instructions (A)

---

### F-P9 — Chance: Sticky-Fortschritt + direkte Tiefenlinks zu Cases

**Kategorie:** Navigation  ·  **Severity:** 🟢 Low  ·  **Business Impact:** Mittel  ·  **Aufwand:** Mittel  ·  **Confidence:** Mittel · 💡 Opportunity

**Problem.** Die Seite hat bereits einen Fortschrittsbalken und Panel-Indizes, nutzt dieses Potenzial aber nicht für gezielte Orientierung oder teilbare Tiefenlinks. Recruiter:innen, die einen bestimmten Case verlinken oder direkt anspringen wollen, können das nicht.

**Beleg.** Fortschrittsbalken (pFill) und data-idx vorhanden; keine URL-Hashes pro Sektion/Case, keine Deeplinks.

- `script.js · Z. 126-129` — Progress-Berechnung vorhanden, ohne URL-Sync

**Empfehlung.** Pro Sektion und idealerweise pro Projekt-Case einen URL-Hash vergeben (z. B. #projekte/car-lec), beim Öffnen eines Overlays die URL aktualisieren (history.replaceState) und beim Laden mit Hash das passende Panel/Overlay öffnen. So entstehen teilbare, bookmarkbare Deeplinks — ein konkreter Mehrwert für Bewerbungen, bei denen ein einzelner Case verlinkt wird.

**Nutzen für User:** Nutzer:innen können einen bestimmten Case direkt aufrufen, teilen und per Browser-Zurück sauber schließen.

**Nutzen fürs Business:** Macht das Portfolio gezielt referenzierbar (Bewerbung, LinkedIn-Post zu einem Case) und verbessert SEO/Teilbarkeit.

**UX-Prinzip:** Nielsen #7: Flexibilität & Effizienz

---

## Strategische Empfehlungen (Roadmap)

### Jetzt (dieser Sprint)

- **Scroll-Paradigma bewusst entscheiden** — Entweder das horizontale Konzept voll barrierefrei und tastaturbedienbar ausbauen (mit Vor/Zurück-Controls, Fokusführung, Reduced-Motion-Fallback auf vertikal) oder konsequent auf ein vertikales Layout wechseln. Den jetzigen Mittelweg auflösen. _(betrifft F-P5)_

### Als Nächstes (dieses Quartal)

- **A11y-Grundausstattung als Bau-Standard etablieren** — Fokus-Stil, Landmarks, Dialog-Pattern und Reduced-Motion als wiederverwendbares Snippet in den eigenen Workflow aufnehmen — passt zum 'reuse before create'-Prinzip und verhindert Wiederholung der gleichen Lücken in künftigen Projekten. _(betrifft F-P1, F-P3, F-P5)_

### Später (strategisch)

- **Geteiltes Mini-Design-System extrahieren** — Die bereits saubere Token-Basis in eine geteilte tokens.css plus 2–3 Komponenten (Button, Form-Field, Card) überführen, die alle drei Projekte des Ökosystems nutzen. Senkt Pflegeaufwand und Drift-Risiko dauerhaft. _(betrifft F-P7)_
- **Automatisierte A11y-Checks in den Deploy aufnehmen** — axe-core/Lighthouse-CI als Pre-Deploy-Schritt, der Fokus-, Kontrast- und Landmark-Regressionen abfängt, bevor sie auf Strato live gehen.

---

_UX Insight · UX Audit · Report-ID `01J9X8M2K4-RBLISCHKE-UXAUDIT-0001` · generiert aus `report.json` (Schema 1.0.0)._
