import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GenericTable } from '@/shared/tables'
import { GenericDeleteDialog } from '@/shared/tables'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import type { TitrePersonnel } from '@/shared/types'
import {
  useDeleteTitrePersonnel,
  useGetTitresPersonnel,
} from '@/shared/api/hooks/admin/titrePersonnelHooks'
import { buildTitrePersonnelColumns } from '@/shared/tables/columns/titre-personnel-columns'

export default function ListeTitresPersonnel({
  onAdd,
  onEdit,
}: {
  onAdd: () => void
  onEdit: (row: TitrePersonnel) => void
}) {
  const { data: titres = [] } = useGetTitresPersonnel()
  const deleteMutation = useDeleteTitrePersonnel()
  const { search, navigate } = useEmbeddedTableState()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<TitrePersonnel | null>(null)

  const handleEdit = useCallback(
    (row: TitrePersonnel) => {
      onEdit(row)
    },
    [onEdit]
  )

  const handleDeleteRequest = useCallback((row: TitrePersonnel) => {
    setRowToDelete(row)
    setDeleteOpen(true)
  }, [])

  const columns = useMemo(
    () =>
      buildTitrePersonnelColumns({
        onEdit: handleEdit,
        onDeleteRequest: handleDeleteRequest,
      }),
    [handleEdit, handleDeleteRequest]
  )

  return (
    <>
      <div className='space-y-4'>
        <div className='flex justify-end'>
          <Button type='button' variant='outline' size='sm' onClick={onAdd}>
            Ajouter un titre
          </Button>
        </div>

        <GenericTable<TitrePersonnel>
          data={titres}
          columns={columns}
          search={search}
          navigate={navigate}
          showSearch={false}
          showPagination={titres.length > 10}
          showViewOptions={false}
          emptyMessage='Aucun titre.'
        />
      </div>

      {rowToDelete && (
        <GenericDeleteDialog<TitrePersonnel>
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          currentRow={rowToDelete}
          entityName='le titre'
          getEntityLabel={(row) => row.libelle_titre}
          onDelete={(row) => deleteMutation.mutate(row.id_titre)}
        />
      )}
    </>
  )
}
