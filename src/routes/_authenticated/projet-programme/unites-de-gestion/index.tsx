import { PageRouteLayout } from '@/shared'
import { AddUgl, ListeUgl } from '@/features/parametrage'
import { createFileRoute } from '@tanstack/react-router'
import { LayoutGrid } from 'lucide-react'

export const Route = createFileRoute(
  '/_authenticated/projet-programme/unites-de-gestion/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Unités de gestion'
      icon={LayoutGrid}
      boutonAddTitle='Ajouter une unité de gestion'
      addDialogComponent={AddUgl}
      listComponent={ListeUgl}
    />
  )
}

