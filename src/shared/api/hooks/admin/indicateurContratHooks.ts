import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { invalidateAndRefetch } from '@/shared/api/hooks/admin/queryInvalidation'
import { indicateurContratService } from '@/shared/api/services/indicateurContratService'
import type { IndicateurContratPayload } from '@/shared/types/entities/indicateurContrat'
import type { IndicateurContratFormData } from '@/shared/schemas/indicateurContratSchemas'

export const indicateurContratQueryKeys = {
  byContrat: (idContrat: number) =>
    ['indicateurs-contrats', idContrat] as const,
}

export function useGetIndicateursContrat(
  idContrat: number,
  cadreIds: number[] = []
) {
  return useQuery({
    queryKey: [
      ...indicateurContratQueryKeys.byContrat(idContrat),
      cadreIds.join(','),
    ],
    queryFn: () => indicateurContratService.getByContrat(idContrat, cadreIds),
    enabled: Number.isFinite(idContrat) && idContrat > 0,
  })
}

export function useCreateIndicateurContrat(idContrat: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IndicateurContratPayload) =>
      indicateurContratService.create(data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(
        queryClient,
        indicateurContratQueryKeys.byContrat(idContrat)
      )
    },
  })
}

export function useUpdateIndicateurContrat(idContrat: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<IndicateurContratPayload>
    }) => indicateurContratService.update(id, data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(
        queryClient,
        indicateurContratQueryKeys.byContrat(idContrat)
      )
    },
  })
}

export function useDeleteIndicateurContrat(idContrat: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => indicateurContratService.delete(id),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(
        queryClient,
        indicateurContratQueryKeys.byContrat(idContrat)
      )
    },
  })
}

export type { IndicateurContratFormData }
