<script>
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
  onMounted,
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
  Role_Permission,
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
    Select,
  },
  setup(props, ctx) {
    const data = reactive({
      positionList: [],
      permissionList: [],
    });
    const create = async () => {
      try {
        let isSuccess = false;
        for (let value of data.permissionList) {
          if (value.checked == true) {
            let result = await http_create(Role_Permission, {
              RoleId: props.item._id,
              PermissionId: value._id,
            });
            console.log("result", result);
            if (result.error == true) {
              alert_error(`Tạo quyền`, `Đã tồn tại quyền ${value.name}.`);
            } else {
              isSuccess = true;
            }
          }
        }
        if (isSuccess) {
          alert_success(`Tạo quyền`, `Bạn đã tạo quyền thành công.`);
        }
      } catch (error) {
        console.log(error);
      }
    };
    onBeforeMount(async () => {
      data.positionList = await http_getAll(Position);
      data.permissionList = await http_getAll(Permission);
    });
    onMounted(() => {});
    return {
      create,
      data,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-setPermission">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Tạo quyền thao tác vai trò
            <span style="color: blue">{{ item.name }}</span>
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="">
            <div
              class="form-check mb-2"
              v-for="(value, index) in data.permissionList"
            >
              <label class="form-check-label">
                <input
                  type="checkbox"
                  class="form-check-input"
                  value=""
                  v-model="value.checked"
                />&emsp;{{ value.name }}
              </label>
            </div>
            <button
              type="button"
              class="btn btn-primary px-3 py-2 mt-3"
              style="font-size: 14px"
              @click="create"
              id="add"
            >
              <span>Thiết lập</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
