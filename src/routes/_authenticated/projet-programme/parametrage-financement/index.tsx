import { createFileRoute } from '@tanstack/react-router'
import { ParametrageFinancementLayout } from '@/features/projets'

export const Route = createFileRoute(
  '/_authenticated/projet-programme/parametrage-financement/'
)({
  component: ParametrageFinancementLayout,
})
