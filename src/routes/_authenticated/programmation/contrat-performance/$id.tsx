import { ContratDetailPage } from '@/features/programmation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/programmation/contrat-performance/$id')({
  component: ContratDetailPage,
})
