import { createFileRoute } from '@tanstack/react-router'
import { PageRouteLayout } from '@/shared'
import { Settings, Users } from 'lucide-react'
import {
  ListeUtilisateurs,
  UtilisateurDialog,
  GererTitresPersonnelDialog,
} from '@/features/parametrage'

export const Route = createFileRoute(
  '/_authenticated/parametrage/utilisateurs/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Utilisateurs'
      icon={Users}
      boutonAddTitle='Ajouter un utilisateur'
      addDialogComponent={UtilisateurDialog}
      listComponent={ListeUtilisateurs}
      extraButtons={[
        {
          title: 'Gérer les titres',
          icon: Settings,
          dialogComponent: GererTitresPersonnelDialog,
        },
      ]}
    />
  )
}
