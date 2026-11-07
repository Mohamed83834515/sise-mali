import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import { GenericTable } from '@/shared/tables'
import { GenericDeleteDialog } from '@/shared/tables'
import useDialogState from '@/hooks/use-dialog-state'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import type { SuiviDecaissementPtba } from '@/shared/types/entities/decaissementPtba'
import { buildSuiviDecaissementPtbaColumns } from '@/shared/tables/columns/suivi-decaissement-ptba-columns'
import { useDeleteSuiviDecaissement } from '@/shared/api/hooks/admin/suiviPtbaHooks'
import { type Ptba } from '@/shared/types'

type Props = {
  suivis: SuiviDecaissementPtba[]
  activite: Ptba
  onEdit: (row: SuiviDecaissementPtba) => void
  onAdd: () => void
}

export default function SuiviDecaissementPtbaList({
  suivis,
  activite,
  onEdit,
  onAdd,
}: Props) {
  const { search, navigate } = useEmbeddedTableState()
  const [open, setOpen] = useDialogState<'delete'>(null)
  const [currentRow, setCurrentRow] = useState<SuiviDecaissementPtba | null>(
    null
  )
  const deleteMutation = useDeleteSuiviDecaissement(activite.id_ptba)

  const columns = useMemo(
    () =>
      buildSuiviDecaissementPtbaColumns({
        activite,
        onEdit,
        onDeleteRequest: (row) => {
          setCurrentRow(row)
          setOpen('delete')
        },
      }),
    [activite, onEdit, setOpen]
  )

  const handleConfirmDelete = (row: SuiviDecaissementPtba) => {
    deleteMutation.mutate(row.id_suivi_dec, {
      onSuccess: () => toast.success('Décaissement supprimé'),
      onError: () => toast.error('Erreur lors de la suppression'),
    })
  }

  return (
    <>
      <GenericTable<SuiviDecaissementPtba>
        data={suivis}
        columns={columns}
        search={search}
        navigate={navigate}
        searchKey='observation'
        searchPlaceholder='Filtrer les décaissements…'
        urlFilterConfig={[
          {
            columnId: 'observation',
            searchKey: 'observation',
            type: 'string',
          },
        ]}
        defaultPageSize={10}
        compactPagination
        showViewOptions={false}
        toolbarEndSlot={
          <DataTableToolbarOutlineButton className='ms-auto' onClick={onAdd}>
            Ajouter un décaissement
          </DataTableToolbarOutlineButton>
        }
        emptyMessage='Aucun décaissement enregistré'
      />

      {currentRow && (
        <GenericDeleteDialog<SuiviDecaissementPtba>
          open={open === 'delete'}
          onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)}
          currentRow={currentRow}
          entityName='décaissement'
          getEntityLabel={(row) =>
            row.observation || String(row.montant_decaisse)
          }
          onDelete={handleConfirmDelete}
        />
      )}
    </>
  )
}
