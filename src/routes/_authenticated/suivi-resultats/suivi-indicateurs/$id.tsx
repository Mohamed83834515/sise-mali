import { createFileRoute } from '@tanstack/react-router'
import { SuiviIndicateurCmrPage } from '@/features/suivi-resultats'

export const Route = createFileRoute(
  '/_authenticated/suivi-resultats/suivi-indicateurs/$id'
)({
  component: SuiviIndicateurCmrPage,
})
