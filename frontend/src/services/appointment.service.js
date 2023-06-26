import createApiClient from "./api.service";

class EventService {
    constructor(baseUrl = "/api/appointments") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async deleteOne(id, data) {
        return (await this.api.post(`/${id}`,data)).data;
    }
    async findAllAppointment(id){
        return (await this.api.get(`/task/${id}`)).data;
    }
}

export default new EventService();