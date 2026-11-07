import { createFileRoute } from '@tanstack/react-router'
import { Target, Layers3 } from 'lucide-react'
import { PageRouteLayout } from '@/shared'
import {
  ListeCadreStrategique,
  NiveauCadreStrategiqueDialog,
} from '@/features/politique'

export const Route = createFileRoute('/_authenticated/programme/cadre-strategique/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Cadre stratégique'
      icon={Target}
      showAddButton={false}
      listComponent={ListeCadreStrategique}
      extraButtons={[
        {
          title: 'Gestion des niveaux',
          icon: Layers3,
          dialogComponent: NiveauCadreStrategiqueDialog,
        },
      ]}
    />
  )
}
