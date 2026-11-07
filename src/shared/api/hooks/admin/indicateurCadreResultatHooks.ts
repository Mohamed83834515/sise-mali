import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { indicateurCadreResultatService } from '@/shared/api/services/indicateurCadreResultatService'
import { invalidateAndRefetch } from '@/shared/api/hooks/admin/queryInvalidation'

export const indicateurCadreResultatQueryKeys = {
  all: ['indicateurs-cadre-resultat'] as const,
}

export function useGetIndicateursCadreResultat() {
  return useQuery({
    queryKey: indicateurCadreResultatQueryKeys.all,
    queryFn: () => indicateurCadreResultatService.getAll(),
  })
}

export function useCreateIndicateurCadreResultat(codeProjet: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IndicateurCadreResultatFormData) =>
      indicateurCadreResultatService.create({
        ...data,
        projet_iop: data.projet_iop ?? codeProjet,
      }),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, indicateurCadreResultatQueryKeys.all)
    },
  })
}

export function useUpdateIndicateurCadreResultat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<IndicateurCadreResultatFormData>
    }) => indicateurCadreResultatService.update(id, data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, indicateurCadreResultatQueryKeys.all)
    },
  })
}

export function useDeleteIndicateurCadreResultat() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => indicateurCadreResultatService.delete(id),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await invalidateAndRefetch(queryClient, indicateurCadreResultatQueryKeys.all)
    },
  })
}
