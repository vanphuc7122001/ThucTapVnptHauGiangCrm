import createApiClient from "./api.service";

class departmentsService {
  constructor(baseUrl = "/api/departments") {
    this.api = createApiClient(baseUrl);
  }
  async create(data) {
    return (await this.api.post(`/`, data)).data;
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async getOne(id) {
    return (await this.api.get(`${id}`)).data;
  }
  async findAllDepOfACenter(centerId) {
    return (await this.api.get(`/center/${centerId}`)).data;
  }
  async update(id, data) {
    return (await this.api.post(`/${id}`, data)).data;
  }
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
  async deleteOne(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
}

export default new departmentsService();