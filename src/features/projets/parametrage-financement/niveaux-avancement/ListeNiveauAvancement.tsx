import { useCallback, useMemo, useState } from 'react'
import {
  useDeleteNiveauAvancement,
  useGetNiveauxAvancement,
} from '@/shared/api/hooks/admin/niveauAvancementHooks'
import useDialogState from '@/hooks/use-dialog-state'
import { GenericTable, GenericDialogs, GenericDeleteDialog } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { DataTableToolbarOutlineButton } from '@/components/data-table/toolbar-outline-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buildNiveauAvancementColumns } from '@/shared/tables/columns/niveau-avancement-columns'

export default function ListeNiveauAvancement({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: NiveauAvancementProjet) => void
}) {
  const { data = [] } = useGetNiveauxAvancement()
  const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>(null)
  const [currentRow, setCurrentRow] = useState<any>(null)

  const { search, navigate } = useEmbeddedTableState()
  const deleteMutation = useDeleteNiveauAvancement()

  const handleEdit = useCallback(
    (row: NiveauAvancementProjet) => {
      setCurrentRow(row)
      onEdit(row)
    },
    [onEdit]
  )

  const columns = useMemo(
    () => buildNiveauAvancementColumns(setOpen, setCurrentRow, handleEdit),
    [handleEdit]
  )

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Niveaux d&apos;avancement</CardTitle>
        <DataTableToolbarOutlineButton onClick={onAdd}>
          Ajouter un niveau
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
          searchPlaceholder="Rechercher un niveau d'avancement..."
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
                entityName="niveau d'avancement"
                currentRow={props.currentRow}
                getEntityLabel={(row: NiveauAvancementProjet) =>
                  `${row.code_niveau_avancement} - ${row.nom_niveau_avancement}`
                }
                onDelete={(row: NiveauAvancementProjet) =>
                  deleteMutation.mutate(row?.id_niveau_avancement)
                }
              />
            ),
          }}
        />
      </CardContent>
    </Card>
  )
}
