# AUDIT TECHNIQUE ET ÉTAT DU PROJET NEXORA

Dernière mise à jour : 31 août 2026

Ce document constitue un état de référence du projet. Il peut être transmis directement à ChatGPT ou à un autre développeur afin de poursuivre le travail sans refaire l'audit depuis zéro.

## 1. Contexte technique

NEXORA est un back-office logistique mobile-first construit avec :

- Next.js 16.3.3 avec App Router ;
- React 19 ;
- TypeScript strict ;
- Tailwind CSS 4 ;
- Prisma ORM 7.10 ;
- PostgreSQL hébergé sur Supabase ;
- `@prisma/adapter-pg` et `pg` ;
- Zod 4 ;
- Vitest 4 ;
- pnpm 11.

Le Prisma Client est généré dans `app/generated/prisma` et la connexion est centralisée dans `lib/prisma.ts`.

## 2. Domaine métier

Le projet contient quatre entités principales :

1. `Client`
2. `Driver`
3. `Vehicle`
4. `Delivery`

Relations Prisma :

- `Client.deliveries` vers `Delivery[]` ;
- `Driver.deliveries` vers `Delivery[]` ;
- `Vehicle.deliveries` vers `Delivery[]` ;
- `Delivery.client` vers `Client` ;
- `Delivery.driver` vers `Driver` ;
- `Delivery.vehicle` vers `Vehicle`.

Les clés étrangères utilisent `ON DELETE RESTRICT` et `ON UPDATE CASCADE`. Il est donc impossible de supprimer directement un client, un chauffeur ou un véhicule encore référencé par une livraison.

## 3. État de la connexion Supabase

L'ancien problème Prisma `P1000` correspondait à un refus d'authentification PostgreSQL.

Après mise à jour des identifiants, un test réseau en lecture seule a été exécuté :

```sql
SELECT 1;
```

Résultat : connexion réussie avec `DATABASE_URL`.

La configuration actuelle distingue :

- `DATABASE_URL` pour l'application via le pooler Supabase ;
- `DIRECT_URL` pour la CLI et les migrations Prisma.

Le fichier `.env` n'a pas été modifié pendant l'audit et reste ignoré par Git.

## 4. Audit de la structure

Les éléments suivants ont été inspectés :

- `package.json` et `pnpm-lock.yaml` ;
- `prisma/schema.prisma` ;
- `prisma7.config.ts` ;
- `lib/prisma.ts` ;
- les quatre modèles Prisma et leurs enums ;
- toutes les migrations existantes ;
- le dashboard `app/page.tsx` ;
- les CRUD Client, Driver et Vehicle ;
- les routes et actions Delivery ;
- les scripts présents dans `scripts/` ;
- les pages dynamiques `[id]` ;
- la présentation responsive mobile et desktop.

Le fichier `prisma7.config.ts`, malgré son nom non standard, est correctement détecté automatiquement par Prisma 7 dans ce projet.

Le schéma Prisma est valide et les migrations sont cohérentes avec les modèles actuels. Aucune migration existante n'a été modifiée.

## 5. Routes vérifiées

Next.js détecte et compile les routes suivantes :

```text
/
/clients
/clients/new
/clients/[id]
/clients/[id]/edit
/clients/[id]/delete
/drivers
/drivers/new
/drivers/[id]
/drivers/[id]/edit
/drivers/[id]/delete
/vehicles
/vehicles/new
/vehicles/[id]
/vehicles/[id]/edit
/vehicles/[id]/delete
/deliveries
/deliveries/new
/deliveries/[id]
/deliveries/[id]/delete
```

Les paramètres Next.js 16 sont bien traités comme des promesses avec `await params`.

## 6. Problèmes identifiés pendant l'audit

### 6.1 Identifiants dynamiques invalides

Les pages dynamiques utilisaient directement `Number(id)` avant leurs requêtes Prisma.

Des URL comme celles-ci pouvaient donc transmettre une valeur invalide à Prisma :

```text
/clients/abc
/drivers/0
/vehicles/1.5
/deliveries/-1
```

### 6.2 Validations Zod non réutilisables

Les schémas étaient déclarés directement et de manière privée dans les fichiers `actions.ts`. Ils ne pouvaient pas être importés proprement par des tests unitaires.

### 6.3 Logique Delivery difficile à tester

La logique métier Delivery était mélangée aux Server Actions Next.js, aux appels de revalidation et aux redirections. Tester ces actions aurait nécessité de charger Next.js et l'instance Prisma réelle.

### 6.4 Absence de tests automatisés

Le projet ne possédait ni Vitest, ni configuration de tests, ni scripts `test`.

### 6.5 Compteur de livraisons actives

Le dashboard comptait `ASSIGNED`, `IN_TRANSIT` et `DELAYED`, mais excluait `PENDING` des livraisons actives.

## 7. Corrections réalisées

### 7.1 Validation des identifiants de routes

Le fichier `lib/route-id.ts` a été ajouté.

Il accepte uniquement une chaîne représentant un entier strictement positif et sûr pour JavaScript. Toutes les pages `[id]` valident maintenant leur paramètre avant d'appeler Prisma. Une valeur invalide déclenche `notFound()` et produit une réponse 404.

### 7.2 Centralisation des schémas Zod

Le fichier `lib/validations.ts` contient désormais :

- `clientSchema` ;
- `driverStatusSchema` ;
- `driverSchema` ;
- `vehicleStatusSchema` ;
- `vehicleSchema` ;
- `deliverySchema` ;
- `deliveryStatusSchema` ;
- les types TypeScript dérivés nécessaires.

Les Server Actions Client, Driver, Vehicle et Delivery importent ces schémas.

### 7.3 Isolation de la logique métier Delivery

Le fichier `lib/delivery-service.ts` a été ajouté avec trois opérations métier :

- `createDeliveryWithAssignments` ;
- `updateDeliveryStatusWithResources` ;
- `deleteDeliveryWithResources`.

Ces fonctions reçoivent un client compatible Prisma en dépendance. En production, elles reçoivent l'instance centralisée de `lib/prisma.ts`. En test, elles reçoivent un faux client en mémoire.

### 7.4 Transactions Delivery

Les opérations métier utilisent maintenant des transactions interactives.

Lors de la création :

1. le chauffeur est mis à jour uniquement s'il est encore `AVAILABLE` ;
2. le véhicule est mis à jour uniquement s'il est encore `AVAILABLE` ;
3. la livraison est créée avec le statut `ASSIGNED` ;
4. toute erreur provoque l'annulation de la transaction.

Lors du passage à `DELIVERED` :

1. la livraison passe à `DELIVERED` ;
2. `deliveredAt` reçoit la date courante ;
3. le chauffeur repasse à `AVAILABLE` ;
4. le véhicule repasse à `AVAILABLE`.

Lors du passage à `CANCELLED` :

1. la livraison passe à `CANCELLED` ;
2. `deliveredAt` est remis à `null` ;
3. le chauffeur et le véhicule repassent à `AVAILABLE`.

Lors de la suppression d'une livraison active :

1. la livraison est supprimée ;
2. le chauffeur repasse à `AVAILABLE` ;
3. le véhicule repasse à `AVAILABLE`.

Les statuts considérés actifs sont `PENDING`, `ASSIGNED`, `IN_TRANSIT` et `DELAYED`.

### 7.5 Dashboard

Le statut `PENDING` a été ajouté au compteur des livraisons actives.

Les statistiques proviennent toutes de PostgreSQL avec Prisma :

- nombre de clients ;
- nombre total de livraisons ;
- livraisons actives ;
- livraisons en retard ;
- livraisons terminées ;
- chauffeurs disponibles ;
- chauffeurs en livraison ;
- véhicules disponibles ;
- véhicules en livraison ;
- véhicules en maintenance ;
- cinq dernières livraisons avec leurs relations.

Aucun compteur métier n'est écrit en dur.

## 8. Infrastructure de tests

Vitest 4 a été ajouté comme dépendance de développement.

Scripts disponibles dans `package.json` :

```json
{
  "test": "vitest",
  "test:run": "vitest run"
}
```

Configuration : `vitest.config.mts`.

L'environnement de test est volontairement `node`, car les suites actuelles testent des fonctions métier et des schémas, pas des composants React.

## 9. Tests créés

### 9.1 `tests/validations.test.ts`

Couverture Client :

- nom valide ;
- email valide ;
- email invalide rejeté.

Couverture Driver :

- prénom et nom ;
- email ;
- numéro de permis ;
- statuts autorisés uniquement.

Couverture Vehicle :

- année valide ;
- année hors limites rejetée ;
- kilométrage positif ou nul ;
- kilométrage négatif rejeté ;
- statuts autorisés uniquement.

Couverture Delivery :

- `clientId` positif ;
- `driverId` positif ;
- `vehicleId` positif ;
- date valide ;
- date invalide rejetée ;
- origine obligatoire ;
- destination obligatoire.

### 9.2 `tests/delivery-service.test.ts`

Scénarios couverts :

- scénario A : création et passage du chauffeur et du véhicule à `ON_DELIVERY` ;
- scénario B : livraison terminée, `deliveredAt` renseigné et ressources libérées ;
- scénario C : livraison annulée et ressources libérées ;
- scénario D : suppression d'une livraison active et ressources libérées ;
- scénario E : création refusée si le chauffeur n'est plus disponible ;
- scénario F : création refusée si le véhicule n'est plus disponible.

### 9.3 `tests/route-id.test.ts`

Les valeurs suivantes sont notamment rejetées avant Prisma :

- texte non numérique ;
- zéro ;
- nombre négatif ;
- nombre décimal ;
- valeur contenant des espaces ;
- entier supérieur à `Number.MAX_SAFE_INTEGER`.

## 10. Isolation de Supabase pendant les tests

Les tests automatisés :

- n'importent pas `lib/prisma.ts` ;
- ne chargent pas `.env` ;
- n'instancient pas `PrismaPg` ;
- n'ouvrent aucune connexion PostgreSQL ;
- ne peuvent donc ni lire ni modifier la base Supabase.

La logique Delivery est testée avec un faux client transactionnel Vitest entièrement en mémoire.

## 11. Vérification responsive

Aucun redesign n'a été réalisé.

Constats :

- les listes utilisent des cartes sur mobile ;
- les tableaux sont masqués sur mobile et affichés à partir du breakpoint `md` ;
- les boutons principaux prennent toute la largeur sur petit écran ;
- les formulaires reviennent à une colonne sur mobile ;
- les emails et textes longs utilisent des règles comme `break-all`, `break-words` ou `truncate` ;
- aucun débordement horizontal évident n'a été identifié ;
- aucune navigation fixe ne masque le contenu.

## 12. Résultats finaux

### Prisma

```text
Prisma schema loaded from prisma/schema.prisma.
The schema at prisma/schema.prisma is valid.
```

### Lint

Commande :

```bash
pnpm lint
```

Résultat : succès, aucune erreur ESLint.

### Tests

Commande :

```bash
pnpm test:run
```

Résultat :

```text
Test Files  3 passed (3)
Tests       30 passed (30)
```

### Build

Commande :

```bash
pnpm build
```

Résultat :

- compilation Turbopack réussie ;
- contrôle TypeScript réussi ;
- collecte des pages réussie ;
- toutes les routes demandées détectées ;
- build de production réussi.

Le premier essai de build dans l'environnement isolé avait échoué uniquement parce que `next/font` ne pouvait pas joindre Google Fonts. Le build final avec accès réseau a réussi.

### Connexion PostgreSQL

```text
DATABASE_URL: OK, SELECT 1
```

## 13. Fichiers ajoutés

```text
AUDIT_NEXORA.md
lib/delivery-service.ts
lib/route-id.ts
lib/validations.ts
tests/delivery-service.test.ts
tests/route-id.test.ts
tests/validations.test.ts
vitest.config.mts
```

## 14. Fichiers modifiés par l'audit

```text
app/clients/actions.ts
app/clients/[id]/page.tsx
app/clients/[id]/edit/page.tsx
app/clients/[id]/delete/page.tsx
app/drivers/actions.ts
app/drivers/[id]/page.tsx
app/drivers/[id]/edit/page.tsx
app/drivers/[id]/delete/page.tsx
app/vehicles/actions.ts
app/vehicles/[id]/page.tsx
app/vehicles/[id]/edit/page.tsx
app/vehicles/[id]/delete/page.tsx
app/deliveries/actions.ts
app/deliveries/[id]/page.tsx
app/deliveries/[id]/delete/page.tsx
app/page.tsx
package.json
pnpm-lock.yaml
```

Des modifications locales existaient déjà dans le dashboard et les écrans Delivery avant l'audit. Elles ont été conservées et n'ont pas été écrasées.

## 15. Points restant à décider ou améliorer

### 15.1 Suppression d'entités liées

La base empêche correctement la suppression d'un client, chauffeur ou véhicule encore lié à une livraison. L'interface ne transforme cependant pas encore cette erreur PostgreSQL/Prisma en message utilisateur explicite.

Il faudra choisir entre :

- conserver `RESTRICT` et afficher un message métier ;
- interdire visuellement l'action lorsqu'il existe des livraisons ;
- mettre en place une politique d'archivage ;
- utiliser une autre stratégie de suppression uniquement si le besoin métier le justifie.

Il ne faut pas ajouter de cascade de suppression sans décision métier explicite.

### 15.2 Réouverture d'une livraison finale

L'interface permet encore de repasser une livraison `DELIVERED` ou `CANCELLED` vers un statut actif. Le comportement attendu doit être décidé :

- interdire définitivement la réouverture ;
- autoriser la réouverture uniquement si le chauffeur et le véhicule sont disponibles ;
- proposer une action métier séparée de réactivation.

### 15.3 Métadonnées Next.js

`app/layout.tsx` utilise encore le titre et la description génériques de Create Next App. Ils pourront être remplacés par des métadonnées NEXORA.

## 16. Consignes pour la prochaine intervention ChatGPT

Avant toute nouvelle modification :

1. lire ce document ;
2. lire `AGENTS.md` et les guides Next.js 16 installés dans `node_modules/next/dist/docs/` ;
3. inspecter `git status` afin de préserver les modifications locales ;
4. ne jamais modifier `.env` ou les identifiants Supabase ;
5. ne jamais lancer de commande destructive sur PostgreSQL ;
6. conserver les tests isolés de Supabase ;
7. ne pas modifier les migrations déjà appliquées sans problème réel démontré ;
8. exécuter après chaque changement significatif :

```bash
pnpm lint
pnpm test:run
pnpm build
```

L'état de référence actuel est : lint vert, 30 tests verts, build vert et connexion PostgreSQL opérationnelle.
