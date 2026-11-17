import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/axios/api'
import {
  GeneralParamsSchema,
  type GeneralParamsRaw,
} from '@/simadou/schemas/generalParams.schema'

export const generalParamsKeys = {
  all:    () => ['general-params']           as const,
  single: () => ['general-params', 'single'] as const,
}

export function useGeneralParamsQuery() {
  return useQuery({
    queryKey: generalParamsKeys.single(),
    queryFn:  async () => {
      try {
        const raw = await apiClient.request<GeneralParamsRaw>('/configuration/')
        return GeneralParamsSchema.parse(raw)
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.status === 404) {
          return null
        }
        throw err
      }
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.status === 404) return false
      return failureCount < 2
    },
    staleTime: 1000 * 60 * 10,
  })
}