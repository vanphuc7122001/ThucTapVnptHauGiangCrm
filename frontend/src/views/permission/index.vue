<script>
import Add from "./add.vue";
import Edit from "./edit.vue";
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
  alert_delete_wide,
} from "../common/import.js";

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
      itemAdd: [
        {
          name: "",
        },
      ],
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
      choseSearch: "",
      selectAll: [
        {
          checked: false,
        },
      ],
    });
    const toString = computed(() => {
     
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
    const activeMenu = ref(3);
    watch(activeMenu, (newValue, oldValue) => {
      if (activeMenu.value == 1) {
        router.push({ name: "Account" });
      } else if (activeMenu.value == 2) {
        router.push({ name: "Role" });
      }
    });

    // methods
    const create = async (pTValue) => {
      try {
        let isFlase = false;
        for (let value of data.itemAdd) {
          const result = await http_create(Permission, {
            name: value.name,
            permissionTypesId: pTValue,
          });
          if (result.error) {
            alert_error(`Thêm quyền`, `${result.msg}`);
            break;
          } else if (!result.error) isFlase = true;
        }
        if (isFlase) {
          alert_success(`Thêm quyền`, `Quyền đã được tạo thành công.`);
          refresh();
          data.itemAdd = [{ name: "" }];
        }
      } catch (error) {
        console.log(error);
      }
    };

    const removeItem = (index) => {
      data.itemAdd = data.itemAdd.filter((value1, index1) => {
        return index1 != index;
      });
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
    const deleteOne = async (_id, data) => {
      //   const event = await http_getOne(Permission, _id);
      //   console.log("deleting", event);
      const isConfirmed = await alert_delete(
        `Xoá quyền`,
        `Bạn có chắc chắn muốn xoá quyền ${data.name} không ?`
      );
     
      if (isConfirmed == true) {
        const result = await http_deleteOne(Permission, _id);
        alert_success(
          `Xoá quyền`,
          `Bạn đã xoá thành công quyền ${result.document.name}.`
        );
        refresh();
      }
    };

    const deleteMany = async () => {
      try {
        const deleteArray = data.items.filter((value, index) => {
          return value.checked == true;
        });
        let name, phone, email;
        let contentAlert = `<p>Bạn có muốn xoá tất cả quyền này không?</p><p>Tổng số quyền sẽ xoá là: <span style="color: blue;">${deleteArray.length}</span></p>
          <table class="table table-bordered">
      <thead>
        <tr>
          <th>Tên quyền</th>
        </tr>
      </thead> <tbody>`;
        
        for (let value of deleteArray) {
          contentAlert += `<tr>
          <td>${value.name}</td>
        </tr>`;
        }
        contentAlert += `</tbody>
    </table>`;
        const isConfirmed = await alert_delete_wide(
          `Xoá nhiều quyền`,
          contentAlert
        );
        if (isConfirmed) {
          let checkDeleteAll = false;
          for (let valueDelete of deleteArray) {
            const result = await http_deleteOne(Permission, valueDelete._id);
            if (result.error) {
              alert_error("Lổi ", result.msg);
              checkDeleteAll = false;
            } else {
              checkDeleteAll = true;
            }
          }
          if (checkDeleteAll) {
            refresh();
            alert_success("Thành công", "Xóa quyền thành công");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const edit = async (editValue) => {
    
      const result = await http_update(Permission, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa quyền`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa quyền`, `${result.msg}`);
      }
    };

    const view = (_id) => {
      
      // router.push({ name: "Event.view", params: { id: _id } });
    };

    const refresh = async () => {
      data.items = await http_getAll(Permission);
      for (let value of data.items) {
        value.checked = false;
        value.pTValue = value.Permission_Type.name;
      }
    };

    const handleSelectAll = (value) => {
  
      if (value == false) {
        for (let value1 of data.items) {
          value1.checked = true;
        }
      } else {
        for (let value1 of data.items) {
          value1.checked = false;
        }
      }
    };

    const delete_a = async (objectData) => {
      // console.log("delete_a", objectData);
    };

    const getOne = async (_id) => {
      try {
        const result = await http_getOne(Permission, _id);
        return result;
      } catch (error) {}
    };

    // handle http methods

    // Hàm callback được gọi trước khi component được mount (load)
    onBeforeMount(async () => {
      refresh();
   
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
      getOne,
      handleSelectAll,
      deleteMany,
      removeItem,
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        :to="{ name: 'Account' }"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Tài khoản</span>
      </router-link>
      <router-link
        :to="{ name: 'Role' }"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-18">Vai trò</span>
      </router-link>
      <router-link
        :to="{ name: 'Permission' }"
        @click="activeMenu = 3"
        :class="[activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-18">Quyền</span>
      </router-link>
    </div>
    <!-- Filter -->
    <!-- <div class="border-hr mb-3"></div> -->
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
          ]"
        />
      </div>
      <div class="d-flex align-items-start">
        <button
          type="button"
          class="btn btn-danger mr-3"
          data-toggle="modal"
          data-target="#model-delete-all"
        >
          <span id="delete-all" class="mx-2" @click="deleteMany()">Xoá</span>
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
        <Add :items="data.itemAdd" @create="(value) => create(value)" @remove="removeItem" />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="['Tên quyền', 'Loại quyền']"
      :labels="['name', 'pTValue']"
      :showActionList="[false, false, true]"
      :startRow="data.startRow"
      :selectAll="data.selectAll"
      @selectAll="(value) => handleSelectAll(value)"
      @delete="(value, value1) => deleteOne(value, value1)"
      @edit="
        async (value, value1) => (
          (data.editValue = await getOne(value._id)), (data.activeEdit = value1)
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
  <Edit
    :item="data.editValue"
    :class="[data.activeEdit ? 'show-modal' : 'd-none']"
    @cancel="data.activeEdit = false"
    @edit="edit(data.editValue)"
  />
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