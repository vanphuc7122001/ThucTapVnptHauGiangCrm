<script>
import Notification from "../../services/notification.service";
import socket from "../../../socket";
import {
  reactive,
  onBeforeMount,
  ref,
  watch,
  computed,
  watchEffect,
} from "vue";
import Select_Advanced from "../../components/form/select_advanced.vue";
import Table from "../../components/table/table_employee.vue";
import Select from "../../components/form/select.vue";
import Pagination from "../../components/table/pagination_duy.vue";
//service
import Employee from "../../services/employee.service";
import Position from "../../services/position.service";
import CenterServices from "../../services/center_vnpt.service";
import departmentsServices from "../../services/department.service";
import unitsServices from "../../services/unit.service";
import EmployeeTask from "../../services/task_employee.service";
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

import {
  isSelfAssignement,
  isSetAssignement
} from '../../use/getSessionItem'
import { Task } from "../common/import";
export default {
  components: {
    Select_Advanced,
    Table,
    Select,
    Pagination,
  },
  props: {
    item: {
      type: Object,
      default: [],
    },
  },
  setup(props, ctx) {
    const data = reactive({
      itemAdd: {
        EmployeeId: "",
      },
      itemEm: [
        {
          _id: "",
          name: "",
          postionId: "",
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
      modelEm: "",
      modelPositon: "Chức vụ",
      modelValue: "Trung tâm",
      modelDep: "Phòng",
      modelUnit: "Tổ",
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      arrTaskEm: {},
      center: {},
      department: {},
      unit: {},
      position: {},
      selectAll: [
        {
          checked: false,
        },
      ],
    });

    const employees = reactive({ employee: [] });

    // computed
    const toString = computed(() => {
      console.log("Starting search");
      if (data.choseSearch == "name") {
        return data.itemEm.map((value, index) => {
          return [value.name].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "email") {
        return data.itemEm.map((value, index) => {
          return [value.email].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "phone") {
        return data.itemEm.map((value, index) => {
          return [value.phone].join("").toLocaleLowerCase();
        });
      } else {
        return data.itemEm.map((value, index) => {
          return [value.name, value.email, value.phone]
            .join("")
            .toLocaleLowerCase();
        });
      }
    });
    const filter = computed(() => {
      return data.itemEm.filter((value, index) => {
        return toString.value[index].includes(
          data.searchText.toLocaleLowerCase()
        );
      });
    });
    const filtered = computed(() => {
      if (!data.searchText) {
        data.totalRow = data.itemEm.length;
        return data.itemEm;
      } else {
        data.totalRow = filter.value.length;
        return filter.value;
      }
    });
    const setNumberOfPages = computed(() => {
      return Math.ceil(filtered.value.length / data.entryValue);
    });
    const setPages = computed(() => {
      if (data.itemEm.length > 0) {
        if (setNumberOfPages.value == 0 || data.entryValue == "All") {
          data.entryValue = data.itemEm.length;
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
      } else return data.itemEm.value;
    });
    //SelectAll
    const arrayCheck = reactive({ data: [] });
    const entryValuePosition = ref(""); //id
    const entryNamePosition = ref("Chức vụ"); //name
    const entryValueCenter = ref("");
    const entryNameCenter = ref("Trung tâm");
    const entryValueDepartment = ref(""); //id
    const entryNameDepartment = ref("Phòng"); //name
    const entryValueUnit = ref("");
    const entryNameUnit = ref("Tổ");

    //watch lọc nhân viên
    // ******LỌC ******
    watch(entryValuePosition, async (newValue, oldValue) => {
      if (newValue == "") {
        await refresh();
        return;
      }
      data.itemEm = await http_getAll(Employee);
      //1.lấy danh sách nhân viên chức vụ x
      if (entryValuePosition.value.length > 0) {
        data.itemEm = data.itemEm.filter((val) => {
          return val.postionId == entryValuePosition.value;
        });
      }
      if (
        entryValueCenter.value != "" &&
        entryValueDepartment.value != "" &&
        entryValueDepartment.value != "1" &&
        entryValueUnit.value != "" &&
        entryValueUnit.value != "1"
      ) {
        data.itemEm = data.itemEm.filter((value) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value &&
            value.unitId == entryValueUnit.value
          );
        });
      }
      //2. chọn 1 trung tâm và 1 phòng
      else if (
        entryValueCenter.value != "" &&
        entryValueDepartment.value != "" &&
        entryValueDepartment.value != "1"
      ) {
        data.itemEm = data.itemEm.filter((value) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value
          );
        });
      } else if (entryValueCenter.value != "") {
        data.itemEm = data.itemEm.filter((val) => {
          return (
            val.Unit.Department.Center_VNPTHG._id == entryValueCenter.value
          );
        });
      }
      //Thay đổi
      data.selectAll[0].checked = false;
      for (let value of data.itemEm) {
        value.checked = false;
      }
      for (let value of data.itemEm) {
        for (let array of arrayCheck.data) {
          console.log("arrayid==value_id", array._id == value._id);
          if (array._id == value._id) {
            value.checked = true;
            break;
          }
          value.checked = false;
        }
      }
      console.log("items:", data.itemEm);
    });
    const updateEntryValuePosition = (value) => {
      entryValuePosition.value = value;
    };
    //  CENTER
    watch(entryValueCenter, async (newValue, oldValue) => {
      if (newValue == "") {
        await refresh();
        return;
      }
      entryValueDepartment.value = "1"; //id
      entryNameDepartment.value = "Phòng"; //name
      entryValueUnit.value = "1"; //id
      entryNameUnit.value = "Tổ"; //name
      //Lấy tất cả nhân viên
      data.itemEm = await http_getAll(Employee);
      //Lấy tất cả phòng của 1 trung tâm
      console.log("newValueCenter:", newValue);
      data.department = await departmentsServices.findAllDepOfACenter(newValue);
      console.log("dataDepartment:", data.department);
      data.department = data.department.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
      // console.log("start1", data.department[0]._id);
      data.unit = [];
      //Lấy tất cả tổ của 1 trung tâm
      // for (let value of data.department) {
      //   console.log("id", value._id);

      //   var newUnit = await unitsServices.findAllUnitsOfADep(value._id);
      //   for (let value of newUnit) {
      //     console.log("new:", value);
      //     data.unit.push(value);
      //   }
      //   // console.log("start2", data.unit);
      // }
      console.log("start2");
      data.unit = data.unit.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
      console.log("start3");

      //Lọc
      // 1. có chức vụ và trung tâm
      if (entryValueCenter.value != "" && entryValuePosition.value != "") {
        console.log("cả 2");
        data.itemEm = data.itemEm.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.postionId == entryValuePosition.value
          );
        });
      }
      //2.  chỉ có trung tâm
      else {
        console.log("1");
        data.itemEm = data.itemEm.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value
          );
        });
      }
      data.selectAll[0].checked = false;
      for (let value of data.itemEm) {
        value.checked = false;
      }
      for (let value of data.itemEm) {
        for (let array of arrayCheck.data) {
          console.log("arrayid==value_id", array._id == value._id);
          if (array._id == value._id) {
            value.checked = true;
            break;
          }
          value.checked = false;
        }
      }
      console.log("items:", data.itemEm);
      console.log("Array:", arrayCheck.data);
    });
    //UpdateEntryValueCenter
    const updateEntryValueCenter = (value) => {
      entryValueCenter.value = value;
    };

    //DEP
    watch(entryValueDepartment, async (newValue, oldValue) => {
      if (newValue == "") {
        await refresh();
        return;
      } else if (newValue == "1") {
        return;
      }
      entryValueUnit.value = "1"; //id
      entryNameUnit.value = "Tổ"; //name

      //Lấy tất cả nhân vien
      data.itemEm = await http_getAll(Employee);
      //Lấy tất cả tổ của 1 phòng
      data.unit = await unitsServices.findAllUnitsOfADep(newValue);
      data.unit = data.unit.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
      //Lọc
      //1. có trung tâm, phòng, chức vụ
      if (entryValuePosition.value != "") {
        data.itemEm = data.itemEm.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value &&
            value.postionId == entryValuePosition.value
          );
        });
      }
      // 2. có trung tâm và phòng
      else {
        data.itemEm = data.itemEm.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value
          );
        });
      }
      //Thay đổi
      for (let value of data.itemEm) {
        value.checked = false;
      }
      for (let value of data.itemEm) {
        for (let array of arrayCheck.data) {
          console.log("arrayid==value_id", array._id == value._id);
          if (array._id == value._id) {
            value.checked = true;
            break;
          }
          value.checked = false;
        }
      }
      console.log("items:", data.itemEm);
    });
    const updateEntryValueDepartment = (value) => {
      entryValueDepartment.value = value;
    };

    //UNIT
    watch(entryValueUnit, async (newValue, oldValue) => {
      if (newValue == "") {
        await refresh();
        return;
      } else if (newValue == "1") {
        return;
      }
      //Lấy tất cả nhân vien
      data.itemEm = await http_getAll(Employee);
      //Lọc
      //1. có position
      if (entryValuePosition.value != "") {
        data.itemEm = data.itemEm.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value &&
            value.postionId == entryValuePosition.value &&
            value.unitId == entryValueUnit.value
          );
        });
      }
      //2. có trung tâm, phòng, tổ
      else {
        console.log("2");
        data.itemEm = data.itemEm.filter((value, index) => {
          return (
            value.Unit.Department.Center_VNPTHG._id == entryValueCenter.value &&
            value.Unit.Department._id == entryValueDepartment.value &&
            value.unitId == entryValueUnit.value
          );
        });
      }
      //Thay đổi
      data.selectAll[0].checked = false;
      for (let value of data.itemEm) {
        value.checked = false;
      }
      for (let value of data.itemEm) {
        for (let array of arrayCheck.data) {
          console.log("arrayid==value_id", array._id == value._id);
          if (array._id == value._id) {
            value.checked = true;
            break;
          }
          value.checked = false;
        }
      }
      console.log("items:", data.itemEm);
    });

    const updateEntryValueUnit = (value) => {
      entryValueUnit.value = value;
    };

    const createTaskEm = async (value) => {
      const dataTaskEm = reactive({ TaskId: " ", EmployeeId: " " });
      dataTaskEm.TaskId = props.item._id;
      if (arrayCheck.data.length == 0) {
        alert_warning("Chưa chọn nhân viên để giao việc", "");
        return;
      }
      //xóa nhân viên 1**
      const A = ["A", "B"]; //array
      const B = ["B", "C", "D"]; //arrayCheck
      const C = reactive({ data: [] });
      const D = reactive({ data: [] });
      const E = reactive({ data: [] });
      C.data = array.data.filter((value) => !arrayCheck.data.includes(value));
      C.data = [...new Set(C.data)];
      D.data = array.data.filter((value) => arrayCheck.data.includes(value));
      D.data = [...new Set(D.data)];
      E.data = arrayCheck.data.filter((value) => !D.data.includes(value));
      // console.log("C:", C.data, C.data.length);
      // console.log("đã giao trước:", array.data, array.data.length);
      if (C.data.length != 0) {
        for (let j = 0; j < C.data.length; j++) {
          const dataDel = reactive({
            data: {
              TaskId: props.item._id,
              EmployeeId: C.data[j]._id,
            },
          });
          const result = await EmployeeTask.deleteOne(dataDel.data);
          const token = sessionStorage.getItem("token");
          if (token) {
            const _idEmployee = sessionStorage.getItem("employeeId");
            const _nameEmployee = sessionStorage.getItem("employeeName");
            const object = {
              _id: _idEmployee,
              name: _nameEmployee,
            };
            console.log("ggg", _idEmployee, "hhh", dataDel.data.EmployeeId);
            const TaskCus = await http_getOne(Task, dataDel.data.TaskId);
            const notiAssignment = reactive({
              title: "Huỷ giao việc",
              content: `đã huỷ phân công khách hàng "${TaskCus.Customer.name}" cho bạn`,
              isRead: false,
              recipient: "",
              sender: "",
              idRecipient: "",
            });
            if (_idEmployee == dataDel.data.EmployeeId) {
              notiAssignment.content = `Bạn đã hủy phân công khách hàng "${TaskCus.Customer.name}" thành công`;
              notiAssignment.sender = "";
            } else {
              notiAssignment.sender = _nameEmployee;
            }
            notiAssignment.recipient = C.data[j].name;
            notiAssignment.idRecipient = C.data[j]._id;
            // const result1 = await http_create(Notification, notiAssignment);
            socket.emit("cancleAssign",notiAssignment)
            console.log("giao viec", notiAssignment);
            socket.emit("assignmentTask");
          }
        }
      }
      if (E.data.length != 0) {
        for (let i = 0; i < E.data.length; i++) {
          const token = sessionStorage.getItem("token");
          if (token) {
            const _idEmployee = sessionStorage.getItem("employeeId");
            const _nameEmployee = sessionStorage.getItem("employeeName");
            const object = {
              _id: _idEmployee,
              name: _nameEmployee,
            };
            const TaskCus = await http_getOne(Task, dataTaskEm.TaskId);
            console.log("Khach hang dươc phan cong", TaskCus.Customer.name);
            const notiAssignment = reactive({
              title: "Phân công mới",
              content: `đã phân công khách hàng "${TaskCus.Customer.name}" cho bạn`,
              isRead: false,
              recipient: "",
              sender: "",
              idRecipient: "",
            });
            if (_idEmployee == E.data[i]._id) {
              notiAssignment.content = `Khách hàng "${TaskCus.Customer.name}" đã được phân công cho bạn`;
              notiAssignment.sender = "";
            } else {
              notiAssignment.sender = _nameEmployee;
            }
            notiAssignment.recipient = E.data[i].name;
            notiAssignment.idRecipient = E.data[i]._id;
            // const result1 = await http_create(Notification, notiAssignment);
            socket.emit("Assign",notiAssignment)
            console.log("giao viec", notiAssignment);
            socket.emit("assignmentTask");
          }
        }
      }
      for (let i = 0; i < arrayCheck.data.length; i++) {
        try {
          dataTaskEm.EmployeeId = arrayCheck.data[i]._id;
          await http_create(EmployeeTask, dataTaskEm);
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
      alert_success("Đã giao việc cho nhân viên thành công", "");
      await refresh();
      ctx.emit("giaoviec");
    };

    //tu giao viec
    const addTaskEm = async () => {
      const newData = reactive({ TaskId: " ", EmployeeId: " " });
      newData.TaskId = props.item._id;
      newData.EmployeeId = sessionStorage.getItem("employeeId");
      console.log("leaderId:", newData.EmployeeId);
      console.log("taskid:", newData.TaskId);
      try {
        const result = await http_create(EmployeeTask, newData);

        ////////////////////////////
        const token = sessionStorage.getItem("token");
        if (token) {
          const _idEmployee = sessionStorage.getItem("employeeId");
          const _nameEmployee = sessionStorage.getItem("employeeName");
          const object = {
            _id: _idEmployee,
            name: _nameEmployee,
          };
          const TaskCus = await http_getOne(Task, newData.TaskId);
          console.log("Khach hang dươc phan cong", TaskCus.Customer.name);
          const notiAssignment = reactive({
            title: "Nhận việc thành công",
            content: `Khách hàng "${TaskCus.Customer.name}" đã được phân công cho bạn`,
            isRead: false,
            recipient: "",
            sender: "",
            idRecipient: "",
          });
          notiAssignment.recipient = _nameEmployee;
          notiAssignment.idRecipient = _idEmployee;
          // const result1 = await http_create(Notification, notiAssignment);
          socket.emit("Work",notiAssignment)
          socket.emit("assignmentTask");
        }
        /////////////////////////////////////
        console.log(result.error);
        if (result.error == true) {
          alert_warning(`Thêm công việc`, `Công việc đã được giao cho bạn`);
        } else {
          alert_success(
            `Thêm công việc`,
            `Nhận khách hàng ${props.item.Customer.name} thành công`
          );
        }
        await refresh();
      } catch (error) {
        console.error("Lỗi tạo công việc:", error);
      }
      ctx.emit("giaoviec");
    };

    //CHECKALL
    const handleSelectAll = (value) => {
      arrayCheck.data = [];
      if (value == false) {
        for (let value1 of data.itemEm) {
          value1.checked = true;
          arrayCheck.data.push(value1);
        }
      } else {
        for (let value1 of data.itemEm) {
          value1.checked = false;
          const index = arrayCheck.data.indexOf(value1._id);
          if (index !== -1) {
            arrayCheck.data.splice(index, 1);
          }
        }
      }
      console.log("arrayCheck:", arrayCheck.data);
    };
    const handlSelectOne = (id, item) => {
      console.log(id, item);
      if (item.checked == false) {
        arrayCheck.data.push(item);
      } else {
        arrayCheck.data = arrayCheck.data.filter((value, index) => {
          return value._id != id;
        });
      }
      data.selectAll[0].checked = false;
      console.log("arrayCheckOne:", arrayCheck.data);
    };

    const array = reactive({ data: [] });
    const refresh = async () => {
      // data.cycleSelect = [...rs];
      console.log("REFRESH");
      data.itemEm = await http_getAll(Employee);
      for (let i = 0; i < data.itemEm.length; i++) {
        data.itemEm[i].checked = false;
      }
      console.log("ds nv", data.itemEm);
      // ***
      arrayCheck.data = [];
      array.data = [];
      const employeeTask = reactive({ data: [] });
      employeeTask.data = await http_getOne(Task, props.item._id);
      console.log("list", employeeTask.data);

      for (let i = 0; i < data.itemEm.length; i++) {
        for (let j = 0; j < employeeTask.data.Employees.length; j++) {
          if (data.itemEm[i]._id == employeeTask.data.Employees[j]._id) {
            data.itemEm[i].checked = true;
            arrayCheck.data.push(data.itemEm[i]);
            array.data.push(data.itemEm[i]);
          }
        }
      }
      console.log("check:", data.itemEm);

      data.position = await http_getAll(Position);

      data.center = await CenterServices.getAll();
      if (entryValueCenter.value != "") {
        data.department = await departmentsServices.findAllDepOfACenter(
          entryValueCenter.value
        );
        data.department = data.department.map((value, index) => {
          return {
            ...value,
            value: value._id,
          };
        });
      } else {
        data.department = [];
      }
      if (entryValueDepartment.value != "") {
        data.unit = await unitsServices.findAllUnitsOfADep(
          entryValueDepartment.value
        );
        data.unit = data.unit.map((value, index) => {
          return {
            ...value,
            value: value._id,
          };
        });
      } else {
        data.unit = [];
      }
      data.position = data.position.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
      data.center = data.center.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });

      entryNamePosition.value = "Chức vụ";
      entryValuePosition.value = "";
      entryNameCenter.value = "Trung tâm";
      entryValueCenter.value = "";
      entryNameDepartment.value = "Phòng";
      entryValueDepartment.value = "";
      entryNameUnit.value = "Tổ";
      entryValueUnit.value = "";
      // for (let value of data.itemEm) {
      //   for (let array of arrayCheck.data) {
      //     console.log("arrayid==value_id", array._id == value._id);
      //     if (array._id == value._id) {
      //       value.checked = true;
      //       break;
      //     }
      //     value.checked = false;
      //   }
      // }
      data.selectAll[0].checked = false;
    };
    const closeModal = async () => {
      console.log("close modal");

      await refresh();
      showModal.value = false;
    };
    onBeforeMount(async () => {
      await refresh();
    });
    watchEffect(async () => {
      console.log("111TĐ:", props.item._id);
      await refresh();
    });

    return {
      setPages,
      createTaskEm,
      refresh,
      employees,
      data,
      closeModal,
      addTaskEm,
      entryNamePosition,
      entryValuePosition,
      entryNameCenter,
      entryValueCenter,
      entryNameDepartment,
      entryValueDepartment,
      entryNameUnit,
      entryValueUnit,
      updateEntryValuePosition,
      updateEntryValueCenter,
      updateEntryValueUnit,
      updateEntryValueDepartment,
      handlSelectOne,
      handleSelectAll,
      // phân quyền 
      isSelfAssignement,
      isSetAssignement
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-form-task_em">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 18px">
            Giao việc cho nhân viên
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
        <div class="model-body">
          <div style="padding: 24px">
            <form action="" class="was-validated">
              <div class="form-group">
                <label for="name"
                  >Khách hàng(<span style="color: red">*</span>):</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  name="name"
                  v-model="item.Customer.name"
                  disabled
                />
              </div>
              <div class="form-group">
                <label for=""
                  >Nội dung chăm sóc(<span style="color: red">*</span>):</label
                >
                <textarea
                  class="form-control"
                  v-model="item.content"
                  required
                  disabled
                ></textarea>
              </div>
              <div class="border-box d-flex flex-column">
                <div class="d-flex mx-3">
                  <div class="form-group w-100 mr-2">
                    <Select
                      :title="`Chức vụ`"
                      :entryValue="entryNamePosition"
                      :options="data.position"
                      @update:entryValue="
                        (value, value1) => (
                          updateEntryValuePosition(value),
                          (entryNamePosition = value1.name)
                        )
                      "
                      @refresh="
                        (entryNamePosition = 'Chọn chức vụ'),
                          updateEntryValuePosition('')
                      "
                      style="height: 35px"
                    />
                  </div>
                  <div class="form-group w-100 mr-2">
                    <Select
                      :title="`Trung tâm`"
                      :entryValue="entryNameCenter"
                      :options="data.center"
                      @update:entryValue="
                        (value, value1) => (
                          updateEntryValueCenter(value),
                          (entryNameCenter = value1.name)
                        )
                      "
                      @refresh="
                        (entryNameCenter = 'Chọn trung tâm'),
                          updateEntryValueCenter('')
                      "
                      style="height: 35px"
                    />
                  </div>

                  <!-- Phòng -->
                  <div class="form-group w-100 mr-2">
                    <Select
                      :title="`Phòng`"
                      :entryValue="entryNameDepartment"
                      :options="data.department"
                      @update:entryValue="
                        (value, value1) => (
                          updateEntryValueDepartment(value),
                          (entryNameDepartment = value1.name)
                        )
                      "
                      @refresh="
                        (entryNameDepartment = 'Chọn phòng'),
                          updateEntryValueDepartment('')
                      "
                      style="height: 35px"
                    />
                  </div>

                  <div class="form-group w-100">
                    <Select
                      :title="`Tổ`"
                      :entryValue="entryNameUnit"
                      :options="data.unit"
                      @update:entryValue="
                        (value, value1) => (
                          updateEntryValueUnit(value),
                          (entryNameUnit = value1.name)
                        )
                      "
                      @refresh="
                        (entryNameUnit = 'Chọn tổ'), updateEntryValueUnit('')
                      "
                      style="height: 35px"
                    />
                  </div>
                </div>
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
                  :selectAll="data.selectAll"
                  :startRow="data.startRow"
                  @selectAll="(value) => handleSelectAll(value)"
                  @selectOne="(id, item) => handlSelectOne(id, item)"
                  :activeAction="false"
                />
                <Pagination
                  :numberOfPages="data.numberOfPages"
                  :totalRow="data.totalRow"
                  :startRow="data.startRow"
                  :endRow="data.endRow"
                  :currentPage="data.currentPage"
                  @update:currentPage="(value) => (data.currentPage = value)"
                  class="mx-3"
                />
              </div>

              <button
                type="button"
                class="btn btn-primary px-3 py-2"
                style="font-size: 14px; margin-right: 24px"
                @click="createTaskEm"
                id="add"
                :disabled="isSetAssignement() ? false : true"
              >
                <span style="color: white">Giao việc</span>
              </button>
              <button
                type="button"
                class="btn btn-secondary px-3 py-2"
                style="font-size: 14px"
                @click="addTaskEm"
                :disabled="isSelfAssignement() ? false : true"
                id=""
              >
                <span>Nhận việc</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-box {
  border: 1px solid var(--gray);
  border-radius: 5px;
  padding-top: 10px;
  margin-bottom: 14px;
}
@media screen and (min-width: 739px) and (max-width: 992px) {
  .modal-content {
    width: 200%;
    margin-left: -50%;
  }
}
</style>
