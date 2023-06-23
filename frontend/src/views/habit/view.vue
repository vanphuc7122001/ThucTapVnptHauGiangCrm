<script>
import { reactive } from "vue";
import Table_Customer from "./view_customer.vue";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  components: {
    Table_Customer,
  },
  setup(props, ctx) {
    const data = reactive({});
    return {};
  },
};
</script>

<template>
  <div class="modal" id="model-view">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Thông tin chi tiết thói quen</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form class="was-validated">
            <div class="form-group">
              <label for="name">Tên thói quen(<span style="color: red">*</span>):</label>
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                v-model="item.name"
                disabled
              />
            </div>
          </form>
          <div class="form-group">
            <label for="duration"
              >Danh sách khách hàng cùng thói quen:</label
            >
            <Table_Customer :customer_event="item.Customers" />

          </div>
          <div class="mt-2">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
label {
  font-size: 18px;
}
</style>
