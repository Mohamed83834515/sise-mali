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
      title='Liste des plans stratégiques'
      icon={FileStack}
      boutonAddTitle='Ajouter un plan stratégique'
      addDialogComponent={ProgrammeDialog}
      listComponent={ListeProgrammes}
    />
  )
}
