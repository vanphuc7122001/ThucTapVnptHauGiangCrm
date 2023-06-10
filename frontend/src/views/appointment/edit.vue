<script>
import { reactive } from "vue";
import {
  // components
  Table,
  Pagination,
  Dropdown,
  Select,
  Search,
  DeleteAll,
  Select_Advanced,
  // compositions
  reactive,
  computed,
  watch,
  ref,
  onBeforeMount,
  // router
  useRouter,
  // format date or datetime
  formatDateTime,
  formatDate,
  // service
  Event,
  Habit,
  Account,
  Appointment,
  Center_VNPT,
  Company_KH,
  Customer_Types,
  Customer_Work,
  Customer,
  Cycle,
  Department,
  Employee,
  Log,
  Permission,
  Position,
  Role,
  Task,
  Unit,
  // http service
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
  // alert
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
  alert_info,
} from "../common/import.js";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  components: {
    Table,
    Pagination,
    Dropdown,
    Select,
    Search,
    Add,
    DeleteAll,
    Edit,
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
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Sửa lịch hẹn</h4>
          <button
            @click="$emit('cancel')"
            type="button"
            class="close"
            data-dismiss="modal"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body" style="overflow: auto; max-height: 700px">
          <form action="/action_page.php" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Khách hàng(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                required
              />
            </div>
            <div class="form-group">
              <label for="name"
                >Nhân viên(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                required
              />
            </div>
            <div class="form-group">
              <label for="name"
                >Ngày hẹn(<span style="color: red">*</span>):</label
              >
              <input
                type="datetime-local"
                class="form-control"
                id="name"
                name="name"
                v-model="item.date_time"
                required
              />
            </div>
            <div class="form-group">
              <label for="content"
                >Nội dung lịch hẹn(<span style="color: red">*</span>):</label
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
              <label for="name"
                >Trạng thái cuộc hẹn(<span style="color: red">*</span>):</label
              >
              <Select
                class="d-flex justify-content-start"
                :options="[
                  {
                    value: 'true',
                    name: 'Thành công',
                  },
                  {
                    value: 'false',
                    name: 'Thất bại',
                  },
                ]"
                @update:entryValue="(value) => (data.statusId = value)"
                :entryValue="`Thành công`"
              />
            </div>
            <div class="form-group">
              <label for="content"
                >Lý do(<span style="color: red">*</span>):</label
              >
              <textarea
                id="reason"
                required
                class="form-control"
                rows="5"
                v-model="item.reason"
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="create"
              id="add"
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
