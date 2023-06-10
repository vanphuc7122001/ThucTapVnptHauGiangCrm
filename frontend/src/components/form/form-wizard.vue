<script>
import { reactive } from "vue";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({
      stepList: [
        {
          _id: 1,
          name: "Parents",
        },
        {
          _id: 2,
          name: "Child",
        },
      ],
      activeStep: 1,
    });
    const create = () => {
      ctx.emit("create");
    };
    return {
      create,
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
          <h4 class="modal-title" style="font-size: 15px">Thêm sự kiện mới</h4>
          <button type="button" class="close" data-dismiss="modal">
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
                    >Tên sự kiện(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control w-100"
                    id="name"
                    name="name"
                    v-model="item.a"
                    required
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="content"
                    >Nội dung sự kiện(<span style="color: red">*</span>):</label
                  >
                  <textarea
                    id="content"
                    required
                    class="form-control w-100"
                    rows="5"
                  ></textarea>
                </div>
                <div class="form-group flex-grow-1">
                  <label for="content"
                    >Thời gian diễn ra sự kiện(<span style="color: red">*</span
                    >):</label
                  >
                  <input
                    type="datetime-local"
                    class="form-control w-100"
                    id="time_duration"
                    name="time_duration"
                    required
                  />
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
                  <label for="content"
                    >Nội dung sự kiện(<span style="color: red">*</span>):</label
                  >
                  <textarea
                    id="content"
                    required
                    class="form-control w-100"
                    rows="5"
                    v-model="item.b"
                  ></textarea>
                </div>
                <div class="form-group flex-grow-1">
                  <label for="content"
                    >Thời gian diễn ra sự kiện(<span style="color: red">*</span
                    >):</label
                  >
                  <input
                    type="datetime-local"
                    class="form-control w-100"
                    id="time_duration"
                    name="time_duration"
                    required
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-primary px-3 py-2"
                  style="font-size: 14px"
                  @click="$emit('create')"
                  id="add"
                >
                  <span>Thêm</span>
                </button>
              </form>
              <div class="d-flex justify-content-end mt-3">
                <span
                  v-if="data.activeStep >= 1 && data.activeStep < data.stepList.length"
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
                  v-if="data.activeStep > 1 && data.activeStep <= data.stepList.length"
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
</style>
