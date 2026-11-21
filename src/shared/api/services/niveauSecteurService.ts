import { apiClient } from '@/shared/api'

const BASE_URL = '/niveaux-secteur-projet/'

export const niveauSecteurService = {
  async getAll(): Promise<NiveauSecteur[]> {
    const res = await apiClient.request<NiveauSecteur[]>(BASE_URL)
    return Array.isArray(res) ? res : []
  },

  async getById(id: number): Promise<NiveauSecteur> {
    return await apiClient.request<NiveauSecteur>(`${BASE_URL}${id}/`)
  },

  async create(data: Omit<NiveauSecteur, 'id_niveau_secteur'>): Promise<NiveauSecteur> {
    return await apiClient.request<NiveauSecteur>(BASE_URL, {
      method: 'POST',
      data,
    })
  },

  async update(id: number, data: Partial<NiveauSecteur>): Promise<NiveauSecteur> {
    return await apiClient.request<NiveauSecteur>(`${BASE_URL}${id}/`, {
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
