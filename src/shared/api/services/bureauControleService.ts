import { apiClient } from '@/shared/api'
import type { BureauControleFormData } from '@/shared/schemas/bureauControleSchema'

const BASE_URL = '/bureaux-controle/'

export const bureauControleService = {
  async getAll(): Promise<BureauControle[]> {
    const res = await apiClient.request<BureauControle[]>(BASE_URL)
    return Array.isArray(res) ? res : []
  },

  async getById(id: number): Promise<BureauControle> {
    return await apiClient.request<BureauControle>(`${BASE_URL}${id}/`)
  },

  async create(data: BureauControleFormData): Promise<BureauControle> {
    return await apiClient.request<BureauControle>(BASE_URL, {
      method: 'POST',
      data,
    })
  },

  async update(id: number, data: BureauControleFormData): Promise<BureauControle> {
    return await apiClient.request<BureauControle>(`${BASE_URL}${id}/`, {
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
