<script>
import Add from "./add.vue";
import FormWizard from "../../components/form/form-wizard.vue";
import {
  // components
  Table,
  Pagination,
  Dropdown,
  Select,
  Search,
  DeleteAll,
  Select_Advanced,
  // compositions
  reactive,
  computed,
  watch,
  ref,
  onBeforeMount,
  // router
  useRouter,
  // format date or datetime
  formatDateTime,
  formatDate,
  // service
  Event,
  Habit,
  Account,
  Appointment,
  Center_VNPT,
  Company_KH,
  Customer_Types,
  Customer_Work,
  Customer,
  Cycle,
  Department,
  Employee,
  Log,
  Permission,
  Position,
  Role,
  Task,
  Unit,
  // http service
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
  // alert
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
  alert_info,
} from "../common/import.js";

export default {
  components: {
    Table,
    Pagination,
    Dropdown,
    Select,
    Search,
    Add,
    Select_Advanced,
    FormWizard,
  },
  setup(ctx) {
    const data = reactive({
      items: [],
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      itemAdd: {
        name: "",
        content: "",
        time_duration: "",
      },
      activeEdit: false,
      editValue: {},
      searchSelect: "",
      optionSelect: [
        {
          _id: 1,
          name: "1",
        },
        {
          _id: 2,
          name: "2",
        },
      ],
      test: {
        a: "",
        b: "",
      },
    });
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.name].join("").toLocaleLowerCase();
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

    // routers
    const router = useRouter();

    // watch
    const activeMenu = ref(1);
    watch(activeMenu, (newValue, oldValue) => {
      if (activeMenu.value == 2) {
        router.push({ name: "Role" });
      } else if (activeMenu.value == 3) {
        router.push({ name: "Permission" });
      }
    });

    // methods
    const create = async () => {
      const result = await http_create(Event, data.itemAdd);
      if (!result.error) {
        alert_success(
          `Thêm sự kiện`,
          `Sự kiện ${result.document.name} lúc ${formatDateTime(
            result.document.time_duration
          )} đã được tạo thành công.`
        );
        refresh();
      } else if (result.error) {
        alert_error(`Thêm sự kiện`, `${result.msg}`);
      }
    };
    const update = async (item) => {
      const result = await http_update(Event, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa sự kiện`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa sự kiện`, `${result.msg}`);
      }
    };

    const deleteOne = async (_id) => {
      const account = await http_getOne(Account, _id);
      console.log("deleting", account);
      const isConfirmed = await alert_delete(
        `Xoá tài khoản`,
        `Bạn có chắc chắn muốn xoá tài khoản ${account.user_name} không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Account, _id);
        alert_success(
          `Xoá tài khoản`,
          `Bạn đã xoá thành công tài khoản ${
            result.document.user_name
          }.`
        );
        refresh();
      }
    };

    const edit = async (editValue) => {
      console.log(editValue);
      const result = await http_update(Event, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa sự kiện`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa sự kiện`, `${result.msg}`);
      }
    };

    const view = (_id) => {
      console.log("view", _id);
      router.push({ name: "Event.view", params: { id: _id } });
    };

    const refresh = async () => {
      data.items = await http_getAll(Account);
      data.items = data.items.map((value, index) => {
        return {
          _id: value._id,
          user_name: value.user_name,
          employee: value.Employee.name,
          role: value.Role.name,
        };
      });
    };

    const delete_a = async (objectData) => {
      console.log("delete_a", objectData);
    };

    // handle http methods

    // Hàm callback được gọi trước khi component được mount (load)
    onBeforeMount(async () => {
      refresh();
      console.log(data.items);
    });

    return {
      data,
      setPages,
      activeMenu,
      create,
      update,
      deleteOne,
      edit,
      view,
      delete_a,
      refresh,
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <a
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Tài khoản</a
      >
      <a
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Vai trò</a
      >
      <a
        @click="activeMenu = 3"
        :class="[activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Quyền</a
      >
    </div>
    <!-- Filter -->
    <div class="border-hr mb-3"></div>
    <div class="d-flex flex-column">
      <span class="mx-3 mb-3 h6">Lọc tài khoản</span>
      <div class="d-flex mx-3">
        <div class="form-group w-100">
          <Select
            :title="`Vai trò tài khoản`"
            :entryValue="`Vai trò tài khoản`"
            :options="[
              { name: '1 tuần', value: '1 tuần' },
              { name: '1 tháng', value: '1 tháng' },
              { name: '1 năm', value: '1 năm' },
            ]"
          />
        </div>
        <!-- <div class="form-group ml-3">
        </div> -->
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
        <Add :item="data.itemAdd" @create="create" />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="['Tên nhân viên', 'Tên tài khoản', 'Vai trò tài khoản', 'Quyền']"
      :labels="['employee', 'user_name', 'role', 'content']"
      :showActionList="[false, false, true]"
      @delete="(value) => deleteOne(value)"
      @edit="
        (value, value1) => (
          (data.editValue = value),
          (data.activeEdit = value1),
          (data.editValue.time_duration =
            data.editValue.time_duration.toUpperCase())
        )
      "
      @view="(value) => view(value)"
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
.input {
  background-color: inherit;
  border: 1px solid var(--gray);
  border-radius: 5px;
}
</style>

