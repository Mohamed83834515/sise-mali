import { useMemo, useState, useCallback } from 'react'
import { GenericTable } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { buildTachePtbaColumns, TachePtbaTableRow } from '@/shared/tables/columns/tache-activites-columns'
import useDialogState from '@/hooks/use-dialog-state'
import { useDeleteTachePtba } from '@/shared/api/hooks/admin/tacheActiviteHooks'
import { toast } from 'sonner'
import { GenericDeleteDialog } from '@/shared/tables'
import { useGetPersonnels } from '@/shared/api/hooks/admin/personnelHooks'
import { resolvePersonnelLabel } from '@/shared/utils/resolveApiRelation'

type SuiviTacheActiviteListProps = {
  taches: TacheActivitePtba[]
  idActivite: number
  onEdit: (tache: TacheActivitePtba) => void
}

export default function TacheActiviteList({
  taches,
  idActivite,
  onEdit,
}: SuiviTacheActiviteListProps) {
  const { search, navigate } = useEmbeddedTableState()

  const [open, setOpen] = useDialogState<'delete'>(null)
  const [currentRow, setCurrentRow] =
    useState<TacheActivitePtba | null>(null)

  const { data: personnels = [] } = useGetPersonnels()
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
    (tache: TacheActivitePtba) =>
      resolvePersonnelLabel(tache.responsable_gt, personnelsById) ?? '',
    [personnelsById]
  )

  const columns = useMemo(
    () => buildTachePtbaColumns(setOpen, setCurrentRow, onEdit, getResponsableLabel),
    [onEdit, setOpen, setCurrentRow, getResponsableLabel]
  )

  const deleteMutation = useDeleteTachePtba(idActivite)

  const handleConfirmDelete = (row: TacheActivitePtba) => {
    deleteMutation.mutate(row.id_groupe_tache, {
      onSuccess: () => toast.success('Tache supprimée avec succes'),
      onError: () => toast.error('Erreur lors de la suppression'),
    })
  }
  return (
    <>
      <GenericTable<TachePtbaTableRow>
        data={taches}
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='intutile_tache_gt'
        searchPlaceholder='Filtrer les tâches...'
        urlFilterConfig={[
          {
            columnId: 'intutile_tache_gt',
            searchKey: 'intutile_tache_gt',
            type: 'string',
          },
        ]}
        defaultPageSize={10}
        showViewOptions={false}
        showPagination={false}
        showSearch={false}
        emptyMessage='Aucune tâche planifiée pour cette activité.'
      />

      {currentRow && (
        <GenericDeleteDialog<TacheActivitePtba>
          open={open === 'delete'}
          onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)}
          currentRow={currentRow}
          entityName='observation globale'
          getEntityLabel={(row) => row.intutile_tache_gt}
          onDelete={handleConfirmDelete}
        />
      )}

    </>
  )
}
