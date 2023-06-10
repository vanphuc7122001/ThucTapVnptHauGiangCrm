<script>
import Add from "./add.vue";
import Edit from "./edit.vue";
import View from "./view.vue";
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
    DeleteAll,
    Edit,
    View,
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
      }
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
      router.push({ name: "Habit" });
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
    const update = (item) => {
      console.log("updating", item);
    };
    const deleteOne = async (_id) => {
      const event = await http_getOne(Event, _id);
      console.log("deleting", event);
      const isConfirmed = await alert_delete(
        `Xoá sự kiện`,
        `Bạn có chắc chắn muốn xoá sự kiện ${event.name} lúc ${formatDateTime(
          event.time_duration
        )} không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Event, _id);
        alert_success(
          `Xoá sự kiện`,
          `Bạn đã xoá thành công sự kiện ${
            result.document.name
          } lúc ${formatDateTime(result.document.time_duration)}.`
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
      console.log("met moi qau");
      data.items = await http_getAll(Event);
      data.items.push({
        _id: "other",
        name: "other",
      });
      for (const value of data.items) {
        value.time_duration_format = formatDateTime(value.time_duration);
      }
      console.log(data.items);
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
    {{ data.searchSelect }}
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <a
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Sự kiện</a
      >
      <a
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Thói quen</a
      >
    </div>
    <!-- Filter -->
    <div class="border-hr mb-3"></div>
    <div class="d-flex flex-column">
      <span class="mx-3 mb-3 h6">Lọc sự kiện</span>
      <div class="d-flex mx-3">
        <div class="form-group w-100">
          <Select
            :title="`Khoảng thời gian`"
            :entryValue="`Khoảng thời gian`"
            :options="[
              { name: '1 tuần', value: '1 tuần' },
              { name: '1 tháng', value: '1 tháng' },
              { name: '1 năm', value: '1 năm' },
            ]"
          />
        </div>
        <div class="d-flex">
          <input
            style=""
            class="input px-2 form-group w-100 ml-3"
            type="date"
            name=""
            id=""
          />
        </div>

        <div class="form-group ml-3">
          <Select_Advanced
            :modelValue="`abc`"
            :options="data.items"
            style="width: 300px; height: 100%"
            @searchSelect="
              async (value) => (
                await refresh(),
                (data.items = data.items.filter((value1, index) => {
                  console.log(value1, value);
                  return value1.name.includes(value) || value.length == 0;
                })),
                console.log('searchSlect', value.length)
              )
            "
            @delete="(value) => console.log('delete', value)"
            @chose="(value) => console.log('choosed', value)"
          />
        </div>
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
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#model-form-wizard"
        >
          <span class="mx-2">model-form-wizard</span>
        </button>
        {{ data.test }}
        <FormWizard :item="data.test" />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="['Tên sự kiện', 'Nội dung sự kiện', 'Thời gian diễn ra']"
      :labels="['name', 'content', 'time_duration_format']"
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
  <Edit
    :item="data.editValue"
    :class="[data.activeEdit ? 'show-modal' : 'd-none']"
    @cancel="data.activeEdit = false"
    @edit="edit(data.editValue)"
  />
  <View />
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
