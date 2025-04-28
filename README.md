# Zone01 Profile Dashboard

Ce projet est un tableau de bord Next.js/React pour visualiser les statistiques, l’activité et les audits d’un étudiant Zone01 via l’API GraphQL officielle.

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone <repo-url>
   cd graphql
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Configurer les variables d’environnement**

   - Créez un fichier `.env.local` à la racine si besoin (exemple : pour surcharger l’URL GraphQL ou d’autres secrets).
   - Par défaut, l’URL de l’API Zone01 est codée dans le code source.

4. **Lancer le projet**
   ```bash
   npm run dev
   ```

## Utilisation

- Rendez-vous sur `/login` pour vous connecter avec votre email ou votre pseudo Zone01 (ex : "clecart") et votre mot de passe.
- Après connexion, accédez à votre profil, vos XP, vos audits, vos projets et vos statistiques de collaboration.

## Bonnes pratiques appliquées

- **Pas de code en dur** : Les identifiants utilisateurs ne sont pas codés en dur, tout est dynamique.
- **Séparation des responsabilités** : Les requêtes GraphQL, la logique Apollo, et les composants UI sont bien séparés.
- **Commentaires** : Les fichiers critiques sont commentés pour faciliter la maintenance.
- **Validation** : Le formulaire de login accepte un email ou un pseudo autorisé.
- **Variables d’environnement** : Prise en charge possible via `.env.local`.
- **Aucune dépendance obsolète** : Les dépendances sont à jour (voir package.json).
- **Aucun doublon de code** : Les composants sont factorisés et réutilisables.

## Structure du projet

- `src/app/` : Pages Next.js (login, profil, etc.)
- `src/components/` : Composants UI et graphiques
- `src/lib/` : Utilitaires et requêtes GraphQL
- `.vscode/settings.json` : Ignore les warnings sur les at-rules CSS personnalisées

## Contribution

- Forkez le repo, créez une branche, proposez vos améliorations via pull request.

## Licence

MIT
