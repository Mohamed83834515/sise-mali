import { createFileRoute } from '@tanstack/react-router'
import { TrendingUp } from 'lucide-react'
import { PageRouteLayout } from '@/shared'
import { ListeIndicateursCmr } from '@/features/politique'

export const Route = createFileRoute('/_authenticated/programme/indicateurs-cmr/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title='Indicateurs du CMR'
      icon={TrendingUp}
      showAddButton={false}
      listComponent={ListeIndicateursCmr}
    />
  )
}
