import { apiClient } from '@/shared/api'
import type { EntrepriseTravauxFormData } from '@/shared/schemas/entrepriseTravauxSchema'

const BASE_URL = '/entreprises-travaux/'

export const entrepriseTravauxService = {
  async getAll(): Promise<EntrepriseTravaux[]> {
    const res = await apiClient.request<EntrepriseTravaux[]>(BASE_URL)
    return Array.isArray(res) ? res : []
  },

  async getById(id: number): Promise<EntrepriseTravaux> {
    return await apiClient.request<EntrepriseTravaux>(`${BASE_URL}${id}/`)
  },

  async create(data: EntrepriseTravauxFormData): Promise<EntrepriseTravaux> {
    return await apiClient.request<EntrepriseTravaux>(BASE_URL, {
      method: 'POST',
      data,
    })
  },

  async update(id: number, data: EntrepriseTravauxFormData): Promise<EntrepriseTravaux> {
    return await apiClient.request<EntrepriseTravaux>(`${BASE_URL}${id}/`, {
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
