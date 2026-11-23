import type { CSSProperties } from 'react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CHART_COLORS, useColor } from '@/stores/others/color-store'
import { cn } from '@/lib/utils'

export function useNiveauTabsTheme() {
  const { color } = useColor()
  const { stroke } = CHART_COLORS[color]

  return {
    tabsStyle: {
      '--tab-active-bg': stroke,
      '--tab-active-color': '#ffffff',
    } as CSSProperties,
  }
}

interface NiveauTabTriggerProps {
  value: string
  count?: number
  children: React.ReactNode
}

export function NiveauTabTrigger({ value, count, children }: NiveauTabTriggerProps) {
  return (
    <TabsTrigger value={value} className='relative h-auto flex-none'>
      {children}
      {count !== undefined && count > 0 && (
        <span className='rounded-full bg-muted px-1.5 py-0.5 text-xs text-black'>
          ({count})
        </span>
      )}
    </TabsTrigger>
  )
}

export function NiveauTabsList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <TabsList
      className={cn(
        'inline-flex w-auto max-w-full flex-nowrap justify-start sm:justify-start gap-1 overflow-x-auto',
        className
      )}
    >
      {children}
    </TabsList>
  )
}
