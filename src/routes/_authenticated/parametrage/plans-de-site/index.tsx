import { ListePlanSite } from '@/features/parametrage'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute(
  '/_authenticated/parametrage/plans-de-site/',
)({
  component: ListePlanSite,
})
