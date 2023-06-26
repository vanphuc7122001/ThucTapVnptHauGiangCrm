<script>
import { onMounted, onUnmounted, defineProps } from "vue";
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
  Customer_Event,
  Customer_Habit,
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
  alert_delete_wide,
} from "../common/import.js";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
    habitAdd: {
      type: Array,
      default: {},
    },
    eventAdd: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({
      stepList: [
        {
          _id: 1,
          name: "Thói quen",
        },
        {
          _id: 2,
          name: "Sự kiện",
        },
      ],
      activeStep: 1,
      activeSuggest: -1,
      suggestList: [],
      a: "123",
    });
    const createHabit = async () => {
      try {
        let isFlase = false;
        let isSuccess = false;
        for (let value of props.habitAdd) {
          const result = await http_create(Habit, value);
          console.log("result", result);
          if (result.error) {
            alert_error(
              `Thêm thói quên`,
              `${result.msg}${result.document._id}`
            );
            const result1 = await http_create(Customer_Habit, {
              customerId: props.item.Customer._id,
              habitId: result.document._id,
            });
            if (result1.error == true) {
              alert_error(
                `Thêm thói quen`,
                `Đã tồn tại thói quen ${result.document.name} với khách hàng ${props.item.Customer.name}`
              );
            } else {
              isSuccess = true;
            }
          } else if (!result.error) {
            const result1 = await http_create(Customer_Habit, {
              customerId: props.item.Customer._id,
              habitId: result.document._id,
            });
            if (result1.error == true) {
              alert_error(
                `Thêm thói quen`,
                `Đã tồn tại thói quen ${result.document.name} với khách hàng ${props.item.Customer.name}`
              );
            } else {
              isSuccess = true;
            }
          }
        }
        if (isSuccess) {
          alert_success(`Thêm thói quen`, `Thói quen đã được tạo thành công.`);
          refresh();
          ctx.emit("freshHabitAdd");
        }
      } catch (error) {
        console.log(error);
      }
    };
    const createEvent = async () => {
      const result = await http_create(Event, props.eventAdd);
      let isSuccess = false;
      console.log("result", result);
      if (!result.error) {
        console.log("ghghsjkhdjskhhsjh");
        console.log(props.item._id);
        console.log(result.document._id);
        let result1 = await http_create(Customer_Event, {
          customerId: props.item.Customer._id,
          eventId: result.document._id,
        });
        console.log(result1);
        if (result1.error == true) {
          alert_success(
            `Thêm sự kiện`,
            `Sự kiện ${result.document.name} lúc ${formatDateTime(
              result.document.time_duration
            )} đã được tạo thành công.`
          );
          alert_error(
            `Áp dụng sự kiện`,
            `Đã áp dụng sự kiện ${result.document.name} với khách hàng ${props.item.Customer.name}`
          );
        } else {
          isSuccess = true;
        }
        if (isSuccess) {
          alert_success(
            `Áp dụng sự kiện`,
            `Bạn đã áp dụng sự kiện đối với khách hàng thành công thành công.`
          );
          ctx.emit("freshHabitAdd");
        }
      } else if (result.error) {
        alert_error(`Thêm sự kiện`, `${result.msg}`);
      }
    };
    const addInput = () => {
      props.habitAdd.push({
        name: "",
      });
    };
    const removeInput = (index) => {
      if (props.habitAdd.length > 1) {
        ctx.emit("remove", index);
      }
    };
    const habitValue = ref("");
    const refresh = async () => {
      data.suggestList = await http_getAll(Habit);
      if (habitValue.value.length > 0) {
        data.suggestList = data.suggestList.filter((value, index) => {
          return value.name.includes(habitValue.value);
        });
      }
    };
    watch(habitValue, () => {
      console.log("hdjghjdhjs");
      refresh();
    });
    onBeforeMount(async () => {
      refresh();
    });
    const handleClick = () => {
      console.log("cccccccccccccccccccccccccccccccccccccc");
    };
    const selectRef = ref(null);

    const handleClickOutside = (event) => {
      if (!selectRef.value.contains(event.target)) {
        ctx.emit("freshHabitAdd");
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    return {
      data,
      addInput,
      removeInput,
      createHabit,
      createEvent,
      habitValue,
      handleClick,
      selectRef,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div ref="selectRef" class="modal" id="model-addHabit">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 18px">
            Thêm thói quen và sự kiện {{ data.a }}
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>
        <div class="modal-header">
          <div class="d-flex flex-column w-100">
            <!-- <h4 class="modal-title" style="font-size: 15px">Thông tin khách hàng</h4> -->
            <div class="d-flex justify-content-between w-100">
              <div class="d-flex flex-column">
                <div class="">
                  <span
                    ><span style="font-weight: 900">Tên khách hàng</span>:
                    {{ item.Customer.name }}</span
                  >
                </div>
                <span class="my-2">
                  <span
                    ><span style="font-weight: 900">Số diện thoại</span>:
                    {{ item.Customer.phone }}</span
                  >
                </span>
                <div class="">
                  <span
                    ><span style="font-weight: 900">Email</span>:
                    {{ item.Customer.email }}</span
                  >
                </div>
                <div class="mt-2">
                  <span
                    ><span style="font-weight: 900">Địa chỉ</span>:
                    {{ item.Customer.address }}</span
                  >
                </div>
              </div>
              <div class="d-flex flex-column">
                <div class="">
                  <span
                    ><span style="font-weight: 900">Vị trí làm việc</span>:
                    {{ item.current_position }}</span
                  >
                </div>
                <span class="my-2">
                  <span
                    ><span style="font-weight: 900">Nơi làm việc</span>:
                    {{ item.current_workplace }}</span
                  >
                </span>
                <div class="">
                  <span
                    ><span style="font-weight: 900">Công ty</span>:
                    {{ item.Company_KH.name }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal body -->
        <div class="model-body">
          <div class="d-flex">
            <!-- steps -->
            <div class="d-flex flex-column" style="height: 100%">
              <div
                class="d-flex mt-3 mx-3"
                v-for="(value, index) in data.stepList"
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
              <form v-if="data.activeStep == 1" action="" class="was-validated">
                <!-- <div class="autocomplete">
                  <input type="text" class="input-text w-100" />
                  <ul class="suggestions-list mt-1">
                    <li class="suggestion-item">1</li>
                  </ul>
                </div> -->
                <div
                  class="form-group autocomplete"
                  v-for="(value, index) in habitAdd"
                >
                  <div class="d-flex justify-content-between">
                    <label for="name"
                      >Tên thói quen
                      {{ habitAdd.length == 1 ? "" : index + 1 }}(<span
                        style="color: red"
                        >*</span
                      >):</label
                    >
                    <label for="" class="d-flex flex-row-reverse"
                      ><span
                        @click="addInput()"
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
                    @input="habitValue = $event.target.value"
                    required
                    @focus="data.activeSuggest = index"
                    autocomplete="off"
                  />
                  <ul
                    v-show="
                      data.suggestList.length > 0 &&
                      data.activeSuggest == index &&
                      habitValue.length > 0
                    "
                    class="suggestions-list mt-1"
                  >
                    <li
                      v-for="(value1, index1) in data.suggestList"
                      class="suggestion-item w-100"
                      @click="value.name = value1.name, data.activeSuggest = -1"
                    >
                      {{ value1.name }}
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  class="btn btn-primary px-3 py-2"
                  style="font-size: 14px"
                  @click="createHabit"
                  id="add"
                >
                  <span>Thêm thói quen</span>
                </button>
              </form>
              <!-- page 2 -->
              <form v-if="data.activeStep == 2" action="" class="was-validated">
                <div class="form-group">
                  <label for="name"
                    >Tên sự kiện(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    v-model="eventAdd.name"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="content"
                    >Nội dung sự kiện(<span style="color: red">*</span>):</label
                  >
                  <textarea
                    id="content"
                    required
                    class="form-control"
                    v-model="eventAdd.content"
                    rows="5"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content"
                    >Thời gian diễn ra sự kiện(<span style="color: red">*</span
                    >):</label
                  >
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="time_duration"
                    name="time_duration"
                    v-model="eventAdd.time_duration"
                    required
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-primary px-3 py-2"
                  style="font-size: 14px"
                  @click="createEvent"
                  id="add"
                >
                  <span>Thêm sự kiện</span>
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
                  >Next
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
                  >Previous</span
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

.autocomplete {
  position: relative;
}

.input-text {
  width: 300px;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1;
}

.suggestion-item {
  padding: 8px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}
</style>
