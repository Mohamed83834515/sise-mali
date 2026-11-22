import { type ColumnDef } from '@tanstack/react-table'
import { buildColumns } from '@/shared/tables/column-builder'
import { GenericRowActions } from '@/shared/tables/GenericRowActions'
import { UserPen, Trash2 } from 'lucide-react'

type DialogType = 'add' | 'edit' | 'delete'

export const buildEntrepriseTravauxColumns = (
  setOpen: (dialog: DialogType | null) => void,
  setCurrentRow: (row: any) => void,
  onEdit?: (row: EntrepriseTravaux) => void
): ColumnDef<EntrepriseTravaux>[] => [
  ...buildColumns<EntrepriseTravaux>([
    {
      type: 'text',
      key: 'code_entreprise',
      title: 'Code',
    },
    {
      type: 'text',
      key: 'intitule_entreprise',
      title: 'Intitulé',
    },
    {
      type: 'text',
      key: 'description_entreprise',
      title: 'Description',
    },
  ]),
  {
    id: 'actions',
    cell: ({ row }) => (
      <GenericRowActions
        row={row}
        actions={[
          {
            label: 'Modifier',
            icon: <UserPen size={16} />,
            onClick: (item) => {
              setCurrentRow(item)
              if (onEdit) onEdit(item as EntrepriseTravaux)
              else setOpen('edit')
            },
          },
          {
            label: 'Supprimer',
            icon: <Trash2 size={16} />,
            className: 'text-red-500!',
            separator: true,
            onClick: (item) => {
              setCurrentRow(item)
              setOpen('delete')
            },
          },
        ]}
      />
    ),
  },
]
