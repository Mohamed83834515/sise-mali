import type {
  AvancementTachesPlanSiteChartRow,
  TacheActiviteByPlanSiteGroup,
} from '@/shared/types/entities/dashboardType'
import { computeDashboardRate } from '@/shared/utils/dashboardPaoStatsUtils'

export function buildAvancementTachesPlanSiteChartData(
  groups: TacheActiviteByPlanSiteGroup[]
): AvancementTachesPlanSiteChartRow[] {
  return groups.map((group) => {
    const nbTaches = Number(group.nb_taches) || 0
    const nbTachesValidees = Number(group.nb_taches_validees) || 0

    return {
      service: group.service.intutile_ds?.trim() || 'Non défini',
      nbTaches,
      nbTachesValidees,
      pourcentageValide: computeDashboardRate(nbTachesValidees, nbTaches),
    }
  })
}
