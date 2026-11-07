 
import { createFileRoute } from '@tanstack/react-router'
import { ListeLocalite } from '@/features/parametrage'

export const Route = createFileRoute('/_authenticated/parametrage/localites/')({
  component: ListeLocalite,
})
