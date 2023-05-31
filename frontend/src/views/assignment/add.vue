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
    const data = reactive({
      task2: {
        ID: 100,
        customer: "",
        staff: "",
        startDate: "",
        endDate: "",
        cycle: "",
        content: "",
      },
    });
    const create = () => {
      if (props.item.name.length > 0 && props.item.content.length > 0) {
        ctx.emit("create");
      }
    };
    return {
      create,
      data,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <!-- The Modal -->
  <div class="modal" id="model-add">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm mới nhiệm vụ</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="/action_page.php" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Khách hàng(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id=""
                name=""
                v-model="data.task2.customer"
                required
              />
            </div>

            <div class="form-group">
              <label for=""
                >Nhân viên(<span style="color: red">*</span>):</label
              >
              <select id="" class="form-control" v-model="data.task2.staff" required>
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
                v-model="data.task2.startDate"
                required
              />
            </div>

            <div class="form-group">
              <label for="">Ngày kết thúc(<span style="color: red">*</span>):</label>
              <input
                type="date"
                class="form-control"
                id=""
                v-model="data.task2.endDate"
                required
              />
            </div>

            <div class="form-group">
              <label for="">Chu kỳ(<span style="color: red">*</span>):</label>
              <input
                type="text"
                class="form-control"
                id=""
                v-model="data.task2.cycle"
                required
              />
            </div>

            <div class="form-group">
              <label for="">Nội dung(<span style="color: red">*</span>):</label>
              <textarea
                class="form-control"
                v-model="data.task2.content"
                required
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              id="add"
              data-dismiss="modal"
            >
              <span @click="">Thêm</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
