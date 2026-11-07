import { apiClient } from '@/shared/api'
import type { ModePassationFormData } from '@/shared/schemas/modePassationSchema'

const ENDPOINT = '/modes-passation/'

export const modePassationService = {
  async getAll(): Promise<ModePassation[]> {
    return apiClient.request<ModePassation[]>(ENDPOINT, { method: 'GET' })
  },

  async getById(id: number): Promise<ModePassation> {
    return apiClient.request<ModePassation>(`${ENDPOINT}${id}/`, { method: 'GET' })
  },

  async create(data: ModePassationFormData): Promise<ModePassation> {
    return apiClient.request<ModePassation>(ENDPOINT, {
      method: 'POST',
      data,
    })
  },

  async update(
    id: number,
    data: Partial<ModePassationFormData>
  ): Promise<ModePassation> {
    return apiClient.request<ModePassation>(`${ENDPOINT}${id}/`, {
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
