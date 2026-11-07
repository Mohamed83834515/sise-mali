import { RapportEtatActivitesPage } from '@/features/rapport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/rapport/etat-des-activites/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <RapportEtatActivitesPage />
}
