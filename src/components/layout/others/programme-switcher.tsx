import { useState, useMemo } from 'react'
import { Check, ChevronDown, FolderKanban, Loader2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { Programme } from '@/simadou/allTypes/programme'
import { useProgrammeStore } from '@/stores/programme-store'

interface ProgrammeSwitcherProps {
  onHeader?: boolean
}

function programmePeriode(programme: Programme): string {
  const debut = programme.annee_debut_programme?.slice(0, 4)
  const fin = programme.annee_fin_programme?.slice(0, 4)
  if (debut && fin) return `${debut} – ${fin}`
  if (debut) return debut
  return '—'
}

function programmeLabel(programme: Programme): string {
  return programme.sigle_programme?.trim() || programme.code_programme
}

export function ProgrammeSwitcher({ onHeader = false }: ProgrammeSwitcherProps) {
  const activeProgramme = useProgrammeStore((s) => s.activeProgramme)
  const programmes = useProgrammeStore((s) => s.programmes)
  const setActiveProgramme = useProgrammeStore((s) => s.setActiveProgramme)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSearch('')
    }
  }

  const isLoading = programmes.length === 0 && !activeProgramme

  const filteredProgrammes = useMemo(() => {
    if (!search.trim()) return programmes
    const q = search.trim().toLowerCase()
    return programmes.filter((p) => {
      const sigle = p.sigle_programme?.toLowerCase() || ''
      const code = p.code_programme?.toLowerCase() || ''
      const nom = p.nom_programme?.toLowerCase() || ''
      return sigle.includes(q) || code.includes(q) || nom.includes(q)
    })
  }, [programmes, search])

  const handleSelect = (programme: Programme) => {
    if (programme.id_programme === activeProgramme?.id_programme) {
      setOpen(false)
      return
    }
    setActiveProgramme(programme)
    setOpen(false)
  }

  const triggerLabel = activeProgramme
    ? programmeLabel(activeProgramme)
    : 'Projet'

  const triggerTitle = activeProgramme
    ? `${activeProgramme.nom_programme} (${activeProgramme.code_programme})`
    : 'Sélectionner un programme'

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'flex max-w-[220px] items-center gap-2 shadow-sm transition-colors',
            onHeader ? 'hover:brightness-110' : 'hover:brightness-[0.98]'
          )}
          disabled={isLoading}
          title={triggerTitle}
          style={
            onHeader
              ? {
                  color: 'var(--header-text)',
                  borderColor:
                    'color-mix(in srgb, var(--chart-color) 55%, transparent)',
                  backgroundColor:
                    'color-mix(in srgb, var(--chart-color) 18%, rgba(255,255,255,0.08))',
                  boxShadow:
                    '0 0 0 1px color-mix(in srgb, var(--chart-color) 30%, transparent)',
                }
              : {
                  borderColor:
                    'color-mix(in srgb, var(--chart-color-2) 45%, transparent)',
                  backgroundColor:
                    'color-mix(in srgb, var(--chart-color-2) 10%, transparent)',
                  boxShadow:
                    '0 0 0 1px color-mix(in srgb, var(--chart-color-2) 20%, transparent)',
                }
          }
        >
          {isLoading ? (
            <Loader2
              className='h-4 w-4 shrink-0 animate-spin'
              style={
                onHeader ? { color: 'var(--header-text)' } : undefined
              }
            />
          ) : (
            <FolderKanban
              className='h-4 w-4 shrink-0'
              style={{
                color: onHeader
                  ? 'var(--chart-color)'
                  : 'var(--chart-color-2)',
              }}
            />
          )}
          <span className='truncate text-xs font-semibold'>{triggerLabel}</span>
          <ChevronDown className='h-3 w-3 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='w-84 max-w-[calc(100vw-2rem)] p-1.5 shadow-xl'
      >
        <div className='flex items-center justify-between px-2.5 py-1.5'>
          <span className='text-xs font-semibold text-foreground/80'>
            Programme actif
          </span>
          {programmes.length > 0 && (
            <span className='rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground'>
              {filteredProgrammes.length} / {programmes.length}
            </span>
          )}
        </div>

        {programmes.length > 3 && (
          <div className='px-1.5 pb-1'>
            <div className='relative'>
              <Search className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder='Rechercher un programme...'
                className='h-8 pl-8 pr-2 text-xs'
              />
            </div>
          </div>
        )}

        <DropdownMenuSeparator className='my-1' />

        <div className='max-h-72 overflow-y-auto overscroll-contain pr-1 space-y-0.5'>
          {filteredProgrammes.length === 0 ? (
            <div className='px-3 py-6 text-center text-xs text-muted-foreground'>
              {search.trim()
                ? 'Aucun programme correspondant'
                : 'Aucun programme disponible'}
            </div>
          ) : (
            filteredProgrammes.map((programme) => {
              const isActive =
                activeProgramme?.id_programme === programme.id_programme
              return (
                <DropdownMenuItem
                  key={programme.id_programme}
                  onClick={() => handleSelect(programme)}
                  className={cn(
                    'my-0.5 flex cursor-pointer flex-col items-start gap-1 rounded-md p-2.5 transition-colors',
                    isActive && 'bg-primary/10 ring-1 ring-primary/25'
                  )}
                >
                  <div className='flex w-full items-center justify-between gap-2'>
                    <div className='flex min-w-0 items-center gap-2'>
                      {isActive && (
                        <Check className='h-3.5 w-3.5 shrink-0 text-primary' />
                      )}
                      <span className='truncate text-xs font-semibold'>
                        {programme.sigle_programme} | {programme.code_programme}
                      </span>
                    </div>
                    <Badge variant='outline' className='shrink-0 px-1.5 py-0 text-[10px]'>
                      {programmePeriode(programme)}
                    </Badge>
                  </div>
                  <span
                    className={cn(
                      'line-clamp-2 text-[11px] leading-snug',
                      isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}
                  >
                    {programme.nom_programme}
                  </span>
                </DropdownMenuItem>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
