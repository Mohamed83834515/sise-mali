// simadou/allfonctionalities/parametrage/localite/LocaliteNiveauTable.tsx
import { useMemo } from 'react'
import { GenericTable } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { buildLocaliteColumns } from '@/shared/tables/columns/localite-columns'
import { useGetNiveauxLocalite } from '@/shared/api/hooks/admin/niveauLocaliteHooks'

type LocaliteNiveauTableProps = {
  niveauId: number
  localites: Localite[]
  tableKey: string
  onEdit: (row: Localite) => void
  onDeleteRequest: (row: Localite) => void
}

function getNiveauIdFromLocalite(loc: Localite): number | null {
  if (!loc.niveau_loca) return null
  if (typeof loc.niveau_loca === 'object') return loc.niveau_loca.id_nlc || null
  return loc.niveau_loca
}

export function LocaliteNiveauTable({
  niveauId,
  localites,
  tableKey,
  onEdit,
  onDeleteRequest,
}: LocaliteNiveauTableProps) {
  const { search, navigate } = useEmbeddedTableState()
  const { data: niveaux = [] } = useGetNiveauxLocalite()

  const currentNiveau = niveaux.find((n: any) => n.id_nlc === niveauId)

  const columns = useMemo(
    () =>
      buildLocaliteColumns(
        niveaux,
        currentNiveau?.nombre_nlc || 0,
        localites,
        onEdit,
        onDeleteRequest
      ),
    [niveaux, currentNiveau?.nombre_nlc, localites, onEdit, onDeleteRequest]
  )

  const rows = useMemo(
    () => localites.filter((loc) => getNiveauIdFromLocalite(loc) === niveauId),
    [localites, niveauId]
  )

  return (
    <GenericTable<Localite>
      key={tableKey}
      data={rows}
      columns={columns as any}
      search={search}
      navigate={navigate}
      searchKey='intitule_loca'
      searchPlaceholder='Filtrer les localités…'
      defaultPageSize={10}
      showViewOptions={false}
      showSearch={false}
      emptyMessage='Aucune localité pour ce niveau'
    />
  )
}