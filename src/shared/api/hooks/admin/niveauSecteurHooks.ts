import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { niveauSecteurService } from '@/shared/api/services/niveauSecteurService'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api-error-message'

export const niveauSecteurQueryKeys = {
  all: ['niveaux-secteur-projet'] as const,
  list: () => [...niveauSecteurQueryKeys.all, 'list'] as const,
}

export const useGetNiveauxSecteur = () => {
  return useQuery({
    queryKey: niveauSecteurQueryKeys.list(),
    queryFn: () => niveauSecteurService.getAll(),
  })
}

export const useSaveNiveauSecteur = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<NiveauSecteur, 'id_niveau_secteur'>) =>
      niveauSecteurService.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: niveauSecteurQueryKeys.list(),
      })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la création du niveau de secteur'))
    },
  })
}

export const useUpdateNiveauSecteur = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NiveauSecteur> }) =>
      niveauSecteurService.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: niveauSecteurQueryKeys.list(),
      })
      onSuccess?.()
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la modification du niveau de secteur'))
    },
  })
}

export const useDeleteNiveauSecteur = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => niveauSecteurService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: niveauSecteurQueryKeys.list(),
      })
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la suppression du niveau de secteur'))
    },
  })
}
