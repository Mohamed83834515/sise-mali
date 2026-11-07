import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  showViewOptions?: boolean
  showSearch?: boolean
  toolbarEndSlot?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
  showViewOptions = true,
  showSearch = true,
  toolbarEndSlot,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  return (
    <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between'>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {showSearch && (
          searchKey && table.getColumn(searchKey) ? (
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className='h-8 w-full sm:w-48 lg:w-64'
            />
          ) : (
            <Input
              placeholder={searchPlaceholder}
              value={table.getState().globalFilter ?? ''}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className='h-8 w-full sm:w-48 lg:w-64'
            />
          )
        )}
        <div className='flex flex-wrap items-center gap-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className='h-8 px-2 lg:px-3 text-xs'
          >
            Réinitialiser
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>

      <div className='flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto'>
        {toolbarEndSlot ??
          (showViewOptions ? <DataTableViewOptions table={table} /> : null)
        }
      </div>
    </div>
  )
}
