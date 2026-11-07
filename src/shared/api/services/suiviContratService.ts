import { apiClient } from '@/shared/api'
import { normalizeApiList } from './apiListUtils'

const ENDPOINT = '/suivis-contrats/'

export const suiviContratService = {
  async getAll(params?: {
    etat?: boolean
    indicateur_contrat?: number
    trimestre?: string
  }): Promise<SuiviContrat[]> {
    const response = await apiClient.request<unknown>(ENDPOINT, {
      method: 'GET',
      params,
    })
    return normalizeApiList<SuiviContrat>(response)
  },
}

export default suiviContratService
