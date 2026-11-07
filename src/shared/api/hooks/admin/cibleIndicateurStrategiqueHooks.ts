import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cibleIndicateurStrategiqueService } from '@/shared/api/services/cibleIndicateurStrategiqueService'
import type { CibleIndicateurStrategiquePayload } from '@/shared/schemas/indicateurStrategiqueSchemas'
import { invalidateAndRefetch } from '@/shared/api/hooks/admin/queryInvalidation'

export const cibleIndicateurStrategiqueQueryKeys = {
  all: ['cibles-indicateur-strategique'] as const,
} as const

export function useGetCiblesIndicateurStrategique() {
  return useQuery({
    queryKey: cibleIndicateurStrategiqueQueryKeys.all,
    queryFn: () => cibleIndicateurStrategiqueService.getAll(),
  })
}

export function useCreateCibleIndicateurStrategique() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CibleIndicateurStrategiquePayload) =>
      cibleIndicateurStrategiqueService.create(
        data as CibleIndicateurStrategique
      ),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, cibleIndicateurStrategiqueQueryKeys.all)
    },
  })
}

export function useUpdateCibleIndicateurStrategique() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: CibleIndicateurStrategiquePayload
    }) =>
      cibleIndicateurStrategiqueService.update(
        id,
        data as CibleIndicateurStrategique
      ),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, cibleIndicateurStrategiqueQueryKeys.all)
    },
  })
}

export function useDeleteCibleIndicateurStrategique() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cibleIndicateurStrategiqueService.delete(id),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, cibleIndicateurStrategiqueQueryKeys.all)
    },
  })
}
