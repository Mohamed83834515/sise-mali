import { apiClient } from '@/shared/api'
import { normalizeApiList } from './apiListUtils'
import { resolveRelationId } from '@/shared/utils/resolveApiRelation'

const BASE_URL = '/infrastructures/'

export const infrastructureService = {
  async getAll(): Promise<Infrastructure[]> {
    try {
      const res = await apiClient.request<Infrastructure[]>(BASE_URL)
      return normalizeApiList<Infrastructure>(res)
    } catch {
      return []
    }
  },

  async getByProjet(
    projetId: number,
    filters?: { type_infrastructure?: number; secteur?: number; localite?: number }
  ): Promise<Infrastructure[]> {
    const params = new URLSearchParams()
    if (filters?.type_infrastructure) {
      params.append('type_infrastructure', String(filters.type_infrastructure))
    }
    if (filters?.secteur) {
      params.append('secteur', String(filters.secteur))
    }
    if (filters?.localite) {
      params.append('localite', String(filters.localite))
    }
    const query = params.toString() ? `?${params.toString()}` : ''

    try {
      const res = await apiClient.request<Infrastructure[]>(
        `/projets/${projetId}/infrastructures/${query}`
      )
      return normalizeApiList<Infrastructure>(res)
    } catch {
      // Fallback si la route imbriquée n'est pas disponible
      try {
        const res = await apiClient.request<Infrastructure[]>(
          `${BASE_URL}?projet=${projetId}`
        )
        return normalizeApiList<Infrastructure>(res)
      } catch {
        const all = await this.getAll()
        return all.filter((item) => {
          const id =
            resolveRelationId(item.projet, 'id_projet') ??
            resolveRelationId(item.projet, 'id')
          return id === projetId || Number(item.projet) === projetId
        })
      }
    }
  },

  async createForProjet(
    projetId: number,
    data: Record<string, any> | FormData
  ): Promise<Infrastructure> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
    try {
      return await apiClient.request<Infrastructure>(
        `/projets/${projetId}/infrastructures/`,
        {
          method: 'POST',
          data,
          headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
        }
      )
    } catch {
      // Fallback sur la route standard POST /infrastructures/
      return await this.create(data)
    }
  },

  async getById(id: number): Promise<Infrastructure> {
    return await apiClient.request<Infrastructure>(`${BASE_URL}${id}/`)
  },

  async create(data: Record<string, any> | FormData): Promise<Infrastructure> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
    return await apiClient.request<Infrastructure>(BASE_URL, {
      method: 'POST',
      data,
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })
  },

  async update(id: number, data: Record<string, any> | FormData): Promise<Infrastructure> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
    return await apiClient.request<Infrastructure>(`${BASE_URL}${id}/`, {
      method: 'PUT',
      data,
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })
  },

  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: 'DELETE',
    })
  },
}
