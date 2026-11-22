import { useCallback, useMemo, useState } from 'react'
import {
  useDeleteTypeInfrastructure,
  useGetTypesInfrastructures,
} from '@/shared/api/hooks/admin/typeInfrastructureHooks'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericTable, GenericDialogs, GenericDeleteDialog } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildTypeInfrastructureColumns } from '@/shared/tables/columns/type-infrastructure-columns'

export default function ListeTypeInfrastructure({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: TypeInfrastructure) => void
}) {
  const { data = [] } = useGetTypesInfrastructures()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<any>(null)

  const { search, navigate } = useEmbeddedTableState()
  const deleteMutation = useDeleteTypeInfrastructure()

  const handleEdit = useCallback(
    (row: TypeInfrastructure) => {
      setCurrentRow(row)
      onEdit(row)
    },
    [onEdit]
  )

  const columns = useMemo(
    () => buildTypeInfrastructureColumns(setOpen, setCurrentRow, handleEdit),
    [handleEdit]
  )

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Types d&apos;infrastructures</CardTitle>
        <DataTableToolbarOutlineButton onClick={onAdd}>
          Ajouter un type d&apos;infrastructure
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
          searchPlaceholder="Rechercher un type d'infrastructure..."
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
                entityName="type d'infrastructure"
                currentRow={props.currentRow}
                getEntityLabel={(row: TypeInfrastructure) =>
                  `${row.code_type_infrastructure} - ${row.intitule_type_infrastructure}`
                }
                onDelete={(row: TypeInfrastructure) =>
                  deleteMutation.mutate(row?.id_type_infrastructure)
                }
              />
            ),
          }}
        />
      </CardContent>
    </Card>
  )
}
