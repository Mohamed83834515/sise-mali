import { apiClient } from '@/shared/api'
import type { EtatFinancementFormData } from '@/shared/schemas/parametrageFinancementSchemas'

const BASE_URL = '/etats-financement-projet/'

export const etatFinancementService = {
  async getAll(): Promise<EtatFinancement[]> {
    const res = await apiClient.request<EtatFinancement[]>(BASE_URL)
    return Array.isArray(res) ? res : []
  },

  async getById(id: number): Promise<EtatFinancement> {
    return await apiClient.request<EtatFinancement>(`${BASE_URL}${id}/`)
  },

  async create(data: EtatFinancementFormData): Promise<EtatFinancement> {
    return await apiClient.request<EtatFinancement>(BASE_URL, {
      method: 'POST',
      data,
    })
  },

  async update(id: number, data: EtatFinancementFormData): Promise<EtatFinancement> {
    return await apiClient.request<EtatFinancement>(`${BASE_URL}${id}/`, {
      method: 'PUT',
      data,
    })
  },

  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: 'DELETE',
    })
  },
}
