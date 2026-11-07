import { createFileRoute } from '@tanstack/react-router'
import { ProjetDetail } from '@/features/projets'

export const Route = createFileRoute(
  '/_authenticated/projet-programme/projets/$id/'
)({
  component: ProjetDetail,
})
