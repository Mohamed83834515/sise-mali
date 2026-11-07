import { createFileRoute } from '@tanstack/react-router'
import { LineChart } from 'lucide-react'
import { PageRouteLayout } from '@/shared'
import { ListeIndicateursCmr } from '@/features/politique'

function SuiviIndicateursList() {
  return <ListeIndicateursCmr showAddButton={false} showSuiviAction />
}

export const Route = createFileRoute(
  '/_authenticated/suivi-resultats/suivi-indicateurs/'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Suivi des indicateurs'
      icon={LineChart}
      showAddButton={false}
      listComponent={SuiviIndicateursList}
    />
  )
}
