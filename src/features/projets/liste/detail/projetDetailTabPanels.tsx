import type { ReactNode } from 'react'
import type { ProjetDetailTab, ProjetDetailTabKey } from './projetDetailTabs'
import ProjetDashboard from './ProjetDashboard'
import ProjetPhasesPanel from './phases/ProjetPhasesPanel'
import ProjetActivitesPanel from './activities/ProjetActivitesPanel'
import ProjetFinancementPanel from './financement/ProjetFinancementPanel'
import ProjetInfrastructurePanel from './infrastructures/ProjetInfrastructurePanel'
import ProjetPtbaPanel from './ptba/ProjetPtbaPanel'
import ProjetSuiviPtbaPanel from './suivi-ptba/ProjetSuiviPtbaPanel'
import ProjetConventionPanel from './conventions/ProjetConventionPanel'
import ProjetCadreResultatsPanel from './resultsFramework/ProjetCadreResultatsPanel'
import ProjetIndicateursCmrPanel from './cmrIndicators/ProjetIndicateursCmrPanel'
// ✅ Correction : importer le bon fichier
import ProjetDocumentsPanel from './documents/ProjetDocumentsPanel'
import ProjetPointsBlocagePanel from './points-blocage/ProjetPointsBlocagePanel'
import ProjetDetailPlaceholder from './ProjetDetailPlaceholder'

type TabPanelRenderer = (projet: Projet) => ReactNode

const TAB_PANEL_RENDERERS: Record<ProjetDetailTabKey, TabPanelRenderer> = {
  dashboard: (projet) => <ProjetDashboard projet={projet} />,
  phases: (projet) => <ProjetPhasesPanel projet={projet} />,
  financement: (projet) => <ProjetFinancementPanel projet={projet} />,
  infrastructures: (projet) => <ProjetInfrastructurePanel projet={projet} />,
  activities: (projet) => <ProjetActivitesPanel projet={projet} />,
  ptba: (projet) => <ProjetPtbaPanel projet={projet} />,
  suivi_ptba: (projet) => <ProjetSuiviPtbaPanel projet={projet} />,
  conventions: (projet) => <ProjetConventionPanel projet={projet} />,
  results_framework: (projet) => <ProjetCadreResultatsPanel projet={projet} />,
  cmr_indicators: (projet) => <ProjetIndicateursCmrPanel projet={projet} />,
  documents: (projet) => <ProjetDocumentsPanel projet={projet} />,
  points_blocage: (projet) => <ProjetPointsBlocagePanel projet={projet} />,
}

export function renderProjetDetailTabPanel(
  tab: ProjetDetailTab,
  projet: Projet
): ReactNode {
  const render = TAB_PANEL_RENDERERS[tab.key]
  if (render) return render(projet)
  return <ProjetDetailPlaceholder tab={tab} />
}