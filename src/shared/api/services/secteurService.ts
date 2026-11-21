import { apiClient } from '@/shared/api'

const BASE_URL = '/secteurs-projet/'

export const secteurService = {
  async getAll(): Promise<Secteur[]> {
    const res = await apiClient.request<Secteur[]>(BASE_URL)
    return Array.isArray(res) ? res : []
  },

  async getById(id: number): Promise<Secteur> {
    return await apiClient.request<Secteur>(`${BASE_URL}${id}/`)
  },

  async create(data: Partial<Secteur>): Promise<Secteur> {
    return await apiClient.request<Secteur>(BASE_URL, {
      method: 'POST',
      data,
    })
  },

  async update(id: number, data: Partial<Secteur>): Promise<Secteur> {
    return await apiClient.request<Secteur>(`${BASE_URL}${id}/`, {
      method: 'PATCH',
      data,
    })
  },

  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: 'DELETE',
    })
  },
}
