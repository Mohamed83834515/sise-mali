import { CartographieView } from '@/features/suivi-resultats'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/suivi-resultats/cartographie/',
)({
  component: CartographieView,
})
