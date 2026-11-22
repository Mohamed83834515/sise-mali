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

  async getByProjet(projetId: number): Promise<Infrastructure[]> {
    try {
      const res = await apiClient.request<Infrastructure[]>(`${BASE_URL}?projet=${projetId}`)
      const items = normalizeApiList<Infrastructure>(res)
      if (items.length > 0) return items
    } catch {
      // Si le paramètre ?projet n'est pas géré côté backend, fallback sur filtrage côté client
    }

    try {
      const all = await this.getAll()
      return all.filter((item) => {
        const id = resolveRelationId(item.projet, 'id_projet') ?? resolveRelationId(item.projet, 'id')
        return id === projetId || Number(item.projet) === projetId
      })
    } catch {
      return []
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
