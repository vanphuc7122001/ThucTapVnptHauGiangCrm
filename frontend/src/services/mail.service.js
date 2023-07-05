import createApiClient from "./api.service";

class EventService {
  constructor(baseUrl = "/api/mail") {
    this.api = createApiClient(baseUrl);
  }
  async sendmail(data) {
    return (await this.api.post("/", data)).data;
  }

  async sendMailReport(data) {
    return (
      await this.api.post("/send-mail", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo định dạng dữ liệu là multipart/form-data
        },
      })
    ).data;
  }

  async sendMailMultiple(data) {
    return (
      await this.api.post("/send-mail-muliple", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo định dạng dữ liệu là multipart/form-data
        },
      })
    ).data;
  }
}

export default new EventService();
