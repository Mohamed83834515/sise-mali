import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { entrepriseTravauxService } from '@/shared/api/services/entrepriseTravauxService'
import type { EntrepriseTravauxFormData } from '@/shared/schemas/entrepriseTravauxSchema'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const entrepriseTravauxQueryKeys = {
  all: ['entreprises-travaux'] as const,
  list: () => [...entrepriseTravauxQueryKeys.all, 'list'] as const,
}

export const useGetEntreprisesTravaux = () => {
  return useQuery({
    queryKey: entrepriseTravauxQueryKeys.list(),
    queryFn: () => entrepriseTravauxService.getAll(),
  })
}

export const useSaveEntrepriseTravaux = (
  isEdit: boolean,
  currentRow?: any,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EntrepriseTravauxFormData) =>
      isEdit && currentRow?.id_entreprise
        ? entrepriseTravauxService.update(currentRow.id_entreprise, data)
        : entrepriseTravauxService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: entrepriseTravauxQueryKeys.list(),
      })
      toast.success(
        isEdit ? 'Entreprise de travaux modifiée' : 'Entreprise de travaux créée'
      )
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Une erreur est survenue'))
    },
  })
}

export const useDeleteEntrepriseTravaux = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => entrepriseTravauxService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: entrepriseTravauxQueryKeys.list(),
      })
      toast.success('Entreprise de travaux supprimée')
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression'))
    },
  })
}
