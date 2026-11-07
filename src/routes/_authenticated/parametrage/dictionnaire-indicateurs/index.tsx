import { createFileRoute } from '@tanstack/react-router'
import { PageRouteLayout } from '@/shared'
import { BookOpen } from 'lucide-react'
import {
  ListeDictionnaireIndicateurs,
  DictionnaireIndicateurDialog,
} from '@/features/parametrage'

export const Route = createFileRoute(
  '/_authenticated/parametrage/dictionnaire-indicateurs/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Dictionnaire des indicateurs'
      icon={BookOpen}
      boutonAddTitle='Ajouter un indicateur'
      addDialogComponent={DictionnaireIndicateurDialog}
      listComponent={ListeDictionnaireIndicateurs}
    />
  )
}
