import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  phaseProjetSchema,
  type PhaseProjetFormData,
} from '@/shared/schemas/phaseProjetSchema'
import { useSavePhaseProjet } from '@/shared/api/hooks/admin/phaseProjetHooks'

type PhaseProjetFormDialogProps = {
  projet: Projet
  phase?: PhaseProjet | null
  onClose: () => void
  onSuccess: () => void
}

export default function PhaseProjetFormDialog({
  projet,
  phase,
  onClose,
  onSuccess,
}: PhaseProjetFormDialogProps) {
  const isEditing = !!phase?.id
  const idProjet = projet.id_projet

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PhaseProjetFormData>({
    resolver: zodResolver(phaseProjetSchema),
    defaultValues: {
      nom_phase: phase?.nom_phase || '',
      projet: idProjet,
    },
  })

  useEffect(() => {
    reset({
      nom_phase: phase?.nom_phase || '',
      projet: idProjet,
    })
  }, [phase, idProjet, reset])

  const saveMutation = useSavePhaseProjet(
    isEditing,
    phase,
    idProjet,
    onSuccess
  )

  const onSubmit = (data: PhaseProjetFormData) => {
    saveMutation.mutate({
      nom_phase: data.nom_phase.trim(),
      projet: idProjet,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-2'>
      <div className='space-y-1.5'>
        <Label htmlFor='nom_phase' className='text-xs font-semibold text-slate-700'>
          Nom de la phase <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='nom_phase'
          placeholder='Ex. Phase 1 - Études et conception'
          className='h-9 text-xs'
          autoFocus
          {...register('nom_phase')}
        />
        {errors.nom_phase && (
          <p className='text-[11px] text-red-500 mt-1 font-medium'>
            {errors.nom_phase.message}
          </p>
        )}
      </div>

      <div className='flex items-center justify-end gap-2.5 pt-3 border-t mt-4'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={onClose}
          className='h-8 px-4 text-xs'
        >
          Annuler
        </Button>
        <Button
          type='submit'
          size='sm'
          disabled={saveMutation.isPending}
          className='h-8 px-5 text-xs bg-primary text-primary-foreground font-medium'
        >
          {saveMutation.isPending && (
            <Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
          )}
          {isEditing ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
