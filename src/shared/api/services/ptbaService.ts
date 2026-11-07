import { apiClient } from "@/shared/api";
import { PtbaFormData } from "@/shared/schemas/ptbaSchemas";
import { buildPtbaApiPayload } from "@/shared/utils/ptbaFormUtils";

const ENDPOINT = "/ptbas/";

const ptbaService = {
  async getAll(codeProgramme?: string, idVersionPtba?: number): Promise<Ptba[]> {

    const response:any = await
      apiClient.request(`/versions-ptbas/${idVersionPtba}/ptbas-programmes/?programme=${codeProgramme}`, {
        method: "GET"
      }
      );
    return response.ptbas_programmes as Ptba[];
  },

  async getById(id: number): Promise<Ptba> {
    return apiClient.request(`${ENDPOINT}${id}/`, { method: "GET" });
  },

  async create(data: PtbaFormData): Promise<Ptba> {
    return apiClient.request(ENDPOINT, {
      method: "POST",
      data: buildPtbaApiPayload(data),
    });
  },

  async update(id: number, data: Partial<PtbaFormData>): Promise<Ptba> {
    return apiClient.request(`${ENDPOINT}${id}/`, {
      method: "PUT",
      data: buildPtbaApiPayload(data as PtbaFormData),
    });
  },

  async delete(id: number): Promise<void> {
    await apiClient.request(`${ENDPOINT}${id}/`, {
      method: "DELETE",
    });
  },
};

export default ptbaService;
