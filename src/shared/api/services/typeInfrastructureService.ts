import { apiClient } from '@/shared/api'
import type { TypeInfrastructureFormData } from '@/shared/schemas/typeInfrastructureSchema'

const BASE_URL = '/types-infrastructures/'

export const typeInfrastructureService = {
  async getAll(): Promise<TypeInfrastructure[]> {
    const res = await apiClient.request<TypeInfrastructure[]>(BASE_URL)
    return Array.isArray(res) ? res : []
  },

  async getById(id: number): Promise<TypeInfrastructure> {
    return await apiClient.request<TypeInfrastructure>(`${BASE_URL}${id}/`)
  },

  async create(data: TypeInfrastructureFormData): Promise<TypeInfrastructure> {
    return await apiClient.request<TypeInfrastructure>(BASE_URL, {
      method: 'POST',
      data,
    })
  },

  async update(id: number, data: TypeInfrastructureFormData): Promise<TypeInfrastructure> {
    return await apiClient.request<TypeInfrastructure>(`${BASE_URL}${id}/`, {
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
