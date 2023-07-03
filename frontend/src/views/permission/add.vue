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
  Permission_Types,
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
  alert_delete_wide,
  alert_input_text,
} from "../common/import.js";
export default {
  components: {
    Select_Advanced,
  },
  props: {
    items: {
      type: Object,
      default: [],
    },
  },
  setup(props, ctx) {
    const data = reactive({
      permissionTypesList: [],
      pTValue: "",
      modelValue: "",
    });
    const create = () => {
      ctx.emit("create", data.pTValue);
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
    const createPT = async () => {
      console.log("chay");
      const content = await alert_input_text(`Thêm loại quyền`);
      if (content.length > 0) {
        const result = await http_create(Permission_Types, {
          name: content,
        });
        if (!result.error) {
          alert_success(
            `Thêm loại quyền`,
            `Loại quyền ${result.document.name} đã được thêm thành công.`
          );
          refresh();
          data.modelValue = result.document.name;
          data.pTValue = result.document._id;
        } else {
          alert_error(`Thêm loại quyền`, `${result.msg}`);
        }
      }
    };

    const deletePT = async(value) => {
      const isConfirmed = await alert_delete(
        `Xoá loại quyền`,
        `Bạn có chắc chắn muốn xoá loại quyền ${value.name} không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Permission_Types, value._id);
        alert_success(
          `Xoá loại quyền`,
          `Bạn đã xoá thành công loại quyền ${value.name}.`
        );
        refresh();
      }
    }

    const refresh = async (value = '') => {
      data.permissionTypesList = await http_getAll(Permission_Types);
      data.permissionTypesList.documents.push({
        _id: "other",
        name: "khác",
      });
      console.log('permissionTypesList');
      if (value.length > 0) {
        data.permissionTypesList.documents = data.permissionTypesList.documents.filter(
          (value1, index1) => {
            console.log(value1.name);
            return value1.name.includes(value);
          }
        )
      }
    };
    onBeforeMount(async () => {
      refresh();
    });
    return {
      create,
      addInput,
      removeInput,
      data,
      createPT,
      deletePT,
      refresh,
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
          <h4 class="modal-title" style="font-size: 18px">Thêm quyền mới</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for=""
                >Loại quyền(<span style="color: red">*</span>):</label
              >
              <Select_Advanced
                :options="data.permissionTypesList.documents"
                style="height: 40px"
                :modelValue="data.modelValue"
                @chose="
                  (value, value1) => {
                    if (value == 'other') {
                      createPT();
                    } else {
                      data.pTValue = value;
                      data.modelValue = value1.name;
                    }
                  }
                "
                @delete="(value) => deletePT(value)"
                @searchSelect="(value) => refresh(value)"
              />
            </div>
            <div class="form-group" v-for="(value, index) in items">
              <div class="d-flex justify-content-between">
                <label for="name"
                  >Tên quyền {{ items.length == 1 ? "" : index + 1 }}(<span
                    style="color: red"
                    >*</span
                  >):</label
                >
                <label for="" class="d-flex flex-row-reverse"
                  ><span
                    @click="addInput"
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