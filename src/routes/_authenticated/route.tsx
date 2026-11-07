import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/features/auth'
import { AuthenticatedLayout } from '@/components/layout/others/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: requireAuth,
  component: AuthenticatedLayout,
})
