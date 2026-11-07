import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import React from 'react'

export type RowAction<TData> = {
  label: string
  icon?: React.ComponentType<{ size?: number }> | React.ReactNode
  onClick: (row: TData) => void
  /** Affiche en rouge destructif */
  destructive?: boolean
  separator?: boolean
  className?: string
}

type GenericRowActionsProps<TData> = {
  row: Row<TData>
  actions: RowAction<TData>[]
}

/**
 * Menu d'actions par ligne (⋯) entièrement configurable via `actions`.
 *
 * Usage dans users/ :
 *   <GenericRowActions
 *     row={row}
 *     actions={[
 *       { label: 'Edit', icon: UserPen, onClick: (u) => { setCurrentRow(u); setOpen('edit') } },
 *       { label: 'Delete', icon: Trash2, onClick: (u) => { setCurrentRow(u); setOpen('delete') }, destructive: true, separator: true },
 *     ]}
 *   />
 */
export function GenericRowActions<TData>({
  row,
  actions,
}: GenericRowActionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        {actions.map((action, idx) => {
          const renderIcon = () => {
            if (React.isValidElement(action.icon)) return action.icon
            if (typeof action.icon === 'function') {
              const IconComp = action.icon
              return <IconComp size={16} />
            }
            const DefaultIcon = action.destructive ? Trash2 : Pencil
            return <DefaultIcon size={16} />
          }
          return (
            <React.Fragment key={idx}>
              {action.separator && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  action.onClick(row.original)
                }}
                className={action.className ?? (action.destructive ? 'text-red-500!' : undefined)}
              >
                {action.label}
                <DropdownMenuShortcut>
                  {renderIcon()}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </React.Fragment>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}