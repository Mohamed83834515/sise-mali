import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { buildEditDeleteActionsColumn } from '@/shared/tables/buildEditDeleteActionsColumn'
import { resolveRelationId } from '@/shared/utils/resolveApiRelation'

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
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export function buildInfrastructureColumns({
  typesById,
  bureauxById,
  entreprisesById,
  localitesById,
  onEdit,
  onDeleteRequest,
}: {
  typesById?: Map<number, TypeInfrastructure>
  bureauxById?: Map<number, BureauControle>
  entreprisesById?: Map<number, EntrepriseTravaux>
  localitesById?: Map<number, Localite>
  onEdit: (row: Infrastructure) => void
  onDeleteRequest: (row: Infrastructure) => void
}): ColumnDef<Infrastructure>[] {
  return [
    {
      id: 'code_infrastructure',
      accessorKey: 'code_infrastructure',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Code' />
      ),
      cell: ({ row }) => (
        <span className='font-mono font-medium'>{row.original.code_infrastructure || '—'}</span>
      ),
    },
    {
      id: 'nom_infrastructure',
      accessorKey: 'nom_infrastructure',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Nom' />
      ),
      cell: ({ row }) => (
        <div className='max-w-[200px] truncate font-medium'>
          {row.original.nom_infrastructure || '—'}
        </div>
      ),
    },
    {
      id: 'type_infrastructure',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type d'infrastructure" />
      ),
      cell: ({ row }) => {
        const val = row.original.type_infrastructure
        if (typeof val === 'object' && val !== null) {
          return val.intitule_type_infrastructure || val.code_type_infrastructure || '—'
        }
        const id = resolveRelationId(val, 'id_type_infrastructure')
        if (id && typesById?.has(id)) {
          const t = typesById.get(id)!
          return t.intitule_type_infrastructure || t.code_type_infrastructure
        }
        return id ? String(id) : '—'
      },
    },
    {
      id: 'maitre_ouvrage',
      accessorKey: 'maitre_ouvrage',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Maître d'ouvrage" />
      ),
      cell: ({ row }) => row.original.maitre_ouvrage || '—',
    },
    {
      id: 'entreprise_travaux',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Entreprise de travaux' />
      ),
      cell: ({ row }) => {
        const val = row.original.entreprise_travaux
        if (typeof val === 'object' && val !== null) {
          return val.intitule_entreprise || val.code_entreprise || '—'
        }
        const id = resolveRelationId(val, 'id_entreprise')
        if (id && entreprisesById?.has(id)) {
          const e = entreprisesById.get(id)!
          return e.intitule_entreprise || e.code_entreprise
        }
        return id ? String(id) : '—'
      },
    },
    {
      id: 'bureau_controle',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Bureau de contrôle' />
      ),
      cell: ({ row }) => {
        const val = row.original.bureau_controle
        if (typeof val === 'object' && val !== null) {
          return val.intitule_bureau || val.code_bureau || '—'
        }
        const id = resolveRelationId(val, 'id_bureau')
        if (id && bureauxById?.has(id)) {
          const b = bureauxById.get(id)!
          return b.intitule_bureau || b.code_bureau
        }
        return id ? String(id) : '—'
      },
    },
    {
      id: 'cout_infrastructure',
      accessorKey: 'cout_infrastructure',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Coût (FCFA)' />
      ),
      cell: ({ row }) => (
        <span className='block text-end font-medium'>
          {formatMontant(row.original.cout_infrastructure)}
        </span>
      ),
      meta: {
        thClassName: 'text-end',
        className: 'text-end',
      },
    },
    {
      id: 'periode',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Période prévue' />
      ),
      cell: ({ row }) => {
        const debut = formatDate(row.original.date_debut_prevue)
        const fin = formatDate(row.original.date_fin_prevue)
        if (debut === '—' && fin === '—') return '—'
        return `${debut} au ${fin}`
      },
    },
    {
      id: 'localite',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Localité' />
      ),
      cell: ({ row }) => {
        const val = row.original.localite
        if (typeof val === 'object' && val !== null) {
          return (val as any).nom_loca || (val as any).nom_localite || '—'
        }
        const id = resolveRelationId(val, 'id_loca') ?? resolveRelationId(val, 'id')
        if (id && localitesById?.has(id)) {
          const loc = localitesById.get(id)!
          return loc.nom_loca || String(id)
        }
        return id ? String(id) : '—'
      },
    },
    buildEditDeleteActionsColumn<Infrastructure>({
      onEdit,
      onDeleteRequest,
    }),
  ]
}
