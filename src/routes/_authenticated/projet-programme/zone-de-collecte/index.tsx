import { PageRouteLayout } from '@/shared'
import { AddZoneCollecte, ListeZoneCollecte } from '@/features/projets'
import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

export const Route = createFileRoute(
    '/_authenticated/projet-programme/zone-de-collecte/',
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <PageRouteLayout
            title='Zones de collecte'
            boutonAddTitle='Ajouter une zone'
            icon={MapPin}
            addDialogComponent={AddZoneCollecte}
            listComponent={ListeZoneCollecte}
        />
    )
}
