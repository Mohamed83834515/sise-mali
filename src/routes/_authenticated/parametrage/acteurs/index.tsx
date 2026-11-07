import { PageRouteLayout } from '@/shared'
import { AddActeur, CategorieActeurDialog, ListeActeur } from '@/features/parametrage'
import { createFileRoute } from '@tanstack/react-router'
import { GitBranch, User } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/parametrage/acteurs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Acteurs'
      icon={User}
      boutonAddTitle='Ajouter un acteur'
      addDialogComponent={AddActeur}
      listComponent={ListeActeur}
       extraButtons={[
        {
          title: "Categories Acteurs",
          icon: GitBranch,
          dialogComponent: CategorieActeurDialog,
        },
      ]}
    />
  )
}