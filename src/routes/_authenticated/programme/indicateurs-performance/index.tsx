import { createFileRoute } from '@tanstack/react-router'
import { LineChart } from 'lucide-react'
import { PageRouteLayout } from '@/shared'
import { ListeIndicateursStrategique } from '@/features/politique'

export const Route = createFileRoute(
  '/_authenticated/programme/indicateurs-performance/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Indicateurs stratégiques'
      icon={LineChart}
      showAddButton={false}
      listComponent={ListeIndicateursStrategique}
    />
  )
}
