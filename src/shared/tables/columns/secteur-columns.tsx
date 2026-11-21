import { buildColumns } from '@/shared/tables/column-builder'
import { GenericRowActions } from '@/shared/tables/GenericRowActions'
import { DataTableColumnHeader } from '@/components/data-table'
import { UserPen, Trash2 } from 'lucide-react'

function resolveParentSecteur(
  parent: Secteur['parent_secteur'] | Record<string, unknown> | null | undefined,
  allSecteurs: Secteur[]
): string {
  if (parent == null) return '—'
  if (typeof parent === 'object' && parent !== null) {
    return (parent as any).intitule_secteur || (parent as any).code_secteur || '—'
  }
  if (typeof parent === 'number') {
    const found = allSecteurs.find((s) => s.id_secteur === parent)
    return found ? `${found.code_secteur} - ${found.intitule_secteur}` : String(parent)
  }
  return '—'
}

export const buildSecteurColumns = (
  _niveaux: NiveauSecteur[],
  currentNiveauNombre: number,
  allSecteurs: Secteur[],
  onEdit: (row: Secteur) => void,
  onDeleteRequest: (row: Secteur) => void
) => {
  const isHigherLevel = currentNiveauNombre > 1

  return [
    ...buildColumns([
      {
        type: 'text',
        key: 'code_secteur',
        title: 'Code',
      },
      {
        type: 'text',
        key: 'intitule_secteur',
        title: 'Intitulé',
      },
    ]),
    ...(isHigherLevel
      ? [
          {
            id: 'parent_secteur',
            header: ({ column }: any) => (
              <DataTableColumnHeader column={column} title='Secteur parent' />
            ),
            cell: ({ row }: any) => (
              <span className='text-sm text-muted-foreground'>
                {resolveParentSecteur(row.original.parent_secteur, allSecteurs)}
              </span>
            ),
          },
        ]
      : []),
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <GenericRowActions
          row={row}
          actions={[
            {
              label: 'Modifier',
              icon: <UserPen size={16} />,
              onClick: (item) => onEdit(item as Secteur),
            },
            {
              label: 'Supprimer',
              icon: <Trash2 size={16} />,
              className: 'text-red-500!',
              separator: true,
              onClick: (item) => onDeleteRequest(item as Secteur),
            },
          ]}
        />
      ),
    },
  ]
}
