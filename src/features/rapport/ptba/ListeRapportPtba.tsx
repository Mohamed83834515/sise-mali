import { useCallback, useMemo, useRef } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { GenericTable } from '@/shared/tables'
import { buildRapportPtbasColumns } from '@/shared/tables/columns/rapport-ptbas-columns'
import { useGetAllIndicateursTache } from '@/shared/api/hooks/admin/indicateurTacheHooks'
import { useGetPersonnels } from '@/shared/api/hooks/admin/personnelHooks'
import { useGetPtbas } from '@/shared/api/hooks/admin/ptbaHooks'
import { useGetAllTachesActivite } from '@/shared/api/hooks/admin/suiviPtbaHooks'
import { usePtbaVersionSelection } from '@/shared/api/hooks/admin/versionHooks'
import { useGeneralParamsQuery } from '@/shared/api/hooks/generalParams/queries'
import type { Ptba } from '@/shared/types'
import { resolveIdActivite } from '@/shared/types/entities/tacheActivitePtba'
import { PtbaVersionSelect } from '@/features/programmation/ptba/PtbaVersionSelect'
import {
  mapTableColumnsToExportIds,
  RAPPORT_PTBA_COLUMN_MAP,
} from '@/features/rapport/export/rapportExportColumnMap'
import {
  buildRapportPtbaExportRows,
  getRapportPtbaExportColumns,
} from '@/features/rapport/export/rapportExportRowBuilders'
import {
  EMPTY_PTBA_LIST,
  RAPPORT_PTBA_TABLE_INITIAL_STATE,
  RAPPORT_PTBA_URL_FILTER_CONFIG,
  filterPtbasByVersion,
  resolvePtbaActiviteId,
} from '@/features/rapport/rapportTableUtils'
import { useExportTableContextRef } from '@/features/rapport/useExportTableContextRef'
import { useRapportExportRegistration } from '@/features/rapport/useRapportExportRegistration'
import { normalizeIndicateurTache } from '@/shared/utils/indicateurTacheUtils'
import { resolvePersonnelLabel } from '@/shared/utils/resolveApiRelation'
import { useActiveProgrammeCode } from '@/hooks/use-active-programme'

const route = getRouteApi('/_authenticated/rapport/ptba/')

export default function ListeRapportPtba() {
  const codeProgramme = useActiveProgrammeCode()
  const { selectedVersionId, handleChangeVersion, versionOptions } =
    usePtbaVersionSelection(codeProgramme)

  const { exportContextRef, onExportContext } = useExportTableContextRef<Ptba>()

  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: ptbas } = useGetPtbas(selectedVersionId ? Number(selectedVersionId) : 0)
  const { data: personnels = [] } = useGetPersonnels()
  const { data: config } = useGeneralParamsQuery()
  const currencyCode = config?.currencyCode
  const ptbaList = ptbas ?? EMPTY_PTBA_LIST

  const filteredPtbas = useMemo(
    () => filterPtbasByVersion(ptbaList, selectedVersionId),
    [ptbaList, selectedVersionId]
  )

  const activiteIds = useMemo(
    () =>
      filteredPtbas
        .map((ptba) => resolvePtbaActiviteId(ptba))
        .filter((id): id is number => id != null),
    [filteredPtbas]
  )

  const { data: allTaches = [], isLoading: tachesLoading } =
    useGetAllTachesActivite(activiteIds.length > 0)

  const { data: allIndicateurs = [], isLoading: indicateursLoading } =
    useGetAllIndicateursTache(activiteIds.length > 0)

  const tachesCountByActivite = useMemo(() => {
    const map = new Map<number, number>()
    const activiteIdSet = new Set(activiteIds)

    for (const id of activiteIds) {
      map.set(id, 0)
    }

    for (const tache of allTaches) {
      const activiteId = resolveIdActivite(tache)
      if (activiteId == null || !activiteIdSet.has(activiteId)) continue
      map.set(activiteId, (map.get(activiteId) ?? 0) + 1)
    }

    return map
  }, [allTaches, activiteIds])

  const indicateursCountByActivite = useMemo(() => {
    const map = new Map<number, number>()
    const activiteIdSet = new Set(activiteIds)

    for (const id of activiteIds) {
      map.set(id, 0)
    }

    for (const raw of allIndicateurs) {
      const item = normalizeIndicateurTache(raw)
      if (!activiteIdSet.has(item.id_activite)) continue
      map.set(item.id_activite, (map.get(item.id_activite) ?? 0) + 1)
    }

    return map
  }, [allIndicateurs, activiteIds])

  const personnelsById = useMemo(
    () =>
      new Map(
        personnels
          .filter((p) => p.n_personnel != null)
          .map((p) => [p.n_personnel!, p])
      ),
    [personnels]
  )

  const getResponsableLabel = useCallback(
    (ptba: Ptba) =>
      resolvePersonnelLabel(ptba.responsable_ptba, personnelsById),
    [personnelsById]
  )

  const exportHandlersRef = useRef({
    getResponsableLabel,
    tachesCountByActivite,
    indicateursCountByActivite,
  })
  exportHandlersRef.current = {
    getResponsableLabel,
    tachesCountByActivite,
    indicateursCountByActivite,
  }

  const buildExportTable = useCallback(
    () => ({
      columns: getRapportPtbaExportColumns(currencyCode),
      rows: buildRapportPtbaExportRows(
        exportContextRef.current.filteredData,
        exportHandlersRef.current
      ),
      visibleColumnIds: mapTableColumnsToExportIds(
        exportContextRef.current.visibleColumnIds,
        RAPPORT_PTBA_COLUMN_MAP
      ),
    }),
    [currencyCode, exportContextRef]
  )

  useRapportExportRegistration({
    buildExportTable,
    isLoading: tachesLoading || indicateursLoading,
  })

  const columns = useMemo(
    () =>
      buildRapportPtbasColumns({
        getResponsableLabel,
        tachesCountByActivite,
        indicateursCountByActivite,
        countsLoading: tachesLoading || indicateursLoading,
        currencyCode,
      }),
    [
      getResponsableLabel,
      tachesCountByActivite,
      indicateursCountByActivite,
      tachesLoading,
      indicateursLoading,
      currencyCode,
    ]
  )

  return (
    <GenericTable<Ptba>
      data={filteredPtbas}
      columns={columns}
      search={search}
      navigate={navigate}
      searchKey='intitule_activite_ptba'
      searchPlaceholder='Filtrer les activités...'
      urlFilterConfig={RAPPORT_PTBA_URL_FILTER_CONFIG}
      toolbarEndSlot={
        <PtbaVersionSelect
          options={versionOptions}
          value={selectedVersionId}
          onChange={handleChangeVersion}
        />
      }
      showViewOptions={false}
      initialState={RAPPORT_PTBA_TABLE_INITIAL_STATE}
      onExportContext={onExportContext}
    />
  )
}
