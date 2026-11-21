import { createFileRoute } from '@tanstack/react-router'
import { ListeSecteur } from '@/features/parametrage'

export const Route = createFileRoute('/_authenticated/parametrage/secteurs/')({
  component: ListeSecteur,
})
