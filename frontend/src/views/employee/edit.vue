<script>
import { reactive, ref, watch, onMounted, watchEffect } from "vue";
import Select from "../../components/form/select.vue";
import Employee from "../../services/employee.service";
// ******
import Select_Advanced from "../../components/form/select_advanced.vue";
import Position from "../../services/position.service";
// import SelectOption from "../../components/box_lananh/select_cdu.vue";
import CenterServices from "../../services/center_vnpt.service";
import departmentsServices from "../../services/department.service";
import unitsServices from "../../services/unit.service";
import Swal from "sweetalert2";

import {
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
} from "../../assets/js/common.alert";
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
} from "../../assets/js/common.http";
export default {
  components: {
    Select,
    // ***
    // SelectOption,
    Select_Advanced,
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
    updateAdd: { type: String, default: "" },
  },
  setup(props, ctx) {
    const data = reactive({
      stepList: [
        {
          _id: 1,
          name: "Thông tin",
        },
        {
          _id: 2,
          name: "Công việc",
        },
      ],
      activeStep: 1,
      item: { name: "", birthday: "", phone: "", email: "", address: "" },
      modelPos: "",
      modelValue: "",
      modelDep: "",
      modelUnit: "",
    });
    // ****REFRESH
    const refresh = async (name) => {
      switch (name) {
        case "position": {
          positions.position = await http_getAll(Position);
          break;
        }
        case "center": {
          centers.center = await http_getAll(CenterServices);
          break;
        }
        case "department": {
          departments.department = await http_getAll(departmentsServices);
          break;
        }
        case "unit": {
          units.unit = await http_getAll(unitsServices);
          break;
        }
      }
    };
    //POSITION
    const positions = reactive({ position: [] });
    const selectedOptionPosition = ref("Chức vụ");
    watch(selectedOptionPosition, async (newValue, oldValue) => {
      console.log("New Position:", newValue);
    });
    //CENTERS
    const centers = reactive({ center: [] });
    const selectedOptionCenter = ref("");
    watch(selectedOptionCenter, async (newValue, oldValue) => {
      departments.department = await departmentsServices.findAllDepOfACenter(
        newValue
      );
      units.unit = [];
      for (let val of departments.department) {
        var newData = await unitsServices.findAllUnitsOfADep(val._id);
        for (let value of newData) {
          units.unit.push(value);
        }
      }
    });

    //DEPARTMENTS
    //DEPARTMENTS
    const departments = reactive({ department: [] });
    const selectedOptionDepartment = ref("Phòng");
    watch(selectedOptionDepartment, async (newValue, oldValue) => {
      units.unit = await unitsServices.findAllUnitsOfADep(newValue);
    });

    //UNITS
    const units = reactive({
      unit: [],
    });
    const selectedOptionUnit = ref("Đơn vị");
    watch(selectedOptionUnit, (newValue, oldValue) => {
      console.log("New Unit:", newValue);
    });

    const refresh_add = async () => {
      positions.position = await Position.getAll();
      centers.center = await CenterServices.getAll();
      departments.department = await departmentsServices.getAll();
      units.unit = await unitsServices.getAll();
    };
    const onDeletePosition = async (value) => {
      console.log("Value delete:", value);
      const result = await alert_delete("Bạn muốn xóa", value.name);
      if (result) {
        await Position.delete(value._id);
        alert_success("Bạn đã xóa trung tâm", value.name);
        await refresh_add();
        ctx.emit("newPosition", positions.position);
      }
    };
    const onDeleteCenter = async (value) => {
      console.log("Value delete:", value);
      const result = await alert_delete("Bạn muốn xóa", value.name);
      if (result) {
        await CenterServices.deleteOne(value._id);
        alert_success("Bạn đã xóa trung tâm", value.name);
        await refresh_add();
        ctx.emit("newCenter", centers.center);
      }
    };
    const onDeleteDep = async (value) => {
      console.log("Value delete:", value);
      const result = await alert_delete("Bạn muốn xóa", value.name);
      if (result) {
        await departmentsServices.deleteOne(value._id);
        alert_success("Bạn đã xóa", value.name);
        await refresh_add();
        ctx.emit("newDep", departments.department);
      }
    };
    const onDeleteUnit = async (value) => {
      console.log("Value delete:", value);
      const result = await alert_delete("Bạn muốn xóa", value.name);
      if (result) {
        await unitsServices.deleteOne(value._id);
        alert_success("Bạn đã xóa ", value.name);
        await refresh_add();
        ctx.emit("newUnit", units.unit);
      }
    };
    const update = ref("");
    update.value = props.updateAdd;
    watchEffect(async () => {
      console.log("updateADD:", props.updateAdd);
      if (props.updateAdd) {
        console.log("updateADD:", props.updateAdd);
        await refresh_add();
        ctx.emit("restore", false);
      }
    });

    const showModal = ref(false);

    const closeModal = async () => {
      console.log("close modal");
      showModal.value = false;
      ctx.emit("refresh");
    };

    onMounted(async () => {
      console.log("Mouted updateAdd:", props.updateAdd);
      await refresh_add();
    });
    return {
      data,
      // ***
      positions,
      selectedOptionPosition,
      centers,
      selectedOptionCenter,
      departments,
      selectedOptionDepartment,
      units,
      selectedOptionUnit,
      refresh,
      refresh_add,
      onDeletePosition,
      onDeleteCenter,
      onDeleteDep,
      onDeleteUnit,
      //
      closeModal,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-edit">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Thêm thông tin nhân viên mới
          </h4>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            @click="closeModal"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="model-body" @click="closeModal">
          <div class="d-flex">
            <!-- steps -->
            <div class="d-flex flex-column" style="height: 100%">
              <div
                class="d-flex mt-3 mx-3"
                v-for="(value, index) in data.stepList"
                :key="index"
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
                    >Họ và tên(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    v-model="item.name"
                    required
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="birthday"
                    >Ngày sinh(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    id="birthday"
                    name="birthday"
                    v-model="item.birthday"
                    required
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="avatar"
                    >Avatar(<span style="color: red">*</span>):</label
                  >
                  <!-- Khum bít làm huhu -->
                  <input
                    type="text"
                    class="form-control"
                    id="avatar"
                    name="avatar"
                    v-model="item.avatar"
                    required
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="address"
                    >Địa chỉ(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="address"
                    name="address"
                    v-model="item.address"
                    required
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="phone"
                    >Số điện thoại(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="phone"
                    name="phone"
                    v-model="item.phone"
                    required
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="email"
                    >Email(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="email"
                    name="email"
                    v-model="item.email"
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
                <div class="form-group flex-grow-1">
                  <label for=""
                    >Chức vụ(<span style="color: red">*</span>):</label
                  >
                  <div class="form-group w-100">
                    <Select_Advanced
                      class="form-control"
                      required
                      :modelValue="item.Position.name"
                      :options="positions.position"
                      style="width: 100%; height: 100%"
                      @searchSelect="
                        async (value) => (
                          await refresh_add(),
                          (positions.position = positions.position.filter(
                            (value1, index) => {
                              console.log(value1, value);
                              return (
                                value1.name.includes(value) || value.length == 0
                              );
                            }
                          )),
                          console.log('searchSlect', value.length)
                        )
                      "
                      @delete="(value) => onDeletePosition(value)"
                      @choosed="(value) => (item.postionId = value)"
                    />
                  </div>
                </div>
                <div class="form-group flex-grow-1">
                  <label for=""
                    >Trung tâm(<span style="color: red">*</span>):</label
                  >
                  <div class="form-group w-100">
                    <Select_Advanced
                      class="form-control"
                      required
                      :options="centers.center"
                      :modelValue="item.Unit.Department.Center_VNPTHG.name"
                      style="width: 100%; height: 100%"
                      @searchSelect="
                        async (value) => (
                          await refresh_add(),
                          (centers.center = centers.center.filter(
                            (value1, index) => {
                              console.log(value1, value);
                              return (
                                value1.name.includes(value) || value.length == 0
                              );
                            }
                          )),
                          console.log('searchSlect', value.length)
                        )
                      "
                      @delete="(value) => onDeleteCenter(value)"
                      @choosed="(value) => (selectedOptionCenter = value)"
                    />
                  </div>
                </div>
                <div class="form-group flex-grow-1">
                  <label for=""
                    >Phòng(<span style="color: red">*</span>):</label
                  >
                  <Select_Advanced
                    class="form-control"
                    required
                    :options="departments.department"
                    :modelValue="item.Unit.Department.name"
                    style="width: 100%; height: 100%"
                    @searchSelect="
                      async (value) => (
                        await refresh_add(),
                        (departments.department = departments.department.filter(
                          (value1, index) => {
                            console.log(value1, value);
                            return (
                              value1.name.includes(value) || value.length == 0
                            );
                          }
                        )),
                        console.log('searchSlect', value.length)
                      )
                    "
                    @delete="(value) => onDeleteDep(value)"
                    @choosed="(value) => (selectedOptionDepartment = value)"
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="">Tổ(<span style="color: red">*</span>):</label>
                  <Select_Advanced
                    class="form-control"
                    :options="units.unit"
                    :modelValue="item.Unit.name"
                    style="width: 100%; height: 100%"
                    @searchSelect="
                      async (value) => (
                        await refresh_add(),
                        (units.unit = units.unit.filter((value1, index) => {
                          console.log(value1, value);
                          return (
                            value1.name.includes(value) || value.length == 0
                          );
                        })),
                        console.log('searchSlect', value.length)
                      )
                    "
                    @delete="(value) => onDeleteUnit(value)"
                    @choosed="(value) => (item.unitId = value)"
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-warning px-3 py-2"
                  style="font-size: 14px"
                  id="edit"
                  data-dismiss="modal"
                  @click="$emit('edit')"
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
</style>