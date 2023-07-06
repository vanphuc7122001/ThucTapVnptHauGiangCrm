<script>
import { reactive, ref } from "vue";
import MailService from "../../services/mail.service";
import { alert_error, alert_success } from "../common/import";

export default {
  setup(props, ntx) {
    const item = reactive({
      title: "",
      content: "",
      mail: "",
      selectedFile: []
    });

    const handleFileUpload = (event) => {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        item.selectedFile.push(files[i]);
      }
      // console.log('FIle upload', item.selectedFile.length);
    };

    const sendEmail = async () => {
      const formData = new FormData();
      // formData.append("filePdf", selectedFile.value);
      formData.append("title", item.title);
      formData.append("content", item.content);
      formData.append("mail", item.mail);
      for (let i = 0; i < item.selectedFile.length; i++) {
          formData.append("file_multiple", item.selectedFile[i]);
      }
      
      const response = await MailService.sendMailMultiple(formData);
      
      if (response.error) {
        alert_error("Gửi mail thất bại", "");
      } else {
        alert_success("Gửi mail thành công", "");
      }
    };

    return {
      sendEmail,
      handleFileUpload,
      item,
    };
  },
};
</script>
<template>
  <!-- The Modal -->
  <div>
    <div class="modal" id="model-form-mail">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title" style="font-size: 18px">Thư điện tử</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal body -->
          <div class="model-body">
            <div class="d-flex">
              <!-- steps -->

              <!-- form -->
              <div
                class="d-flex flex-grow-1 flex-column step-content px-3 my-3"
                style="width: 10000px"
              >
                <!-- page 1 -->
                <form
                  @submit.prevent="sendEmail"
                  class="was-validated"
                  style="width: 100%"
                >
                  <div class="form-group flex-grow-1">
                    <label for="name"
                      >Gửi đến(<span style="color: red">*</span>):</label
                    >
                    <input
                      type="text"
                      class="form-control w-100"
                      id="name"
                      name="name"
                      v-model="item.mail"
                      required
                    />
                  </div>
                  <div class="form-group flex-grow-1">
                    <label for="name"
                      >Tiêu đề mail(<span style="color: red">*</span>):</label
                    >
                    <input
                      type="text"
                      class="form-control w-100"
                      id="name"
                      name="name"
                      v-model="item.title"
                      required
                    />
                  </div>
                  <div class="form-group flex-grow-1">
                    <label for="content"
                      >Nội dung (<span style="color: red">*</span>):</label
                    >
                    <textarea
                      id="content"
                      required
                      class="form-control w-100"
                      rows="5"
                      v-model="item.content"
                    ></textarea>
                  </div>
                  <div class="form-group flex-grow-1">
                    <label for="name"
                      >Đính kèm pdf(<span style="color: red">*</span>):</label
                    >
                    <input
                      type="file"
                      class="form-control w-100"
                      id="name"
                      name="name"
                      multiple
                      ref="fileInput"
                      @change="handleFileUpload"
                      required
                    />
                  </div>
                  <button
                    type="button "
                    class="btn btn-warning px-3 py-2"
                    style="font-size: 14px"
                    id="add"
                  >
                    <span>Gửi</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@media screen and (min-width: 739px) and (max-width: 992px) {
  .modal-content {
    width: 200%;
    margin-left: -50%;
  }
}
</style>
