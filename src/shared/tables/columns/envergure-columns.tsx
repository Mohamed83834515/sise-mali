import { buildColumns } from '@/shared/tables/column-builder'
import { GenericRowActions } from '@/shared/tables/GenericRowActions'
import { UserPen, Trash2 } from 'lucide-react'

type DialogType = 'add' | 'edit' | 'delete'

export const buildEnvergureColumns = (
  setOpen: (dialog: DialogType | null) => void,
  setCurrentRow: (row: any) => void,
  onEdit?: (row: EnvergureProjet) => void
) => [
  ...buildColumns([
    {
      type: 'text',
      key: 'code_envergure',
      title: 'Code',
    },
    {
      type: 'text',
      key: 'nom_envergure',
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
              if (onEdit) onEdit(item as EnvergureProjet)
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
