import { createFileRoute } from '@tanstack/react-router'
import { FileStack } from 'lucide-react'
import { PageRouteLayout } from '@/shared'
import { ListeProgrammes, ProgrammeDialog } from '@/features/politique'

export const Route = createFileRoute('/_authenticated/programme/liste/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Liste des politiques'
      icon={FileStack}
      boutonAddTitle='Ajouter une politique'
      addDialogComponent={ProgrammeDialog}
      listComponent={ListeProgrammes}
    />
  )
}
