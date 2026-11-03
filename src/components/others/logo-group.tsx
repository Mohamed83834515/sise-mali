import logoMali from '@/assets/images/logo-mali.png'
import { cn } from '@/lib/utils'

interface LogoGroupProps {
  className?: string
  logoHeight?: number | string
}

export function LogoGroup({ className, logoHeight = 40 }: LogoGroupProps) {
  return (
    <div className={cn('flex items-center gap-3 py-1', className)}>
      <div className="relative overflow-hidden rounded-lg bg-background/5 p-1 transition-all duration-300 hover:bg-background/10 hover:shadow-md">
        <img
          src={logoMali}
          alt="République du Mali - MEADD"
          style={{ height: logoHeight, width: 'auto' }}
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="hidden sm:flex flex-col text-xs leading-tight">
        <span className="font-bold text-foreground/90">SISE CPS/SEEUDE</span>
        <span className="text-[10px] text-muted-foreground">MEADD — PRTD-Mali</span>
      </div>
    </div>
  )
}
