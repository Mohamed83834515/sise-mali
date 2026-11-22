import { type ColumnDef } from '@tanstack/react-table'
import { buildColumns } from '@/shared/tables/column-builder'
import { GenericRowActions } from '@/shared/tables/GenericRowActions'
import { UserPen, Trash2 } from 'lucide-react'

type DialogType = 'add' | 'edit' | 'delete'

export const buildTypeInfrastructureColumns = (
  setOpen: (dialog: DialogType | null) => void,
  setCurrentRow: (row: any) => void,
  onEdit?: (row: TypeInfrastructure) => void
): ColumnDef<TypeInfrastructure>[] => [
  ...buildColumns<TypeInfrastructure>([
    {
      type: 'text',
      key: 'code_type_infrastructure',
      title: 'Code',
    },
    {
      type: 'text',
      key: 'intitule_type_infrastructure',
      title: 'Intitulé',
    },
    {
      type: 'text',
      key: 'description_type_infrastructure',
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
              if (onEdit) onEdit(item as TypeInfrastructure)
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
