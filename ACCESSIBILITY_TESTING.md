# 🎯 Guide de Test d'Accessibilité WCAG 2.1 AA

## 📋 Vue d'ensemble

Ce guide vous aide à tester la conformité WCAG 2.1 AA de l'application RCT Connect.

## 🚀 Tests Automatiques

### 1. Test ESLint (Analyse statique du code)

```bash
# Test d'accessibilité standard
npm run lint

# Test d'accessibilité strict (toutes les règles en erreur)
npm run lint:a11y
```

**Ce qui est testé:**
- ✅ Présence des textes alternatifs sur les images
- ✅ Labels sur les éléments de formulaire
- ✅ Attributs ARIA valides
- ✅ Rôles ARIA appropriés
- ✅ Navigation au clavier
- ✅ Gestion du focus

### 2. Test Axe-core (En temps réel dans le navigateur)

L'application intègre déjà axe-core en mode développement!

```bash
# Lancez l'application
npm run dev
```

Puis:
1. Ouvrez http://localhost:8080 dans Chrome
2. Ouvrez DevTools (F12)
3. Allez dans l'onglet **Console**
4. Les violations d'accessibilité s'affichent automatiquement

**Violations affichées:**
- ❌ Problèmes de contraste
- ❌ Boutons sans nom accessible
- ❌ Images sans texte alternatif
- ❌ Labels manquants
- ❌ Attributs ARIA invalides

### 3. Guide complet des tests

```bash
npm run test:a11y
```

Affiche toutes les instructions et outils disponibles.

## 🔧 Tests avec Chrome DevTools

### Lighthouse Accessibility Audit

1. Ouvrez l'application dans Chrome
2. Ouvrez DevTools (F12)
3. Cliquez sur l'onglet **Lighthouse**
4. Sélectionnez **Accessibility** uniquement
5. Cliquez sur "Generate report"

**Score cible: ≥ 90/100**

### Ce que Lighthouse teste:
- ✅ Contraste des couleurs (WCAG 1.4.3)
- ✅ Noms accessibles des boutons et liens
- ✅ Attributs ARIA valides
- ✅ Structure des titres
- ✅ Labels de formulaire
- ✅ Landmarks HTML5
- ✅ Ordre de tabulation logique

## 🔌 Extensions Chrome Recommandées

### 1. axe DevTools (Recommandé!)

**Installation:**
1. Chrome Web Store → Recherchez "axe DevTools"
2. Cliquez sur "Ajouter à Chrome"

**Utilisation:**
1. Ouvrez l'application
2. F12 → Onglet "axe DevTools"
3. Cliquez sur "Scan ALL of my page"
4. Consultez les résultats détaillés

### 2. WAVE Evaluation Tool

**Installation:**
- https://wave.webaim.org/extension/

**Utilisation:**
- Cliquez sur l'icône WAVE dans la barre d'outils
- Analyse visuelle des problèmes d'accessibilité

## 🎹 Tests Manuels au Clavier

### Test de navigation complète

**À tester:**

1. **Navigation par Tab**
   ```
   - Appuyez sur Tab répétitivement
   - Tous les éléments interactifs doivent être focusables
   - L'ordre doit être logique
   - Le focus doit être visible (outline bleu)
   ```

2. **Navigation dans les Stories**
   ```
   - Ouvrez une story
   - Flèche droite (→) : Story suivante
   - Flèche gauche (←) : Story précédente
   - Espace : Pause/Play
   - Escape : Fermer
   ```

3. **Navigation dans les modales**
   ```
   - Le focus doit aller automatiquement dans la modale
   - Tab doit rester piégé dans la modale
   - Escape doit fermer la modale
   ```

4. **Formulaires**
   ```
   - Tous les champs doivent être accessibles au clavier
   - Les erreurs doivent être annoncées
   - Enter doit soumettre le formulaire
   ```

## 🔊 Tests avec Lecteur d'Écran

### Windows: NVDA (Gratuit)

**Installation:**
1. Téléchargez: https://www.nvaccess.org/download/
2. Installez et lancez NVDA

**Commandes de base:**
```
- Insert + Flèche bas : Lire tout
- Flèche bas : Ligne suivante
- Tab : Élément interactif suivant
- H : Titre suivant
- B : Bouton suivant
- E : Champ de saisie suivant
- K : Lien suivant
```

**Ce qui doit être annoncé correctement:**
- ✅ Titres de page et sections
- ✅ Noms des boutons et leur fonction
- ✅ Labels des champs de formulaire
- ✅ Textes alternatifs des images
- ✅ État des éléments (sélectionné, étendu, etc.)
- ✅ Messages d'erreur et de succès
- ✅ Navigation active (page courante)

## 🎨 Test de Contraste des Couleurs

### Outil en ligne

**WebAIM Contrast Checker:**
- https://webaim.org/resources/contrastchecker/

**Standards WCAG 2.1 AA:**
- Texte normal: ratio ≥ 4.5:1
- Texte large (≥18pt ou ≥14pt gras): ratio ≥ 3:1

### Éléments à vérifier:
```
- Text sur fond blanc/gris
- Badges de types d'événements
- Textes sur images/gradients
- Boutons et leurs états (hover, focus)
- Messages d'erreur
- Placeholders des champs
```

## 🔍 Test de Zoom et Redimensionnement

### Test à 200% de zoom

1. Ouvrez l'application
2. Ctrl + roulette de souris (ou Ctrl + "+")
3. Zoomez jusqu'à 200%

**À vérifier:**
- ✅ Tout le contenu reste visible
- ✅ Pas de défilement horizontal
- ✅ Les textes ne se chevauchent pas
- ✅ Les boutons restent cliquables
- ✅ Les images s'adaptent correctement

## 📱 Test Mobile et Tactile

### Tailles des zones tactiles (WCAG 2.5.5)

**Minimum requis: 44×44 pixels**

**À vérifier:**
- ✅ Tous les boutons de la BottomNav
- ✅ Boutons d'action (créer, modifier, supprimer)
- ✅ Liens dans les posts
- ✅ Contrôles des stories
- ✅ Éléments de formulaire

## 📊 Checklist WCAG 2.1 AA

### Principe 1: Perceptible

- [ ] **1.1.1** Textes alternatifs sur toutes les images
- [ ] **1.3.1** Structure HTML sémantique (header, main, nav)
- [ ] **1.3.2** Ordre de lecture logique
- [ ] **1.4.3** Contraste minimum (4.5:1)
- [ ] **1.4.4** Texte redimensionnable (200%)
- [ ] **1.4.10** Reflow (pas de scroll horizontal à 320px)
- [ ] **1.4.11** Contraste non-textuel (3:1)

### Principe 2: Utilisable

- [ ] **2.1.1** Navigation clavier complète
- [ ] **2.1.2** Pas de piège au clavier
- [ ] **2.4.1** Skip links implémentés
- [ ] **2.4.3** Ordre de focus logique
- [ ] **2.4.7** Focus visible
- [ ] **2.5.5** Taille des cibles (44×44px)

### Principe 3: Compréhensible

- [ ] **3.1.1** Langue de la page définie (lang="fr")
- [ ] **3.2.3** Navigation cohérente
- [ ] **3.3.1** Identification des erreurs
- [ ] **3.3.2** Labels ou instructions sur formulaires
- [ ] **3.3.3** Suggestions de correction d'erreurs

### Principe 4: Robuste

- [ ] **4.1.2** Nom, rôle, valeur (ARIA)
- [ ] **4.1.3** Messages de statut (aria-live)

## 🛠️ Correction des Problèmes

### Problèmes courants et solutions

#### 1. Contraste insuffisant
```tsx
// Avant (mauvais contraste)
<p className="text-gray-400">Texte</p>

// Après (bon contraste)
<p className="text-gray-600 dark:text-gray-300">Texte</p>
```

#### 2. Bouton sans nom accessible
```tsx
// Avant
<button><Icon /></button>

// Après
<button aria-label="Fermer">
  <Icon aria-hidden="true" />
</button>
```

#### 3. Image sans alt
```tsx
// Avant
<img src="photo.jpg" />

// Après
<img src="photo.jpg" alt="Coureur lors du marathon de Tunis" />
```

#### 4. Label manquant
```tsx
// Avant
<input type="email" placeholder="Email" />

// Après
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

## 📈 Résultats Attendus

### Scores cibles:

- **Lighthouse Accessibility: ≥ 90/100**
- **axe DevTools: 0 violations critiques**
- **ESLint: 0 erreurs d'accessibilité**
- **Tests manuels: 100% navigable au clavier**
- **Lecteur d'écran: Toutes les infos annoncées**

## 🎓 Ressources Supplémentaires

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/resources/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)

## 💡 Besoin d'Aide?

Consultez [ACCESSIBILITY.md](./ACCESSIBILITY.md) pour plus de détails sur l'implémentation d'accessibilité dans l'application.
