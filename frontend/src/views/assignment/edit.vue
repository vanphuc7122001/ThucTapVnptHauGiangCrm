<script>
import { reactive } from "vue";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const update = () => {
      if (props.item.name.length > 0 && props.item.content.length > 0) {
        ctx.emit("update");
      }
    };
    return {
      update,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-edit">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Chỉnh sửa phân công
          </h4>
          <button type="button" class="close" data-dismiss="modal" @click="$emit('cancel')">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body" style="overflow: auto; max-height: 700px;">
          <form class="was-validated">
            <div class="form-group">
              <label for="name"
                >Khách hàng(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id=""
                name=""
                v-model="item.customer"
                required
              />
            </div>

            <div class="form-group">
              <label for=""
                >Nhân viên(<span style="color: red">*</span>):</label
              >
              <select id="" class="form-control" v-model="item.staff" required>
                <option selected>Choose...</option>
                <option>Trúc</option>
                <option>Vân Anh</option>
                <option>Lan Anh</option>
                <option>Duy</option>
                <option>Long</option>
                <option>Phúc</option>
              </select>
            </div>

            <div class="form-group">
              <label for="">Ngày bắt đầu(<span style="color: red">*</span>):</label>
              <input
                type="date"
                class="form-control"
                id=""
                v-model="item.startDate"
                required
              />
            </div>

            <div class="form-group">
              <label for="">Ngày kết thúc(<span style="color: red">*</span>):</label>
              <input
                type="date"
                class="form-control"
                id=""
                v-model="item.endDate"
                required
              />
            </div>

            <div class="form-group">
              <label for="">Chu kỳ(<span style="color: red">*</span>):</label>
              <input
                type="text"
                class="form-control"
                id=""
                v-model="item.cycle"
                required
              />
            </div>

            <div class="form-group">
              <label for="">Nội dung(<span style="color: red">*</span>):</label>
              <textarea
                class="form-control"
                v-model="item.content"
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="">Trạng thái:</label>
              <input
                type="text"
                class="form-control"
                id=""
                v-model="item.status"
                required
              />
            </div>
            <div class="form-group">
              <label for="">Nội dung trạng thái(<span style="color: red">*</span>):</label>
              <textarea
                class="form-control"
                v-model="item.statusContent"
                required
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-warning px-3 py-2"
              style="font-size: 14px"
              id="edit"
              data-dismiss="modal"
            >
              <span>Cập nhật</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show-modal {
  display: block;
  opacity: 1;
  pointer-events: auto;
}
</style>
