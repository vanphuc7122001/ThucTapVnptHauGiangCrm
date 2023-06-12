<script>
import Mail from "../../components/box_lananh/mail.vue";
import mailService from "../../services/mail.service";
/////
import Table from "../../components/table/table_employee.vue";
import Pagination from "../../components/table/pagination_duy.vue";
import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Search from "../../components/form/search.vue";
import DeleteAll from "../../components/form/delete-all.vue";
import Add1 from "./add.vue";
// import Add from "./add.vue";
import Edit from "./edit.vue";
import View from "./view.vue";
import Select_Advanced from "../../components/form/select_advanced.vue";
import { reactive, computed, watch, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
//service
import Employee from "../../services/employee.service";
import Position from "../../services/position.service";
import CenterServices from "../../services/center_vnpt.service";
import departmentsServices from "../../services/department.service";
import unitsServices from "../../services/unit.service";
import Swal from "sweetalert2";
import FormWizard from "../../components/form/form-wizard.vue";
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
} from "../../assets/js/common.http";
import {
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
} from "../../assets/js/common.alert";
import SelectCDU from "../../components/box_lananh/select_cdu.vue";
export default {
  components: {
    Table,
    Pagination,
    Dropdown,
    Select,
    Search,
    // Add,
    DeleteAll,
    Edit,
    View,

    Select_Advanced,
    Add1,
    Mail,
    FormWizard,
    SelectCDU,
  },
  setup(ctx) {
    const data = reactive({
      items: [
        {
          _id: "",
          name: "",
          Position: {
            _id: "",
            name: "",
          },
          unitId: "",
          Unit: {
            _id: "",
            name: "",
            Department: {
              _id: "",
              name: "",
              Center_VNPTHG: {
                _id: "",
                name: "",
              },
            },
          },
        },
      ],
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeEdit: false,
      editValue: {},

      viewValue: {
        _id: "",
        name: "",
        birthday: "",
        // avatar: "",
        address: "",
        phone: "",
        email: "",
        Position: {
          _id: "",
          name: "",
        },
        Unit: {
          _id: "",
          name: "",
          Department: {
            _id: "",
            name: "",
            Center_VNPTHG: {
              name: "",
              _id: "",
            },
          },
        },
      },
      modelPositon: "Chức vụ",
      modelValue: "Trung tâm",
      modelDep: "Phòng",
      modelUnit: "Tổ",
    });

    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [
          value.name,
          value.phone,
          value.Position.name,
          value.Unit.name,
          value.Unit.Department.name,
          value.Unit.Department.Center_VNPTHG.name,
        ]
          .join("")
          .toLocaleLowerCase();
      });
    });
    const filter = computed(() => {
      return data.items.filter((value, index) => {
        return toString.value[index].includes(
          data.searchText.toLocaleLowerCase()
        );
      });
    });
    const filtered = computed(() => {
      if (!data.searchText) {
        data.totalRow = data.items.length;
        return data.items;
      } else {
        data.totalRow = filter.value.length;
        return filter.value;
      }
    });
    const setNumberOfPages = computed(() => {
      return Math.ceil(filtered.value.length / data.entryValue);
    });
    const setPages = computed(() => {
      if (data.items.length > 0) {
        if (setNumberOfPages.value == 0 || data.entryValue == "All") {
          data.entryValue = data.items.length;
          data.numberOfPages = 1;
        } else data.numberOfPages = setNumberOfPages.value;
        data.startRow = (data.currentPage - 1) * data.entryValue + 1;
        data.endRow = data.currentPage * data.entryValue;
        return filtered.value.filter((item, index) => {
          return (
            index + 1 > (data.currentPage - 1) * data.entryValue &&
            index + 1 <= data.currentPage * data.entryValue
          );
        });
      } else return data.items.value;
    });

    const router = useRouter();

    // watch
    const activeMenu = ref(1);

    // methods
    const create = async () => {
      refresh();
    };

    const update = (item) => {
      console.log("updating", item);
    };

    const deleteOne = async (_id) => {
      const employee = await http_getOne(Employee, _id);
      console.log("deleting", employee);
      const isConfirmed = await alert_delete(
        `Xoá nhân viên`,
        `Bạn có chắc chắn muốn xoá nhân viên "${employee.name}" không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Employee, _id);
        alert_success(
          `Xoá nhân viên`,
          `Bạn đã xoá thành công nhân viên "${result.document.name}".`
        );
        refresh();
      }
    };

    const edit = async (editValue) => {
      console.log(editValue);
      const result = await http_update(Employee, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa nhân viên`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa nhân viên`, `${result.msg}`);
      }
    };

    const refresh = async () => {
      data.positions = await http_getAll(Position);
      data.items = await http_getAll(Employee);
      centers.center = await CenterServices.getAll();
      centers.center.push({ _id: "other", name: "khác" });
      departments.department = await departmentsServices.getAll();
      departments.department.push({ _id: "other", name: "khác" });

      units.unit = await unitsServices.getAll();
      units.unit.push({ _id: "other", name: "khác" });
      positions.position = await http_getAll(Position);
      positions.position.push({ _id: "other", name: "khác" });
    };

    // ****** trung tâm ******
    const centers = reactive({ center: [] });
    const selectedOptionCenter = ref("");
    watch(selectedOptionCenter, async (newValue, oldValue) => {
      if (newValue == "") {
        return;
      }

      const doc = ref("");
      doc.value = await CenterServices.get(selectedOptionCenter.value);
      data.modelValue = doc.value.name;
      data.items = await http_getAll(Employee);
      if (selectedOptionPosition.value != "") {
        data.items = data.items.filter((val, index) => {
          return (
            val.Unit.Department.Center_VNPTHG._id ==
              selectedOptionCenter.value &&
            val.Position._id == selectedOptionPosition.value
          );
        });
      } else {
        data.items = data.items.filter((val, index) => {
          return (
            val.Unit.Department.Center_VNPTHG._id == selectedOptionCenter.value
          );
        });
      }
      departments.department = await departmentsServices.findAllDepOfACenter(
        newValue
      );
      units.unit = [];
      departments.department.push({ _id: "other", name: "khác" });

      for (let val of departments.department) {
        var newData = await unitsServices.findAllUnitsOfADep(val._id);
        for (let value of newData) {
          units.unit.push(value);
        }
      }
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
            await refresh();
            data.modelValue = document.document.name;
            updateAdd.value = true;
          }
          return true;
        };
        showSweetAlert();
      } else if (newValue == "all") {
        await refresh();
        selectedOptionCenter.value = "";
        selectedOptionDepartment.value = "";
        selectedOptionUnit.value = "";
        selectedOptionPosition.value = "";
      }
    });

    //DEP
    const departments = reactive({ department: [] });
    const selectedOptionDepartment = ref("");
    watch(selectedOptionDepartment, async (newValue, oldValue) => {
      if (newValue == "") {
        return;
      }
      const doc = ref("");
      doc.value = await CenterServices.get(selectedOptionCenter.value);
      data.modelValue = doc.value.name;
      const docDep = ref("");
      docDep.value = await departmentsServices.getOne(
        selectedOptionDepartment.value
      );
      data.modelDep = docDep.value.name;
      data.items = await http_getAll(Employee);
      if (selectedOptionPosition.value != "") {
        data.items = data.items.filter((val, index) => {
          return (
            val.Unit.Department.Center_VNPTHG._id ==
              selectedOptionCenter.value &&
            val.Unit.Department._id == selectedOptionDepartment.value &&
            val.Position._id == selectedOptionPosition.value
          );
        });
      } else {
        data.items = data.items.filter((val, index) => {
          return (
            val.Unit.Department.Center_VNPTHG._id ==
              selectedOptionCenter.value &&
            val.Unit.Department._id == selectedOptionDepartment.value
          );
        });
      }

      units.unit = await unitsServices.findAllUnitsOfADep(newValue);
      units.unit.push({ _id: "other", name: "khác" });

      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: formValues } = await Swal.fire({
            title: "Thêm phòng mới",
            html: `
      <select id="my-select" class="swal2-input  mx-2" style="width:92%"  >
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
            await refresh();
            updateAdd.value = true;
          }
        };

        // Gọi hàm showSweetAlert khi bạn muốn hiển thị SweetAlert
        showSweetAlert();
      } else if (newValue == "all") {
        await refresh();
        selectedOptionCenter.value = "";
        selectedOptionDepartment.value = "";
        selectedOptionUnit.value = "";
        selectedOptionPosition.value = "";
      }
    });

    //UNIT
    const units = reactive({
      unit: [],
    });
    const selectedOptionUnit = ref("Đơn vị");
    watch(selectedOptionUnit, async (newValue, oldValue) => {
      if (newValue == "") {
        return;
      }
      const doc = ref("");
      doc.value = await CenterServices.get(selectedOptionCenter.value);
      data.modelValue = doc.value.name;
      // DEP
      const docDep = ref("");
      docDep.value = await departmentsServices.getOne(
        selectedOptionDepartment.value
      );
      //UNIT
      const docUnit = ref("");
      docUnit.value = await unitsServices.getOne(selectedOptionUnit.value);
      data.modelUnit = docUnit.value.name;

      data.items = await http_getAll(Employee);
      if (selectedOptionPosition.value != "") {
        data.items = data.items.filter((val, index) => {
          return (
            val.Unit.Department.Center_VNPTHG._id ==
              selectedOptionCenter.value &&
            val.Unit.Department._id == selectedOptionDepartment.value &&
            val.unitId == selectedOptionUnit.value &&
            val.Position._id == selectedOptionPosition.value
          );
        });
      } else {
        data.items = data.items.filter((val, index) => {
          return (
            val.Unit.Department.Center_VNPTHG._id ==
              selectedOptionCenter.value &&
            val.Unit.Department._id == selectedOptionDepartment.value &&
            val.unitId == selectedOptionUnit.value
          );
        });
      }
      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: formValues } = await Swal.fire({
            title: "Thêm phòng mới",
            html: `
      <select id="my-select-center" class="swal2-input  mx-2" style="width:92%">
        <option value="">Trung tâm</option>
        ${centers.center
          .map(
            (option) => `<option value="${option._id}"
            ${option._id == selectedOptionCenter.value ? "selected" : ""}
            >${option.name}</option>`
          )
          .join("")}
      </select>
      <select id="my-select-dep" class="swal2-input  mx-2" style="width:92%" >
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
          <option value="">Select a product</option>
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
            data.modelUnit = document.document.name;
            await refresh("unit");
            selectedOptionUnit.value = document.document._id;
            updateAdd.value = true;
          }
        };

        // Gọi hàm showSweetAlert khi bạn muốn hiển thị SweetAlert
        showSweetAlert();
      } else if (newValue == "all") {
        await refresh();
        selectedOptionCenter.value = "";
        selectedOptionDepartment.value = "";
        selectedOptionUnit.value = "";
        selectedOptionPosition.value = "";
      }
    });
    const search = async (value) => {
      centers.center = await CenterServices.getAll();
      centers.center = centers.center.filter((value1, index) => {
        return value1.name.includes(value) || value.length == 0;
      });
      console.log("searchSlect", value.length);
    };

    //POSITION
    const positions = reactive({ position: [] });
    const selectedOptionPosition = ref("Chức vụ");
    watch(selectedOptionPosition, async (newValue, oldValue) => {
      if (newValue == "") {
        return;
      }

      const docPosition = ref("");
      docPosition.value = await http_getOne(
        Position,
        selectedOptionPosition.value
      );
      data.modelPositon = docPosition.value.name;

      data.items = await http_getAll(Employee);
      if (
        selectedOptionCenter.value != "" &&
        selectedOptionDepartment.value != "" &&
        selectedOptionUnit.value != ""
      ) {
        data.items = data.items.filter((val, index) => {
          console.log("đủ 3");
          return (
            val.Position._id == selectedOptionPosition.value &&
            val.Unit.Department.Center_VNPTHG._id ==
              selectedOptionCenter.value &&
            val.Unit.Department._id == selectedOptionDepartment.value &&
            val.unitId == selectedOptionUnit.value
          );
        });
      } else if (
        selectedOptionCenter.value != "" &&
        selectedOptionDepartment.value != ""
      ) {
        console.log(data.items);
        data.items = data.items.filter((val, index) => {
          return (
            val.Position._id == selectedOptionPosition.value &&
            val.Unit.Department.Center_VNPTHG._id ==
              selectedOptionCenter.value &&
            val.Unit.Department._id == selectedOptionDepartment.value
          );
        });
      } else if (selectedOptionCenter.value != "") {
        console.log(data.items);
        data.items = data.items.filter((val, index) => {
          return (
            val.Position._id == selectedOptionPosition.value &&
            val.Unit.Department.Center_VNPTHG._id == selectedOptionCenter.value
          );
        });
      } else {
        console.log("đủ 1");
        data.items = data.items.filter((val, index) => {
          return val.Position._id == selectedOptionPosition.value;
        });
      }
      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: positionName } = await Swal.fire({
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

          if (positionName) {
            const document = await Position.create({
              name: positionName,
            });
            if (document.error) {
              alert_warning(`Đã tồn tại chức vụ `, `${positionName}`);
              return false;
            }
            alert_success(`Đã thêm chức vụ`, `${positionName}`);
            await refresh();
            data.modelPositon = document.name;
          }
          return true;
        };
        showSweetAlert();
      } else if (newValue == "all") {
        await refresh();
        selectedOptionCenter.value = "";
        selectedOptionDepartment.value = "";
        selectedOptionUnit.value = "";
        selectedOptionPosition.value = "";
      }
    });

    const updateAdd = ref(false);
    const onDeletePosition = async (value) => {
      console.log("Value delete:", value);
      const result = await alert_delete("Bạn muốn xóa", value.name);
      if (result) {
        await Position.delete(value._id);
        alert_success("Bạn đã xóa chức vụ", value.name);
        await refresh();
      }
      updateAdd.value = true;
    };
    const onDeleteCenter = async (value) => {
      console.log("Value delete:", value);
      const result = await alert_delete("Bạn muốn xóa", value.name);
      if (result) {
        await CenterServices.delete(value._id);
        alert_success("Bạn đã xóa trung tâm", value.name);
        await refresh();
      }
      updateAdd.value = true;
    };
    const onDeleteDep = async (value) => {
      console.log("Value delete:", value);
      const result = await alert_delete("Bạn muốn xóa", value.name);
      if (result) {
        await departmentsServices.deleteOne(value._id);
        alert_success("Bạn đã xóa", value.name);
        await refresh();
      }
      updateAdd.value = true;
    };
    const onDeleteUnit = async (value) => {
      console.log("Value delete:", value);
      const result = await alert_delete("Bạn muốn xóa", value.name);
      if (result) {
        await unitsServices.deleteOne(value._id);
        alert_success("Bạn đã xóa ", value.name);
        await refresh();
      }
      updateAdd.value = true;
    };
    const mail = reactive({ list: [] });
    watch(mail, (newValue, oldValue) => {
      console.log("new mail:", mail.list);
    });
    const sendEmail = async (value) => {
      const dataMail = reactive({ title: "", content: "", mail: "" });

      try {
        console.log("lenght:", mail.list.length);
        if (mail.list.length > 0) {
          alert_success("Mail đã được gửi", "");
          for (let i = 0; i < mail.list.length; i++) {
            dataMail.title = value.title;
            dataMail.content = value.content;
            dataMail.mail = mail.list[i];
            await mailService.sendmail(dataMail);
            console.log("NDMail:", dataMail);
          }

          console.log("Email sent successfully.");
        } else {
          alert_warning("Bạn chưa chọn nhân viên", "");
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
    };
    onBeforeMount(async () => {
      await refresh();
    });

    return {
      data,
      setPages,
      activeMenu,
      create,
      update,
      deleteOne,
      edit,

      centers,
      selectedOptionCenter,
      departments,
      selectedOptionDepartment,
      units,
      selectedOptionUnit,
      search,
      refresh,
      onDeletePosition,
      onDeleteCenter,
      onDeleteDep,
      onDeleteUnit,
      updateAdd,
      positions,
      selectedOptionPosition,
      mail,
      sendEmail,
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <div class="d-flex flex-column mt-3">
      <span class="mx-3 mb-3 h6">Lọc nhân viên</span>
      <div class="d-flex mx-3">
        <!-- <div class="form-group w-100">
          <Select_Advanced
            class="form-control"
            required
            :options="positions.position"
            :modelValue="data.modelPositon"
            style="width: 100%; height: 100%"
            @searchSelect="
              async (value) => (
                await refresh(),
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
            @choosed="(value) => (selectedOptionPosition = value)"
          />
        </div> -->
        <!-- **** Lan Anh **** -->
        <!-- <div class="form-group w-100 ml-3">
          <Select_Advanced
            :options="centers.center"
            :modelValue="data.modelValue"
            style="width: 300px; height: 100%"
            @searchSelect="
              async (value) => (
                await refresh(),
                (centers.center = centers.center.filter((value1, index) => {
                  console.log(value1, value);
                  return value1.name.includes(value) || value.length == 0;
                })),
                console.log('searchSlect', value.length)
              )
            "
            @delete="(value) => onDeleteCenter(value)"
            @choosed="(value) => (selectedOptionCenter = value)"
          />
        </div>
        <div class="form-group w-100 ml-3">
          <Select_Advanced
            :options="departments.department"
            :modelValue="data.modelDep"
            style="width: 300px; height: 100%"
            @searchSelect="
              async (value) => (
                await refresh(),
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
            @choosed="(value) => (selectedOptionDepartment = value)"
          />
        </div>
        <div class="form-group w-100 ml-3">
          <Select_Advanced
            :options="units.unit"
            :modelValue="data.modelUnit"
            style="width: 300px; height: 100%"
            @searchSelect="
              async (value) => (
                await refresh(),
                (units.unit = units.unit.filter((value1, index) => {
                  console.log(value1, value);
                  return value1.name.includes(value) || value.length == 0;
                })),
                console.log('searchSlect', value.length)
              )
            "
            @delete="(value) => onDeleteUnit(value)"
            @choosed="(value) => (selectedOptionUnit = value)"
          />
        </div> -->
        <div class="form-group w-100">
          <label for="name">Chức vụ</label>
          <SelectCDU
            class="d-flex justify-content-start"
            :title="`Chức vụ`"
            :field="positions.position"
            :selectedOption="selectedOptionPosition"
            @option="(value) => (selectedOptionPosition = value)"
          />
        </div>
        <div class="form-group w-100">
          <label for="name">Trung tâm</label>

          <SelectCDU
            class="d-flex justify-content-start"
            :title="`Trung tâm`"
            :field="centers.center"
            :selectedOption="selectedOptionCenter"
            @option="(value) => (selectedOptionCenter = value)"
          />
        </div>
        <div class="form-group w-100">
          <label for="name">Phòng</label>

          <SelectCDU
            class="d-flex justify-content-start"
            :title="`Phòng`"
            :field="departments.department"
            :selectedOption="selectedOptionDepartment"
            @option="(value) => (selectedOptionDepartment = value)"
          />
        </div>
        <div class="form-group w-100">
          <label for="name">Tổ</label>

          <SelectCDU
            class="d-flex justify-content-start"
            :title="`Tổ`"
            :selectedOption="selectedOptionUnit"
            :field="units.unit"
            @option="(value) => (selectedOptionUnit = value)"
          />
        </div>
      </div>
    </div>
    <div class="border-hr mb-3"></div>
    <div class="d-flex justify-content-between mx-3 mb-3">
      <div class="d-flex justify-content-start">
        <Select
          class="d-flex justify-content-start"
          :options="[
            {
              name: 5,
              value: 5,
            },
            {
              name: 10,
              value: 10,
            },
            {
              name: 20,
              value: 20,
            },
            {
              name: 30,
              value: 30,
            },
            {
              name: 'All',
              value: 'All',
            },
          ]"
          @update:entryValue="(value) => (data.entryValue = value)"
          :entryValue="data.entryValue"
        />
        <Search
          class="ml-3"
          style="width: 300px"
          @update:searchText="(value) => (data.searchText = value)"
        />
      </div>
      <div class="d-flex align-items-start">
        <button
          type="button"
          class="btn btn-danger mr-3"
          data-toggle="modal"
          data-target="#model-delete-all"
        >
          <span id="delete-all" class="mx-2">Xoá</span>
        </button>
        <!-- <DeleteAll :item="data.items" /> -->

        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#model-form-wizard"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <Add1
          @create="create"
          :updateAdd="updateAdd"
          @restore="(value) => (updateAdd = value)"
          @newPosition="
            (value) => {
              positions.position = value;
            }
          "
          @newCenter="
            (value) => {
              centers.center = value;
            }
          "
          @newDep="
            (value) => {
              departments.department = value;
            }
          "
          @newUnit="
            (value) => {
              units.unit = value;
            }
          "
        />
        <button
          type="button"
          class="btn btn-warning ml-3"
          data-toggle="modal"
          data-target="#model-form-mail"
        >
          <span class="mx-2">Mail</span>
        </button>
        <Mail @sendEmail="(value) => sendEmail(value)"></Mail>
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Tên',
        'Sđt',
        'Email',
        'Chức vụ',
        'Đơn vị',
        'Phòng',
        'Trung tâm',
      ]"
      :labels="['name', 'phone', 'email']"
      @delete="(value) => deleteOne(value)"
      @edit="
        (value, value1) => (
          (data.editValue = value), (data.activeEdit = value1)
        )
      "
      @view="(value) => (data.viewValue = value)"
      @checkbox="(value) => (mail.list = value)"
    />
    <!-- Pagination -->
    <Pagination
      :numberOfPages="data.numberOfPages"
      :totalRow="data.totalRow"
      :startRow="data.startRow"
      :endRow="data.endRow"
      :currentPage="data.currentPage"
      @update:currentPage="(value) => (data.currentPage = value)"
      class="mx-3"
    />
    <Edit
      :item="data.editValue"
      :class="[data.activeEdit ? 'show-modal' : 'd-none']"
      @cancel="data.activeEdit = false"
      :position="data.items.postionId"
      :unit="data.items.unitId"
      @edit="edit(data.editValue)"
      @refresh="
        async () => {
          await refresh();
        }
      "
    />

    <View :item="data.viewValue" />
  </div>
</template>

<style scoped>
.border-box {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.menu {
  /* border: 1px solid var(--gray); */
  border-collapse: collapse;
}
.menu a {
  border: 1px solid var(--gray);
  border-collapse: collapse;
  padding: 8px 12px;
  font-size: 15px;
}
.active-menu {
  color: blue;
}
.none-active-menu {
  color: var(--dark);
}
.border-hr {
  border-top: 1px solid var(--gray);
}
#add,
#delete-all {
  font-size: 14px;
}

.form-control {
  background-color: inherit;
  border: 1px solid var(--gray);
}
</style>
