<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="report_container">
      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 2 ? { border: '1px solid blue' } : {}"
      >
        <router-link
          :to="!isReadReport() ? '#' : '/report'"
          :class="[data.activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span class=""> Khách hàng lâu chưa chăm sóc</span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countReport }}/{{ store.countCustomer }}</span
            >
          </span>
        </router-link>
      </div>
      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 1 ? { border: '1px solid blue' } : {}"
      >
        <!-- to="/report_assignment_staff" -->
        <router-link
          :to="!isReadReportAssinmentStaff() ? '#' : '/report_assignment_staff'"
          :class="[data.activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span class=""> Khách hàng do nhân viên chăm sóc </span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countReportAssignmentStaff }}/{{
                store.countCustomer
              }}</span
            >
          </span>
        </router-link>
      </div>

      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 0 ? { border: '1px solid blue' } : {}"
      >
        <router-link
          :to="!isReadReportCustomerCycle() ? '#' : '/report_customer_cycle'"
          :class="[data.activeMenu == 0 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span> Khách hàng tới chu kì nhưng chưa chăm sóc </span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countReportCustomerCycle }}/{{
                store.countCustomer
              }}</span
            >
          </span>
        </router-link>
      </div>

      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 3 ? { border: '1px solid blue' } : {}"
      >
        <router-link
          :to="!isReadReportLeaderCustomer() ? '#' : '/report_leader_customer'"
          :class="[data.activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span class=""> Khách hàng do lãnh đạo phụ trách </span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countLeaderCustomer }}/{{ store.countCustomer }}</span
            >
          </span>
        </router-link>
      </div>
      <div
        class="mx-1 report__item"
        :style="data.activeMenu == 4 ? { border: '1px solid blue' } : {}"
      >
        <router-link
          :to="!isReadReportLeaderStaff() ? '#' : '/report_leader_staff'"
          :class="[data.activeMenu == 4 ? 'active-menu' : 'none-active-menu']"
          class=""
        >
          <span class=""> Nhân viên do lãnh đạo phụ trách </span>
          <span class="pl-3" style="margin-top: -4px">
            <span class="material-symbols-outlined"> group </span>
            <span class="text-center"
              >{{ store.countleaderStaff }}/{{ store.countEmployee }}</span
            >
          </span>
        </router-link>
      </div>
    </div>
    <!-- Filter -->
    <!-- Search -->
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
          @update:entryValue="handleUpdateEntryValue"
          :entryValue="data.entryValue"
          @refresh="data.entryValue = 'All'"
        />
        <Search
          class="ml-3"
          style="width: 300px"
          @update:searchText="(value) => (data.searchText = value)"
          :entryValue="data.searchText"
          @choseSearch="
            async (value) => (
              // console.log('search ........'),
              (data.choseSearch = value), (data.currentPage = 1)
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
          ]"
        />
      </div>
      <div class="d-flex align-items-start">
        <button
          class="btn btn-warning mx-2"
          data-toggle="modal"
          data-target="#model-form-mail"
          :disabled="isMail() ? false : true"
        >
          <span id="delete-all" class="">Mail</span>
        </button>
        <button
          type="button"
          :disabled="isPrintReport() ? false : true"
          class="btn btn-primary"
          @click="handlePrintReport"
        >
          <span id="add" class="">In</span>
        </button>
      </div>
    </div>
    <Table
      :items="setPages"
      :fields="[
        'Tên khách hàng',
        'Email khách hàng',
        'Số điện thoại khách hàng',
        'Loại khách hàng',
        'Trạng thái chăm sóc',
      ]"
      :labels="[
        'nameCustomer',
        'emailCustomer',
        'phoneCustomer',
        'customerType',
        'statusTask',
      ]"
      @delete="handleDelete"
      @edit="EditEmit"
      :showActionList="[true, false, false]"
      :startRow="data.startRow"
      @view="view"
      :isActiveCheckbox="false"
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

    <div class="container pdf-content" v-show="true" ref="pdfContent">
      <img
        src="../../../assets/images/vnpt-logo1.png"
        class="rounded-circle"
        alt="Cinque Terre"
        style="height: 70px"
      />
      <div class="d-flex justify-content-between mt-4">
        <p class="text-center ml-4 font-weight-bold">VNPT Hậu Giang</p>
        <div class="text-center font-weight-bold" style="margin-top: -40px">
          <p>CỘNG HÒA XÃ HỘI CHỦ NGHỈA VIỆT NAM</p>
          <p>Độc lập - Tự do - Hạnh phúc</p>
          <p>-----------------</p>
        </div>
      </div>
      <div class="float-right">
        <p>....ngày....tháng....năm</p>
      </div>
      <div class="text-center mt-4 font-weight-bold">
        <h3 class="font-weight-bold">
          Báo Cáo <br />
          Danh Sách Khách Hàng Thuộc Nhân Viên Phụ Trách
        </h3>
      </div>
      <div class="">
        <span>Họ tên: ................................</span>
        <br />
        <span>Chức vụ: .............................</span>
        <br />
        <span>Bộ phận công tác: ............</span>
      </div>
      <!-- 'Tên nhân viên',
                'Email nhân viên',
                'Sdt nhân viên', -->
      <table class="table table-bordered mt-4">
        <thead>
          <tr>
            <th
              v-for="(value, index) in [
                'Stt',
                'Tên khách hàng',
                'Sdt khách hàng',
                'Email khách hàng',
                'Loại khách hàng',
                'Trạng thái chăm sóc',
              ]"
              :key="index"
            >
              {{ value }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data.employee" :key="index">
            <td>{{ index + 1 }}</td>
            <!-- <td>
              <span v-for="(value, index) in item.employee" :key="index">
                {{ value.name }} <br />
              </span>
            </td>
            <td>
              <span v-for="(value, index) in item.employee" :key="index">
                {{ value.email }} <br />
              </span>
            </td>
            <td>
              <span v-for="(value, index) in item.employee" :key="index">
                {{ value.phone }} <br />
              </span>
            </td> -->
            <td>{{ item.nameCustomer }}</td>
            <td>{{ item.phoneCustomer }}</td>
            <td>{{ item.emailCustomer }}</td>
            <td>{{ item.customerType }}</td>
            <td>{{ item.statusTask }}</td>
          </tr>
        </tbody>
      </table>

      <div
        class="d-flex justify-content-around mt-4"
        style="margin-bottom: 100px"
      >
        <p>Phụ trách bộ phận</p>
        <p>Người Báo Cáo</p>
      </div>
    </div>
    <View
      :item="data.viewValue"
      :Events="data.Events"
      :viewCareCus="data.viewCareCus"
    />
    <Mail />
  </div>
</template>
<script>
import { reactive, computed, ref, onBeforeMount } from "vue";
import Table from "../../../components/table/table-report.vue";
import Mail from "../mail.vue";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  http_getAll,
  Task,
  Pagination,
  Select,
  Search,
  Customer,
  http_getOne,
  formatDateTime,
  formatDateTime_2,
  formatDate,
} from "../../common/import";

import {
  countCustomer,
  countEmployee,
  countElementReportPage,
  countElementReportCustomerCyclePage,
  countElementReportAssignmentStaff,
  countElementReportLeaderCustomer,
  countElementReportLeaderStaff,
} from "../use/index";

import {
  isReadReport,
  isReadReportLeaderCustomer,
  isReadReportLeaderStaff,
  isReadReportCustomerCycle,
  isReadReportAssinmentStaff,
  isPrintReport,
  isMail,
} from "../../../use/getSessionItem";

import View from "./view.vue";

export default {
  components: {
    Table,
    Pagination,
    Select,
    Search,
    View,
    Mail,
  },
  setup(ctx) {
    const store = reactive({
      countCustomer: 0,
      countEmployee: 0,
      countReport: 0,
      countReportAssignmentStaff: 0,
      countReportCustomerCycle: 0,
      countLeaderCustomer: 0,
      countleaderStaff: 0,
    });

    const labels = [
      "STT",
      "Tên khách hàng",
      "Loại khách hàng",
      "Tên nhân viên",
      "Ngày bắt đầu",
      "Ngầy kết thúc",
    ];

    const data = reactive({
      Events: [],
      items: [],
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeMenu: 1,
      viewValue: [],
      lengthCustomer: 0,
      employee: [],
      viewCareCus: [],
    });

    const reFresh = async () => {
      store.countCustomer = await countCustomer();
      store.countEmployee = await countEmployee();
      store.countReport = await countElementReportPage();
      store.countReportAssignmentStaff =
        await countElementReportAssignmentStaff();
      store.countReportCustomerCycle =
        await countElementReportCustomerCyclePage();
      store.countLeaderCustomer = await countElementReportLeaderCustomer();
      store.countleaderStaff = await countElementReportLeaderStaff();

      const tasks = await http_getAll(Task);
      const ListTaskId = [];
      tasks.map((task) => {
        ListTaskId.push(task._id);
      });

      const customerArray = [];
      for (const _id of ListTaskId) {
        const rs = await http_getOne(Task, _id);
        customerArray.push(rs);
        // data.items.push(rs);
      }

      data.items = [...customerArray];

      // console.log('Data items report assignment staff:', data.items);

      data.items = data.items.filter((item) => {
        if (item.Employees.length > 0) {
          return item;
        }
      });

      // data.items.filter( (item) => {
      //   console.log('Item: ' , item);
      // })

      data.items = data.items.map((task) => {
        return {
          statusTask: task.Status_Task.name,
          nameCustomer: task.Customer.name,
          phoneCustomer: task.Customer.phone,
          emailCustomer: task.Customer.email,
          customerType: task.Customer.Customer_Type.name,
          employee: [...task.Employees],
          ...task,
        };
      });

      data.employee = data.items.map((item) => {
        return {
          statusTask: item.statusTask,
          nameCustomer: item.nameCustomer,
          phoneCustomer: item.phoneCustomer,
          emailCustomer: item.emailCustomer,
          customerType: item.customerType,
          employee: [...item.employee],
        };
      });

      // console.log("data employee: ", data.employee[0].employee[0].name);
    };

    // life cycle
    onBeforeMount(() => {
      reFresh();
    });
    const pdfContent = ref(null);
    const handlePrintReport = async () => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      if (pdfContent.value) {
        const content = pdfContent.value;

        html2canvas(content).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          const imgWidth = pageWidth - 20; // Giảm kích thước hình ảnh để tạo lề
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let yPosition = 10; // Đặt lề trên là 10px
          let contentRemainingHeight = imgHeight;
          let pageNumber = 1;

          while (contentRemainingHeight > 0) {
            if (pageNumber > 1) {
              doc.addPage();
            }

            doc.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight); // Đặt lề trái là 10px

            contentRemainingHeight -= pageHeight - 20; // Giảm chiều cao trang để tạo lề
            if (contentRemainingHeight > 0) {
              yPosition = 10 - contentRemainingHeight; // Đặt lề trên trang tiếp theo
            } else {
              yPosition = 10; // Reset lề trên cho trang tiếp theo
            }

            pageNumber++;
          }

          doc.save("BaoCaoKhachHangThuocNhanVienPhuTrach.pdf");
        });
      }
    };

    // computed
    const toString = computed(() => {
      // console.log("Starting search");
      if (data.choseSearch == "name") {
        return data.items.map((value, index) => {
          return [value.nameCustomer].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "email") {
        return data.items.map((value, index) => {
          return [value.emailCustomer].join("").toLocaleLowerCase();
        });
      } else if (data.choseSearch == "phone") {
        return data.items.map((value, index) => {
          return [value.phoneCustomer].join("").toLocaleLowerCase();
        });
      } else {
        return data.items.map((value, index) => {
          return [value.nameCustomer, value.emailCustomer, value.phoneCustomer]
            .join("")
            .toLocaleLowerCase();
        });
      }
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

    const view = async (item) => {
      // console.log("Before view", item.Customer._id);
      const rs = await http_getOne(Customer, item.Customer._id);
      
      data.viewCareCus = rs.documents.Tasks.map((value) => {
        return {
          name: item.Customer.name,
          start_date: formatDate(value.start_date),
          end_date: formatDate(value.end_date),
          content: value.content,
          cycle: value.Cycle.name,
          statusTask: value.Status_Task.name,
          star: value.Evaluate.star,
          comment: value.Comment.content,
        };
      });
      data.viewValue = {
        Customer: {
          name: item.Customer.name,
          birthday: formatDate(item.Customer.birthday),
          avatar: item.Customer.avatar,
          phone: item.Customer.phone,
          email: item.Customer.email,
          address: item.Customer.address,
          customerType: item.customerType,
        },
        Customer_Work: {
          nameCompany: item.Customer.Customer_Works[0].Company_KH.name,
          current_position: item.Customer.Customer_Works[0].current_position,
          current_workplace: item.Customer.Customer_Works[0].current_workplace,
          work_history: item.Customer.Customer_Works[0].work_history,
          work_temp: item.Customer.Customer_Works[0].work_temp,
        },
        Events: [...item.Customer.Events],
        Habits: [...item.Customer.Habits],
        ...item,
        startdate: formatDate(item.start_date),
      };

      data.Events = item.Customer.Events.map((item) => {
        return {
          name: item.name,
          time_duration: formatDateTime_2(item.time_duration),
          content: item.content,
          place: item.place != null ? item.place : "không có",
        };
      });
    };
    return {
      data,
      setPages,
      view,
      handlePrintReport,
      pdfContent,
      labels,
      store,
      isReadReport,
      isReadReportLeaderCustomer,
      isReadReportLeaderStaff,
      isReadReportCustomerCycle,
      isReadReportAssinmentStaff,
      isPrintReport,
      isMail,
    };
  },
};
</script>

<style scoped>
.pdf-content {
  position: absolute;
  left: -9999px;
  top: -9999px;
}

.border-box {
  border: 1px solid var(--gray);
  border-radius: 5px;
}

.menu {
  /* border: 1px solid var(--gray); */
  border-collapse: collapse;
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

.report_container {
  display: flex;
  justify-content: space-between;
  margin: 10px 4px;
}

.mx-1.report__item {
  height: 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
}

a.none-active-menu,
a.router-link-active.router-link-exact-active.active-menu {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 5px;
  text-decoration: none;
}

a.router-link-active.router-link-exact-active.active-menu {
  font-weight: bold;
}

a.router-link-active.router-link-exact-active.active-menu
  span.material-symbols-outlined {
  color: blue;
}

span.material-symbols-outlined {
  padding: 5px;
  font-size: 24px;
  color: #000;
}
</style>