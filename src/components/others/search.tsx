import { SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { useSearch } from '@/stores/others/search-store'

export function Search({
  className = '',
  placeholder = 'Rechercher…',
  ...props
}: React.ComponentProps<'button'> & { placeholder?: string }) {
  const { setOpen } = useSearch()
  return (
    <Button
      {...props}
      variant='outline'
      size='sm'
      className={cn(
        'group relative h-8 w-8 p-0 justify-center rounded-md bg-muted/25 text-sm font-normal text-muted-foreground shadow-none hover:bg-accent shrink-0 sm:w-40 sm:justify-start sm:px-3 sm:pe-12 md:w-52 lg:w-64',
        className
      )}
      aria-keyshortcuts='Meta+K Control+K'
      aria-label='Rechercher'
      onClick={() => setOpen(true)}
    >
      <SearchIcon
        aria-hidden='true'
        className='h-4 w-4 shrink-0 sm:absolute sm:inset-s-2.5 sm:top-1/2 sm:-translate-y-1/2'
        size={16}
      />
      <span className='hidden sm:inline ms-4 truncate'>{placeholder}</span>
      <kbd className='pointer-events-none absolute inset-e-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none group-hover:bg-accent sm:flex'>
        <span className='text-xs'>⌘</span>K
      </kbd>
    </Button>
  )
}
