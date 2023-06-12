<script>
import Table from "../../components/table/table_customer.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
import View from "./view.vue";
import AddHabit from "../habit/add.vue";
import { reactive, computed, ref, onBeforeMount } from "vue";
import {
  http_getAll,
  http_deleteOne,
  alert_success,
  alert_error,
  alert_warning,
  alert_delete,
  Pagination,
  Dropdown,
  Select,
  Search,
  Select_Advanced,
  DeleteAll,
  Company_KH,
  Customer_Work,
  Customer,
  formatDateTime,
  formatDate,
} from "../common/import";

export default {
  components: {
    Table,
    Pagination,
    Dropdown,
    Select,
    Search,
    Add,
    DeleteAll,
    Edit,
    View,
    AddHabit,
    Select_Advanced,
  },
  setup(ctx) {
    const data = reactive({
      items: null,
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      itemAdd: {
        name: "",
        birthdate: "",
        address: "",
        phone: "",
        email: "",
        type: "",
        avatar: "",
        wor_current_workplace: "",
        wor_work_history: "",
        wor_current_position: "",
        wor_work_temp: "",
        companyKH: "",
      },
      activeEdit: false,
      viewValue: {
        Customer: {
          name: "",
          birthday: "",
          avatar: "",
          phone: "",
          email: "",
          address: "",
        },
        Customer_Type: {
          name: "",
        },
        Company_KH: {
          name: "",
        },
        Events: [
          {
            name: "",
            content: "",
            time_duration: "",
          },
        ],
        Habits: [
          {
            name: "",
          },
        ],
        current_workplace: "",
        work_history: "",
        current_position: "",
        work_temp: "",
      },
      customerTypeValue: "",
      customerValue: {},
      showAddHabit: false,
    });

    const reFresh = async () => {
      const rs = await http_getAll(Customer_Work);
      data.items = rs.documents;

      for (let value of data.items) {
        value.checked = false;
      }

      if (data.custypeTypeValue.length != 0) {
        data.items = data.items.filter((value, index) => {
          return value.name == "vip";
        });
      }

      if (data.custypeTypeValue.length != 0) {
        data.items = data.items.filter((value, index) => {
          return value.name == "vip";
        });
      }
    };

    const showAddHabit = () => {
      console.log('ok');
      data.customerValue = {};
      data.showAddHabit = false;
      for (let value of data.items) {
        if (value.checked == true) {
          data.customerValue = value;
          data.showAddHabit = true;
          break;
        }
      }
      if (data.showAddHabit == false) {
        alert_warning(`Thêm thói quen khách hàng`, `Vui lòng chọn khách hàng.`);
      }
    };

    onBeforeMount(() => {
      reFresh();
    });

    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.Customer.name, value.Customer.phone]
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

    // methods
    const update = (item) => {
      console.log("updating", item);
    };
    const deleteOne = (_id) => {
      console.log("deleting", _id);
    };

    // watch
    const activeMenu = ref(1);

    // CRUD

    const handleDelete = async (customerId, CompanyId, item) => {
      const isConfirmed = await alert_delete(
        "Xóa",
        `Bạn có chắc là xóa khách hàng ${item.Customer.name} không!!`
      );

      if (isConfirmed) {
        const rsCustomer = await http_deleteOne(Customer, customerId);
        console.log(rsCustomer);
        if (rsCustomer.error) {
          alert_error("Lổi ", rsCustomer.msg);
        } else {
          const rsCompany = await http_deleteOne(Company_KH, CompanyId);
          console.log(rsCompany);
          if (rsCompany.error) {
            alert_error("Lổi ", rsCompany.msg);
          } else {
            reFresh();
            alert_success("Thành công", "Xóa khách hàng thành công");
          }
        }
      }
    };

    const refresh_customer = () => {
      reFresh();
    };

    const view = (item) => {
      data.viewValue = {
        Customer: {
          _id: item.Customer._id,
          name: item.Customer.name,
          birthday: item.Customer.birthday,
          avatar: item.Customer.avatar,
          phone: item.Customer.phone,
          email: item.Customer.email,
          address: item.Customer.address,
        },
        Customer_Type: {
          _id: item.Customer.Customer_Type._id,
          name: item.Customer.Customer_Type.name,
        },
        Company_KH: {
          _id: item.Company_KH._id,
          name: item.Company_KH.name,
        },
        Events: [
          ...item.Customer.Events,

          // {name: item.Customer.Events[0].name,
          // content: item.Customer.Events[0].content,
          // time_duration: item.Customer.Events[0].time_duration}
        ],
        Habits: {
          ...item.Customer.Habits,
        },
        _id: item._id,
        current_workplace: item.current_workplace,
        work_history: item.work_history,
        current_position: item.current_position,
        work_temp: item.work_temp,
      };
    };

    //   formatDateTime,
    // formatDate,
    const edit = (item, isCheck) => {
      console.log(item.Customer);
      data.viewValue = {
        Customer: {
          _id: item.Customer._id,
          name: item.Customer.name,
          birthday: item.Customer.birthday,
          avatar: item.Customer.avatar,
          phone: item.Customer.phone,
          email: item.Customer.email,
          address: item.Customer.address,
        },
        Customer_Type: {
          _id: item.Customer.Customer_Type._id,
          name: item.Customer.Customer_Type.name,
        },
        Company_KH: {
          _id: item.Company_KH._id,
          name: item.Company_KH.name,
        },
        _id: item._id,
        current_workplace: item.current_workplace,
        work_history: item.work_history,
        current_position: item.current_position,
        work_temp: item.work_temp,
      };

      data.activeEdit = isCheck;
      console.log("Edit data", data.viewValue);
      console.log("Check edit", data.activeEdit);
    };

    return {
      data,
      setPages,
      activeMenu,
      update,
      deleteOne,
      edit,
      handleDelete,
      refresh_customer,
      view,
      showAddHabit
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        to="/customer"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Khách hàng
      </router-link>
      <router-link
        to="customer_types"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Loại khách hàng
      </router-link>
    </div>
    <!-- Filter -->
    <div class="border-hr mb-3"></div>
    <div class="d-flex flex-column mt-3">
      <span class="mx-3 mb-3 h6">Lọc khách hàng</span>
      <div class="d-flex mx-3">
        <div class="form-group w-100">
          <Select :title="`Loại khách hàng`" :entryValue="`Loại khách hàng`" />
        </div>
        <div class="form-group w-100 ml-3">
          <Select
            :title="`Trạng thái chăm sóc`"
            :entryValue="`Trạng thái chăm sóc`"
          />
        </div>
        <div class="form-group"></div>
      </div>
    </div>
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
        <!-- <DeleteAll :items="data.items" /> -->
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#model-add"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <Add @refresh_customer="refresh_customer" />
        <button
          type="button"
          class="btn btn-secondary ml-3"
          data-toggle="modal"
          data-target="#model-addHabit"
          @click="showAddHabit()"
        >
          <span id="add" class="mx-2">Thêm thói quen</span>
        </button>
        <AddHabit v-if="data.showAddHabit" :item="data.customerValue" />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Tên',
        'Email',
        'Sdt',
        'Công việc',
        'Công ty',
        'Loại khách hàng',
      ]"
      @delete="handleDelete"
      @edit="edit"
      @view="view"
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
      :item="data.viewValue"
      :class="[data.activeEdit ? 'show-modal' : 'd-none']"
      @cancel="data.activeEdit = false"
      @refresh_customer="refresh_customer"
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
</style>
