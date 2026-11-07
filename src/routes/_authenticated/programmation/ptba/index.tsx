import { PageRouteLayout } from '@/shared'
import {
  AddPtba,
  ListePtba as ListePtbas,
  TypeActiviteDialog,
  VersionPtbaDialog,
} from '@/features/programmation'
import { createFileRoute } from '@tanstack/react-router'
import { ClipboardList, GitBranch, Layers3 } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/programmation/ptba/')({
  component: RouteComponent,
})
function RouteComponent() {
  return (
    <PageRouteLayout
      title="Listes activités du Plan d'Action Operationnel"
      boutonAddTitle="Ajouter PAO"
      icon={ClipboardList}
      addDialogComponent={AddPtba}
      listComponent={ListePtbas}
      extraButtons={[
        {
          title: "Versions",
          icon: GitBranch,
          dialogComponent: VersionPtbaDialog,
        },
        {
          title: "Types activité",
          icon: Layers3,
          dialogComponent: TypeActiviteDialog,
        },
      ]}
    />
  )
}
