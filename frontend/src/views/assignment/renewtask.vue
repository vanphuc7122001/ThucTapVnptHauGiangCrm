<script>
import { reactive, onBeforeMount, watch, ref, computed } from "vue";
import StatusTask from "../../services/status_task.service";
import Select_Advanced from "../../components/form/select_advanced.vue";
import Cycle from "../../services/cycle.service";
import Swal from "sweetalert2";
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
    item: {
      type: Object,
      default: {},
    },
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
    statustask: {
      type: Object,
      default: {},
    },
    evaluate: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({
      stepList: [
        {
          _id: 1,
          name: "Phân công",
        },
        {
          _id: 2,
          name: "Trạng thái",
        },
      ],
      activeStep: 1,
      modelStatus_Task: "1",
      renewValue: {
        _id: "",
        start_date: "",
        end_date: "",
        content: "",
        customerId: "",
        cycleId: "",
        Cycle: {
          _id: "",
          name: "",
        },
        leaderId: "",
        Status_Task: {
          _id: "",
          name: "",
        },
      },
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
            props.item.Cycle.name = res.document.name;
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
      props.item.cycleId = selectedOptionCycle.value;
    });

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
    const searchCycle = async (value) => {
      console.log("a", value, cycles.cycle);
      await refresh();
      cycles.cycle = cycles.cycle.filter((value1, index) => {
        console.log(value1, value);
        return value1.name.includes(value) || value.length == 0;
      });
      console.log("searchSlect", value.length);
    };

    const refresh = async () => {
      cycles.cycle = await http_getAll(Cycle);
      cycles.cycle.push({
        _id: "other",
        name: "khác",
      });
      // data.cycleSelect = [...rs];
    };

    onBeforeMount(() => {
      refresh();
    });
    const create = () => {
      ctx.emit("initRenewTask", props.item);
    };

    return {
      data,
      selectedOptionCycle,
      deleteCycle,
      cycles,
      searchCycle,
      create,
    };
  },
};
</script>
<template>
  <!-- The Modal -->
  <!-- The Modal -->
  <div class="modal" id="model-renew">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm mới phân công</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form class="was-validated">
            <div class="form-group">
              <label for="name">Khách hàng(<span style="color: red">*</span>):</label>
              <select id="" class="form-control" required v-model="item.customerId">
                <option value="" disabled selected hidden>Chọn khách hàng</option>
                <option v-for="cus in cus" :key="cus" :value="cus._id">
                  {{ cus.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="name">Ngày bắt đầu(<span style="color: red">*</span>):</label>
              <input
                type="date"
                class="form-control"
                id=""
                v-model="item.start_date"
                required
              />
            </div>

            <div class="form-group">
              <label for="name">Ngày kết thúc(<span style="color: red">*</span>):</label>
              <input
                type="date"
                class="form-control"
                id=""
                v-model="item.end_date"
                required
              />
            </div>

            <div class="form-group">
              <label for="content">Chu kỳ(<span style="color: red">*</span>):</label>
              <Select_Advanced
                style="height: 40px"
                required
                :options="cycles.cycle"
                :modelValue="item.Cycle.name"
                @searchSelect="(value) => searchCycle(value)"
                @delete="(value) => deleteCycle(value._id)"
                @chose="
                  (value, value1) => (
                    (selectedOptionCycle = value), (item.Cycle.name = value1.name)
                  )
                "
              />
            </div>

            <div class="form-group">
              <label for="content"
                >Nội dung chăm sóc(<span style="color: red">*</span>):</label
              >
              <textarea class="form-control" v-model="item.content" required></textarea>
            </div>
            <div class="form-group">
              <label for="content">Chú thích:</label>
              <textarea
                v-model="item.note"
                id="content"
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
