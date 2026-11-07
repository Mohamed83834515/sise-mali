import {
  useGetCadresLogiquesClcp,
  useGetNiveauxConfigClcp,
} from '@/shared/api/hooks/admin/cadreLogiqueClcpHooks'
import { useGetIndicateursContrat } from '@/shared/api/hooks/admin/indicateurContratHooks'
import type { ContratPerformance } from '@/shared/types/entities/contratPerformance'
import RapportExportButton from '@/features/rapport/RapportExportButton'
import { RapportExportProvider } from '@/features/rapport/RapportExportContext'
import { ContratPerformanceReportTable } from '@/features/rapport/contrat-performance/ContratPerformanceReportTable'

export default function ContratReportPanel({
  contrat,
}: {
  contrat: ContratPerformance
}) {
  const idContrat = contrat.id_contrat ?? 0

  const { data: niveaux = [], isLoading: niveauxLoading } =
    useGetNiveauxConfigClcp(idContrat)
  const { data: cadres = [], isLoading: cadresLoading } =
    useGetCadresLogiquesClcp(idContrat)
  const { data: indicateurs = [], isLoading: indicateursLoading } =
    useGetIndicateursContrat(idContrat)

  return (
    <RapportExportProvider
      pageTitle={`Rapport du contrat de performance ${contrat.code_contrat}`}
    >
      <div className='space-y-4'>
        <div className='flex justify-end'>
          <RapportExportButton />
        </div>

        <ContratPerformanceReportTable
          niveaux={niveaux}
          cadres={cadres}
          indicateurs={indicateurs}
          isLoading={niveauxLoading || cadresLoading || indicateursLoading}
        />
      </div>
    </RapportExportProvider>
  )
}
