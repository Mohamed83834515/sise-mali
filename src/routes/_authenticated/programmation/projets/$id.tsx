import { createFileRoute } from '@tanstack/react-router'
import { ProjetDetail } from '@/features/projets'

export const Route = createFileRoute(
  '/_authenticated/programmation/projets/$id'
)({
  component: ProjetDetail,
})
