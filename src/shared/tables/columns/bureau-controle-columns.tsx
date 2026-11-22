import { type ColumnDef } from '@tanstack/react-table'
import { buildColumns } from '@/shared/tables/column-builder'
import { GenericRowActions } from '@/shared/tables/GenericRowActions'
import { UserPen, Trash2 } from 'lucide-react'

type DialogType = 'add' | 'edit' | 'delete'

export const buildBureauControleColumns = (
  setOpen: (dialog: DialogType | null) => void,
  setCurrentRow: (row: any) => void,
  onEdit?: (row: BureauControle) => void
): ColumnDef<BureauControle>[] => [
  ...buildColumns<BureauControle>([
    {
      type: 'text',
      key: 'code_bureau',
      title: 'Code',
    },
    {
      type: 'text',
      key: 'intitule_bureau',
      title: 'Intitulé',
    },
    {
      type: 'text',
      key: 'description_bureau',
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
              if (onEdit) onEdit(item as BureauControle)
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
