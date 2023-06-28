<script>
import { reactive } from "vue";
export default {
  props: {
    items: {
      type: Object,
      default: [],
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const create = () => {
      ctx.emit("create");
    };
    const addInput = () => {
      props.items.push({
        name: "",
      });
    };
    const removeInput = (index) => {
      if (props.items.length > 1) {
        ctx.emit("remove", index);
      }
    };
    return {
      create,
      addInput,
      removeInput,
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
          <h4 class="modal-title" style="font-size: 18px">
            Thêm vai trò mới mới
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group" v-for="(value, index) in items">
              <div class="d-flex justify-content-between">
                <label for="name"
                  >Tên vai trò {{ items.length == 1 ? "" : index + 1 }}(<span
                    style="color: red"
                    >*</span
                  >):</label
                >
                <label for="" class="d-flex flex-row-reverse"
                  ><span
                    @click="addInput()"
                    class="material-symbols-outlined size-16 btn format-btn ml-2"
                  >
                    add </span
                  ><span
                    class="material-symbols-outlined size-16 btn format-btn"
                    @click="removeInput(index)"
                  >
                    remove
                  </span></label
                >
              </div>
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                v-model="value.name"
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
.tooltip::before {
  content: attr(data-tooltip);
  /* ... */
}
</style>