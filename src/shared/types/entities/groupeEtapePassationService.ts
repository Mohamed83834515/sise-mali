import { apiClient } from '@/shared/api'
import type { GroupeEtapePassation } from './groupeEtapePassation'

const ENDPOINT = '/groupes-etapes-passation/'

export const groupeEtapePassationService = {
    async getAll(): Promise<GroupeEtapePassation[]> {
        return apiClient.request<GroupeEtapePassation[]>(ENDPOINT, {
            method: 'GET',
        })
    },

    async getById(id: number): Promise<GroupeEtapePassation> {
        return apiClient.request<GroupeEtapePassation>(`${ENDPOINT}${id}/`, {
            method: 'GET',
        })
    },
}