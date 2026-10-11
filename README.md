# Milhoun — L’île des dinos

Jeu 3D en français : explorer une île, construire et apprivoiser des dinosaures.

## Jouer et installer

Le jeu est un site statique, sans compte ni serveur applicatif. Sur Android, ouvrir son adresse HTTPS dans Chrome puis utiliser « Installer l’application » ou « Ajouter à l’écran d’accueil » si proposé. L’installation sur un appareil physique reste à vérifier. Cette version est une application Web, pas un APK.

## Développement

- Node.js 24 est utilisé pour les tests et le serveur local. Aucune installation npm ni compilation n’est nécessaire.
- Lancer `node server.cjs`, puis ouvrir http://127.0.0.1:4173.
- Lancer `node --test tests/*.test.mjs` pour les vérifications.
- Les fichiers de `dist/` sont les sources directement exécutées : HTML, CSS et modules JavaScript. Modifier ces fichiers pour poursuivre avec Codex.
- Three.js r170 est inclus dans `dist/vendor/three.module.js`, avec sa notice MIT conservée.

## GitHub Pages

Le workflow `.github/workflows/pages.yml` teste puis publie uniquement `dist/`. Dans Settings → Pages, sélectionner GitHub Actions comme source. Le workflow se lance sur les modifications de `main` et manuellement. Le jeu utilise des chemins relatifs compatibles avec un sous-dossier de dépôt. Aucun secret personnalisé n’est nécessaire ; le workflow utilise le jeton temporaire fourni par GitHub Actions.

## Sauvegardes

Les parties sont stockées localement dans le navigateur (`milhoun-island-v1`), sans synchronisation ni envoi au serveur. Avant de changer d’adresse, exporter la partie depuis le menu de l’ancien jeu, conserver le fichier sur son appareil puis l’importer à la nouvelle adresse. Une importation garde une copie de la partie précédente dans le navigateur. Ne pas effacer les données du navigateur avant l’export.

Le stockage est lié à l’origine (protocole, domaine, port), pas au chemin : deux jeux Milhoun hébergés sous le même domaine partagent cette clé. Les fichiers de parties ne doivent jamais être ajoutés au dépôt, aux tickets ni aux pièces jointes publiques.

## Mode hors ligne et mises à jour

Le service worker met en cache les fichiers après une première visite réussie. À chaque publication qui modifie `dist/`, changer la version de `CACHE_VERSION` dans `dist/sw.js`. Le cache est limité au dossier du jeu et distinct de celui des autres sites sur le même domaine.

## Provenance et validation

Base : `Milhoun-version-Android-a-publier.tar.gz`, dont tous les modules du jeu sont identiques à ceux de `Milhoun-projet-complet.zip`. Tests et lancement local proviennent de l’archive complète. Les métadonnées de l’ancien hébergement sont exclues. Voir `AUDIT.md` pour le contrôle de préparation.

Aucune licence de redistribution du jeu n’a été ajoutée automatiquement. La notice de la dépendance Three.js reste conservée.
