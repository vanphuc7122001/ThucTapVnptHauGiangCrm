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
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm sự kiện mới</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="name">Tên sự kiện(<span style="color: red">*</span>):</label>
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
                rows="5"
                v-model="item.content"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="content"
                >Thời gian diễn ra sự kiện(<span style="color: red">*</span>):</label
              >
              <input
                type="datetime-local"
                class="form-control"
                id="time_duration"
                name="time_duration"
                v-model="item.time_duration"
                required
              />
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

</style>
