import { useCallback, useMemo, useState } from 'react'
import {
  useDeleteBureauControle,
  useGetBureauxControle,
} from '@/shared/api/hooks/admin/bureauControleHooks'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericTable, GenericDialogs, GenericDeleteDialog } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildBureauControleColumns } from '@/shared/tables/columns/bureau-controle-columns'

export default function ListeBureauControle({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: BureauControle) => void
}) {
  const { data = [] } = useGetBureauxControle()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<any>(null)

  const { search, navigate } = useEmbeddedTableState()
  const deleteMutation = useDeleteBureauControle()

  const handleEdit = useCallback(
    (row: BureauControle) => {
      setCurrentRow(row)
      onEdit(row)
    },
    [onEdit]
  )

  const columns = useMemo(
    () => buildBureauControleColumns(setOpen, setCurrentRow, handleEdit),
    [handleEdit]
  )

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Bureaux de contrôle</CardTitle>
        <DataTableToolbarOutlineButton onClick={onAdd}>
          Ajouter un bureau
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
          searchPlaceholder='Rechercher un bureau de contrôle...'
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
                entityName='bureau de contrôle'
                currentRow={props.currentRow}
                getEntityLabel={(row: BureauControle) =>
                  `${row.code_bureau} - ${row.intitule_bureau}`
                }
                onDelete={(row: BureauControle) =>
                  deleteMutation.mutate(row?.id_bureau)
                }
              />
            ),
          }}
        />
      </CardContent>
    </Card>
  )
}
