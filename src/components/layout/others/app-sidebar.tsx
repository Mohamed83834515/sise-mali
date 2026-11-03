
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

import { useLayout } from '@/stores/others/layout-store'
import { CHART_COLORS, useColor } from '@/stores/others/color-store'
import { useMe } from '@/simadou/allHooks/auth/authHooks'
import logoMali from '@/assets/images/logo-mali.png'
import { useGeneralParamsQuery } from '@/simadou/allHooks/generalParams/queries'
import { useFilteredSidebar } from '@/simadou/allHooks/admin/use-filtered-sidebar'
export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { color } = useColor()
  const { stroke } = CHART_COLORS[color]
  const { data: user } = useMe()
  const { data: config } = useGeneralParamsQuery()
  const sidebarData = useFilteredSidebar()
  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      style={{
        '--sidebar-primary': stroke,
        '--sidebar-accent': `${stroke}1A`,
        '--sidebar-accent-foreground': stroke,
        '--sidebar-ring': stroke,
      } as React.CSSProperties}
    >
      <SidebarHeader>
        <div className='flex items-start gap-3'>
          <div className='flex aspect-square size-9 items-center justify-center rounded-lg bg-white/10 p-0.5 shadow-xs'>
            <img
              src={config?.structureLogo || logoMali}
              alt={config?.structureSigle || 'CPS/SEEUDE'}
              className='size-8 object-contain rounded-full'
            />
          </div>
          <div className='grid flex-1 text-start text-sm leading-tight'>
            <span className='truncate font-semibold'>
              {config?.systemTitle || "SISE CPS/SEEUDE"}
            </span>
            <span className='truncate text-xs text-muted-foreground'>
              {config?.structureSigle || "MEADD — PRTD-Mali"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser user={{ nom_perso: user.nom_perso ?? "Utilisateur", email: user.email ?? "contact@sise-mali.org", id_personnel_perso: user.id_personnel_perso ?? "4", statut: user.statut ?? 1, personnel_profile_picture: user.personnel_profile_picture, prenom_perso: user.prenom_perso }} />
        )}

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}