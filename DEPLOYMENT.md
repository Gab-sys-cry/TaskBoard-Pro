# Déploiement du site TaskBoard-Pro

## Sommaire
- [Préparation commune](#pr%C3%A9paration-commune)
- [GitHub Pages](#github-pages)
- [Angular CLI `gh-pages`](#angular-cli-gh-pages)
- [GitHub Actions](#github-actions)
- [Modes d'exécution : SSR, Prerender & SPA](#modes-dex%C3%A9cution-ssr-prerender--spa)
- [Prerender / SSG](#prerender--ssg)

## Préparation commune
1. Confirme que la compilation fonctionne via `npm run build`.
2. Vérifie que `baseHref` dans `angular.json` correspond au dossier racine lors du déploiement (ex : `/TaskBoard-Pro/`).
3. Pour les pages statiques, assure-toi que `index.html` est bien copié et que les assets sont accessibles.

## GitHub Pages
1. Créé un build de production avec `npm run build -- --output-path=dist`.
2. Active la branche `gh-pages` dans GitHub (Settings > Pages > Source : `gh-pages`).
3. Depuis la racine du projet, pousse `dist/` sur `gh-pages` via :
   ```powershell
   npm run build
   npx angular-cli-ghpages --dir=dist
   ```
4. Si tu préfères un workflow manuel :
   - Crée un dépôt `gh-pages` séparé ou branche.
   - Copie le contenu de `dist/` vers ce dépôt.
   - Pousse la branche et configure GitHub Pages sur cette branche.

## Angular CLI `gh-pages`
1. Installe l'outil si nécessaire :
   ```powershell
   npm install --save-dev angular-cli-ghpages
   ```
2. Ajoute un script dans `package.json` :
   ```json
   "deploy:ghpages": "ng build --prod --base-href=/TaskBoard-Pro/ && npx angular-cli-ghpages --dir=dist"
   ```
3. Exécute `npm run deploy:ghpages` pour construire et publier automatiquement sur la branche `gh-pages`.
4. Vérifie que GitHub Pages utilise bien la branche `gh-pages` (Settings > Pages).

## GitHub Actions
1. Crée `/.github/workflows/deploy.yml` contenant :
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ "main" ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest

       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             cache: 'npm'
             node-version: '20'
         - run: npm install
         - run: npm run build -- --output-path=dist --base-href=/TaskBoard-Pro/
         - uses: peaceiris/actions-gh-pages@v4
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```
2. Modifie `branches` si tu utilises une autre branche par défaut (`main`/`master`).
3. Après un `push`, GitHub Actions construira l'application et utilisera `peaceiris/actions-gh-pages` pour mettre à jour la branche `gh-pages`.

## Modes d'exécution : SSR, Prerender & SPA
- **SPA (Single Page Application)** : l'application Angular est compilée côté client. Le serveur renvoie un `index.html` unique ; le routage est géré par Angular. Convient aux sites dynamiques, mais le SEO et le temps au premier chargement peuvent souffrir.
- **SSR (Server-Side Rendering)** : Angular Universal assemble les pages côté serveur, ce qui améliore SEO et performance perçue. Nécessite un serveur Node.js pouvant exécuter l'app Angular générée (`ng run app:server`).
- **Prerender** : version pré-générée des routes. Chaque route listée est rendue à la construction et les fichiers statiques (`index.html`, `*.json`) sont livrés. Comporte certains bénéfices de SSR sans serveur dynamique.

### Choisir entre SSR & SPA
| Cas d'usage | Avantages | Contraintes |
|-------------|-----------|-------------|
| SPA | Simplicité, déploiement statique | Chargement initial plus lent, SEO limité |
| SSR | SEO, performance initiale | Besoin d'un serveur (Node.js) |
| Prerender | SEO pour routes connues, hébergement statique | Routes dynamiques non couvertes |

## Prerender / SSG
1. Active Angular Universal :
   ```powershell
   ng add @nguniversal/express-engine
   ```
2. Liste les routes à pré-rendre dans `prerender.ts`.
3. Modifie `package.json` pour ajouter :
   ```json
   "scripts": {
     "prebuild": "ng build --configuration production && ng run app:server:production",
     "prerender": "ng run app:prerender"
   }
   ```
4. Exécute `npm run prerender` pour générer les pages statiques dans `dist/app/browser`.
5. Déploie ce dossier comme pour une SPA (GitHub Pages, `gh-pages`, CDN statique).
6. Pour un vrai SSG, liste toutes les routes possibles dans la configuration de prerender et ajoute des hooks si des données dynamiques doivent être résolues pendant la construction.

