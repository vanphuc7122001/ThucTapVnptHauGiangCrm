<script>
import { reactive, onBeforeMount, watch, ref, computed } from "vue";
import StatusTask from "../../services/status_task.service";
import Select_Advanced from "../../components/form/select_advanced.vue";
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
    });

    const statustasks = reactive({ statustask: [] });
    let selectedOptionStatus = ref("0");
    watch(selectedOptionStatus, async (newValue, oldValue) => {
      if (newValue == "") return;
      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: statusTask } = await Swal.fire({
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

          if (statusTask) {
            const res = await http_create(StatusTask, { name: statusTask });
            if (res.error) {
              alert_warning(`Đã tồn tại trạng thái `, `${statusTask}`);
              return false;
            }
            alert_success(`Đã thêm trạng thái`, `${statusTask}`);
            props.item.Status_Task.name = res.document.name;
            await refresh();
            ctx.emit("newStatus", statustasks.statustask);
            console.log("ne", res.document.name);
            selectedOptionStatus.value = res.document._id;
          }
          return true;
        };
        showSweetAlert();
        selectedOptionStatus.value = 0;
      }
      console.log("THAYDOI:", selectedOptionStatus.value);
      props.item.StatusTaskId = selectedOptionStatus.value;
      selectedOptionStatus.value = "";
    });

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
    const search = async (value) => {
      console.log("a", value, statustasks.statustask);
      await refresh();
      statustasks.statustask = statustasks.statustask.filter(
        (value1, index) => {
          console.log(value1, value);
          return value1.name.includes(value) || value.length == 0;
        }
      );
      console.log("searchSlect", value.length);
    };

    const refresh = async () => {
      statustasks.statustask = await http_getAll(StatusTask);
      statustasks.statustask.push({
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
      data,
      selectedOptionStatus,
      statustasks,
      deleteStatusTask,
      search,
    };
  },
};
</script>
<template>
  <!-- The Modal -->
  <div class="modal" id="model-form-wizard">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Chỉnh sửa phân công
          </h4>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            @click="data.activeStep = 1"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="model-body">
          <div class="d-flex">
            <!-- steps -->
            <div class="d-flex flex-column" style="height: 100%">
              <div
                class="d-flex mt-3 mx-3"
                v-for="(value, index) in data.stepList"
                :key="value"
              >
                <span
                  @click="data.activeStep = index + 1"
                  class="step-id px-3 py-2"
                  :class="[data.activeStep == index + 1 ? 'active-step' : '']"
                  >{{ value._id }}</span
                >
                <span
                  class="d-flex align-items-center pl-3"
                  :class="[data.activeStep == index + 1 ? 'active-step' : '']"
                  >{{ value.name }}</span
                >
              </div>
            </div>
            <!-- form -->
            <div
              class="d-flex flex-grow-1 flex-column step-content px-3 my-3"
              style="width: 10000px"
            >
              <!-- page 1 -->
              <form
                v-if="data.activeStep == 1"
                action=""
                class="was-validated"
                style="width: 100%"
              >
                <div class="form-group flex-grow-1">
                  <label for="name"
                    >Khách hàng(<span style="color: red">*</span>):</label
                  >
                  <select
                    id=""
                    class="form-control"
                    required
                    v-model="item.customerId"
                  >
                    <option value="" disabled selected hidden>
                      Chọn khách hàng
                    </option>
                    <option v-for="cus in cus" :key="cus" :value="cus._id">
                      {{ cus.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group flex-grow-1">
                  <label for="name"
                    >Ngày bắt đầu(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="date"
                    class="form-control w-100"
                    id="name"
                    name="name"
                    v-model="item.start_date"
                    required
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="name"
                    >Ngày kết thúc(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="date"
                    class="form-control w-100"
                    id="name"
                    name="name"
                    v-model="item.end_date"
                    required
                  />
                </div>

                <div class="form-group flex-grow-1">
                  <label for="content"
                    >Chu kỳ(<span style="color: red">*</span>):</label
                  >
                  <select
                    id=""
                    class="form-control"
                    required
                    v-model="item.cycleId"
                  >
                    <option value="" disabled selected hidden>
                      Chọn chu kì
                    </option>
                    <option
                      v-for="cycle in cycles"
                      :key="cycle"
                      :value="cycle._id"
                    >
                      {{ cycle.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group flex-grow-1">
                  <label for="content"
                    >Nội dung phân công(<span style="color: red">*</span
                    >):</label
                  >
                  <textarea
                    v-model="item.content"
                    id="content"
                    required
                    class="form-control w-100"
                    rows="5"
                  ></textarea>
                </div>
              </form>
              <!-- page 2 -->
              <form
                v-if="data.activeStep == 2"
                action=""
                class="was-validated"
                style="width: 100%"
              >
                <div class="form-group flex-grow-1">
                  <div class="form-group flex-grow-1">
                    <label for="content"
                      >Trạng thái phân công(<span style="color: red">*</span
                      >):</label
                    >
                    <Select_Advanced
                      style="height: 40px"
                      required
                      :options="statustasks.statustask"
                      :modelValue="item.Status_Task.name"
                      @searchSelect="(value) => search(value)"
                      @delete="(value) => deleteStatusTask(value._id)"
                      @chose="
                        (value, value1) => (
                          (selectedOptionStatus = value),
                          (item.Status_Task.name = value1.name)
                        )
                      "
                    />
                  </div>
                </div>

                <div class="form-group flex-grow-1">
                  <label for="content"
                    >Chú thích(<span style="color: red">*</span>):</label
                  >
                  <textarea
                    v-model="item.note"
                    id="content"
                    required
                    class="form-control w-100"
                    rows="5"
                  ></textarea>
                </div>
                <button
                  type="button"
                  class="btn btn-warning px-3 py-2"
                  style="font-size: 14px"
                  @click="$emit('edit')"
                  id="edit"
                  data-dismiss="modal"
                >
                  <span>Cập nhật</span>
                </button>
              </form>
              <div class="d-flex justify-content-end mt-3">
                <span
                  v-if="
                    data.activeStep >= 1 &&
                    data.activeStep < data.stepList.length
                  "
                  class="btn-next d-flex align-items-center px-3 py-1"
                  @click="data.activeStep = 2"
                  >Trang kế tiếp
                  <span
                    class="material-symbols-outlined d-flex align-items-center"
                  >
                    navigate_next
                  </span>
                </span>
                <span
                  v-if="
                    data.activeStep > 1 &&
                    data.activeStep <= data.stepList.length
                  "
                  class="btn-prev d-flex align-items-center px-3 py-1"
                  @click="data.activeStep = 1"
                  ><span
                    class="material-symbols-outlined d-flex align-items-center"
                  >
                    navigate_before </span
                  >Trang trước</span
                >
              </div>
            </div>
          </div>
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
