import type { LucideIcon } from 'lucide-react'
import RapportExportButton from './RapportExportButton'
import { RapportExportProvider } from './RapportExportContext'

type Props = {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}

export default function RapportPageLayout({
  title,
  icon: Icon,
  children,
}: Props) {
  return (
    <RapportExportProvider pageTitle={title}>
      <div>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg px-3 sm:px-6 pb-2'>
          <div className='flex items-center gap-2 min-w-0'>
            <Icon className='h-5 w-5 shrink-0 text-muted-foreground' />
            <h3 className='truncate font-semibold text-base sm:text-lg'>{title}</h3>
          </div>
          <div className='self-end sm:self-auto shrink-0'>
            <RapportExportButton />
          </div>
        </div>
        <div className='px-2 sm:px-4'>{children}</div>
      </div>
    </RapportExportProvider>
  )
}
