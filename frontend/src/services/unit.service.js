import createApiClient from "./api.service";

class unitsService {
  constructor(baseUrl = "/api/units") {
    this.api = createApiClient(baseUrl);
  }
  async create(data) {
    return (await this.api.post(`/`, data)).data;
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async getOne(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async findAllUnitsOfADep(depId) {
    return (await this.api.get(`/dep/${depId}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
  async deleteOne(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new unitsService();