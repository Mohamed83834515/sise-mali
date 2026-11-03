import { cn } from '@/lib/utils'
import logoImg from '@/assets/images/logo-mali.png'

interface LogoProps {
  className?: string
  alt?: string
}

export function Logo({ className, alt = 'SISE CPS/SEEUDE' }: LogoProps) {
  return (
    <img
      src={logoImg}
      alt={alt}
      className={cn('size-6 rounded-full object-contain', className)}
    />
  )
}
