# SISE-MALI

Système d'Information de Suivi-Évaluation (SISE) du Mali.

Application Web moderne développée en React, TypeScript, TanStack Router, TanStack Query et Tailwind CSS.

---

## 🛠️ Stack Technique

- **Package Manager** : [pnpm](https://pnpm.io/) (`>= 10.x`) — *npm et yarn sont strictement bloqués via `only-allow pnpm`*.
- **Framework & Bundler** : React 18, Vite.
- **Routage** : [TanStack Router](https://tanstack.com/router) (file-based routing typé).
- **Gestion d'état serveur** : [TanStack Query](https://tanstack.com/query) v5.
- **Gestion d'état client** : Zustand.
- **Composants UI & Styling** : Tailwind CSS, Shadcn UI, Radix UI, Lucide Icons.
- **Formulaires & Validation** : React Hook Form, Zod, Formulaires Dynamiques (`@/shared/forms`).
- **Tableaux de données** : TanStack Table (`@/shared/tables`).

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js `>= 18`
- `pnpm` (`npm install -g pnpm` si non présent)

### Commandes usuelles

```bash
# Installation des dépendances
pnpm install

# Démarrage du serveur de développement (port 5173)
pnpm dev

# Vérification TypeScript (0 erreur)
pnpm exec tsc -b

# Build de production
pnpm run build

# Prévisualisation du build de production
pnpm run preview
```

> ⚠️ **Variables d'environnement (`.env`)** :
> Assurez-vous d'avoir le protocole HTTP dans l'URL de base :
> `VITE_API_BASE_URL=http://localhost:8000/api/` (ou `https://api.sise-mali.net/api/`)

---

## 🏛️ Architecture du Projet : Feature-Driven

Le projet suit la méthodologie **Feature-Driven Architecture** (inspirée de *Bulletproof React*) où le code métier est organisé par grands domaines d'affaires, avec un socle transverse unifié (`@/shared/`).

```
src/
├── features/               # 📦 Modules métiers isolés
│   ├── auth/               # Authentification, sessions, permissions, profils
│   ├── dashboard/          # Tableaux de bord PAO, graphiques, KPIs
│   ├── parametrage/        # Référentiels (acteurs, localités, plan site, UGL, etc.)
│   ├── politique/          # Politiques sectorielles, CDMT, cadres stratégiques, indicateurs
│   ├── programmation/      # PTBA, contrats de performance, marchés PPM
│   ├── projets/            # Gestion des projets, conventions, financements, suivi
│   ├── suivi-resultats/    # Suivi physique/financier PTBA, PPM, étapes, indicateurs
│   ├── rapport/            # Rapports d'activités, décaissements, exports Excel/Word/PDF
│   ├── settings/           # Paramètres utilisateur, sécurité, préférences
│   ├── users/              # Administration des utilisateurs et rôles
│   └── apps/               # Applications & intégrations
│
├── shared/                 # 🧱 Socle transverse unifié
│   ├── api/                # Client Axios instance, gestionnaires d'erreurs, services, hooks
│   ├── forms/              # DynamicForm, FormField, validateurs, configs, resetFields
│   ├── tables/             # GenericTable, column-builder, GenericRowActions, colonnes
│   ├── types/              # Types TypeScript & entités d'affaires (`@/shared/types`)
│   ├── schemas/            # Schémas de validation Zod (`@/shared/schemas`)
│   ├── utils/              # Fonctions de calcul, formatage, relations d'API
│   ├── routes/             # PageRouteLayout pour TanStack Router
│   ├── detail/             # Composants de visualisation de détails
│   ├── errors/             # Pages d'états d'erreurs, 404, offline
│   └── components/         # Composants partagés (ex: SessionProvider)
│
├── routes/                 # 🧭 Arborescence de routes TanStack Router (fichiers légers)
│   ├── __root.tsx
│   ├── (auth)/             # Routes publiques (connexion, mot de passe oublié)
│   └── _authenticated/     # Routes protégées par l'AuthGuard
│
├── components/             # 🎨 Composants UI réutilisables (shadcn/ui, layout app-sidebar)
└── stores/                 # 🗄️ Stores globaux légers Zustand (auth, thème, programme actif)
```

---

## 💡 Guide : Comment créer une nouvelle fonctionnalité

Prenons l'exemple de l'ajout d'une fonctionnalité **`partenaires-techniques`** dans le domaine **`parametrage`** :

### Étape 1 : Créer la Feature dans `src/features/`

Créez le sous-dossier `src/features/parametrage/partenaires-techniques/` :

```
src/features/parametrage/partenaires-techniques/
├── components/             # Composants d'interface (dialog, formulaires, liste)
│   ├── AddPartenaireTechnique.tsx
│   └── ListePartenairesTechniques.tsx
├── api/                    # Hooks React Query et services spécifiques
│   └── partenaireTechniqueHooks.ts
├── config/                 # Colonnes de tableau et config de formulaire
│   └── partenaireTechniqueColumns.tsx
└── index.ts                # Point d'entrée public de la feature
```

### Étape 2 : Créer le composant de Liste et d'Ajout

```tsx
// src/features/parametrage/partenaires-techniques/components/ListePartenairesTechniques.tsx
import { GenericTable } from '@/shared/tables'
import { PageRouteLayout } from '@/shared/routes'
import { Handshake } from 'lucide-react'
import { useGetPartenairesTechniques } from '../api/partenaireTechniqueHooks'
import { buildPartenaireTechniqueColumns } from '../config/partenaireTechniqueColumns'

export function ListePartenairesTechniques() {
  const { data = [], isLoading } = useGetPartenairesTechniques()
  const columns = buildPartenaireTechniqueColumns()

  return (
    <GenericTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      searchPlaceholder="Rechercher un partenaire..."
    />
  )
}
```

### Étape 3 : Exporter la feature via `index.ts`

```ts
// src/features/parametrage/partenaires-techniques/index.ts
export { ListePartenairesTechniques } from './components/ListePartenairesTechniques'
```

### Étape 4 : Déclarer la Route TanStack Router

Dans `src/routes/_authenticated/parametrage/partenaires-techniques/index.tsx` :

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { PageRouteLayout } from '@/shared/routes'
import { ListePartenairesTechniques } from '@/features/parametrage'
import { Handshake } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/parametrage/partenaires-techniques/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title="Partenaires Techniques"
      description="Gestion des partenaires techniques d'exécution"
      icon={Handshake}
    >
      <ListePartenairesTechniques />
    </PageRouteLayout>
  )
}
```

Le code de routage reste ainsi ultra-léger et découplé, toute la logique métier résidant au sein de sa feature dédiée.
