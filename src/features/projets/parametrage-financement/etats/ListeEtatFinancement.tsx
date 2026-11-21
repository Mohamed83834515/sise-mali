import { useCallback, useMemo, useState } from 'react'
import { useDeleteEtatFinancement, useGetEtatsFinancement } from '@/shared/api/hooks/admin/etatFinancementHooks'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericTable, GenericDialogs, GenericDeleteDialog } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildEtatFinancementColumns } from '@/shared/tables/columns/etat-financement-columns'

export default function ListeEtatFinancement({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: EtatFinancement) => void
}) {
  const { data = [] } = useGetEtatsFinancement()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<any>(null)

  const { search, navigate } = useEmbeddedTableState()
  const deleteMutation = useDeleteEtatFinancement()

  const handleEdit = useCallback(
    (row: EtatFinancement) => {
      setCurrentRow(row)
      onEdit(row)
    },
    [onEdit]
  )

  const columns = useMemo(
    () => buildEtatFinancementColumns(setOpen, setCurrentRow, handleEdit),
    [handleEdit]
  )

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>États de financement</CardTitle>
        <DataTableToolbarOutlineButton onClick={onAdd}>
          Ajouter un état
        </DataTableToolbarOutlineButton>
      </CardHeader>
      <CardContent>
        <GenericTable
          data={data}
          columns={columns}
          search={search}
          showSearch
          showPagination
          navigate={navigate}
          showViewOptions
          searchPlaceholder='Rechercher un état...'
        />

        <GenericDialogs
          open={open}
          setOpen={setOpen}
          currentRow={currentRow}
          setCurrentRow={setCurrentRow}
          rowRequiredDialogs={['edit', 'delete']}
          dialogMap={{
            delete: (props) => (
              <GenericDeleteDialog
                {...props}
                entityName='état de financement'
                currentRow={props.currentRow}
                getEntityLabel={(row: EtatFinancement) =>
                  `${row.code_etat_financement} - ${row.nom_etat_financement}`
                }
                onDelete={(row: EtatFinancement) =>
                  deleteMutation.mutate(row?.id_etat_financement)
                }
              />
            ),
          }}
        />
      </CardContent>
    </Card>
  )
}
