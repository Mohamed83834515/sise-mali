import { PageRouteLayout } from '@/shared'
import AddUser from '@/features/users/AddUser'
import ListeUsers from '@/features/users/ListeUsers'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageRouteLayout
      title="Listes utilisateurs"
      icon={Users}
      addDialogComponent={AddUser}
      listComponent={ListeUsers}
    />
  )
}