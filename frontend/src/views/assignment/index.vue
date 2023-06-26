<script>
import Table from "../../components/table/table-assignment.vue";
import Pagination from "../../components/table/pagination_duy.vue";
import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Search from "../../components/form/search.vue";
import SelectFilter from "../../components/form/select_task_truc.vue";
import InputFilter from "../../components/form/form_filter_truc.vue";
import DeleteAll from "../../components/form/delete-all.vue";
import Add from "./add.vue";
import Add_TaskEmployee from "./add_taskemployee.vue";
import Edit from "./edit.vue";
import View from "./view.vue";
import FeedBack from "./feedback.vue";
import Select_Advanced from "../../components/form/select_advanced.vue";
import { reactive, computed, watch, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
// services

import Task from "../../services/task.service";
import Cycle from "../../services/cycle.service";
import Employee from "../../services/employee.service";
import Customer from "../../services/customer.service";
import Employees_Task from "../../services/task_employee.service";
import Appointment from "../../services/appointment.service";
import StatusTask from "../../services/status_task.service";
import Evaluate from "../../services/evaluate.service";
import AddAppointment from "../appointment/add.vue";
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
  alert_delete_wide,
} from "../../assets/js/common.alert";
import { formatDate } from "../../assets/js/common";
export default {
  components: {
    SelectFilter,
    InputFilter,
    Select_Advanced,
    Table,
    Pagination,
    Dropdown,
    Select,
    Add,
    DeleteAll,
    Edit,
    View,
    AddAppointment,
    Add_TaskEmployee,
    Search,
    FeedBack,
  },
  setup(ctx) {
    const data = reactive({
      items: [
        {
          _id: "",
          start_date: "",
          end_date: "",
          content: "",
          Customer: {
            _id: "",
            name: "",
          },
          cycleId: "",
          Cycle: {
            _id: "",
            name: "",
          },
          Employee: {
            _id: "",
            name: "",
          },
          Status_Task: {
            _id: "",
            name: "",
          },
          Appointments: {
            _id: "",
            date_time: "",
            content: "",
            Status_App: {
              status: "",
              reason: "",
            },
          },
          Evaluate: {
            _id: "",
            star: "",
          },
          Comment: {
            _id: "",
            content: "",
          },
        },
      ],
      entryValue: 2,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeEdit: false,
      editValue: {
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
      viewValue: {
        _id: "",
        start_date: "",
        end_date: "",
        content: "",
        leaderId: "",
        Customer: {
          _id: "",
          name: "",
          birthday: "",
          avatar: "",
          address: "",
          email: "",
          Customer_Type: {
            _id: "",
            name: "",
          },
        },
        Cycle: {
          _id: "",
          name: "",
        },
        Employees: {},
        Status_Task: {
          _id: "",
          name: "",
        },
        Appointments: {
          _id: "",
          date_time: "",
          content: "",
          Status_App: {
            _id: "",
            name: "",
          },
        },
        Evaluate: {
          star: "",
        },
        Comment: {
          _id: "",
          content: "",
        },
      },
      evaluate: [],
      statusTask: [],
      cus: [],
      employee: [],
      taskId: "",
      taskObject: {},
      taskEmployee: {
        _id: "",
        start_date: "",
        end_date: "",
        content: "",
        Customer: {
          _id: "",
          name: "",
        },
        cycleId: "",
        Cycle: {
          _id: "",
          name: "",
        },
        Employee: {
          _id: "",
          name: "",
        },
        Status_Task: {
          _id: "",
          name: "",
        },
        Appointments: {
          _id: "",
          date_time: "",
          content: "",
          Status_App: {
            status: "",
            reason: "",
          },
        },
        Evaluate: {
          _id: "",
          star: "",
        },
        Comment: {
          _id: "",
          content: "",
        },
      },
      showTask_Employee: false,
      listAppoiment: {},
      listEmployeeTask: {},
      selectAll: [
        {
          checked: false,
        },
      ],
      showFeedback: false,
    });

    const cycleValue = ref("");
    const startdateValue = ref("");
    const statusValue = ref("");
    const enddateValue = ref("");
    const cycles = reactive({ cycle: [] });
    const status_tasks = reactive({ status_task: [] });
    const evaluates = reactive({ evaluate: [] });

    const entryValueEval = ref(""); //id
    const entryNameEval = ref("Đánh giá");
    const entryValueStatusTask = ref(""); //id
    const entryNameStatusTask = ref("Trạng thái");
    const entryValueCycle = ref(""); //id
    const entryNameCycle = ref("Chu kỳ"); //name
    const updateEntryValueStatusTask = (value) => {
      entryValueStatusTask.value = value;
    };
    const updateEntryValueCycle = (value) => {
      console.log("lên đây");
      entryValueCycle.value = value;
      console.log("giá trị cycle", entryValueCycle.value);
    };
    const updateEntryValueEval = (value) => {
      entryValueEval.value = value;
    };
    // //watch lọc
    watch(entryValueCycle, async (newValue, oldValue) => {
      console.log("hhhh", newValue);
      if (newValue == "") {
        await refresh();
        return;
      }
      data.items = await http_getAll(Task);
      for (const value of data.items) {
        value.end_date_format = formatDate(value.end_date);
        value.start_date_format = formatDate(value.start_date);
      }
      if (
        entryValueStatusTask.value != "" &&
        startdateValue.value != "" &&
        enddateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        console.log("trúc");
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        startdateValue.value != "" &&
        enddateValue.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (
        startdateValue.value != "" &&
        enddateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        enddateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        startdateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueEval.value != "" && entryValueStatusTask.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueEval.value != "" && startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueEval.value != "" && enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueStatusTask.value != "" && startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value
          );
        });
      } else if (enddateValue.value != "" && startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueStatusTask.value != "" && enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueEval.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueStatusTask.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value
          );
        });
      } else if (startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value
          );
        });
      } else if (enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value && value.end_date == enddateValue.value
          );
        });
      } else {
        console.log("hhhttttt:", newValue);
        data.items = data.items.filter((value, index) => {
          console.log("giá trị đang lọc", value.cycleId);
          return value.Cycle._id == entryValueCycle.value;
        });
      }
      var employees = reactive({ data: {} });
      for (let value of data.items) {
        employees.data = await http_getOne(Task, value._id);
        console.log("count:", employees.data.Employees.length);
        value.count = employees.data.Employees.length;

        for (let value1 of arrayCheck.data) {
          // value.count = employees.Employees.length;
          if (value._id == value1._id) {
            value.checked = true;
          }
        }
      }
      data.currentPage = 1;
    });
    watch(entryValueStatusTask, async (newValue, oldValue) => {
      if (newValue == "") {
        await refresh();
        return;
      }
      data.items = await http_getAll(Task);
      for (const value of data.items) {
        value.end_date_format = formatDate(value.end_date);
        value.start_date_format = formatDate(value.start_date);
      }
      if (
        entryValueCycle.value != "" &&
        startdateValue.value != "" &&
        enddateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        console.log("hello");
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueCycle.value != "" &&
        startdateValue.value != "" &&
        enddateValue.value != ""
      ) {
        console.log("hello");
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (
        entryValueCycle.value != "" &&
        startdateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueCycle.value != "" &&
        enddateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        startdateValue.value != "" &&
        enddateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        console.log("hello");
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (startdateValue.value != "" && enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueCycle.value != "" && entryValueEval.value != "") {
        console.log("hello");
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (startdateValue.value != "" && entryValueEval.value != "") {
        console.log("hello");
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (enddateValue.value != "" && entryValueEval.value != "") {
        console.log("hello");
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (startdateValue.value != "" && entryValueCycle.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.Status_Task._id == entryValueStatusTask.value
          );
        });
      } else if (enddateValue.value != "" && entryValueCycle.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.end_date == enddateValue.value &&
            value.Status_Task._id == entryValueStatusTask.value
          );
        });
      } else if (entryValueCycle.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value
          );
        });
      } else if (startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value
          );
        });
      } else if (enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.end_date == enddateValue.value &&
            value.Status_Task._id == entryValueStatusTask.value
          );
        });
      } else if (entryValueEval.value != "") {
        console.log("hello");
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else {
        data.items = data.items.filter((value, index) => {
          // console.log('name', value.Status_Task.status)
          return value.Status_Task._id == entryValueStatusTask.value;
        });
      }
      var employees = reactive({ data: {} });
      for (let value of data.items) {
        employees.data = await http_getOne(Task, value._id);
        console.log("count:", employees.data.Employees.length);
        value.count = employees.data.Employees.length;

        for (let value1 of arrayCheck.data) {
          // value.count = employees.Employees.length;
          if (value._id == value1._id) {
            value.checked = true;
          }
        }
      }
      data.currentPage = 1;
    });

    watch(startdateValue, async (newValue, oldValue) => {
      console.log("start date", newValue);
      if (newValue == "") {
        await refresh();
        return;
      }
      data.items = await http_getAll(Task);
      for (const value of data.items) {
        value.end_date_format = formatDate(value.end_date);
        value.start_date_format = formatDate(value.start_date);
      }
      if (
        entryValueStatusTask.value != "" &&
        enddateValue.value != "" &&
        entryValueCycle.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        enddateValue.value != "" &&
        entryValueCycle.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        enddateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        entryValueCycle.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        enddateValue.value != "" &&
        entryValueCycle.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueCycle.value != "" && entryValueStatusTask.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value
          );
        });
      } else if (entryValueCycle.value != "" && entryValueEval.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueStatusTask.value != "" && entryValueEval.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (enddateValue.value != "" && entryValueEval.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueStatusTask.value != "" && enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueCycle.value != "" && enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueCycle.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value
          );
        });
      } else if (entryValueStatusTask.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value
          );
        });
      } else if (enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueEval.value != "") {
        data.items = data.items.filter((value, index) => {
          return value.Evaluate._id == entryValueEval.value;
        });
      } else {
        data.items = data.items.filter((value, index) => {
          return value.start_date == startdateValue.value;
        });
      }
      var employees = reactive({ data: {} });
      for (let value of data.items) {
        employees.data = await http_getOne(Task, value._id);
        console.log("count:", employees.data.Employees.length);
        value.count = employees.data.Employees.length;

        for (let value1 of arrayCheck.data) {
          // value.count = employees.Employees.length;
          if (value._id == value1._id) {
            value.checked = true;
          }
        }
      }
      data.currentPage = 1;
    });

    watch(enddateValue, async (newValue, oldValue) => {
      console.log("end date", newValue);
      if (newValue == "") {
        await refresh();
        return;
      }
      data.items = await http_getAll(Task);
      for (const value of data.items) {
        value.end_date_format = formatDate(value.end_date);
        value.start_date_format = formatDate(value.start_date);
      }
      for (const value of data.items) {
        value.end_date_format = formatDate(value.end_date);
        value.start_date_format = formatDate(value.start_date);
      }
      if (
        entryValueStatusTask.value != "" &&
        startdateValue.value != "" &&
        entryValueCycle.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        startdateValue.value != "" &&
        entryValueCycle.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (
        startdateValue.value != "" &&
        entryValueCycle.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        entryValueCycle.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        startdateValue.value != "" &&
        entryValueEval.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueCycle.value != "" && entryValueStatusTask.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueStatusTask.value != "" && startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueCycle.value != "" && startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueCycle.value != "" && entryValueEval.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (startdateValue.value != "" && entryValueEval.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueStatusTask.value != "" && entryValueEval.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueCycle.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value && value.end_date == enddateValue.value
          );
        });
      } else if (entryValueStatusTask.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (entryValueEval.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Evaluate._id == entryValueEval.value &&
            value.end_date == enddateValue.value
          );
        });
      } else {
        data.items = data.items.filter((value, index) => {
          return value.end_date == enddateValue.value;
        });
      }
      var employees = reactive({ data: {} });
      for (let value of data.items) {
        employees.data = await http_getOne(Task, value._id);
        console.log("count:", employees.data.Employees.length);
        value.count = employees.data.Employees.length;

        for (let value1 of arrayCheck.data) {
          // value.count = employees.Employees.length;
          if (value._id == value1._id) {
            value.checked = true;
          }
        }
      }
      data.currentPage = 1;
    });

    watch(entryValueEval, async (newValue, oldValue) => {
      console.log("end date", newValue);
      if (newValue == "") {
        await refresh();
        return;
      }
      data.items = await http_getAll(Task);
      for (const value of data.items) {
        value.end_date_format = formatDate(value.end_date);
        value.start_date_format = formatDate(value.start_date);
      }
      if (
        entryValueStatusTask.value != "" &&
        startdateValue.value != "" &&
        entryValueCycle.value != "" &&
        enddateValue.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        startdateValue.value != "" &&
        enddateValue.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.Evaluate._id == entryValueEval.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value
          );
        });
      } else if (
        startdateValue.value != "" &&
        entryValueCycle.value != "" &&
        entryValueStatusTask.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueCycle.value != "" &&
        startdateValue.value != "" &&
        enddateValue.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (
        entryValueStatusTask.value != "" &&
        entryValueCycle.value != "" &&
        enddateValue.value != ""
      ) {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.cycleId == entryValueCycle.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueCycle.value != "" && entryValueStatusTask.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Status_Task._id == entryValueStatusTask.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueStatusTask.value != "" && startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueCycle.value != "" && startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueCycle.value != "" && enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (startdateValue.value != "" && enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.start_date == startdateValue.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueStatusTask.value != "" && enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.end_date == enddateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueCycle.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.cycleId == entryValueCycle.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (entryValueStatusTask.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Status_Task._id == entryValueStatusTask.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (startdateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.start_date == startdateValue.value &&
            value.Evaluate._id == entryValueEval.value
          );
        });
      } else if (enddateValue.value != "") {
        data.items = data.items.filter((value, index) => {
          return (
            value.Evaluate._id == entryValueEval.value &&
            value.end_date == enddateValue.value
          );
        });
      } else {
        console.log("day ne", entryValueEval.value);
        data.items = data.items.filter((value, index) => {
          return value.Evaluate._id == entryValueEval.value;
        });
      }
      var employees = reactive({ data: {} });
      for (let value of data.items) {
        employees.data = await http_getOne(Task, value._id);
        console.log("count:", employees.data.Employees.length);
        value.count = employees.data.Employees.length;

        for (let value1 of arrayCheck.data) {
          // value.count = employees.Employees.length;
          if (value._id == value1._id) {
            value.checked = true;
          }
        }
      }
      data.currentPage = 1;
    });

    // computed
    const toString = computed(() => {
      console.log("Starting search");
      if (data.choseSearch == "nameCus") {
        return data.items.map((value, index) => {
          return [value.Customer.name].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "statustask") {
        return data.items.map((value, index) => {
          return [value.Status_Task.name].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "cycle") {
        return data.items.map((value, index) => {
          return [value.Cycle.name].join("").toLocaleLowerCase();
        });
      } else {
        return data.items.map((value, index) => {
          return [value.Customer.name, value.Status_Task.name, value.Cycle.name]
            .join("")
            .toLocaleLowerCase();
        });
      }
    });
    const filter = computed(() => {
      return data.items.filter((value, index) => {
        return toString.value[index].includes(data.searchText.toLocaleLowerCase());
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
    // methods
    const appointmentView = (value, value1) => {
      // data.taskId = value;
      // data.taskObject = value1;
      console.log("Id:", value, "Object:", value1);
      router.push({ name: "Task.appointment", params: { id: `${value}` } });
    };
    const showFeedback = () => {
      console.log("day ne");
      data.showFeedback = false;
      for (let value of data.items) {
        if (value.checked == true) {
          console.log("item", value);
          data.taskEmployee = value;
          data.showFeedback = true;
          break;
        }
      }
      if (data.showFeedback == false) {
        alert_warning(`Thêm đánh giá`, `Vui lòng chọn phân công để thêm đánh giá.`);
      }
    };
    const showTask_Employee = () => {
      // console.log("day ne")
      // data.showTask_Employee = false;
      // for (let value of data.items) {
      //   if (value.checked == true) {
      //     console.log('item', value );
      //     data.taskEmployee = value;
      //     data.showTask_Employee = true;
      //     break;
      //   }
      // }
      // if (data.showTask_Employee == false) {
      //   alert_warning(`Thêm phân công cho nhân viên`, `Vui lòng chọn phân công để giao việc cho nhân viên.`);
      // }
      console.log("11ArrayCheck Index:", arrayCheck.data[0]);
      data.showTask_Employee = false;
      if (arrayCheck.data.length > 0) {
        data.taskEmployee = arrayCheck.data[0];
        data.showTask_Employee = true;
      } else {
        alert_warning(
          `Thêm phân công cho nhân viên`,
          `Vui lòng chọn phân công để giao việc cho nhân viên.`
        );
      }
    };

    const create = async () => {
      //await refresh();
      console.log("new task");
      data.items = await http_getAll(Task);
      await refresh();
    };

    const update = async (item) => {
      const result = await http_update(Task, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa phân công`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa phân công`, `${result.msg}`);
      }
    };
    const edit = async (editValue) => {
      // editValue["StatusTaskId"] = editValue.Status_Task._id;
      console.log("edit", editValue);
      console.log("Id:", editValue._id);
      editValue.loginId = sessionStorage.getItem("employeeId");
      const result = await http_update(Task, editValue._id, editValue);
      console.log("ne", result);
      // thêm phân công khi có sự thay đổi status thành Đã chăm sóc
      if (!result.error) {
        alert_success(`Sửa phân công`, `${result.msg}`);
        await refresh();
      } else if (result.error) {
        alert_error(`Sửa phân công`, `${result.msg}`);
      }
    };

    const router = useRouter();

    const view = async (id) => {
      console.log(id);
      data.viewValue = await http_getOne(Task, id);

      data.viewValue.Customer.birthday = formatDate(data.viewValue.Customer.birthday);
      console.log(data.viewValue);
      // router.push({ name: "Assignment.view", params: { id: _id } });
    };

    //SelectAll
    const arrayCheck = reactive({ data: [] });

    const handleSelectAll = (value) => {
      arrayCheck.data = [];
      if (value == false) {
        for (let value1 of data.items) {
          value1.checked = true;
          arrayCheck.data.push(value1);
        }
      } else {
        for (let value1 of data.items) {
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

    // HANDLE DELETE
    const handleDelete = async (id, item) => {
      console.log("h", id, item);
      const isConfirmed = await alert_delete(
        "Xóa",
        `Bạn có chắc là xóa phân công khách hàng 
        <span style="color: blue;">${item.Customer.name} </span>
        với nội dung chăm sóc  <span style="color: blue;"> ${item.content}</span>
         không !!`
      );
      if (isConfirmed) {
        const rsTask = await http_deleteOne(Task, id);
        console.log(rsTask);
        if (rsTask.error) {
          alert_error("Lỗi ", rsTask.msg);
        } else {
          await refresh();
          alert_success(
            "Thành công",
            `Bạn đã xóa phân công khách hàng ${rsTask.documents.Customer.name} `
          );
        }
      }
    };
    const deleteMany = async () => {
      console.log("delete many");
      try {
        //Mảng nhân viên sẽ xóa
        // const deleteArray = data.items.filter((value, index) => {
        //   return value.checked == true;
        // });
        if (arrayCheck.data.length == 0) {
          alert_warning("Bạn chưa chọn phân công", "");
          return;
        }
        let contentAlert = `<p>Bạn có muốn xoá tất cả phân công này không?
          </p><p>Tổng số phân công sẽ xoá là:
           <span style="color: blue;">${arrayCheck.data.length}</span></p>
            <table class="table table-bordered">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Nội dung chăm sóc</th>
          </tr>
        </thead> <tbody>`;
        for (let value of arrayCheck.data) {
          for (const value of data.items) {
            value.end_date_format = formatDate(value.end_date);
            value.start_date_format = formatDate(value.start_date);
          }
          console.log(value);
          contentAlert += `<tr>
            <td>${value.Customer.name}</td>
            <td>${value.start_date_format}</td>
            <td>
              ${value.end_date_format}
            </td>
            <td>
              ${value.content}
            </td>
          </tr>`;
        }
        contentAlert += `</tbody>
      </table>`;
        const isConfirmed = await alert_delete_wide(`Xoá nhiều phân công`, contentAlert);
        if (isConfirmed) {
          let checkDeleteAll = false;
          for (let valueDelete of arrayCheck.data) {
            const rsTask = await http_deleteOne(Task, valueDelete._id);
            if (rsTask.error) {
              alert_error("Lỗi ", rsTask.msg);
              checkDeleteAll = false;
            } else {
              checkDeleteAll = true;
            }
          }
          //2****
          if (checkDeleteAll) {
            arrayCheck.data = [];
            await refresh();
            alert_success("Thành công", "Xóa phân công thành công");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const appointment = (_id) => {
      // router.push({ name: "Assignment.appointment", params: { id: _id } });
    };

    const refresh = async () => {
      // data.evaluate = await http_getAll(Evaluate);
      status_tasks.status_task = await http_getAll(StatusTask);
      evaluates.evaluate = await http_getAll(Evaluate);
      cycles.cycle = await http_getAll(Cycle);
      data.cus = await http_getAll(Customer);
      data.cus = data.cus.documents;
      // console.log("aaa", data.cus);
      data.employee = await http_getAll(Employee);
      data.items = await http_getAll(Task);
      for (let value of data.items) {
        value.checked = false;
      }
      // 2*****
      // console.log("Data items tasks:", data.items);
      var employees = reactive({ data: {} });
      for (let value of data.items) {
        employees.data = await http_getOne(Task, value._id);
        // console.log("count:", employees.data.Employees.length);
        value.count = employees.data.Employees.length;

        for (let value1 of arrayCheck.data) {
          // value.count = employees.Employees.length;
          if (value._id == value1._id) {
            value.checked = true;
          }
        }
      }
      // console.log("Data items tasks:", data.items);

      for (const value of data.items) {
        value.end_date_format = formatDate(value.end_date);
        value.start_date_format = formatDate(value.start_date);
      }
      status_tasks.status_task = status_tasks.status_task.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
      cycles.cycle = cycles.cycle.map((value, index) => {
        return {
          ...value,
          value: value._id,
        };
      });
      evaluates.evaluate = evaluates.evaluate.map((value, index) => {
        return {
          ...value,
          value: value._id,
          name: value.star,
        };
      });
      // console.log("evaluate", evaluates.evaluate);
      data.selectAll[0].checked = false;
    };
    const giaoviec = async () => {
      console.log("giao việc");
      await refresh();
    };
    // handle http methods

    // Hàm callback được gọi trước khi component được mount (load)
    onBeforeMount(async () => {
      await refresh();
      // console.log("status task", status_tasks.status_task);
      // console.log("task", data.items);
      // console.log("cycle", cycles.cycle);
      // console.log("employee", data.employee);
      // console.log("customer", data.cus);
    });

    return {
      data,
      setPages,
      create,
      update,
      edit,
      view,
      appointment,
      cycles,
      cycleValue,
      statusValue,
      startdateValue,
      enddateValue,
      showTask_Employee,
      showFeedback,
      status_tasks,
      updateEntryValueStatusTask,
      updateEntryValueCycle,
      updateEntryValueEval,
      entryValueStatusTask,
      entryNameStatusTask,
      entryNameCycle,
      entryValueCycle,
      entryNameEval,
      entryValueEval,
      handleDelete,
      deleteMany,
      handlSelectOne,
      handleSelectAll,
      evaluates,
      appointmentView,
      giaoviec,
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Filter -->
    <!-- Search -->
    <!-- <div class="border-hr mb-3"></div> -->
    <div class="d-flex flex-column mt-3">
      <span class="mx-3 mb-3 h6">Lọc phân công</span>
      <div class="d-flex mx-3">
        <div class="form-group w-100">
          <Select
            :title="`Chu kỳ`"
            :entryValue="entryNameCycle"
            :options="cycles.cycle"
            @update:entryValue="
              (value, value1) => (
                updateEntryValueCycle(value), (entryNameCycle = value1.name)
              )
            "
            @refresh="(entryNameCycle = 'Chu kỳ'), updateEntryValueCycle('')"
            style="height: 35px"
          />
        </div>
        <div class="form-group w-50 ml-3">
          <Select
            :title="`Đánh giá`"
            :entryValue="entryNameEval"
            :options="evaluates.evaluate"
            @update:entryValue="
              (value, value1) => (
                updateEntryValueEval(value), (entryNameEval = value1.name)
              )
            "
            @refresh="(entryNameEval = 'Đánh giá'), updateEntryValueEval('')"
            style="height: 35px"
          />
        </div>
        <div class="form-group w-100 ml-3">
          <Select
            :title="`Trạng thái`"
            :entryValue="entryNameStatusTask"
            :options="status_tasks.status_task"
            @update:entryValue="
              (value, value1) => (
                updateEntryValueStatusTask(value), (entryNameStatusTask = value1.name)
              )
            "
            @refresh="
              (entryNameStatusTask = 'Trạng thái'), updateEntryValueStatusTask('')
            "
            style="height: 35px"
          />
        </div>
        <div class="form-group w-100 ml-3">
          <InputFilter
            @update:entryValue="(value) => (startdateValue = value)"
            :title="`Ngày bắt đầu`"
            :entryValue="`Ngày bắt đầu`"
            style="height: 35px"
          />
        </div>
        <div class="form-group w-100 ml-3">
          <InputFilter
            @update:entryValue="(value) => (enddateValue = value)"
            :title="`Ngày kết thúc`"
            :entryValue="`Ngày kết thúc`"
            style="height: 35px"
          />
        </div>
        <div class="form-group"></div>
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
          ]"
          style="width: 125px"
          :title="`Số bản ghi`"
          @update:entryValue="(value) => (data.entryValue = value)"
          :entryValue="data.entryValue"
          @refresh="(data.entryValue = 'All'), (data.currentPage = 1)"
        />
        <Search
          class="ml-3"
          style="width: 300px"
          @update:searchText="(value) => (data.searchText = value)"
          :entryValue="data.searchText"
          @choseSearch="
            async (value) => (
              console.log('search ........'),
              (data.choseSearch = value),
              (data.currentPage = 1)
            )
          "
          @refresh="(data.entryValue = 'All'), (data.currentPage = 1)"
          :options="[
            {
              _id: 'nameCus',
              name: 'Tìm kiếm theo tên khách hàng',
            },
            {
              _id: 'statustask',
              name: 'Tìm kiếm theo trạng thái',
            },
            {
              _id: 'cycle',
              name: 'Tìm kiếm theo chu kỳ',
            },
          ]"
        />
      </div>
      <div class="d-flex align-items-start">
        <Add_TaskEmployee
          v-if="data.showTask_Employee"
          :item="data.taskEmployee"
          @giaoviec="giaoviec"
        />
        <FeedBack v-if="data.showFeedback" :item="data.taskEmployee" />
        <button
          type="button"
          class="btn btn-secondary mr-3"
          data-toggle="modal"
          data-target="#model-feedback"
          @click="showFeedback()"
        >
          <span class="mx-2">Đánh giá</span>
        </button>
        <button
          type="button"
          class="btn btn-warning mr-3"
          data-toggle="modal"
          data-target="#model-form-task_em"
          @click="showTask_Employee()"
        >
          <span class="mx-2" style="color: white">Giao việc</span>
        </button>
        <button
          type="button"
          class="btn btn-danger mr-3"
          data-toggle="modal"
          data-target="#model-delete-all"
          @click="deleteMany()"
        >
          <span id="delete-all" class="mx-2">Xoá</span>
        </button>
        <!-- <DeleteAll :items="data.items" /> -->
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#model-add"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <Add
          @create="create"
          :cycles="data.cycles"
          :cus="data.cus"
          :employee="data.employee"
          @newCycle="
            (value) => {
              cycles.cycle = value;
            }
          "
          @newStatus="
            (value) => {
              status_tasks.status_task = value;
            }
          "
        />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Bắt đầu',
        'Kết thúc',
        'Nội dung chăm sóc',
        'SLNV',
        'Đánh giá',
        'Trạng thái',
      ]"
      :selectAll="data.selectAll"
      :labels="['start_date_format', 'end_date_format', 'content', 'count']"
      @selectAll="(value) => handleSelectAll(value)"
      @selectOne="(id, item) => handlSelectOne(id, item)"
      @delete="handleDelete"
      @edit="(value, value1) => ((data.editValue = value), (data.activeEdit = value1))"
      @view="(value) => view(value)"
      @appointmentView="
        (value, value1) => {
          appointmentView(value, value1);
        }
      "
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
      :cycles="cycles.cycle"
      :cus="data.cus"
      :employee="data.employee"
      :evaluate="data.evaluate"
      :statustask="status_tasks.status_task"
      @edit="edit(data.editValue)"
    />
    <AddAppointment
      v-if="data.taskId.length > 0"
      :taskId="data.taskId"
      :task="data.taskObject"
    />
    <View :viewValue="data.viewValue" />
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
</style>
