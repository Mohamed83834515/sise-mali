import { useMemo } from 'react'
import { GenericTable } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { buildSecteurColumns } from '@/shared/tables/columns/secteur-columns'
import { useGetNiveauxSecteur } from '@/shared/api/hooks/admin/niveauSecteurHooks'

type SecteurNiveauTableProps = {
  niveauId: number
  secteurs: Secteur[]
  onEdit: (row: Secteur) => void
  onDeleteRequest: (row: Secteur) => void
}

function getNiveauIdFromSecteur(sec: Secteur): number | null {
  if (!sec.niveau_secteur) return null
  if (typeof sec.niveau_secteur === 'object') {
    return (sec.niveau_secteur as any).id_niveau_secteur ?? null
  }
  return Number(sec.niveau_secteur)
}

export function SecteurNiveauTable({
  niveauId,
  secteurs,
  onEdit,
  onDeleteRequest,
}: SecteurNiveauTableProps) {
  const { search, navigate } = useEmbeddedTableState()
  const { data: niveaux = [] } = useGetNiveauxSecteur()

  const currentNiveau = niveaux.find((n) => n.id_niveau_secteur === niveauId)

  const columns = useMemo(
    () =>
      buildSecteurColumns(
        niveaux,
        currentNiveau?.nombre_niveau_secteur || 0,
        secteurs,
        onEdit,
        onDeleteRequest
      ),
    [niveaux, currentNiveau?.nombre_niveau_secteur, secteurs, onEdit, onDeleteRequest]
  )

  const rows = useMemo(
    () => secteurs.filter((sec) => getNiveauIdFromSecteur(sec) === niveauId),
    [secteurs, niveauId]
  )

  return (
    <GenericTable
      data={rows}
      columns={columns}
      search={search}
      navigate={navigate}
      searchPlaceholder='Rechercher un secteur...'
      showSearch
      showPagination
      showViewOptions
    />
  )
}
