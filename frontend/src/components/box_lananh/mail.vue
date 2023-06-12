<script>
import { reactive, ref } from "vue";
import axios from "axios";
import mailService from "../../services/mail.service";
export default {
  setup(props, ntx) {
    const item = reactive({
      title: "",
      content: "",
      mail: "",
    });
    const sendEmail = async () => {
      // console.log("mail:", item);
      ntx.emit("sendEmail", item);
      // try {
      //   await mailService.sendmail(item);
      //   console.log("Email sent successfully.");
      // } catch (error) {
      //   console.error("Error sending email:", error);
      // }
    };

    return {
      sendEmail,
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
            <h4 class="modal-title" style="font-size: 15px">
              Thêm sự kiện mới
            </h4>
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
                      >Nội dung sự kiện(<span style="color: red">*</span
                      >):</label
                    >
                    <textarea
                      id="content"
                      required
                      class="form-control w-100"
                      rows="5"
                      v-model="item.content"
                    ></textarea>
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