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
      if (newValue == 0) return;
      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: PositionName } = await Swal.fire({
            title: "Thêm mới chức vụ",
            input: "text",
            inputLabel: "Tên chức vụ",
            inputValue: "",
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return "Tên chức vụ không được bỏ trống";
              }
            },
          });

          if (PositionName) {
            const document = await Position.create({ name: PositionName });
            if (document.error) {
              alert_warning(`Đã tồn tại chức vụ `, `${PositionName}`);
              return false;
            }
            alert_success(`Đã thêm chức vụ`, `${PositionName}`);
            await refresh("position");
            props.item.Position.name = document.document.name;
            positions.position.push({ _id: "other", name: "khác" });
            ctx.emit("newPosition", positions.position);
            selectedOptionPosition.value = document.document._id;
          }
          return true;
        };
        showSweetAlert();
        selectedOptionPosition.value = 0;
      }
      props.item.postionId = selectedOptionPosition.value;
      console.log("P:", props.item.postionId);
    });
    //CENTERS
    const centers = reactive({ center: [] });
    const selectedOptionCenter = ref("");
    watch(selectedOptionCenter, async (newValue, oldValue) => {
      console.log("center:", newValue);
      departments.department = await departmentsServices.findAllDepOfACenter(newValue);
      units.unit = [];
      for (let val of departments.department) {
        var newData = await unitsServices.findAllUnitsOfADep(val._id);
        for (let value of newData) {
          units.unit.push(value);
        }
      }
      departments.department.push({ _id: "other", name: "khác" });
      units.unit.push({ _id: "other", name: "khác" });
      // Alert add center
      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: CenterName } = await Swal.fire({
            title: "Thêm mới trung tâm",
            input: "text",
            inputLabel: "Tên trung tâm",
            inputValue: "",
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return "Tên trung tâm không được bỏ trống";
              }
            },
          });

          if (CenterName) {
            const document = await CenterServices.create({ name: CenterName });
            if (document.error) {
              alert_warning(`Đã tồn tại trung tâm `, `${CenterName}`);
              return false;
            }
            alert_success(`Đã thêm trung tâm`, `${CenterName}`);
            await refresh("center");
            props.item.Unit.Department.Center_VNPTHG.name = document.document.name;
            selectedOptionCenter.value = document.document._id;
            centers.center.push({ _id: "other", name: "khác" });
            ctx.emit("newCenter", centers.center);
          }
          return true;
        };
        showSweetAlert();
        selectedOptionCenter.value = 0;
      }
    });

    //DEPARTMENTS
    const departments = reactive({ department: [] });
    const selectedOptionDepartment = ref("Phòng");
    watch(selectedOptionDepartment, async (newValue, oldValue) => {
      units.unit = await unitsServices.findAllUnitsOfADep(newValue);
      units.unit.push({ _id: "other", name: "khác" });

      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: formValues } = await Swal.fire({
            title: "Thêm phòng mới",
            html: `
      <select id="my-select" class="swal2-input form-control  ml-3 mx-2" style="width:92%"  >
        <option value="">Trung tâm</option>
        ${centers.center
          .map(
            (option) =>
              `<option value="${option._id}" ${
                option._id == selectedOptionCenter.value ? "selected" : ""
              }
               > ${option.name}</option>`
          )
          .join("")}
      </select>

      </select>
      <input id="my-input" class="swal2-input form-control  m-3" style="width:92%" type="text" placeholder="Tên phòng">
    `,
            showCancelButton: true,
            focusConfirm: false,
            preConfirm: () => {
              const selectedOption = document.getElementById("my-select").value;
              const inputValue = document.getElementById("my-input").value;
              if (!selectedOption || !inputValue) {
                Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin");
              }

              return {
                selectedOption,
                inputValue,
              };
            },
          });

          if (formValues) {
            // Xử lý giá trị selectedOption và giá trị inputValue
            // console.log("Selected Option:", formValues.selectedOption);
            // console.log("Input Value:", formValues.inputValue);
            const document = await departmentsServices.create({
              centerVNPTHGId: formValues.selectedOption,
              name: formValues.inputValue,
            });
            if (document.error) {
              alert_warning(`Đã tồn tại phòng `, `${formValues.inputValue}`);
              return;
            }
            alert_success(`Đã thêm phòng`, `${formValues.inputValue}`);
            props.item.Unit.Department.name = document.document.name;
            selectedOptionDepartment.value = document.document._id;
            await refresh("department");
            departments.department.push({ _id: "other", name: "khác" });
            ctx.emit("newDep", departments.department);
          }
        };

        // Gọi hàm showSweetAlert khi bạn muốn hiển thị SweetAlert
        showSweetAlert();
        selectedOptionDepartment.value = 0;
      }
      departments.department = await departmentsServices.findAllDepOfACenter(
        selectedOptionCenter.value
      );
      departments.department.push({ _id: "other", name: "khác" });
    });
    //UNITS
    const units = reactive({
      unit: [],
    });
    const selectedOptionUnit = ref("Đơn vị");
    watch(selectedOptionUnit, async (newValue, oldValue) => {
      console.log("New Unit:", newValue);
      if (newValue == "") return;
      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: formValues } = await Swal.fire({
            title: "Thêm phòng mới",
            html: `
      <select id="my-select-center" class="swal2-input form-control  ml-3 mb-3 mx-2" style="width:92%">
        <option value="">Trung tâm</option>
        ${centers.center
          .map(
            (option) => `<option value="${option._id}"
            ${option._id == selectedOptionCenter.value ? "selected" : ""}
            >${option.name}</option>`
          )
          .join("")}
      </select>
      <select id="my-select-dep" class="swal2-input form-control  ml-3  mx-2" style="width:92%" >
        <option value="">Phòng</option>

      </select>
      </select>
      <input id="my-input" class="swal2-input form-control  m-3" style="width:92%" type="text" placeholder="Tên tổ">
    `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
              const selectedOptionCenter = document.getElementById("my-select-center")
                .value;
              const selectedOptionDep = document.getElementById("my-select-dep").value;

              const inputValue = document.getElementById("my-input").value;
              if (!selectedOptionCenter || !inputValue || !selectedOptionDep) {
                Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin");
              }

              return {
                selectedOptionCenter,
                selectedOptionDep,
                inputValue,
              };
            },
            didOpen: async () => {
              const center = document.getElementById("my-select-center");
              const dep = document.getElementById("my-select-dep");

              const Id = center.value;
              departments.department =
                (await departmentsServices.findAllDepOfACenter(Id)) || [];

              dep.innerHTML = `
          <option value="">Phòng</option>
          ${departments.department
            .map(
              (option) =>
                `<option value="${option._id}"
                ${option._id == selectedOptionDepartment.value ? "selected" : ""}

                >${option.name}</option>`
            )
            .join("")}
        `;
              center.addEventListener("change", async () => {
                const Id = center.value;
                departments.department =
                  (await departmentsServices.findAllDepOfACenter(Id)) || [];

                dep.innerHTML = `

          ${departments.department
            .map(
              (option) =>
                `<option value="${option._id}"

                >${option.name}</option>`
            )
            .join("")}
        `;
              });
            },
          });

          if (formValues) {
            // Xử lý giá trị selectedOption và giá trị inputValue
            console.log("Selected Option Center:", formValues.selectedOptionCenter);
            console.log("Selected Option dep:", formValues.selectedOptionDep);

            console.log("Input Value:", formValues.inputValue);
            const document = await unitsServices.create({
              departmentId: formValues.selectedOptionDep,
              name: formValues.inputValue,
            });
            if (document.error) {
              alert_warning(`Đã tồn tại  `, `${formValues.inputValue}`);
              return;
            }
            alert_success(`Đã thêm `, `${formValues.inputValue}`);

            await refresh_add();
            units.unit.push({ _id: "other", name: "khác" });

            ctx.emit("newUnit", units.unit);
            selectedOptionUnit.value = document.document._id;
            props.Unit.name = document.document.name;
            console.log("U:", props.unitId);
          }
        };

        // Gọi hàm showSweetAlert khi bạn muốn hiển thị SweetAlert
        showSweetAlert();
        selectedOptionUnit.value = "";
      }
      units.unit = await unitsServices.findAllUnitsOfADep(selectedOptionDepartment.value);
      units.unit.push({ _id: "other", name: "khác" });
      props.item.unitId = selectedOptionUnit.value;
      console.log("U:", props.item.unitId);
    });

    const refresh_add = async () => {
      positions.position = await Position.getAll();
      positions.position.push({ _id: "other", name: "khác" });
      centers.center = await CenterServices.getAll();
      centers.center.push({ _id: "other", name: "khác" });
      departments.department = await departmentsServices.findAllDepOfACenter(
        selectedOptionCenter.value
      );
      departments.department.push({ _id: "other", name: "khác" });
      units.unit = await unitsServices.findAllUnitsOfADep(selectedOptionDepartment.value);
      units.unit.push({ _id: "other", name: "khác" });
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
        await CenterServices.delete(value._id);
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
      if (props.updateAdd) {
        await refresh_add();
        ctx.emit("restore", false);
      }
    });

    const showModal = ref(false);

    const closeModal = async () => {
      // console.log("close modal");
      // showModal.value = false;
      // ctx.emit("refresh");
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
          <button type="button" class="close" data-dismiss="modal" @click="closeModal">
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
                  <label for="name">Họ và tên(<span style="color: red">*</span>):</label>
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
                  <label for="address">Địa chỉ(<span style="color: red">*</span>):</label>
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
                  <label for="email">Email(<span style="color: red">*</span>):</label>
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
                  <label for="">Chức vụ(<span style="color: red">*</span>):</label>
                  <div class="form-group w-100">
                    <Select_Advanced
                      required
                      :modelValue="item.Position.name"
                      :options="positions.position"
                      style="height: 40px"
                      @searchSelect="
                        async (value) => (
                          await refresh_add(),
                          (positions.position = positions.position.filter(
                            (value1, index) => {
                              console.log(value1, value);
                              return value1.name.includes(value) || value.length == 0;
                            }
                          )),
                          console.log('searchSlect', value.length)
                        )
                      "
                      @delete="(value) => onDeletePosition(value)"
                      @chose="
                        (value, value1) => {
                          selectedOptionPosition = value;
                          item.Position.name = value1.name;
                        }
                      "
                    />
                  </div>
                </div>
                <div class="form-group flex-grow-1">
                  <label for="">Trung tâm(<span style="color: red">*</span>):</label>
                  <div class="form-group w-100">
                    <Select_Advanced
                      required
                      :options="centers.center"
                      :modelValue="item.Unit.Department.Center_VNPTHG.name"
                      style="height: 40px"
                      @searchSelect="
                        async (value) => (
                          await refresh_add(),
                          (centers.center = centers.center.filter((value1, index) => {
                            console.log(value1, value);
                            return value1.name.includes(value) || value.length == 0;
                          })),
                          console.log('searchSlect', value.length)
                        )
                      "
                      @delete="(value) => onDeleteCenter(value)"
                      @chose="
                        (value, value1) => (
                          (selectedOptionCenter = value),
                          (item.Unit.Department.Center_VNPTHG.name = value1.name)
                        )
                      "
                    />
                  </div>
                </div>
                <div class="form-group flex-grow-1">
                  <label for="">Phòng(<span style="color: red">*</span>):</label>
                  <Select_Advanced
                    required
                    :options="departments.department"
                    :modelValue="item.Unit.Department.name"
                    style="height: 40px"
                    @searchSelect="
                      async (value) => (
                        await refresh_add(),
                        (departments.department = departments.department.filter(
                          (value1, index) => {
                            console.log(value1, value);
                            return value1.name.includes(value) || value.length == 0;
                          }
                        )),
                        console.log('searchSlect', value.length)
                      )
                    "
                    @delete="(value) => onDeleteDep(value)"
                    @chose="
                      (value, value1) => {
                        (selectedOptionDepartment = value),
                          (item.Unit.Department.name = value1.name);
                      }
                    "
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="">Tổ(<span style="color: red">*</span>):</label>
                  <Select_Advanced
                    :options="units.unit"
                    :modelValue="item.Unit.name"
                    style="height: 40px"
                    @searchSelect="
                      async (value) => (
                        await refresh_add(),
                        (units.unit = units.unit.filter((value1, index) => {
                          console.log(value1, value);
                          return value1.name.includes(value) || value.length == 0;
                        })),
                        console.log('searchSlect', value.length)
                      )
                    "
                    @delete="(value) => onDeleteUnit(value)"
                    @chose="
                      (value, value1) => {
                        (selectedOptionUnit = value), (item.Unit.name = value1.name);
                      }
                    "
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
                  v-if="data.activeStep >= 1 && data.activeStep < data.stepList.length"
                  class="btn-next d-flex align-items-center px-3 py-1"
                  @click="data.activeStep = 2"
                  >Trang tiếp theo
                  <span class="material-symbols-outlined d-flex align-items-center">
                    navigate_next
                  </span>
                </span>
                <span
                  v-if="data.activeStep > 1 && data.activeStep <= data.stepList.length"
                  class="btn-prev d-flex align-items-center px-3 py-1"
                  @click="data.activeStep = 1"
                  ><span class="material-symbols-outlined d-flex align-items-center">
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
