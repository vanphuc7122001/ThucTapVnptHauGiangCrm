<script>
import Add from "./add.vue";
import Edit from "./edit.vue";
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
  },
  props: {
    taskObject: {
      type: Object,
      default: {
        customer: "",
        employee: "",
      },
    },
  },
  setup(ctx, props) {
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
        date_time: "",
        content: "",
        taskId: "",
        statusId: "",
        reason: "",
        ...props.taskObject,
      },
      activeEdit: false,
      editValue: {},
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
      const result = await http_create(Appointment, data.itemAdd);
      if (!result.error) {
        alert_success(
          `Thêm lịch hẹn`,
          `Lịch hẹn ${result.document.name} lúc ${formatDateTime(
            result.document.date_time
          )} đã được tạo thành công.`
        );
        refresh();
      } else if (result.error) {
        alert_error(`Thêm lịch hẹn`, `${result.msg}`);
      }
    };
    const update = (item) => {
      console.log("updating", item);
    };
    const deleteOne = async (_id) => {
      const appointment = await http_getOne(Appointment, _id);
      const isConfirmed = await alert_delete(
        `Xoá lịch hẹn`,
        `Bạn có chắc chắn muốn xoá lịch ${
          appointment.name
        } lúc ${formatDateTime(appointment.date_time)} không ?`
      );
      if (isConfirmed == true) {
        const result = await http_deleteOne(Appointment, _id);
        alert_success(
          `Xoá lịch hẹn`,
          `Bạn đã xoá thành công lịch hẹn ${
            result.document.name
          } lúc ${formatDateTime(result.document.date_time)}.`
        );
        refresh();
      }
    };

    const edit = async (editValue) => {
      const result = await http_update(Appointment, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa lịch hẹn`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa lịch hẹn`, `${result.msg}`);
      }
    };

    const router = useRouter();

    const view = (_id) => {
      console.log("view", _id);
      router.push({ name: "Event.view", params: { id: _id } });
    };

    const refresh = async () => {
      data.items = await http_getAll(Appointment);
    };

    const getOne = async (_id) => {
      try {
        const result = await http_getOne(Appointment, _id);
        return result;
      } catch (error) {
        
      }
    }

    // Hàm callback được gọi trước khi component được mount (load)
    onBeforeMount(async () => {
      refresh();
      console.log(data.items);
    });

    // watch
    return {
      data,
      setPages,
      create,
      update,
      deleteOne,
      edit,
      view,
      getOne
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Filter -->
    <!-- Search -->
    <div class="my-3 mx-3 h6"><span>Danh sách lịch hẹn</span></div>
    <div class="border-hr mb-3"></div>
    <div class="d-flex justify-content-between mx-3 my-3">
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
      :fields="['Thời gian hẹn', 'Nội dung cuộc hẹn']"
      :labels="['date_time_format', 'content']"
      @delete="(value) => deleteOne(value)"
      @edit="
        async (value, value1) => (
          (data.editValue = await getOne(value._id)),
          (data.activeEdit = value1),
          (data.editValue.time_duration =
            data.editValue.date_time.toUpperCase())
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
</style>
