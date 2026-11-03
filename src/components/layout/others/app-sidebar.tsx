
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
import { MaliFlag } from '@/components/others/mali-flag'
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
        <div className='flex items-start gap-4'>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-sidebar-primary-foreground p-1'>
            {config?.structureLogo ? (
              <img src={config.structureLogo} alt={config?.structureSigle || 'Mali'} className='size-6 object-contain rounded' />
            ) : (
              <MaliFlag width={22} height={15} className='rounded-xs shadow-xs' />
            )}
          </div>
          <div className='grid flex-1 text-start text-sm leading-tight'>
            <span className='truncate font-semibold'>
              {config?.systemTitle || "SISE-MALI"}
            </span>
            <span className='truncate text-xs'>{config?.structureSigle || "Agriculture"}</span>
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
          <NavUser user={{ nom_perso: user.nom_perso ?? "Utilisateur", email: user.email ?? "contact@sise-mali.ml", id_personnel_perso: user.id_personnel_perso ?? "4", statut: user.statut ?? 1, personnel_profile_picture: user.personnel_profile_picture, prenom_perso: user.prenom_perso }} />
        )}

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}