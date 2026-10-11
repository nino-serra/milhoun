# Préparation de publication — 11 octobre 2026

## Inspection

- Les listes des deux archives ont été vérifiées avant extraction : chemins relatifs, fichiers ordinaires et dossiers, aucun lien ni chemin sortant observé.
- Extraction réalisée dans un dossier de travail distinct des références synchronisées.
- Toutes les empreintes du manifeste `FICHIERS.sha256` de l’archive complète correspondent aux fichiers extraits.
- Tous les modules JavaScript du jeu et la bibliothèque Three.js sont identiques entre les archives. La version Android ajoute les fichiers PWA, les métadonnées HTML et le bouton d’installation avec son style.
- Aucun secret ni fichier de partie trouvé lors de l’inventaire et de la recherche dans les fichiers. Il ne s’agit pas d’un audit exhaustif de sécurité de l’application.

## Version préparée

- `dist/` de l’archive Android, sans `dist/.openai/hosting.json`.
- Tests et lancement local de l’archive complète.
- README, règles Codex, exclusions Git et workflow Pages ajoutés.
- Cache du service worker isolé par dossier, requêtes limitées à sa portée.
- Serveur de développement limité à 127.0.0.1, type MIME du manifeste ajouté.
- Aucun fichier volumineux inutile : la bibliothèque Three.js, environ 1,3 Mo, est nécessaire au jeu. Archives, APK, caches et sauvegardes sont exclus.

## Vérification

- Node.js 24.16.0 : 26 tests réussis, zéro échec.
- Démarrage réel vérifié dans le navigateur : écran d’accueil, bouton de démarrage et monde 3D visibles.
- Installation Android physique, mode hors ligne et URL publique encore à vérifier après publication.
- GitHub connecté au compte `nino-serra`. Aucune écriture GitHub effectuée avant l’autorisation sur la création du dépôt public et la publication.

## Confidentialité des parties

Les parties restent dans le localStorage du navigateur ; aucun backend ni synchronisation. Le code inclut export/import avec une copie de secours avant remplacement. Il faut exporter depuis l’ancienne adresse pour importer sur la nouvelle origine. Aucun changement de clé ou de format de sauvegarde n’a été effectué.
