import { cn } from '@/lib/utils'

interface MaliFlagProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  width?: number | string
  height?: number | string
  rounded?: boolean
}

/**
 * Drapeau officiel de la République du Mali (Vert - Or/Jaune - Rouge)
 * Proportions officielles 2:3, bandes verticales égales.
 * Vert:  #009460 (ou #14B53A)
 * Jaune: #FCD116
 * Rouge: #CE1126
 */
export function MaliFlag({
  className,
  width = 24,
  height = 16,
  rounded = true,
  ...props
}: MaliFlagProps) {
  return (
    <svg
      viewBox="0 0 900 600"
      width={width}
      height={height}
      className={cn('inline-block overflow-hidden shadow-xs shrink-0', rounded && 'rounded-[3px]', className)}
      aria-label="Drapeau du Mali"
      {...props}
    >
      <rect width="300" height="600" fill="#009460" />
      <rect x="300" width="300" height="600" fill="#FCD116" />
      <rect x="600" width="300" height="600" fill="#CE1126" />
    </svg>
  )
}

export function MaliEmblem({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-lg bg-emerald-950/20 border border-emerald-500/30 p-1',
        className
      )}
    >
      <MaliFlag width="100%" height="100%" rounded={false} className="size-full object-cover" />
    </div>
  )
}

