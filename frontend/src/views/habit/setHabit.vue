<script>
import Customer_Table from "./customer.vue";
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
  Customer_Event,
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
  Customer_Habit,
} from "../common/import.js";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
    refreshTable: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Select_Advanced,
    Customer_Table,
  },
  setup(props, ctx) {
    const data = reactive({
      customerList: [],
      customerId: "",
      habitId: "",
      customer_habitId: "",
      customer_habitList: [],
    });
    const create = async () => {
      try {
        console.log("strategy");
        let isSuccess = false;
        console.log("data.customerList", data.customerList);
        for (let value of data.customerList) {
          console.log("value.checked ", value.checked == true);
          console.log(isStringFound(value.Customer._id));
          if (
            value.checked == true &&
            isStringFound(value.Customer._id) == false
          ) {
            console.log("ccc");
            let result = await http_create(Customer_Habit, {
              customerId: value.Customer._id,
              habitId: props.item._id,
            });
            console.log("result", result);
            if (result.error == true) {
              alert_error(
                `Thêm khách hàng cùng thói quen`,
                `Đã thêm thói quen ${props.item.name} với khách hàng ${value.Customer.name}`
              );
            } else {
              isSuccess = true;
            }
          } else if (value.checked == false) {
            console.log("dddd");
            if (isStringFound(value.Customer._id)) {
              await Customer_Habit.update(data.customer_habitId, {
                HabitId: data.habitId,
                CustomerId: data.customerId,
              });
              isSuccess = true;
            }
          }
        }
        if (isSuccess) {
          alert_success(
            `Thêm khách hàng cùng thói quen`,
            `Bạn đã thêm thành công.`
          );
        }
        refresh();
        props.refreshTable = true;
      } catch (error) {
        console.log(error);
      }
    };
    const isStringFound = (_id) => {
      return data.customer_habitList.some((item) => {
        if (
          item.CustomerId.toString() == _id &&
          item.HabitId == props.item._id
        ) {
          console.log("item", item);
          data.customerId = item.CustomerId;
          data.habitId = item.HabitId;
          data.customer_habitId = data.customerId + data.habitId;
        }
        return (
          item.CustomerId.toString() == _id && item.HabitId == props.item._id
        );
      });
    };
    const refresh = async () => {
      data.customer_habitList = await http_getAll(Customer_Habit);
    };
    onBeforeMount(async () => {
      // data.customerList = await http_getAll(Customer);
      refresh();
    });
    return {
      create,
      data,
      isStringFound,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-setHabit">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Thêm khách hàng cùng thói quen
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
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
                disabled
              />
            </div>
            <div class="form-group">
              <label for="content"
                >Khách hàng cùng thói quen(<span style="color: red">*</span
                >):</label
              >
              <div class="">
                <Customer_Table
                  :refreshTable="refreshTable"
                  :item="item"
                  :customer_eventListObject="data.customer_habitList"
                  @create="
                    (value) => {
                      data.customerList = value;
                      create();
                    }
                  "
                />
              </div>
            </div>
            <!-- <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="create"
              id="add"
            >
              <span>Thêm</span>
            </button> -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
