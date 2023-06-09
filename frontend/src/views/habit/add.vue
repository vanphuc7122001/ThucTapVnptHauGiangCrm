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
          <h4 class="modal-title" style="font-size: 15px">Thêm thói quen</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="/action_page.php" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Tên thói quen(<span style="color: red">*</span>):</label
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

<style scoped></style>
