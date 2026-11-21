import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { etatFinancementService } from '@/shared/api/services/etatFinancementService'
import type { EtatFinancementFormData } from '@/shared/schemas/parametrageFinancementSchemas'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const etatFinancementQueryKeys = {
  all: ['etats-financement-projet'] as const,
  list: () => [...etatFinancementQueryKeys.all, 'list'] as const,
}

export const useGetEtatsFinancement = () => {
  return useQuery({
    queryKey: etatFinancementQueryKeys.list(),
    queryFn: () => etatFinancementService.getAll(),
  })
}

export const useSaveEtatFinancement = (
  isEdit: boolean,
  currentRow?: any,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EtatFinancementFormData) =>
      isEdit && currentRow?.id_etat_financement
        ? etatFinancementService.update(currentRow.id_etat_financement, data)
        : etatFinancementService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: etatFinancementQueryKeys.list(),
      })
      toast.success(isEdit ? 'État de financement modifié' : 'État de financement créé')
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Une erreur est survenue'))
    },
  })
}

export const useDeleteEtatFinancement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => etatFinancementService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: etatFinancementQueryKeys.list(),
      })
      toast.success('État de financement supprimé')
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression'))
    },
  })
}
