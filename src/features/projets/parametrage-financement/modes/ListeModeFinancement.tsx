import { useCallback, useMemo, useState } from 'react'
import { useDeleteModeFinancement, useGetModesFinancement } from '@/shared/api/hooks/admin/modeFinancementHooks'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericTable, GenericDialogs, GenericDeleteDialog } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildModeFinancementColumns } from '@/shared/tables/columns/mode-financement-columns'

export default function ListeModeFinancement({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: ModeFinancement) => void
}) {
  const { data = [] } = useGetModesFinancement()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<any>(null)

  const { search, navigate } = useEmbeddedTableState()
  const deleteMutation = useDeleteModeFinancement()

  const handleEdit = useCallback(
    (row: ModeFinancement) => {
      setCurrentRow(row)
      onEdit(row)
    },
    [onEdit]
  )

  const columns = useMemo(
    () => buildModeFinancementColumns(setOpen, setCurrentRow, handleEdit),
    [handleEdit]
  )

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Modes de financement</CardTitle>
        <DataTableToolbarOutlineButton onClick={onAdd}>
          Ajouter un mode
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
          searchPlaceholder='Rechercher un mode...'
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
                entityName='mode de financement'
                currentRow={props.currentRow}
                getEntityLabel={(row: ModeFinancement) =>
                  `${row.code_mode_financement} - ${row.nom_mode_financement}`
                }
                onDelete={(row: ModeFinancement) =>
                  deleteMutation.mutate(row?.id_mode_financement)
                }
              />
            ),
          }}
        />
      </CardContent>
    </Card>
  )
}
