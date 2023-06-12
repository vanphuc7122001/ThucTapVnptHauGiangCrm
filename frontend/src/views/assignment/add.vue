<script>
import { reactive, onBeforeMount, ref, watch } from "vue";
import Task from "../../services/task.service";
import Cycle from "../../services/cycle.service";
import Employee from "../../services/employee.service";
import Customer from "../../services/customer.service";
import Swal from "sweetalert2";
import Select_Advanced from "../../components/form/select_advanced.vue";
import axios from "axios";
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
} from "../../assets/js/common.http";
import {
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
} from "../../assets/js/common.alert";
export default {
  components: {
    Select_Advanced,
  },
  props: {
    cycles: {
      type: Object,
      default: {},
    },
    cus: {
      type: Object,
      default: {},
    },
    employee: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({
      itemAdd: {
        start_date: "",
        end_date: "",
        content: "",
        customerId: "",
        cycleId: "",
        leaderId: "",
      },
      modelValue: "",
    });

    const cycles = reactive({ cycle: [] });
    let selectedOptionCycle = ref("0");
    watch(selectedOptionCycle, async (newValue, oldValue) => {
      // Alert add center
      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: cycleName } = await Swal.fire({
            title: "Thêm chu kỳ mới",
            input: "text",
            inputLabel: "Tên chu kỳ",
            inputValue: "",
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return "Tên chu kỳ không được bỏ trống";
              }
            },
          });

          if (cycleName) {
            const res = await http_create(Cycle, { name: cycleName });
            if (res.error) {
              alert_warning(`Đã tồn tại chu kỳ `, `${cycleName}`);
              return false;
            }
            alert_success(`Đã thêm chu kỳ`, `${cycleName}`);
            data.modelValue = res.document.name;
            await refresh();
            ctx.emit("newCycle", cycles.cycle);
            console.log("ne", res.document.name);
            selectedOptionCycle.value = res.document._id;
            // name.value = document.document.name;
          }
          return true;
        };
        showSweetAlert();
        selectedOptionCycle.value = 0;
      }
    });

    const create = async () => {
      data.itemAdd.cycleId = selectedOptionCycle.value;
      console.log(data.itemAdd);
      const result = await http_create(Task, data.itemAdd);
      console.log("result", result);
      if (!result.error) {
        const task = await http_getOne(Task, result.document._id);
        console.log("task", task);
        alert_success(
          `Thêm phân công`,
          `Phân công khách hàng "${task.Customer.name}" cho nhân viên "${task.Employee.name}" đã được tạo thành công.`
        );
        data.itemAdd = {};
      } else if (result.error) {
        alert_error(`Thêm phân công`, `${result.msg}`);
      }
      ctx.emit("create");
    };

    const deleteOne = async (_id) => {
      const cycle = await http_getOne(Cycle, _id);
      console.log("deleting", cycle);
      const isConfirmed = await alert_delete(
        `Xoá chu kỳ`,
        `Bạn có chắc chắn muốn xoá chu kỳ ${cycle.name} không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Cycle, _id);
        alert_success(
          `Xoá chu kỳ`,
          `Bạn đã xoá thành công chu kỳ ${cycle.name} .`
        );
        refresh();
      }
    };

    const refresh = async () => {
      cycles.cycle = await http_getAll(Cycle);
      cycles.cycle.push({
        _id: "other",
        name: "other",
      });
      // data.cycleSelect = [...rs];
    };

    onBeforeMount(() => {
      refresh();
    });
    return {
      create,
      data,
      refresh,
      cycles,
      selectedOptionCycle,
      deleteOne,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <!-- The Modal -->
  <div class="modal" id="model-add">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Thêm mới phân công
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="/action_page.php" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Khách hàng(<span style="color: red">*</span>):</label
              >
              <select
                id=""
                class="form-control"
                required
                v-model="data.itemAdd.customerId"
              >
                <option value="" disabled selected hidden></option>
                <option v-for="cus in cus" :key="cus" :value="cus._id">
                  {{ cus.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for=""
                >Nhân viên(<span style="color: red">*</span>):</label
              >
              <select
                id=""
                class="form-control"
                required
                v-model="data.itemAdd.leaderId"
              >
                <option value="" disabled selected hidden></option>
                <option
                  v-for="employee in employee"
                  :key="employee"
                  :value="employee._id"
                >
                  {{ employee.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for=""
                >Ngày bắt đầu(<span style="color: red">*</span>):</label
              >
              <input
                type="date"
                class="form-control"
                id=""
                v-model="data.itemAdd.start_date"
                required
              />
            </div>

            <div class="form-group">
              <label for=""
                >Ngày kết thúc(<span style="color: red">*</span>):</label
              >
              <input
                type="date"
                class="form-control"
                id=""
                v-model="data.itemAdd.end_date"
                required
              />
            </div>

            <div class="form-group">
              <label for="">Chu kỳ(<span style="color: red">*</span>):</label>
              <!-- <select id="" class="form-control" required v-model="item.cycleId"
              @click="AddCycle">
                <option value="" selected disabled hidden></option>
                <option v-for="cycle in cycles" :key="cycle" :value="cycle._id">{{ cycle.name }}</option>
                <option v-for="(value, index) in data.cycleSelect" :key="index" :value="value._id">
                  {{ value.name }}
                </option>
                <option value="Add" >khác</option>
              </select> -->
              <Select_Advanced
                style="height: 40px;"
                required
                :options="cycles.cycle"
                :modelValue="data.modelValue"
                @searchSelect="
                  async (value) => (
                    await refresh(),
                    (cycles.cycle = cycles.cycle.filter((value1, index) => {
                      console.log(value1, value);
                      return value1.name.includes(value) || value.length == 0;
                    })),
                    console.log('searchSlect', value.length)
                  )
                "
                @delete="(value) => deleteOne(value._id)"
                @chose="(value, value1) => (selectedOptionCycle = value, data.modelValue = value1.name)"
              />
            </div>

            <div class="form-group">
              <label for="">Nội dung chăm sóc(<span style="color: red">*</span>):</label>
              <textarea
                class="form-control"
                v-model="data.itemAdd.content"
                required
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              id="add"
              data-dismiss="modal"
            >
              <span @click="create">Thêm</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
