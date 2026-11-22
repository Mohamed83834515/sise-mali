import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { buildEditDeleteActionsColumn } from '@/shared/tables/buildEditDeleteActionsColumn'
import {
  formatTypeFinancementLabel,
  resolveBailleurLabel,
  resolveModeFinancementLabel,
} from '@/shared/utils/financementProjetUtils'

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR')
}

function formatMontant(value: number | null | undefined): string {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value))
}

export function buildFinancementProjetColumns({
  signatairesById,
  modesById,
  onEdit,
  onDeleteRequest,
}: {
  signatairesById: Map<number, Acteur>
  modesById?: Map<number, ModeFinancement>
  onEdit: (row: FinancementProjet) => void
  onDeleteRequest: (row: FinancementProjet) => void
}): ColumnDef<FinancementProjet>[] {
  return [
    {
      id: 'code_type',
      accessorKey: 'code_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Code' />
      ),
      cell: ({ row }) => row.original.code_type + ':' + row.original.intitule || '—',
    },

    {
      id: 'mode_financement',
      accessorKey: 'mode_financement',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Mode de financement' />
      ),
      cell: ({ row }) => {
        if (row.original.mode_financement) {
          return resolveModeFinancementLabel(row.original.mode_financement, modesById)
        }
        return formatTypeFinancementLabel(row.original.type_financement ?? '')
      },
    },
    {
      id: 'bailleur',
      accessorKey: 'bailleur',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Bailleur' />
      ),
      cell: ({ row }) =>
        resolveBailleurLabel(row.original.bailleur, signatairesById),
    },
    {
      id: 'montant',
      accessorKey: 'montant',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Montant(FCFA)' />
      ),
      cell: ({ row }) => (
        <span className='text-end block'>{formatMontant(row.original.montant)}</span>
      ),
      meta: {
        thClassName: 'text-end',
        className: 'text-end'
      },
    },
    {
      id: 'date_accord',
      accessorKey: 'date_accord',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date d'accord" />
      ),
      cell: ({ row }) => formatDate(row.original.date_accord),
      meta: {
        thClassName: 'text-center',
        className: 'text-center'
      },
    },

    buildEditDeleteActionsColumn<FinancementProjet>({
      onEdit,
      onDeleteRequest,
    }),
  ]
}
