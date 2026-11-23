import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { buildEditDeleteActionsColumn } from '@/shared/tables/buildEditDeleteActionsColumn'

export function buildPhaseProjetColumns({
  onEdit,
  onDeleteRequest,
}: {
  onEdit: (row: PhaseProjet) => void
  onDeleteRequest: (row: PhaseProjet) => void
}): ColumnDef<PhaseProjet>[] {
  return [
    {
      id: 'index',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='N°' />
      ),
      cell: ({ row }) => (
        <span className='text-xs font-mono text-muted-foreground'>
          {row.index + 1}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: 'nom_phase',
      accessorKey: 'nom_phase',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Nom de la phase' />
      ),
      cell: ({ row }) => (
        <div className='font-medium text-slate-900'>
          {row.original.nom_phase || '—'}
        </div>
      ),
    },
    buildEditDeleteActionsColumn<PhaseProjet>({
      onEdit,
      onDeleteRequest,
    }),
  ]
}
