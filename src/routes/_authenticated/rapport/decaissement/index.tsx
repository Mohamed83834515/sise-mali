import { RapportDecaissementPage } from '@/features/rapport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/rapport/decaissement/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RapportDecaissementPage />
}
