import { apiClient } from '@/shared/api'
import { normalizeApiList } from './apiListUtils'

const BASE_URL = '/phases-projet/'

export const phaseProjetService = {
  async getAll(): Promise<PhaseProjet[]> {
    try {
      const res = await apiClient.request<PhaseProjet[]>(BASE_URL)
      return normalizeApiList<PhaseProjet>(res)
    } catch {
      return []
    }
  },

  async getByProjet(projetId: number): Promise<PhaseProjet[]> {
    try {
      const res = await apiClient.request<PhaseProjet[]>(`/projets/${projetId}/phases/`)
      return normalizeApiList<PhaseProjet>(res)
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const res = await apiClient.request<PhaseProjet[]>(`${BASE_URL}?projet=${projetId}`)
          return normalizeApiList<PhaseProjet>(res)
        } catch {
          return []
        }
      }
      throw err
    }
  },

  async getById(id: number): Promise<PhaseProjet> {
    return await apiClient.request<PhaseProjet>(`${BASE_URL}${id}/`)
  },

  async create(data: { nom_phase: string; projet: number }): Promise<PhaseProjet> {
    try {
      return await apiClient.request<PhaseProjet>(`/projets/${data.projet}/phases/`, {
        method: 'POST',
        data,
      })
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        return await apiClient.request<PhaseProjet>(BASE_URL, {
          method: 'POST',
          data,
        })
      }
      throw err
    }
  },

  async update(id: number, data: { nom_phase: string; projet: number }): Promise<PhaseProjet> {
    return await apiClient.request<PhaseProjet>(`${BASE_URL}${id}/`, {
      method: 'PUT',
      data,
    })
  },

  async patch(id: number, data: Partial<{ nom_phase: string; projet: number }>): Promise<PhaseProjet> {
    return await apiClient.request<PhaseProjet>(`${BASE_URL}${id}/`, {
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
