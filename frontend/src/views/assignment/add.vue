<script>
import { reactive, onBeforeMount, ref, watch } from "vue";
import Task from "../../services/task.service";
import Cycle from "../../services/cycle.service";
import Employee from "../../services/employee.service";
import Customer from "../../services/customer.service";
import StatusTask from "../../services/status_task.service";
import Evaluate from "../../services/evaluate.service";
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
  props: {},
  setup(props, ctx) {
    const data = reactive({
      itemAdd: {
        start_date: "",
        end_date: "",
        content: "",
        customerId: "",
        cycleId: "",
        leaderId: "",
        EvaluateId: "",
        StatusTaskId: "",
      },
      modelCus: "",
      modelValue: "",
      modelStatus: "",
      modelEva: "",
      stepList: [
        {
          _id: 1,
          name: "Thông tin",
        },
        {
          _id: 2,
          name: "Trạng thái",
        },
      ],
      activeStep: 1,
    });

    const cycles = reactive({ cycle: [] });
    const customers = reactive({ customer: [] });
    const employees = reactive({ employee: [] });
    const statustasks = reactive({ statustask: [] });
    const evaluates = reactive({ evaluate: [] });
    //loc theo chu ky
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

    //tao phan cong moi
    const create = async () => {
      data.itemAdd.cycleId = selectedOptionCycle.value;
      console.log(data.itemAdd);
      data.itemAdd.leaderId = sessionStorage.getItem("employeeId");
      console.log("leaderId:", sessionStorage.getItem("employeeId"));
      // const evals = await http_getAll(Evaluate);
      // console.log("evals",evals);
      // console.log("star",data.itemAdd.EvaluateId)
      // console.log('data itemadd', data.itemAdd);
      const result = await http_create(Task, data.itemAdd);
      console.log("result", result);
      if (!result.error) {
        const task = await http_getOne(Task, result.document._id);
        console.log("task", task);
        alert_success(
          `Thêm phân công`,
          `Phân công khách hàng "${task.Customer.name}" đã được tạo thành công.`
        );
        refresh();
      } else if (result.error) {
        alert_error(`Thêm phân công`, `${result.msg}`);
      }
      data.itemAdd = {
        start_date: "",
        end_date: "",
        content: "",
        customerId: "",
        cycleId: "",
        leaderId: "",
        modelCus: "",
        modelValue: "",
      };
      ctx.emit("create");
    };

    //xoa phan cong
    const deleteCycle = async (_id) => {
      const cycle = await http_getOne(Cycle, _id);
      console.log("deleting", cycle);
      const isConfirmed = await alert_delete(
        `Xoá chu kỳ`,
        `Bạn có chắc chắn muốn xoá chu kỳ ${cycle.name} không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Cycle, _id);
        alert_success(`Xoá chu kỳ`, `Bạn đã xoá thành công chu kỳ ${cycle.name} .`);
        refresh();
      }
    };
    const deleteStatusTask = async (_id) => {
      const status_task = await http_getOne(StatusTask, _id);
      console.log("deleting", status_task);
      const isConfirmed = await alert_delete(
        `Xoá trạng thái`,
        `Bạn có chắc chắn muốn xoá trạng thái ${status_task.name} không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(StatusTask, _id);
        alert_success(
          `Xoá trạng thái`,
          `Bạn đã xoá thành công trạng thái ${status_task.name} .`
        );
        refresh();
      }
    };

    const refresh = async () => {
      cycles.cycle = await http_getAll(Cycle);
      customers.customer = await http_getAll(Customer);
      customers.customer = customers.customer.documents;
      employees.employee = await http_getAll(Employee);
      statustasks.statustask = await http_getAll(StatusTask);
      evaluates.evaluate = await http_getAll(Evaluate);
      cycles.cycle.push({
        _id: "other",
        name: "khác",
      });
      statustasks.statustask.push({
        _id: "other",
        name: "khác",
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
      customers,
      employees,
      selectedOptionCycle,
      deleteCycle,
      deleteStatusTask,
      evaluates,
      statustasks,
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
          <h4 class="modal-title" style="font-size: 15px">Thêm mới phân công</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="/action_page.php" class="was-validated">
            <div class="form-group">
              <label for="name">Khách hàng(<span style="color: red">*</span>):</label>
              <Select_Advanced
                style="height: 40px"
                required
                :add="false"
                :options="customers.customer"
                :modelValue="data.modelCus"
                @searchSelect="
                  async (value) => (
                    await refresh(),
                    (customers.customer = customers.customer.filter((value1, index) => {
                      console.log(value1, value);
                      return value1.name.includes(value) || value.length == 0;
                    })),
                    console.log('searchSlect', value.length)
                  )
                "
                @chose="
                  (value, value1) => (
                    (data.itemAdd.customerId = value), (data.modelCus = value1.name)
                  )
                "
              />
            </div>
            <div class="form-group">
              <label for="name">Ngày bắt đầu(<span style="color: red">*</span>):</label>
              <input
                type="date"
                class="form-control"
                id=""
                v-model="data.itemAdd.start_date"
                required
              />
            </div>

            <div class="form-group">
              <label for="name">Ngày kết thúc(<span style="color: red">*</span>):</label>
              <input
                type="date"
                class="form-control"
                id=""
                v-model="data.itemAdd.end_date"
                required
              />
            </div>

            <div class="form-group">
              <label for="content">Chu kỳ(<span style="color: red">*</span>):</label>
              <Select_Advanced
                style="height: 40px"
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
                @delete="(value) => deleteCycle(value._id)"
                @chose="
                  (value, value1) => (
                    (selectedOptionCycle = value), (data.modelValue = value1.name)
                  )
                "
              />
            </div>

            <div class="form-group">
              <label for="content"
                >Nội dung chăm sóc(<span style="color: red">*</span>):</label
              >
              <textarea
                class="form-control"
                v-model="data.itemAdd.content"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label for="content">Chú thích(<span style="color: red">*</span>):</label>
              <textarea
                v-model="data.itemAdd.note"
                id="content"
                required
                class="form-control w-100"
                rows="5"
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="create"
              id="create"
              data-dismiss="modal"
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
