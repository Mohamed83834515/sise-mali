import { apiClient } from '@/shared/api'
import type { ModeFinancementFormData } from '@/shared/schemas/parametrageFinancementSchemas'

const BASE_URL = '/modes-financement-projet/'

export const modeFinancementService = {
  async getAll(): Promise<ModeFinancement[]> {
    const res = await apiClient.request<ModeFinancement[]>(BASE_URL)
    return Array.isArray(res) ? res : []
  },

  async getById(id: number): Promise<ModeFinancement> {
    return await apiClient.request<ModeFinancement>(`${BASE_URL}${id}/`)
  },

  async create(data: ModeFinancementFormData): Promise<ModeFinancement> {
    return await apiClient.request<ModeFinancement>(BASE_URL, {
      method: 'POST',
      data,
    })
  },

  async update(id: number, data: ModeFinancementFormData): Promise<ModeFinancement> {
    return await apiClient.request<ModeFinancement>(`${BASE_URL}${id}/`, {
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
