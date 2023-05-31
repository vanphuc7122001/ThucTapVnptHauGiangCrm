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
      if (props.item.name.length > 0 && props.item.content.length > 0) {
        ctx.emit("create");
      }
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
          <h4 class="modal-title" style="font-size: 15px">Thêm chức vụ</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="/action_page.php" class="was-validated">
            <div class="form-group">
              <label for="position"
                >Chức vụ(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="position"
                name="position"
                v-model="item.position"
                required
              />
            </div>
            <b-button
              type="submit"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="clickAdd"
              id="add"
              data-dismiss="modal"
            >
              <span>Thêm</span>
            </b-button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
