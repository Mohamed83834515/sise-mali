import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ProgrammeSwitcher } from './programme-switcher'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-1.5 px-2.5 sm:gap-4 sm:px-4',
          offset > 10 &&
            fixed &&
            'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg'
        )}
      >
        {/* Gauche : trigger sidebar */}
        <SidebarTrigger variant='outline' className='size-8 shrink-0' />
        <Separator orientation='vertical' className='hidden h-6 sm:block' />

        {/* Contenu injecté (logo, search, actions) */}
        <div className='flex flex-1 min-w-0 items-center gap-1.5 sm:gap-3'>
          {children}
        </div>

        {/* Droite : programme actif (mis en avant) */}
        <div className='ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3'>
          <Separator orientation='vertical' className='hidden h-6 sm:block' />
          <ProgrammeSwitcher onHeader />
        </div>
      </div>
    </header>
  )
}