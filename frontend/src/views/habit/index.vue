<script>
import Add from "./add.vue";
import Edit from "./edit.vue";
import setHabit from "./setHabit.vue";
import View from "./view.vue";
import {
  // components
  Table,
  Pagination,
  Dropdown,
  Select,
  Search,
  DeleteAll,
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
  Habit,
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

import {
  isDeleteHabit,
  isEditHabit,
  isCreateHabit,
  isReadHabit,
  isSetHabit,
} from "../../use/getSessionItem";

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
    setHabit,
    View,
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
      choseSearch: "",
      selectAll: [
        {
          checked: false,
        },
      ],
      refreshTable: false,
      habitValue: {},
      showSetHabit: false,
      viewValue: {},
      showView: false,
    });

    // computed
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

    // methods
    const create = async () => {
      try {
        let isFlase = false;
        for (let value of data.itemAdd) {
          const result = await http_create(Habit, value);
          if (result.error) {
            alert_error(`Thêm thói quên`, `${result.msg}`);
            break;
          } else if (!result.error) isFlase = true;
        }
        if (isFlase) {
          alert_success(`Thêm thói quen`, `Thói quen đã được tạo thành công.`);
          refresh();
          data.itemAdd = [{ name: "" }];
        }
      } catch (error) {
        console.log(error);
      }
    };
    const update = async (item) => {
      const result = await http_update(Habit, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa thói quen`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa thói quen`, `${result.msg}`);
      }
    };
    const deleteOne = async (_id) => {
      const habit = await http_getOne(Habit, _id);
      console.log("deleting", habit);
      const isConfirmed = await alert_delete(
        `Xoá thói quen`,
        `Bạn có chắc chắn muốn xoá thói quen ${habit.name} không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Habit, _id);
        alert_success(
          `Xoá thói quen`,
          `Bạn đã xoá thành công thói quen ${result.document.name}.`
        );
        refresh();
      }
    };
    const edit = async (editValue) => {
      console.log(editValue);
      const result = await http_update(Habit, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa sự kiện`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa sự kiện`, `${result.msg}`);
      }
    };

    const router = useRouter();
    const view = (item) => {
      console.log("view", item);
      data.viewValue = item;
      data.showView = true;
      // router.push({ name: "Event.view", params: { id: _id } });
    };

    const getOne = async (_id) => {
      try {
        const result = await http_getOne(Habit, _id);
        return result;
      } catch (error) {}
    };

    const setHabit = () => {
      data.habitValue = {};
      data.showSetHabit = false;
      for (let value of data.items) {
        if (value.checked == true) {
          data.habitValue = value;
          data.showSetHabit = true;
          break;
        }
      }
      if (data.showSetHabit == false) {
        alert_warning(
          `Thêm khách hàng cùng thói quen`,
          `Vui lòng chọn thói quen.`
        );
      }
    };

    const setHabit1 = () => {
      data.habitValue = {};
      data.showSetHabit = false;
      for (let value of data.items) {
        if (value.checked == true) {
          data.habitValue = value;
          data.showSetHabit = true;
          break;
        }
      }
    };

    const refresh1 = async () => {
      const habits = await http_getAll(Habit);
      for (var i = 0; i < habits.length; i++) {
        data.items[i].totalCustomer = habits[i].Customers.length;
        data.items[i].Customers = habits[i].Customers;
        // data.items[i].checked = false;
      }
      console.log("habits[0].Customers", habits[0].Customers);
      // for (const value of data.items) {
      //   value.time_duration_format = formatDateTime(value.time_duration);
      // }
      // for (let value of data.items) {
      //   value.totalCustomer = value.Customers.length;
      // }
    };

    const refresh = async () => {
      data.items = await http_getAll(Habit);
      for (let value of data.items) {
        value.checked = false;
        value.totalCustomer = value.Customers.length;
      }
    };

    const handleSelectAll = (value) => {
      console.log("cccc", value);
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

    const removeItem = (index) => {
      data.itemAdd = data.itemAdd.filter((value1, index1) => {
        return index1 != index;
      });
    };

    const deleteMany = async () => {
      try {
        const deleteArray = data.items.filter((value, index) => {
          return value.checked == true;
        });
        let name, phone, email;
        let contentAlert = `<p>Bạn có muốn xoá tất cả thói quen này không?</p><p>Tổng số thói quen sẽ xoá là: <span style="color: blue;">${deleteArray.length}</span></p>
          <table class="table table-bordered">
      <thead>
        <tr>
          <th>Tên thói quen</th>
        </tr>
      </thead> <tbody>`;
        console.log("deleteArray", deleteArray[0].Customer);
        for (let value of deleteArray) {
          contentAlert += `<tr>
          <td>${value.name}</td>
        </tr>`;
        }
        contentAlert += `</tbody>
    </table>`;
        const isConfirmed = await alert_delete_wide(
          `Xoá nhiều thói quen`,
          contentAlert
        );
        if (isConfirmed) {
          let checkDeleteAll = false;
          for (let valueDelete of deleteArray) {
            const result = await http_deleteOne(Habit, valueDelete._id);
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

    // watch
    const activeMenu = ref(2);
    watch(activeMenu, (newValue, oldValue) => {
      router.push({ name: "Event" });
    });

    // Hàm callback được gọi trước khi component được mount (load)
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
      view,
      getOne,
      handleSelectAll,
      deleteMany,
      removeItem,
      setHabit,
      setHabit1,
      refresh1,
      isDeleteHabit,
      isEditHabit,
      isCreateHabit,
      isReadHabit,
      isSetHabit,
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        :to="{ name: 'Event' }"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Sự kiện</span>
      </router-link>
      <router-link
        :to="{ name: 'Habit' }"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-18">Thói quen</span>
      </router-link>
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
          @click="deleteMany()"
          :disabled="isDeleteHabit() ? false : true"
        >
          <span id="delete-all" class="mx-2">Xoá</span>
        </button>
        <!-- <DeleteAll :items="data.items" /> -->
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#model-addHabit"
          :disabled="isCreateHabit() ? false : true"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <Add :items="data.itemAdd" @create="create" @remove="removeItem" />
        <button
          type="button"
          class="btn btn-secondary ml-3"
          data-toggle="modal"
          data-target="#model-setHabit"
          @click="setHabit()"
          :disabled="isSetHabit() ? false : true"
        >
          <span id="add" class="mx-2">Áp dụng</span>
        </button>
        <setHabit
          :refreshTable="data.refreshTable"
          v-if="data.showSetHabit"
          :item="data.habitValue"
          @refresh1="refresh1()"
        />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="['Tên thói quen', 'Khách hàng']"
      :labels="['name', 'totalCustomer']"
      @delete="(value) => deleteOne(value)"
      :startRow="data.startRow"
      :selectAll="data.selectAll"
      @selectAll="(value) => handleSelectAll(value)"
      @refresh_event="((value) => (data.refreshTable = !value), setHabit1())"
      @edit="
        async (value, value1) => (
          (data.editValue = await getOne(value._id)), (data.activeEdit = value1)
        )
      "
      @view="(value) => view(value)"
      :showActionList="[
        isReadHabit() ? true : false,
        isEditHabit() ? true : false,
        isDeleteHabit() ? true : false,
      ]"
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
  <View v-if="data.showView" :item="data.viewValue" />
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
.show-modal {
  /* display: block;
  opacity: 1;
  background-color: var(--dark);
  pointer-events: auto;
  z-index: 1; */
}
</style>
