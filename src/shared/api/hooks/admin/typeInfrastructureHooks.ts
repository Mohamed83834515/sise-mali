import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { typeInfrastructureService } from '@/shared/api/services/typeInfrastructureService'
import type { TypeInfrastructureFormData } from '@/shared/schemas/typeInfrastructureSchema'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const typeInfrastructureQueryKeys = {
  all: ['types-infrastructures'] as const,
  list: () => [...typeInfrastructureQueryKeys.all, 'list'] as const,
}

export const useGetTypesInfrastructures = () => {
  return useQuery({
    queryKey: typeInfrastructureQueryKeys.list(),
    queryFn: () => typeInfrastructureService.getAll(),
  })
}

export const useSaveTypeInfrastructure = (
  isEdit: boolean,
  currentRow?: any,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TypeInfrastructureFormData) =>
      isEdit && currentRow?.id_type_infrastructure
        ? typeInfrastructureService.update(currentRow.id_type_infrastructure, data)
        : typeInfrastructureService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: typeInfrastructureQueryKeys.list(),
      })
      toast.success(
        isEdit
          ? "Type d'infrastructure modifié"
          : "Type d'infrastructure créé"
      )
      onSuccess?.()
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Une erreur est survenue'))
    },
  })
}

export const useDeleteTypeInfrastructure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => typeInfrastructureService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: typeInfrastructureQueryKeys.list(),
      })
      toast.success("Type d'infrastructure supprimé")
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression'))
    },
  })
}
