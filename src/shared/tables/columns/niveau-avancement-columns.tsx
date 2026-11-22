import { buildColumns } from '@/shared/tables/column-builder'
import { GenericRowActions } from '@/shared/tables/GenericRowActions'
import { UserPen, Trash2 } from 'lucide-react'

type DialogType = 'add' | 'edit' | 'delete'

export const buildNiveauAvancementColumns = (
  setOpen: (dialog: DialogType | null) => void,
  setCurrentRow: (row: any) => void,
  onEdit?: (row: NiveauAvancementProjet) => void
) => [
  ...buildColumns([
    {
      type: 'text',
      key: 'code_niveau_avancement',
      title: 'Code',
    },
    {
      type: 'text',
      key: 'nom_niveau_avancement',
      title: 'Nom',
    },
  ]),
  {
    id: 'actions',
    cell: ({ row }: any) => (
      <GenericRowActions
        row={row}
        actions={[
          {
            label: 'Modifier',
            icon: <UserPen size={16} />,
            onClick: (item) => {
              setCurrentRow(item)
              if (onEdit) onEdit(item as NiveauAvancementProjet)
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
