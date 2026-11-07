import { apiClient } from '@/shared/api'
import type { NatureMarcheFormData } from '@/shared/schemas/natureMarcheSchema'

const ENDPOINT = '/natures-marche/'

export const natureMarcheService = {
  async getAll(): Promise<NatureMarche[]> {
    return apiClient.request<NatureMarche[]>(ENDPOINT, { method: 'GET' })
  },

  async getById(id: number): Promise<NatureMarche> {
    return apiClient.request<NatureMarche>(`${ENDPOINT}${id}/`, { method: 'GET' })
  },

  async create(data: NatureMarcheFormData): Promise<NatureMarche> {
    return apiClient.request<NatureMarche>(ENDPOINT, {
      method: 'POST',
      data,
    })
  },

  async update(
    id: number,
    data: Partial<NatureMarcheFormData>
  ): Promise<NatureMarche> {
    return apiClient.request<NatureMarche>(`${ENDPOINT}${id}/`, {
      method: 'PUT',
      data,
    })
  },

  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${ENDPOINT}${id}/`, {
      method: 'DELETE',
    })
  },
}
