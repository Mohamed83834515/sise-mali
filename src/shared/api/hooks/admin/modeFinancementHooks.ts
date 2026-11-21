import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { modeFinancementService } from '@/shared/api/services/modeFinancementService'
import type { ModeFinancementFormData } from '@/shared/schemas/parametrageFinancementSchemas'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const modeFinancementQueryKeys = {
  all: ['modes-financement-projet'] as const,
  list: () => [...modeFinancementQueryKeys.all, 'list'] as const,
}

export const useGetModesFinancement = () => {
  return useQuery({
    queryKey: modeFinancementQueryKeys.list(),
    queryFn: () => modeFinancementService.getAll(),
  })
}

export const useSaveModeFinancement = (
  isEdit: boolean,
  currentRow?: any,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ModeFinancementFormData) =>
      isEdit && currentRow?.id_mode_financement
        ? modeFinancementService.update(currentRow.id_mode_financement, data)
        : modeFinancementService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: modeFinancementQueryKeys.list(),
      })
      toast.success(isEdit ? 'Mode de financement modifié' : 'Mode de financement créé')
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Une erreur est survenue'))
    },
  })
}

export const useDeleteModeFinancement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => modeFinancementService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: modeFinancementQueryKeys.list(),
      })
      toast.success('Mode de financement supprimé')
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression'))
    },
  })
}
