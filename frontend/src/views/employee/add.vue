<script>
import { reactive, ref, watch, onMounted, watchEffect } from "vue";
import Select from "../../components/form/select.vue";
import Employee from "../../services/employee.service";
// ******
import Select_Advanced from "../../components/form/select_advanced.vue";
import Position from "../../services/position.service";
import Role from "../../services/role.service";
import Account from "../../services/account.service";
import SelectOption from "../../components/box_lananh/select_cdu.vue";
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
import { http_getAll, http_create } from "../../assets/js/common.http";
import mailService from "../../services/mail.service";

export default {
  components: {
    Select,
    // ***
    SelectOption,
    Select_Advanced,
  },
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
          name: "Thông tin",
        },
        {
          _id: 2,
          name: "Công việc",
        },
        {
          _id: 3,
          name: "Tài khoản",
        },
      ],
      activeStep: 1,
      item: {
        name: "",
        birthday: "",
        phone: "",
        email: "",
        address: "",
        password: "",
      },
      modelPos: "",
      modelValue: "",
      modelDep: "",
      modelUnit: "",
      roles: [],
      modelRole: "",
    });

    const create = async () => {
      const dataMail = reactive({
        title: "Thông tin tài khoản nhân viên",
        content: `<div>
                    <h3>Dear ${data.item.name}</h3>
                    <p>Chào mừng bạn đã trở thành nhân viên chính thức của công ty.</p>
                    <p>Và đây là thông tin tài khoản của bạn để đăng nhập vào hệ thống</p>
                    <p>quản lý chăm sóc khách hàng trong suốt quá trình làm việc tại công ty</p>
                    <p>Tài khoản: ${data.item.user_name}</p>
                    <p>Mật Khẩu: ${data.item.password} </p>
                    <p>-----------------------------------------------------------------------</p>
                    <p><span style="font-weight: bold;">Địa chỉ:</span> 61 Võ Văn Kiệt, Phường 5, Vị Thanh, Hậu Giang 95000</p>
                    <p><span style="font-weight: bold;">Điện thoại:</span> 097 747 42 44</p>
	                </div>`,
        mail: data.item.email,
      });

      console.log("NDMail:", dataMail);

      data.item.unitId = selectedOptionUnit.value;
      data.item.postionId = selectedOptionPosition.value;

      data.item.checkUser = true;
      const account = await http_create(Account, data.item);
      if (account.user_name == true) {
        console.log("item", data.item);
        const result = await http_create(Employee, data.item);
        data.item.checkUser = false;
        console.log("result", result);
        if (!result.error) {
          data.item.EmployeeId = result.document._id;
          const account = await http_create(Account, data.item);
          alert_success(
            `Thêm nhân viên`,
            `Nhân viên "${result.document.name}" đã được tạo thành công.`
          );
          await mailService.sendmail(dataMail);

          refresh();
        } else if (result.error) {
          alert_error(`Thêm nhân viên`, `${result.msg}`);
        }
        ctx.emit("create");
        data.item = {
          name: "",
          birthday: "",
          phone: "",
          email: "",
          address: "",
        };
        data.modelValue = "";
        data.modelDep = "";
        data.modelUnit = "";
        data.modelPos = "";
        data.modelRole = "";
        data.item.password = setAccount();
      } else if (account.user_name == false) {
        alert_error(`Thêm nhân viên`, `${account.msg}`);
      }
    };

    const setAccount = () => {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let password = "";

      for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      // data.item.password = password;
      return password;
    };
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
    let selectedOptionPosition = ref("Chức vụ");
    watch(selectedOptionPosition, async (newValue, oldValue) => {
      console.log("New Position:", newValue);
      // Alert add center
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
            data.modelPos = document.document.name;
            positions.position.push({ _id: "other", name: "khác" });
            ctx.emit("newPosition", positions.position);
            selectedOptionPosition.value = document.document._id;
          }
          return true;
        };
        showSweetAlert();
        selectedOptionPosition.value = 0;
      }
    });
    //CENTERS
    const centers = reactive({ center: [] });
    let selectedOptionCenter = ref("0");
    watch(selectedOptionCenter, async (newValue, oldValue) => {
      console.log("selectedOptionCenter", selectedOptionCenter.value);
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
            data.modelValue = document.document.name;
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
    let selectedOptionDepartment = ref("Phòng");
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
            data.modelDep = document.document.name;
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
    });

    //UNITS
    const units = reactive({
      unit: [],
    });
    let selectedOptionUnit = ref("Đơn vị");
    watch(selectedOptionUnit, (newValue, oldValue) => {
      console.log("New Unit:", newValue);
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
              const selectedOptionCenter =
                document.getElementById("my-select-center").value;
              const selectedOptionDep =
                document.getElementById("my-select-dep").value;

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
                ${
                  option._id == selectedOptionDepartment.value ? "selected" : ""
                }

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
            console.log(
              "Selected Option Center:",
              formValues.selectedOptionCenter
            );
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

            await refresh("unit");
            units.unit.push({ _id: "other", name: "khác" });

            ctx.emit("newUnit", units.unit);
            selectedOptionUnit.value = document.document._id;
            data.modelUnit = document.document.name;
          }
        };

        // Gọi hàm showSweetAlert khi bạn muốn hiển thị SweetAlert
        showSweetAlert();
        selectedOptionUnit.value = 0;
      }
    });

    const refresh_add = async () => {
      positions.position = await Position.getAll();
      positions.position.push({ _id: "other", name: "khác" });
      centers.center = await CenterServices.getAll();
      centers.center.push({ _id: "other", name: "khác" });
      departments.department = await departmentsServices.getAll();
      departments.department.push({ _id: "other", name: "khác" });

      units.unit = await unitsServices.getAll();
      units.unit.push({ _id: "other", name: "khác" });
    };
    const onDeletePosition = async (value) => {
      console.log("Value delete:", value);
      const result = await alert_delete("Bạn muốn xóa chức vụ", value.name);
      console.log("result", result, value);
      if (result) {
        console.log("abbbbba");
        const a = await Position.delete(value._id);
        console.log(a);
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

    onMounted(async () => {
      await refresh_add();
      data.item.password = setAccount();
      data.roles = await http_getAll(Role);
    });
    return {
      data,
      create,
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
            Thêm thông tin nhân viên mới
          </h4>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            @click="activeStep = 1"
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
                    v-model="data.item.name"
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
                    v-model="data.item.birthday"
                    required
                  />
                </div>
                <!-- <div class="form-group flex-grow-1">
                  <label for="avatar"
                    >Avatar(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="avatar"
                    name="avatar"
                    v-model="data.item.avatar"
                    required
                  />
                </div> -->
                <div class="form-group flex-grow-1">
                  <label for="address"
                    >Địa chỉ(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="address"
                    name="address"
                    v-model="data.item.address"
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
                    v-model="data.item.phone"
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
                    v-model="data.item.email"
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
                      required
                      :options="positions.position"
                      :modelValue="data.modelPos"
                      style="height: 40px"
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
                      @chose="
                        (value, value1) => (
                          (selectedOptionPosition = value),
                          (data.modelPos = value1.name)
                        )
                      "
                    />
                  </div>
                </div>
                <div class="form-group flex-grow-1">
                  <label for=""
                    >Trung tâm(<span style="color: red">*</span>):</label
                  >
                  <div class="form-group w-100">
                    <Select_Advanced
                      required
                      :options="centers.center"
                      :modelValue="data.modelValue"
                      style="width: 100%; height: 40px"
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
                      @chose="
                        (value, value1) => (
                          (selectedOptionCenter = value),
                          (data.modelValue = value1.name)
                        )
                      "
                    />
                  </div>
                </div>
                <div class="form-group flex-grow-1">
                  <label for=""
                    >Phòng(<span style="color: red">*</span>):</label
                  >
                  <Select_Advanced
                    required
                    :options="departments.department"
                    :modelValue="data.modelDep"
                    style="width: 100%; height: 40px"
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
                    @chose="
                      (value, value1) => (
                        (selectedOptionDepartment = value),
                        (data.modelDep = value1.name)
                      )
                    "
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="">Tổ(<span style="color: red">*</span>):</label>
                  <Select_Advanced
                    :options="units.unit"
                    :modelValue="data.modelUnit"
                    style="width: 100%; height: 40px"
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
                    @chose="
                      (value, value1) => (
                        (selectedOptionUnit = value),
                        value,
                        (data.modelUnit = value1.name)
                      )
                    "
                  />
                </div>
              </form>
              <!-- page3 -->
              <form
                v-if="data.activeStep == 3"
                action=""
                class="was-validated"
                style="width: 100%"
              >
                <div class="form-group flex-grow-1">
                  <label for="name"
                    >Tên tài khoản(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    v-model="data.item.user_name"
                    required
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="birthday"
                    >Mật khẩu(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="birthday"
                    name="birthday"
                    v-model="data.item.password"
                    required
                  />
                </div>
                <div class="form-group flex-grow-1">
                  <label for="avatar"
                    >Vai trò(<span style="color: red">*</span>):</label
                  >
                  <Select_Advanced
                    required
                    :options="data.roles"
                    :modelValue="data.modelRole"
                    style="height: 40px"
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
                    @chose="
                      (value, value1) => (
                        (data.item.roleId = value),
                        (data.modelRole = value1.name)
                      )
                    "
                  />
                </div>
                <b-button
                  type="submit"
                  class="btn btn-primary px-3 py-2"
                  style="font-size: 14px"
                  @click="create"
                  id="add"
                  data-dismiss="modal"
                >
                  <span>Thêm</span>
                </b-button>
              </form>
              <div class="d-flex justify-content-end mt-3">
                <span
                  v-if="
                    data.activeStep > 1 &&
                    data.activeStep <= data.stepList.length
                  "
                  class="btn-prev d-flex align-items-center px-3 py-1 mr-3"
                  @click="data.activeStep = data.activeStep - 1"
                  ><span
                    class="material-symbols-outlined d-flex align-items-center"
                  >
                    navigate_before </span
                  >Trang trước</span
                >
                <span
                  v-if="
                    data.activeStep >= 1 &&
                    data.activeStep < data.stepList.length
                  "
                  class="btn-next d-flex align-items-center px-3 py-1"
                  @click="data.activeStep = data.activeStep + 1"
                  >Trang tiếp theo
                  <span
                    class="material-symbols-outlined d-flex align-items-center"
                  >
                    navigate_next
                  </span>
                </span>
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
