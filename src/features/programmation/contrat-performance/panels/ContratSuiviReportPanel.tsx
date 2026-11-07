import {
  useGetCadresLogiquesClcp,
  useGetNiveauxConfigClcp,
} from '@/shared/api/hooks/admin/cadreLogiqueClcpHooks'
import { useGetIndicateursContrat } from '@/shared/api/hooks/admin/indicateurContratHooks'
import { useGetSuivisContrat } from '@/shared/api/hooks/admin/suiviContratHooks'
import RapportExportButton from '@/features/rapport/RapportExportButton'
import { RapportExportProvider } from '@/features/rapport/RapportExportContext'
import { ContratPerformanceReportTable } from '@/features/rapport/contrat-performance/ContratPerformanceReportTable'

export default function ContratSuiviReportPanel({
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
  const { data: suivis = [], isLoading: suivisLoading } = useGetSuivisContrat()

  return (
    <RapportExportProvider
      pageTitle={`Rapport de suivi du contrat de performance ${contrat.code_contrat}`}
    >
      <div className='space-y-4'>
        <div className='flex justify-end'>
          <RapportExportButton />
        </div>

        <ContratPerformanceReportTable
          niveaux={niveaux}
          cadres={cadres}
          indicateurs={indicateurs}
          isLoading={
            niveauxLoading ||
            cadresLoading ||
            indicateursLoading ||
            suivisLoading
          }
          suivis={suivis}
          showValeurRealisee
        />
      </div>
    </RapportExportProvider>
  )
}
