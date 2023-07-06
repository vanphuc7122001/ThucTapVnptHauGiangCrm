<script>
import { ref, reactive, computed, watch, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import Table from "../../components/table/table_dash.vue";
import Pagination from "../../components/table/pagination_duy.vue";
import Search from "../../components/form/search.vue";
import Select from "../../components/form/select.vue";
import Box from "../../components/box_lananh/box.vue";
import SelectOption from "../../components/box_lananh/select.vue";
import Add from "../dashboard/add_taskemployeedash.vue";
import {
  Customer,
  Customer_Types,
  http_getAll,
  Task,
  Evaluate,
  Status_Task,
  Cycle,
  http_getOne,
  alert_success,
} from "../common/import";
// import { Select_Advanced } from "../common/import";
import Select_Advanced from "../../components/form/select_cycle.vue";
import moment from "moment";
import { isReadDashboard } from "../../use/getSessionItem";

export default {
  components: {
    apexchart: VueApexCharts,
    Table,
    Pagination,
    Search,
    Select,
    Box,
    SelectOption,
    Select_Advanced,
    Add,
  },
  setup() {
    // Data customer
    const data = reactive({
      items: [],

      activeEdit: false,
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeMenu: 1,
      activeSelectAll: false,
      activeEdit: false,
      addValue: {},

      entryType: "",
      customerType: {},
      customer: {},
      lengthCustomer: 0,
      task: {},
      evaluate: {},
      statusTask: {},
      cycle: {},
      modelCycle: "tuần",
      progress: 0,
      days: 0,
      customerCycle: [],
      selectAll: [
        {
          checked: false,
        },
      ],
      customerCare: 0,
    });
    var uniqueTasks = {};
    const toString = computed(() => {
      if (data.choseSearch == "name") {
        return data.items.map((value, index) => {
          return [value.customer.name].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "email") {
        return data.items.map((value, index) => {
          return [value.customer.email].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "phone") {
        return data.items.map((value, index) => {
          return [value.customer.phone].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "cycle") {
        return data.items.map((value, index) => {
          return [value.cycle].join("").toLocaleLowerCase();
        });
      } else {
        return data.items.map((value, index) => {
          return [value.customer.name, value.customer.email, value.customer.phone]
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

    //refresh
    const refresh = async () => {
      data.customerType = await http_getAll(Customer_Types);
      data.customer = await http_getAll(Customer);
      data.lengthCustomer = data.customer.documents.length;
      data.task = await http_getAll(Task);
      data.evaluate = await http_getAll(Evaluate);
      data.statusTask = await http_getAll(Status_Task);
      data.cycle = [
        { _id: "tuần", name: "tuần" },
        { _id: "tháng", name: "tháng" },
        { _id: "quý", name: "quý" },
        { _id: "năm", name: "năm" },
      ];
      data.customerCycle = await http_getAll(Task);
    };

    // table customer
    const overview = ref(true);
    const detail = ref(false);
    // !chăm sóc
    const takeCare = ref(false);
    // !phân công
    const assign = ref(false);
    const isassign = ref(true);
    // Chart
    const selectedOptionCycle = ref(""); //cycle
    const customerChart = ref(false);
    const appointmentChart = ref(true);
    const showchart = ref("appointment");

    //biểu đồ tròn của loại khách hàng
    const chartOptionsCustomerType = reactive({
      chart: {
        type: "pie",
      },
      labels: [],
      series: [],
      colors: ["#9FD7F0", "#3300cc", "#1CA7EC"],
    });
    const chartSeriesCustomerType = ref([]);

    //STAR
    //chart số lượng khách hàng đã phân công
    const chartOptionsStar = reactive({
      chart: {
        type: "pie", // Thay đổi loại biểu đồ thành "line"
      },
      labels: [],
      series: [],
      colors: ["#FFDD94", "#FD8F52", "#FFd700", "#FFC125", "#EEAD0F"],
    });
    const chartSeriesStar = ref([]);

    //bar chart , 3 trạng thái
    const chartOptionsAppointment = reactive({
      chart: {
        id: "basic-bar",
        type: "bar",
      },
      xaxis: {
        categories: ["Trạng thái"],
      },
      colors: ["rgb(255, 99, 132)", "#3300cc", "rgb(250, 90, 80)"],
    });
    const chartSeriesAppointment = reactive({
      data: [
        {
          name: "",
          data: [],
        },
      ],
    });
    //
    const chartOptionsAppointment1 = reactive({
      chart: {
        type: "pie", // Thay đổi loại biểu đồ thành "line"
      },
      labels: [],
      series: [],
      colors: ["#FFDD94", "#FD8F52", "#FFd700", "#FFC125", "#EEAD0F"],
    });
    const chartSeriesAppointment1 = ref([]);
    //Map tính lại chu kỳ tiếp theo cho tất cả trường hợp chu kỳ
    const handleCycle = (nameCycle, date) => {
      let coming_day = moment(date, "YYYY-MM-DD");
      var parts = nameCycle.split(" ");
      var number = parseInt(parts[0]);
      var string = parts[1];
      switch (string) {
        case "ngày":
          coming_day = coming_day.add(number, "days");
          break;
        case "tuần":
          
          coming_day = coming_day.add(number * 7, "days");
          break;
        case "tháng":
          
          coming_day = coming_day.add(number, "months");
          break;
        case "quý":
          
          coming_day = coming_day.add(number * 3, "months");
          break;
        case "năm":
          
          coming_day = coming_day.add(number, "years");
          break;
        default:
         
          break;
      }

      return coming_day.format("YYYY-MM-DD");
    };

    const initCustomer = async (start, end) => {
      // await refresh();
      data.items = [];
      data.customerCycle = await http_getAll(Task);
      // Mảng nhiệm vụ ban đầu
      // Đối tượng để lưu trữ nhiệm vụ duy nhất theo từng khách hàng
      uniqueTasks = {};

      // Duyệt qua mảng nhiệm vụ và lấy nhiệm vụ duy nhất có ngày bắt đầu lớn nhất
      for (var i = 0; i < data.customerCycle.length; i++) {
        var task = data.customerCycle[i];
        var customer = task["customerId"];

        if (uniqueTasks.hasOwnProperty(customer)) {
          var existingTask = uniqueTasks[customer];
          var existingStartDate = new Date(existingTask["start_date"]);
          var currentStartDate = new Date(task["start_date"]);

          if (currentStartDate > existingStartDate) {
            uniqueTasks[customer] = task;
          }
        } else {
          uniqueTasks[customer] = task;
        }
      }
      // Kết quả - Mảng nhiệm vụ duy nhất có ngày bắt đầu lớn nhất cho từng khách hàng
      var result = Object.values(uniqueTasks);
      data.customerCycle = result;

      data.customerCycle = data.customerCycle.map((value, index) => {
        return {
          ...value,
          start_date_new: handleCycle(value.Cycle.name, value.start_date),
        };
      });
      // const abc = reactive({ data: [] });
      data.customerCycle = data.customerCycle.map((value, index) => {
        if (value.start_date_new == value.end_date) {
          return {
            ...value,
            start_date_new: handleCycle("1 ngày", value.start_date_new),
          };
        } else {
          return {
            ...value,
          };
        }
      });
  

      data.customerCycle = data.customerCycle.filter((item) => {
        return item.start_date_new >= start && item.start_date_new <= end;
      });

      for (let value of data.customerCycle) {
        let customer = await http_getOne(Customer, value.customerId);
        let cus = {
          content: value.content,
          cycleId: value.cycleId,
          cycle: value.Cycle.name,
          start_date: formatDate1(value.start_date),
          end_date: formatDate1(value.end_date),
          customer: customer.documents,
          status: value.Status_Task.name,
        };
        data.items.push(cus);
      }
      data.customerCare = data.items.length;
  
    };
    // khởi tạo biểu đồ khi thay đổi lựa chọn tuần, ...
    const initChart = async (start, end) => {
      await refresh();
      data.progress = 0;
      data.task = data.task.filter((item) => {
        return (
          (item.start_date >= start && item.start_date <= end) ||
          (item.end_date >= start && item.end_date <= end)
        );
      });
      for (let i = 0; i < data.statusTask.length; i++) {
        var count = 0;
        chartOptionsAppointment1.labels[i] = data.statusTask[i].name;
        chartSeriesAppointment1.value[i] = 0;

        for (let task of data.task) {
          if (task.StatusTaskId == data.statusTask[i]._id) {
            count++;
            chartSeriesAppointment1.value[i]++;
          }
        }
        if (data.statusTask[i].name == "đã chăm sóc") {
          data.progress = count;
        }

        chartSeriesAppointment.data[i] = {
          name: data.statusTask[i].name,
          data: [count],
        };
      }
      for (let i = 0; i < data.customerType.documents.length; i++) {
        chartOptionsCustomerType.labels[i] = data.customerType.documents[i].name;
        chartSeriesCustomerType.value[i] = 0;

        for (let j = 0; j < data.customer.documents.length; j++) {
          if (
            data.customerType.documents[i]._id ==
            data.customer.documents[j].customerTypesId
          ) {
            chartSeriesCustomerType.value[i]++;
          }
        }
      }
      if (data.task.length == 0) {
        data.progress = 0;
      } else {
        data.progress = (data.progress / data.task.length) * 100;
        data.progress = data.progress.toFixed(2);
      }
    };
    const show = async (nameChart, cycle) => {
      if (nameChart == "customer") {
        await refresh();
        for (let i = 0; i < data.customerType.documents.length; i++) {
          chartOptionsCustomerType.labels[i] = data.customerType.documents[i].name;
          chartSeriesCustomerType.value[i] = 0;

          for (let j = 0; j < data.customer.documents.length; j++) {
            if (
              data.customerType.documents[i]._id ==
              data.customer.documents[j].customerTypesId
            ) {
              chartSeriesCustomerType.value[i]++;
            }
          }
        }
        for (let i = 0; i < data.evaluate.length; i++) {
          chartOptionsStar.labels[i] = data.evaluate[i].star;
          chartSeriesStar.value[i] = 0;
          for (let task of data.task) {
            if (task.EvaluateId == data.evaluate[i]._id) {
              chartSeriesStar.value[i]++;
            }
          }
        }
      } else if (nameChart == "appointment") {
        // var dataCycle = await http_getOne(Cycle, cycle);
        switch (cycle) {
          case "tuần": {
            const week = getCurrentWeekDays();
            const firstDayOfWeek = week[0];
            const lastDayOfWeek = week[week.length - 1];
            initChart(firstDayOfWeek, lastDayOfWeek);
            break;
          }
          case "tháng": {
            const currentMonthDates = getCurrentMonthDates();
            initChart(currentMonthDates.start, currentMonthDates.end);
            break;
          }
          case "quý": {
            const currentQuarterDates = reactive({ data: {} });
            currentQuarterDates.data = getCurrentQuarterDates();
            initChart(currentQuarterDates.data.start, currentQuarterDates.data.end);
          }
          case "năm": {
            const getCurrentYearDates = getCurrentYear();
            initChart(getCurrentYearDates.start, getCurrentYearDates.end);
          }
        }
      } else if (nameChart == "customerCycle") {
        switch (cycle) {
          case "tuần": {
            const week = getCurrentWeekDays();
            const firstDayOfWeek = week[0];
            const lastDayOfWeek = week[week.length - 1];
            await initCustomer(firstDayOfWeek, lastDayOfWeek);
            break;
          }
          case "tháng": {
            const currentMonthDates = getCurrentMonthDates();
            await initCustomer(currentMonthDates.start, currentMonthDates.end);
            break;
          }
          case "quý": {
            const currentQuarterDates = reactive({ data: {} });
            currentQuarterDates.data = getCurrentQuarterDates();
            await initCustomer(
              currentQuarterDates.data.start,
              currentQuarterDates.data.end
            );
            break;
          }
          case "năm": {
            const getCurrentYearDates = getCurrentYear();
            await initCustomer(getCurrentYearDates.start, getCurrentYearDates.end);
            break;
          }
          default: {
            const week = getCurrentWeekDays();
            const firstDayOfWeek = week[0];
            const lastDayOfWeek = week[week.length - 1];
            await initCustomer(firstDayOfWeek, lastDayOfWeek);
            break;
          }
        }
      }
    };

    //Lấy tuần
    const getCurrentWeekDays = () => {
      const currentDate = new Date();
      const currentDay = currentDate.getDay(); // Lấy số thứ tự của ngày hiện tại (0 - Chủ nhật, 1 - Thứ 2, ..., 6 - Thứ 7)
      const firstDayOfWeek = new Date(currentDate);
      firstDayOfWeek.setDate(currentDate.getDate() - currentDay + 1); // Đặt ngày đầu tiên của tuần là ngày hiện tại trừ đi số ngày từ ngày đầu tuần đến ngày hiện tại và cộng thêm 1 ngày để đảm bảo nó là ngày thứ 2
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i); // Đặt ngày tiếp theo của tuần bằng cách thêm i ngày từ ngày đầu tuần
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Thêm '0' vào đầu nếu tháng chỉ có 1 chữ số
        const day = date.getDate().toString().padStart(2, "0"); // Thêm '0' vào đầu nếu ngày chỉ có 1 chữ số
        const formattedDate = `${year}-${month}-${day}`;
        weekDays.push(formattedDate);
      }
      return weekDays;
    };
    //Tháng hiện tại
    const getCurrentMonthDates = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

      const formattedFirstDay = formatDate(firstDayOfMonth);
      const formattedLastDay = formatDate(lastDayOfMonth);

      return {
        start: formattedFirstDay,
        end: formattedLastDay,
      };
    };
    //Quý hiện tại
    const getCurrentQuarterDates = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;

      const firstDayOfQuarter = new Date(currentYear, (currentQuarter - 1) * 3, 1);
      const lastDayOfQuarter = new Date(currentYear, currentQuarter * 3, 0);

      const formattedFirstDay = formatDate(firstDayOfQuarter);
      const formattedLastDay = formatDate(lastDayOfQuarter);

      return {
        start: formattedFirstDay,
        end: formattedLastDay,
      };
    };
    const getCurrentYear = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear(); // Lấy năm hiện tại

      // Lấy ngày bắt đầu của năm hiện tại
      const startDate = new Date(year, 0, 1); // Tháng được đánh số từ 0 (0 - Tháng 1, 1 - Tháng 2, ..., 11 - Tháng 12)
      const formattedStartDate = startDate.toISOString().slice(0, 10);

      // Lấy ngày kết thúc của năm hiện tại
      const endDate = new Date(year, 11, 31);
      const formattedEndDate = endDate.toISOString().slice(0, 10);

      return { start: formattedStartDate, end: formattedEndDate };
    };
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    };
    const formatDate1 = (date) => {
      var date1 = new Date(date);
      const year = date1.getFullYear();
      const month = (date1.getMonth() + 1).toString().padStart(2, "0");
      const day = date1.getDate().toString().padStart(2, "0");
      return `ngày ${day}-${month}-${year}`;
    };
    // watch selectOptionCycle
    watch(selectedOptionCycle, (newValue, oldValue) => {
      show(showchart.value, newValue);
    });
    //Watch chart
    watch(showchart, (newValue, oldValue) => {
      show(showchart.value, selectedOptionCycle.value);
    });
    onMounted(async () => {
      await refresh();
      const week = getCurrentWeekDays();
      const firstDayOfWeek = week[0];
      const lastDayOfWeek = week[week.length - 1];
      //1****
      data.items = [];
      data.customerCycle = await http_getAll(Task);
      // Mảng nhiệm vụ ban đầu
      // Đối tượng để lưu trữ nhiệm vụ duy nhất theo từng khách hàng
      uniqueTasks = {};

      // Duyệt qua mảng nhiệm vụ và lấy nhiệm vụ duy nhất có ngày bắt đầu lớn nhất
      for (var i = 0; i < data.customerCycle.length; i++) {
        var task = data.customerCycle[i];
        var customer = task["customerId"];

        if (uniqueTasks.hasOwnProperty(customer)) {
          var existingTask = uniqueTasks[customer];
          var existingStartDate = new Date(existingTask["start_date"]);
          var currentStartDate = new Date(task["start_date"]);

          if (currentStartDate > existingStartDate) {
            uniqueTasks[customer] = task;
          }
        } else {
          uniqueTasks[customer] = task;
        }
      }
      // Kết quả - Mảng nhiệm vụ duy nhất có ngày bắt đầu lớn nhất cho từng khách hàng
      var result = Object.values(uniqueTasks);
      data.customerCycle = result;

      data.customerCycle = data.customerCycle.map((value, index) => {
        return {
          ...value,
          start_date_new: handleCycle(value.Cycle.name, value.start_date),
        };
      });
      // const abc = reactive({ data: [] });
      data.customerCycle = data.customerCycle.map((value, index) => {
        if (value.start_date_new == value.end_date) {
          return {
            ...value,
            start_date_new: handleCycle("1 ngày", value.start_date_new),
          };
        } else {
          return {
            ...value,
          };
        }
      });

      data.customerCycle = data.customerCycle.filter((item) => {
        return (
          item.start_date_new >= firstDayOfWeek && item.start_date_new <= lastDayOfWeek
        );
      });

      for (let value of data.customerCycle) {
        let customer = await http_getOne(Customer, value.customerId);
        let cus = {
          content: value.content,
          cycleId: value.cycleId,
          cycle: value.Cycle.name,
          start_date: formatDate1(value.start_date),
          end_date: formatDate1(value.end_date),
          customer: customer.documents,
          status: value.Status_Task.name,
        };
        data.items.push(cus);
      }
      data.customerCare = data.items.length;
      //
      data.progress = 0;
      data.task = data.task.filter((value, index) => {
        return value.start_date >= firstDayOfWeek && value.start_date <= lastDayOfWeek;
      });
      // console.log(data.task);
      for (let i = 0; i < data.statusTask.length; i++) {
        var count = 0;
        chartOptionsAppointment1.labels[i] = data.statusTask[i].name;
        chartSeriesAppointment1.value[i] = 0;

        for (let task of data.task) {
          if (task.StatusTaskId == data.statusTask[i]._id) {
            count++;
            chartSeriesAppointment1.value[i]++;
          }
        }
        if (data.statusTask[i].name == "đã chăm sóc") {
          data.progress = count;
        }

        chartSeriesAppointment.data[i] = {
          name: data.statusTask[i].name,
          data: [count],
        };
      }
      //biểu đồ
      await refresh();
      data.progress = 0;
      data.task = data.task.filter((item) => {
        return (
          (item.start_date >= firstDayOfWeek && item.start_date <= lastDayOfWeek) ||
          (item.end_date >= firstDayOfWeek && item.end_date <= lastDayOfWeek)
        );
      });
      for (let i = 0; i < data.statusTask.length; i++) {
        var count = 0;
        chartOptionsAppointment1.labels[i] = data.statusTask[i].name;
        chartSeriesAppointment1.value[i] = 0;

        for (let task of data.task) {
          if (task.StatusTaskId == data.statusTask[i]._id) {
            count++;
            chartSeriesAppointment1.value[i]++;
          }
        }
        if (data.statusTask[i].name == "đã chăm sóc") {
          data.progress = count;
        }

        chartSeriesAppointment.data[i] = {
          name: data.statusTask[i].name,
          data: [count],
        };
      }
      //
      if (data.task.length == 0) {
        data.progress = 0.0;
      } else {
        data.progress = (data.progress / data.task.length) * 100;
        data.progress = data.progress.toFixed(2);
      }

    });

    //3****
    watch(takeCare, (newValue, oldValue) => {
      // console.log("takecare", newValue);
    });
    return {
      data,
      overview,
      detail,
      takeCare,
      setPages,
      selectedOptionCycle,
      showchart,
      customerChart,
      appointmentChart,
      assign,
      isassign,
      chartOptionsCustomerType,
      chartSeriesCustomerType,
      chartOptionsStar,
      chartSeriesStar,

      chartOptionsAppointment,
      chartSeriesAppointment,
      chartOptionsAppointment1,
      chartSeriesAppointment1,

      isReadDashboard,
    };
  },
};
</script>
<template>
  <div class="border-box content ml-2" v-if="isReadDashboard()">
    <div class="d-flex my-2 mx-3 menu justify-content-end" style="border: none">
      <!-- BTN tổng quan chi tiêt -->
      <div class="d-flex menu mx-2 my-2 justify-content-end">
        <a
          @click="
            () => {
              detail = false;
              overview = true;
            }
          "
          class="active-menu"
        >
          <span class="size-17 active-menu">Tổng quan</span>
        </a>
      </div>
      <div class=""></div>
    </div>
    <div class="border-hr mb-3"></div>
    <!-- Box -->
    <Box
      :showchart="showchart"
      @Chart="
        (value) => {
          showchart = value;
        }
      "
      :customer="data.lengthCustomer"
      :progress="data.progress"
      :customerCare="data.customerCare"
    ></Box>

    <!-- search, select -->
    <div class="d-flex justify-content-between mx-4 mb-3">
      <div class="d-flex justify-content-start" v-if="showchart == 'customerCycle'">
        <Select
          class="d-flex justify-content-start select"
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
          class="ml-3 search"
          style="width: 300px"
          @update:searchText="(value) => (data.searchText = value)"
          :entryValue="data.searchText"
          @choseSearch="
            async (value) => (
              (data.choseSearch = value),
              (data.currentPage = 1)
            )
          "
          @refresh="(data.entryValue = 'All'), (data.currentPage = 1)"
          :options="[
            {
              _id: 'name',
              name: 'Tìm kiếm theo tên',
            },
            {
              _id: 'email',
              name: 'Tìm kiếm theo email',
            },
            {
              _id: 'phone',
              name: 'Tìm kiếm theo số điện thoại',
            },
            {
              _id: 'cycle',
              name: 'Tìm kiếm theo chu kỳ',
            },
          ]"
        />
      </div>
      <div
        class="d-flex align-items-start float-right"
        style="width: 98px"
        :style="{ marginLeft: showchart === 'appointment' ? '92%' : '0px' }"
        v-if="showchart == 'appointment' || showchart == 'customerCycle'"
      >
        <Select_Advanced
          required
          :options="data.cycle"
          :modelValue="data.modelCycle"
          data.activeClose
          style="height: 40px"
          @searchSelect="
            async (value) => (
              await refresh(),
              (data.cycle = data.cycle.filter((value1, index) => {
                return value1.name.includes(value) || value.length == 0;
              }))
            )
          "
          @chose="
            (value, value1) => (
              (selectedOptionCycle = value), (data.modelCycle = value1.name)
            )
          "
        />
      </div>
    </div>

    <!--CHART -->

    <div class="p-0 mx-4">
      <div class="mt-2" v-if="showchart == 'appointment'">
        <!--Chart Appointment -->
        <div class="mt-5" v-if="overview && showchart == 'appointment'">
          <div class="border-box-chart">
            <h5 class="text-center mt-2">Biểu đồ thể hiện trạng thái chăm sóc</h5>
            <apexchart
              :options="chartOptionsAppointment"
              :series="chartSeriesAppointment.data"
              v-if="overview && showchart == 'appointment'"
              height="400"
            />
          </div>
          <div class="my-3 border-box-chart">
            <apexchart
              class="mt-5"
              :options="chartOptionsAppointment1"
              :series="chartSeriesAppointment1"
              v-if="overview && showchart == 'appointment'"
              height="400"
            />
          </div>
        </div>
      </div>

      <!--Chart Customer -->
      <div
        class="row justify-content-around row"
        v-if="overview && showchart == 'customer'"
      >
        <div class="col-lg-6 col-12 mb-4">
          <div
            class="card border-left-primary shadow h-100 py-2"
            :class="{ 'box-active': name == 'customer' }"
          >
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <h5 class="mb-1">Biểu đồ phân loại khách hàng</h5>
                  <!-- Tròn -->
                  <apexchart
                    class=""
                    :options="chartOptionsCustomerType"
                    :series="chartSeriesCustomerType"
                    v-if="overview && showchart == 'customer'"
                    height="400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-12 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <!-- tròn sao -->
                  <h5 class="mb-1">Biểu đồ đánh giá của khách hàng</h5>
                  <apexchart
                    class=""
                    :options="chartOptionsStar"
                    :series="chartSeriesStar"
                    v-if="overview && showchart == 'customer'"
                    height="400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- End Chart -->
    </div>
    <!-- Table -->
    <div v-if="showchart == 'customerCycle'">
      <Table
        :items="setPages"
        :fields="[
          'Tên',
          'Sđt',
          'Email',
          'Chu kỳ',
          'Nội dung chăm sóc',
          'Trạng thái',
          'Bắt đầu',
          'Kết thúc',
        ]"
        :selectAll="data.selectAll"
        :startRow="data.startRow"
        @selectAll="(value) => handleSelectAll(value)"
        @selectOne="(id, item) => handleSelectOne(id, item)"
        @delete="handleDelete"
        @edit="(value, value1) => ((data.addValue = value), (data.activeEdit = value1))"
        @view="
          (value) => {
            view(value);
          }
        "
        @appointment="
          (value, value1) => {
            data.activeEdit = value1;
          }
        "
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
    <!--End Detail -->
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.border-box {
  border: 1px solid var(--gray);
  border-radius: 5px;
  padding: 0;
}
.border-box-chart {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.border-hr {
  border-top: 1px solid var(--gray);
}

.menu {
  /* border: 1px solid var(--gray); */
  border-collapse: collapse;
}
.menu a {
  border: 1px solid var(--gray);
  border-radius: 0px;
  padding: 8px 12px;
  font-size: 15px;
}
.active-menu {
  color: blue;
}
select {
  background-color: #f6f6f6;
  border: 1px solid #b8c2cc;
  font-size: 16px;
}

.pad {
  padding: 1px;
}
.select {
  width: 125px;
}
.search {
  width: 300px;
}
.content {
  margin-top: 0px;
}
@media screen and (max-width: 738px) {
  .select {
    width: 90px;
  }
  .search {
    width: 210px;
    margin-left: 2px !important ;
    margin-right: 2px;
  }
  .border-box {
    width: 890px;
    margin-left: 10px;
  }
}
@media screen and (max-width: 992px) {
  .select {
    width: 90px;
  }
  .search {
    width: 210px;
    margin-left: 10px !important ;
    margin-right: 10px;
  }
  .border-box {
    width: 100%;
    margin-left: 10px;
  }
}
</style>