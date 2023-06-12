import createApiClient from "./api.service";

class EventService {
    constructor(baseUrl = "/api/mail") {
        this.api = createApiClient(baseUrl);
    }
    async sendmail(data) {
        return (await this.api.post("/", data)).data;
    }
}

export default new EventService();