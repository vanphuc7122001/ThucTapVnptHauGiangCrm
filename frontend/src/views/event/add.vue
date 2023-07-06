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
    const create = () => {
      ctx.emit("create");
    };
    return {
      create,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-add">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 18px">Thêm sự kiện mới</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Tên sự kiện(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                v-model="item.name"
                required
              />
            </div>
            <div class="form-group">
              <label for="content"
                >Nội dung sự kiện(<span style="color: red">*</span>):</label
              >
              <textarea
                id="content"
                required
                class="form-control"
                rows="4"
                v-model="item.content"
              ></textarea>
            </div>
            <div class="form-group">
              <!-- <label for="content"
                >Thời gian diễn ra sự kiện(<span style="color: red">*</span
                >):</label
              > -->
              <div class="d-flex">
                <div class="form-group mr-3 w-100">
                  <label for="content"
                    >Thời gian bắt đầu(<span style="color: red">*</span
                    >):</label
                  >
                  <input
                    type="datetime-local"
                    class="form-control w-100"
                    id="start_time"
                    name="start_time"
                    v-model="item.start_time"
                    required
                  />
                </div>
                <div class="form-group w-100">
                  <label for="content"
                    >Thời gian kết thúc(<span style="color: red">*</span
                    >):</label
                  >
                  <input
                    type="datetime-local"
                    class="form-control mr-3 w-100"
                    id="end_time"
                    name="end_time"
                    v-model="item.end_time"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="content"
                >Địa điểm:</label
              >
              <textarea
                id="content"
                class="form-control"
                rows="2"
                v-model="item.place"
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="create"
              id="add"
            >
              <span>Thêm</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (min-width: 739px) and (max-width: 992px) {
  .modal-content {
    width: 180%;
    margin-left: -40%;
  }
}
</style>
