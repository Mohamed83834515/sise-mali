import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { niveauAvancementService } from '@/shared/api/services/niveauAvancementService'
import type { NiveauAvancementFormData } from '@/shared/schemas/parametrageFinancementSchemas'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const niveauAvancementQueryKeys = {
  all: ['niveaux-avancement-projet'] as const,
  list: () => [...niveauAvancementQueryKeys.all, 'list'] as const,
}

export const useGetNiveauxAvancement = () => {
  return useQuery({
    queryKey: niveauAvancementQueryKeys.list(),
    queryFn: () => niveauAvancementService.getAll(),
  })
}

export const useSaveNiveauAvancement = (
  isEdit: boolean,
  currentRow?: any,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: NiveauAvancementFormData) =>
      isEdit && currentRow?.id_niveau_avancement
        ? niveauAvancementService.update(currentRow.id_niveau_avancement, data)
        : niveauAvancementService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: niveauAvancementQueryKeys.list(),
      })
      toast.success(
        isEdit ? "Niveau d'avancement modifié" : "Niveau d'avancement créé"
      )
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Une erreur est survenue'))
    },
  })
}

export const useDeleteNiveauAvancement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => niveauAvancementService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: niveauAvancementQueryKeys.list(),
      })
      toast.success("Niveau d'avancement supprimé")
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression'))
    },
  })
}
