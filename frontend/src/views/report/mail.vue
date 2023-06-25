<script>
import { reactive, ref } from "vue";
import MailService from '../../services/mail.service'
import {
  alert_error,
  alert_success
} from '../common/import'


export default {
  setup(props, ntx) {

    const item = reactive({
      title: "",
      content: "",
      mail: "",
    });

    const selectedFile = ref(null);
    const handleFileUpload = (event) => {
      selectedFile.value = event.target.files[0];
      console.log('file uploaded', selectedFile.value);
    };


    const sendEmail = async () => {
      const formData = new FormData();
      formData.append('filePdf', selectedFile.value);
      formData.append('title', item.title);
      formData.append('content', item.content);
      formData.append('mail', item.mail);


      // console.log('title', item.title);
      // console.log('content', item.content);
      // console.log('mail', item.mail);
      const response = await MailService.sendMailReport(formData)
      console.log(response);
      if (response.error) {
        alert_error('Lỗi', 'Mail gửi đi thất bại')
      } else {
        alert_success('Thành công', 'Mail gửi đi thành công')
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
            <h4 class="modal-title" style="font-size: 16px">Thư điện tử</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal body -->
          <div class="model-body">
            <div class="d-flex">
              <!-- steps -->

              <!-- form -->
              <div class="d-flex flex-grow-1 flex-column step-content px-3 my-3" style="width: 10000px">
                <!-- page 1 -->
                <form @submit.prevent="sendEmail" class="was-validated" style="width: 100%">
                  <div class="form-group flex-grow-1">
                    <label for="name">Gửi đến(<span style="color: red">*</span>):</label>
                    <input type="text" class="form-control w-100" id="name" name="name" v-model="item.mail" required />
                  </div>
                  <div class="form-group flex-grow-1">
                    <label for="name">Tiêu đề mail(<span style="color: red">*</span>):</label>
                    <input type="text" class="form-control w-100" id="name" name="name" v-model="item.title" required />
                  </div>
                  <div class="form-group flex-grow-1">
                    <label for="content">Nội dung (<span style="color: red">*</span>):</label>
                    <textarea id="content" required class="form-control w-100" rows="5" v-model="item.content"></textarea>
                  </div>
                  <div class="form-group flex-grow-1">
                    <label for="name">Đính kèm pdf(<span style="color: red">*</span>):</label>
                    <input type="file" class="form-control w-100" id="name" name="name" ref="fileInput"
                      @change="handleFileUpload" required />
                  </div>
                  <button type="button " class="btn btn-warning px-3 py-2" style="font-size: 14px" id="add">
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