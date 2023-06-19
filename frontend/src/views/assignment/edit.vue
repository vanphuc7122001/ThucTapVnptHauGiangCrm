<script>
import { reactive } from "vue";
export default {
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
    statustask:{
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
    });
    const update = () => {
      ctx.emit("update");
    };
    return {
      update,
      data,
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
                v-for="(value, index) in data.stepList" :key="value"
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
                    >Nội dung phân công(<span style="color: red">*</span>):</label
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
                <!-- <div class="form-group flex-grow-1">
                <label for="name"
                  >Tên sự kiện(<span style="color: red">*</span>):</label
                >
                <input
                  type="text"
                  class="form-control w-100"
                  id="name"
                  name="name"
                  v-model="item.name"
                  required
                />
              </div> -->
                <div class="form-group flex-grow-1">
                  <div class="form-group flex-grow-1">
                    <label for="content"
                      >Trạng thái phân công(<span style="color: red">*</span>):</label
                    >
                    <select
                      id=""
                      class="form-control"
                      required
                      v-model="item.StatusTaskId"
                    >
                      <option value="" disabled selected hidden>
                        Chọn trạng thái
                      </option>
                      <option
                        v-for=" statustask in statustask"
                        :key="statustask"
                        :value="statustask._id"
                      >
                        {{ statustask.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <!-- <div class="form-group flex-grow-1">
                  <div class="form-group flex-grow-1">
                    <label for="content"
                      >Đánh giá phân công(<span style="color: red">*</span>):</label
                    >
                    <select
                      id=""
                      class="form-control"
                      required
                      v-model="item.EvaluateId"
                    >
                      <option value="" disabled selected hidden>
                        Chọn sao
                      </option>
                      <option
                        v-for=" evaluate in evaluate"
                        :key="evaluate"
                        :value="evaluate._id"
                      >
                        {{ evaluate.star }}
                      </option>
                    </select>
                  </div>
                </div> -->
                
                <div class="form-group flex-grow-1">
                  <label for="content"
                    >Chú thích(<span style="color: red">*</span
                    >):</label
                  >
                  <textarea
                    v-model="item.note"
                    id="content"
                    required
                    class="form-control w-100"
                    rows="5"
                  ></textarea>
                </div>
                <!-- <div class="form-group flex-grow-1">
                  <label for="content"
                    >Nhận xét của khách hàng(<span style="color: red">*</span
                    >):</label
                  >
                  <textarea
                    v-model="item.Comment.content"
                    id="content"
                    required
                    class="form-control w-100"
                    rows="5"
                  ></textarea>
                </div> -->
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
