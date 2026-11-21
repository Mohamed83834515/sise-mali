import { useCallback, useMemo, useState } from 'react'
import { useDeleteEnvergureProjet, useGetEnverguresProjet } from '@/shared/api/hooks/admin/envergureProjetHooks'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericTable, GenericDialogs, GenericDeleteDialog } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildEnvergureColumns } from '@/shared/tables/columns/envergure-columns'

export default function ListeEnvergure({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: EnvergureProjet) => void
}) {
  const { data = [] } = useGetEnverguresProjet()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<any>(null)

  const { search, navigate } = useEmbeddedTableState()
  const deleteMutation = useDeleteEnvergureProjet()

  const handleEdit = useCallback(
    (row: EnvergureProjet) => {
      setCurrentRow(row)
      onEdit(row)
    },
    [onEdit]
  )

  const columns = useMemo(
    () => buildEnvergureColumns(setOpen, setCurrentRow, handleEdit),
    [handleEdit]
  )

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Envergures des projets</CardTitle>
        <DataTableToolbarOutlineButton onClick={onAdd}>
          Ajouter une envergure
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
          searchPlaceholder='Rechercher une envergure...'
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
                entityName='envergure'
                currentRow={props.currentRow}
                getEntityLabel={(row: EnvergureProjet) =>
                  `${row.code_envergure} - ${row.nom_envergure}`
                }
                onDelete={(row: EnvergureProjet) =>
                  deleteMutation.mutate(row?.id_envergure)
                }
              />
            ),
          }}
        />
      </CardContent>
    </Card>
  )
}
