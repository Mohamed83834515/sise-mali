import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { phaseProjetService } from '@/shared/api/services/phaseProjetService'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const phaseProjetQueryKeys = {
  all: ['phases-projet'] as const,
  list: () => [...phaseProjetQueryKeys.all, 'list'] as const,
  byProjet: (idProjet: number) => [...phaseProjetQueryKeys.all, 'projet', idProjet] as const,
}

export const useGetPhasesProjet = (idProjet?: number) => {
  return useQuery({
    queryKey: idProjet
      ? phaseProjetQueryKeys.byProjet(idProjet)
      : phaseProjetQueryKeys.list(),
    queryFn: () =>
      idProjet
        ? phaseProjetService.getByProjet(idProjet)
        : phaseProjetService.getAll(),
    enabled: idProjet === undefined || idProjet > 0,
  })
}

export const useSavePhaseProjet = (
  isEdit: boolean,
  currentRow?: PhaseProjet | null,
  idProjet?: number,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { nom_phase: string; projet: number }) =>
      isEdit && currentRow?.id
        ? phaseProjetService.update(currentRow.id, data)
        : phaseProjetService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: phaseProjetQueryKeys.all,
      })
      if (idProjet) {
        await queryClient.invalidateQueries({
          queryKey: phaseProjetQueryKeys.byProjet(idProjet),
        })
      }
      toast.success(
        isEdit ? 'Phase modifiée avec succès' : 'Phase créée avec succès'
      )
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(
          error,
          'Une erreur est survenue lors de l’enregistrement de la phase'
        )
      )
    },
  })
}

export const useDeletePhaseProjet = (idProjet?: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => phaseProjetService.delete(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: phaseProjetQueryKeys.all,
      })
      if (idProjet) {
        await queryClient.invalidateQueries({
          queryKey: phaseProjetQueryKeys.byProjet(idProjet),
        })
      }
      toast.success('Phase supprimée avec succès')
    },

    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(
          error,
          'Une erreur est survenue lors de la suppression de la phase'
        )
      )
    },
  })
}
