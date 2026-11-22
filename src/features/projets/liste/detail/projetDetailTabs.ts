import {
  Building2,
  ClipboardList,
  Coins,
  FileText,
  Layout,
  LayoutDashboard,
  OctagonAlert,
  type LucideIcon,
} from 'lucide-react'

export type ProjetDetailTabKey =
  | 'dashboard'
  | 'activities'
  | 'financement'
  | 'infrastructures'
  | 'ptba'
  | 'suivi_ptba'
  | 'conventions'
  | 'results_framework'
  | 'cmr_indicators'
  | 'documents'
  | 'points_blocage'

export type ProjetDetailTab = {
  key: ProjetDetailTabKey
  name: string
  icon: LucideIcon
  description: string
}

export const projetDetailTabs: ProjetDetailTab[] = [
  {
    key: 'dashboard',
    name: "Vue d'ensemble",
    icon: LayoutDashboard,
    description: 'Synthèse du projet (indicateurs et avancement).',
  },
  {
    key: 'financement',
    name: 'Financement',
    icon: Coins,
    description: 'Financements du projet (prêt, don, contrepartie).',
  },
  {
    key: 'infrastructures',
    name: 'Infrastructures',
    icon: Building2,
    description: 'Infrastructures et travaux du projet.',
  },
  {
    key: 'results_framework',
    name: 'Cadre de résultats',
    icon: Layout,
    description: 'Structure du cadre de résultats et indicateurs associés.',
  },
  {
    key: 'cmr_indicators',
    name: 'Indicateurs CMR',
    icon: ClipboardList,
    description: 'Indicateurs du cadre de mesure des résultats.',
  },
  {
    key: 'documents',
    name: 'Documents',
    icon: FileText,
    description: 'Dossiers et documents rattachés au projet.',
  },
  {
    key: 'points_blocage',
    name: 'Points de blocage',
    icon: OctagonAlert,
    description: 'Recommandations et missions de supervision du projet.',
  },
]
