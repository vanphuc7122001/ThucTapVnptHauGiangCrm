<script>
// import { reactive } from "vue";
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
    taskId: {
      type: String,
      default: "",
    },
    task: {
      type: Object,
      default: {},
    },
    customer: {
      type: String,
      default: "",
    },
  },
  setup(props, ctx) {
    const data = reactive({
      item: {
        date_time: "",
        content: "",
        place: "",
        note: "",
        taskId: "",
        StatusAppId: "",
      },
    });
    const create = async () => {
      console.log(data.item.date_time);
      console.log(data.item.content);
      console.log(data.item.place);
      console.log(data.item.note);
      console.log(data.item);
      props.task.changeStatus = true;
      data.item.loginId = sessionStorage.getItem("employeeId");

      data.item.taskId = props.taskId;
      console.log("task id", data.item.taskId);
      const result = await http_create(Appointment, data.item);
      const change = await http_update(Task, props.task._id, props.task);
      if (!result.error) {
        alert_success(
          `Thêm lịch hẹn`,
          `Lịch hẹn ${result.document.content} lúc ${formatDateTime(
            result.document.date_time
          )} đã được tạo thành công.`
        );
      } else if (result.error) {
        alert_error(`Thêm lịch hẹn`, `Đã tồn tại lịch hẹn`);
      }
      data.item = {};
      ctx.emit("create");
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

  <div class="modal" id="modal-add">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm lịch hẹn</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form action="/action_page.php" class="was-validated">
            <div class="form-group">
              <label for="name">Khách hàng(<span style="color: red">*</span>):</label>
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                :value="customer"
                disabled
              />
            </div>
            <div class="form-group">
              <label for="name">Ngày bắt đầu(<span style="color: red">*</span>):</label>
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                :value="task.start_date"
                disabled
              />
            </div>
            <div class="form-group">
              <label for="name">Ngày kết thúc(<span style="color: red">*</span>):</label>
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                :value="task.end_date"
                disabled
              />
            </div>
            <!-- <div class="form-group">
              <label for="name">Nhân viên(<span style="color: red">*</span>):</label>
              <input type="text" class="form-control" name="name" disabled />
            </div> -->
            <div class="form-group">
              <label for="name">Ngày hẹn(<span style="color: red">*</span>):</label>
              <input
                type="datetime-local"
                class="form-control"
                id="name"
                name="name"
                v-model="data.item.date_time"
                required
              />
            </div>
            <div class="form-group">
              <label for="name">Địa điểm(<span style="color: red">*</span>):</label>
              <input
                id="content"
                required
                class="form-control"
                rows="5"
                v-model="data.item.place"
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
                v-model="data.item.content"
                style="height: 80px"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="content">Chú thích:</label>
              <textarea
                id="content"
                class="form-control"
                rows="5"
                v-model="data.item.note"
                style="height: 80px"
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
.step-id {
  border: 1px solid var(--gray);
  border-radius: 5px;
  cursor: pointer;
}
.step-content {
  border-left: 1px solid var(--gray);
}
input {
  width: 100%;
}
.active-step {
  color: blue;
}
.btn-next {
  border: 1px solid var(--gray);
  border-radius: 5px;
  cursor: pointer;
}

.btn-next:hover {
  background-color: green;
  color: white;
}

.btn-prev {
  border: 1px solid var(--gray);
  border-radius: 5px;
  cursor: pointer;
}

.btn-prev:hover {
  background-color: red;
  color: white;
}
</style>
