import { apiClient } from '@/shared/api'
import type { NiveauAvancementFormData } from '@/shared/schemas/parametrageFinancementSchemas'

const BASE_URL = '/niveaux-avancement-projet/'

export const niveauAvancementService = {
  async getAll(): Promise<NiveauAvancementProjet[]> {
    const res = await apiClient.request<NiveauAvancementProjet[]>(BASE_URL)
    return Array.isArray(res) ? res : []
  },

  async getById(id: number): Promise<NiveauAvancementProjet> {
    return await apiClient.request<NiveauAvancementProjet>(`${BASE_URL}${id}/`)
  },

  async create(data: NiveauAvancementFormData): Promise<NiveauAvancementProjet> {
    return await apiClient.request<NiveauAvancementProjet>(BASE_URL, {
      method: 'POST',
      data,
    })
  },

  async update(id: number, data: NiveauAvancementFormData): Promise<NiveauAvancementProjet> {
    return await apiClient.request<NiveauAvancementProjet>(`${BASE_URL}${id}/`, {
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
