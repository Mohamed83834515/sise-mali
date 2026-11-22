import { useCallback, useMemo, useState } from 'react'
import {
  useDeleteEntrepriseTravaux,
  useGetEntreprisesTravaux,
} from '@/shared/api/hooks/admin/entrepriseTravauxHooks'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericTable, GenericDialogs, GenericDeleteDialog } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildEntrepriseTravauxColumns } from '@/shared/tables/columns/entreprise-travaux-columns'

export default function ListeEntrepriseTravaux({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: EntrepriseTravaux) => void
}) {
  const { data = [] } = useGetEntreprisesTravaux()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<any>(null)

  const { search, navigate } = useEmbeddedTableState()
  const deleteMutation = useDeleteEntrepriseTravaux()

  const handleEdit = useCallback(
    (row: EntrepriseTravaux) => {
      setCurrentRow(row)
      onEdit(row)
    },
    [onEdit]
  )

  const columns = useMemo(
    () => buildEntrepriseTravauxColumns(setOpen, setCurrentRow, handleEdit),
    [handleEdit]
  )

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Entreprises de travaux</CardTitle>
        <DataTableToolbarOutlineButton onClick={onAdd}>
          Ajouter une entreprise
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
          searchPlaceholder='Rechercher une entreprise de travaux...'
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
                entityName='entreprise de travaux'
                currentRow={props.currentRow}
                getEntityLabel={(row: EntrepriseTravaux) =>
                  `${row.code_entreprise} - ${row.intitule_entreprise}`
                }
                onDelete={(row: EntrepriseTravaux) =>
                  deleteMutation.mutate(row?.id_entreprise)
                }
              />
            ),
          }}
        />
      </CardContent>
    </Card>
  )
}
