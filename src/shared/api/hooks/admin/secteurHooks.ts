import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { secteurService } from '@/shared/api/services/secteurService'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const secteurQueryKeys = {
  all: ['secteurs-projet'] as const,
  list: () => [...secteurQueryKeys.all, 'list'] as const,
}

export const useGetAllSecteurs = () => {
  return useQuery({
    queryKey: secteurQueryKeys.list(),
    queryFn: () => secteurService.getAll(),
  })
}

export const useSaveSecteur = (
  isEdit: boolean,
  currentRow?: any,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Secteur>) =>
      isEdit && currentRow?.id_secteur
        ? secteurService.update(currentRow.id_secteur, data)
        : secteurService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: secteurQueryKeys.list(),
      })
      toast.success(isEdit ? 'Secteur modifié avec succès' : 'Secteur créé avec succès')
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Une erreur est survenue'))
    },
  })
}

export const useDeleteSecteur = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => secteurService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: secteurQueryKeys.list(),
      })
      toast.success('Secteur supprimé avec succès')
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression'))
    },
  })
}
