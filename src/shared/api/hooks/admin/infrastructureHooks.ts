import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { infrastructureService } from '@/shared/api/services/infrastructureService'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const infrastructureQueryKeys = {
  all: ['infrastructures'] as const,
  list: () => [...infrastructureQueryKeys.all, 'list'] as const,
  byProjet: (idProjet: number) => [...infrastructureQueryKeys.all, 'projet', idProjet] as const,
}

export const useGetInfrastructures = (idProjet?: number) => {
  return useQuery({
    queryKey: idProjet
      ? infrastructureQueryKeys.byProjet(idProjet)
      : infrastructureQueryKeys.list(),
    queryFn: () =>
      idProjet
        ? infrastructureService.getByProjet(idProjet)
        : infrastructureService.getAll(),
    enabled: idProjet === undefined || idProjet > 0,
  })
}

export const useSaveInfrastructure = (
  isEdit: boolean,
  currentRow?: any,
  idProjet?: number,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Record<string, any> | FormData) => {
      if (isEdit && currentRow?.id_infrastructure) {
        return infrastructureService.update(currentRow.id_infrastructure, data)
      }
      if (idProjet) {
        return infrastructureService.createForProjet(idProjet, data)
      }
      return infrastructureService.create(data)
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: infrastructureQueryKeys.all,
      })
      if (idProjet) {
        await queryClient.invalidateQueries({
          queryKey: infrastructureQueryKeys.byProjet(idProjet),
        })
      }
      toast.success(
        isEdit ? 'Infrastructure modifiée avec succès' : 'Infrastructure créée avec succès'
      )
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Une erreur est survenue'))
    },
  })
}

export const useDeleteInfrastructure = (idProjet?: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => infrastructureService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: infrastructureQueryKeys.all,
      })
      if (idProjet) {
        await queryClient.invalidateQueries({
          queryKey: infrastructureQueryKeys.byProjet(idProjet),
        })
      }
      toast.success('Infrastructure supprimée avec succès')
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression'))
    },
  })
}
