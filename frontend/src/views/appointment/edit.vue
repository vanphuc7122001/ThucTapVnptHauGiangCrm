<script>
import StatusApp from "../../services/status_app.service";
import Select_Advanced from "../../components/form/select_advanced.vue";
import Swal from "sweetalert2";
import {
  // components
  Table,
  Pagination,
  Dropdown,
  Select,
  Search,
  DeleteAll,
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
    resetData: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Table,
    Pagination,
    Dropdown,
    Select_Advanced,
    Search,
  },
  setup(props, ctx) {
    watch(
      () => props.resetData,
      async (newValue, oldValue) => {
  
        await refresh();

    
      },
      { immediate: true }
      //có props
    );
    const data = reactive({});
    const status_apps = reactive({ status_app: [] });
    let selectedOptionStatus = ref("0");
    watch(selectedOptionStatus, async (newValue, oldValue) => {
      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: statusApp } = await Swal.fire({
            title: "Thêm trạng thái mới",
            input: "text",
            inputLabel: "Tên trạng thái",
            inputValue: "",
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return "Tên trạng thái không được bỏ trống";
              }
            },
          });

          if (statusApp) {
            const res = await http_create(StatusApp, { name: statusApp });
            if (res.error) {
              alert_warning(`Đã tồn tại trạng thái `, `${statusApp}`);
              return false;
            }
            alert_success(`Đã thêm trạng thái`, `${statusApp}`);
            props.item.Status_App.name = res.document.name;
            await refresh();
            ctx.emit("newStatus", status_apps.status_app);
           
            selectedOptionStatus.value = res.document._id;
          }
          return true;
        };
        showSweetAlert();
        selectedOptionStatus.value = 0;
      }
      props.item.StatusAppId = selectedOptionStatus.value;
    });
    const deleteStatus = async (_id) => {
      const statusapp = await http_getOne(StatusApp, _id);
      const isConfirmed = await alert_delete(
        `Xoá trạng thái`,
        `Bạn có chắc chắn muốn xoá trạng thái ${statusapp.name} không ?`
      );
   
      if (isConfirmed == true) {
        const result = await http_deleteOne(StatusApp, _id);
        alert_success(
          `Xoá trạng thái`,
          `Bạn đã xoá thành công trạng thái ${statusapp.name} .`
        );
        refresh();
      }
    };
    const search = async (value) => {
      
      await refresh();
      status_apps.status_app = status_apps.status_app.filter((value1, index) => {
        
        return value1.name.includes(value) || value.length == 0;
      });
     
    };
    const edit = () => {
      
      ctx.emit("edit", props.item);
    };

    const refresh = async () => {
      status_apps.status_app = await http_getAll(StatusApp);
      status_apps.status_app.push({
        _id: "other",
        name: "khác",
      });
      // data.cycleSelect = [...rs];
    };

    onBeforeMount(() => {
      refresh();
    });
    const update = () => {
      ctx.emit("update");
    };

    return {
      update,
      search,
      selectedOptionStatus,
      status_apps,
      edit,
      deleteStatus,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="modal-edit">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 18px">Chỉnh sửa lịch hẹn</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form class="was-validated">
            <div class="form-group">
              <label for="name">Ngày hẹn(<span style="color: red">*</span>):</label>
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
              <label for="name">Địa điểm(<span style="color: red">*</span>):</label>
              <input
                id="content"
                required
                class="form-control"
                rows="5"
                v-model="item.place"
              />
            </div>
            <div class="form-group">
              <label for="name"
                >Trạng thái lịch hẹn(<span style="color: red">*</span>):</label
              >
              <Select_Advanced
                style="height: 40px"
                required
                :options="status_apps.status_app"
                :modelValue="item.Status_App.name"
                @searchSelect="(value) => search(value)"
                @delete="(value) => deleteStatus(value._id)"
                @chose="
                  (value, value1) => (
                    (selectedOptionStatus = value), (item.Status_App.name = value1.name)
                  )
                "
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
                style="height: 80px"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="content">Chú thích:</label>
              <textarea
                id="content"
                required
                class="form-control"
                rows="5"
                v-model="item.note"
                style="height: 80px"
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-warning px-3 py-2"
              style="font-size: 14px"
              @click="edit()"
              id="add"
            >
              <span>Chỉnh sửa</span>
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
