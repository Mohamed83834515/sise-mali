import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { envergureProjetService } from '@/shared/api/services/envergureProjetService'
import type { EnvergureProjetFormData } from '@/shared/schemas/parametrageFinancementSchemas'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const envergureProjetQueryKeys = {
  all: ['envergures-projet'] as const,
  list: () => [...envergureProjetQueryKeys.all, 'list'] as const,
}

export const useGetEnverguresProjet = () => {
  return useQuery({
    queryKey: envergureProjetQueryKeys.list(),
    queryFn: () => envergureProjetService.getAll(),
  })
}

export const useSaveEnvergureProjet = (
  isEdit: boolean,
  currentRow?: any,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EnvergureProjetFormData) =>
      isEdit && currentRow?.id_envergure
        ? envergureProjetService.update(currentRow.id_envergure, data)
        : envergureProjetService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: envergureProjetQueryKeys.list(),
      })
      toast.success(isEdit ? 'Envergure modifiée' : 'Envergure créée')
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Une erreur est survenue'))
    },
  })
}

export const useDeleteEnvergureProjet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => envergureProjetService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: envergureProjetQueryKeys.list(),
      })
      toast.success('Envergure supprimée')
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression'))
    },
  })
}
