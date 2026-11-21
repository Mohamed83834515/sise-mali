import { apiClient } from '@/shared/api'
import type { EnvergureProjetFormData } from '@/shared/schemas/parametrageFinancementSchemas'

const BASE_URL = '/envergures-projet/'

export const envergureProjetService = {
  async getAll(): Promise<EnvergureProjet[]> {
    const res = await apiClient.request<EnvergureProjet[]>(BASE_URL)
    return Array.isArray(res) ? res : []
  },

  async getById(id: number): Promise<EnvergureProjet> {
    return await apiClient.request<EnvergureProjet>(`${BASE_URL}${id}/`)
  },

  async create(data: EnvergureProjetFormData): Promise<EnvergureProjet> {
    return await apiClient.request<EnvergureProjet>(BASE_URL, {
      method: 'POST',
      data,
    })
  },

  async update(id: number, data: EnvergureProjetFormData): Promise<EnvergureProjet> {
    return await apiClient.request<EnvergureProjet>(`${BASE_URL}${id}/`, {
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
