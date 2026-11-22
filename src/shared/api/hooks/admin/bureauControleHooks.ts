import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bureauControleService } from '@/shared/api/services/bureauControleService'
import type { BureauControleFormData } from '@/shared/schemas/bureauControleSchema'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const bureauControleQueryKeys = {
  all: ['bureaux-controle'] as const,
  list: () => [...bureauControleQueryKeys.all, 'list'] as const,
}

export const useGetBureauxControle = () => {
  return useQuery({
    queryKey: bureauControleQueryKeys.list(),
    queryFn: () => bureauControleService.getAll(),
  })
}

export const useSaveBureauControle = (
  isEdit: boolean,
  currentRow?: any,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BureauControleFormData) =>
      isEdit && currentRow?.id_bureau
        ? bureauControleService.update(currentRow.id_bureau, data)
        : bureauControleService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: bureauControleQueryKeys.list(),
      })
      toast.success(isEdit ? 'Bureau de contrôle modifié' : 'Bureau de contrôle créé')
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Une erreur est survenue'))
    },
  })
}

export const useDeleteBureauControle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => bureauControleService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: bureauControleQueryKeys.list(),
      })
      toast.success('Bureau de contrôle supprimé')
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression'))
    },
  })
}
