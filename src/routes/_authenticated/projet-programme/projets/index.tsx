import { PageRouteLayout } from '@/shared'
import { AddProjet, ListeProjets, TypeProjetDialog } from '@/features/projets'
import { createFileRoute } from '@tanstack/react-router'
import { FolderOpen, GitBranch } from 'lucide-react'
import { useMe } from '@/features/auth'

export const Route = createFileRoute('/_authenticated/projet-programme/projets/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useMe()
  const niveauPerso = user?.niveau_perso
  const isLevel3 = niveauPerso === 3

  return (
    <PageRouteLayout
      title='Gestion des projets'
      icon={FolderOpen}
      listComponent={ListeProjets}
      // ✅ Bouton d'ajout : caché pour le niveau 3
      boutonAddTitle={isLevel3 ? undefined : 'Ajouter un projet'}
      addDialogComponent={isLevel3 ? undefined : AddProjet}
      // ✅ Boutons supplémentaires : cachés pour le niveau 3
      extraButtons={
        isLevel3
          ? []
          : [
              {
                title: 'Type de projet',
                icon: GitBranch,
                dialogComponent: TypeProjetDialog,
              },
            ]
      }
    />
  )
}