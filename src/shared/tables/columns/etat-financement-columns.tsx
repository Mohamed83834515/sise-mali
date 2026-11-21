import { buildColumns } from '@/shared/tables/column-builder'
import { GenericRowActions } from '@/shared/tables/GenericRowActions'
import { UserPen, Trash2 } from 'lucide-react'

type DialogType = 'add' | 'edit' | 'delete'

export const buildEtatFinancementColumns = (
  setOpen: (dialog: DialogType | null) => void,
  setCurrentRow: (row: any) => void,
  onEdit?: (row: EtatFinancement) => void
) => [
  ...buildColumns([
    {
      type: 'text',
      key: 'code_etat_financement',
      title: 'Code',
    },
    {
      type: 'text',
      key: 'nom_etat_financement',
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
              if (onEdit) onEdit(item as EtatFinancement)
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
