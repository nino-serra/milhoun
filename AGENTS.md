# Poursuivre Milhoun avec Codex

- Le jeu est statique. Les sources maintenues sont dans `dist/` ; ne pas introduire une étape de build sans besoin concret.
- Exécuter les tests existants avec Node.js 24 après les modifications du jeu.
- Vérifier aussi le rendu réel et les interactions dans un navigateur ; les tests simulent le rendu 3D.
- Préserver la clé `milhoun-island-v1`, le format de sauvegarde et l’export/import. Toute migration doit conserver les anciennes parties.
- Ne jamais versionner une partie réelle, un secret, un fichier `.env`, une archive, un cache ou des métadonnées d’hébergement.
- Publier uniquement `dist/`. Conserver la bibliothèque Three.js et sa notice.
- Incrémenter `CACHE_VERSION` dans `dist/sw.js` quand les fichiers publiés changent.
