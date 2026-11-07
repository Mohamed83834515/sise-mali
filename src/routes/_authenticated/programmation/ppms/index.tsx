import { PageRouteLayout } from '@/shared'
import {
  AddPpm,
  ListePpm,
  PpmHeaderActions,
  PpmVersionProvider,
} from '@/features/programmation'
import { createFileRoute } from '@tanstack/react-router'
import { FileStack } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/programmation/ppms/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PpmVersionProvider>
      <PageRouteLayout
        title='Plan de Passation des Marchés'
        icon={FileStack}
        boutonAddTitle='Ajouter un marché'
        addDialogComponent={AddPpm}
        listComponent={ListePpm}
        headerActions={<PpmHeaderActions />}
      />
    </PpmVersionProvider>
  )
}
