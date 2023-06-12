<script>
import Table from "../../components/table/table-assignment.vue";
import Pagination from "../../components/table/pagination_duy.vue";
import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Search from "../../components/form/search.vue";
import DeleteAll from "../../components/form/delete-all.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
import View from "./view.vue";
import Select_Advanced from "../../components/form/select_advanced.vue";
import { reactive, computed, watch, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
// services

import Task from "../../services/task.service";
import Cycle from "../../services/cycle.service";
import Employee from "../../services/employee.service";
import Customer from "../../services/customer.service";
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
} from "../../assets/js/common.alert";
export default {
  components: {
    Select_Advanced,
    Table,
    Pagination,
    Dropdown,
    Select,
    Search,
    Add,
    DeleteAll,
    Edit,
    View,
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
          Cycle: {
            _id: "",
            name: "",
          },
          Employee: {
            _id: "",
            name: "",
          },
          Status_Task: {
            status: "",
            reason: "",
          },
        },
      ],
      entryValue: 5,
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
        employeeId: "",
        Status_Task: {
          status: "",
          reason: "",
        },
      },
      addcycle: {},
      cus: [],
      employee: [],
    });

    const cycles = reactive({ cycle: [] });

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
    });

    // methods

    const create = async () => {
      //await refresh();
      console.log("new task");
      data.items = await http_getAll(Task);
    };

    // const update = async (item) => {
    //   console.log("updating", item);
    //   const result = await http_update(Task,data.editValue._id, data.editValue );
    //   console.log("result", result);
    //   if (!result.error) {
    //     // const task = await http_getOne(Task,result.document._id);
    //     // console.log("task", task);
    //     alert_success(
    //       `Chỉnh sửa phân công`,
    //       `Đã chỉnh sửa phân công khách hàng của nhân viên thành công.`
    //     );
    //     refresh();
    //   } else if (result.error) {
    //     alert_error(`Thêm phân công`, `${result.msg}`);
    //   }
    // };

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
      console.log("edit", editValue);
      const result = await http_update(Task, editValue._id, editValue);
      console.log("ne", result);
      if (!result.error) {
        alert_success(`Sửa phân công`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa phân công`, `${result.msg}`);
      }
    };

    const deleteOne = async (_id) => {
      const task = await http_getOne(Task, _id);
      console.log("deleting", task);
      const isConfirmed = await alert_delete(
        `Xoá sự phân công`,
        `Bạn có chắc chắn muốn xoá phân công của nhân viên ${task.Employee.name} không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Task, _id);
        alert_success(
          `Xoá phân công`,
          `Bạn đã xoá thành công phân công của nhân viên ${task.Employee.name} .`
        );
        refresh();
      }
    };

    const router = useRouter();

    const view = (_id) => {
      console.log("view", _id);
      router.push({ name: "Assignment.view", params: { id: _id } });
    };

    const appointment = (_id) => {
      router.push({ name: "Assignment.appointment", params: { id: _id } });
    };

    const refresh = async () => {
      cycles.cycle = await http_getAll(Cycle);
      data.cus = await http_getAll(Customer);
      data.cus = data.cus.documents;
      console.log("aaa", data.cus);
      data.employee = await http_getAll(Employee);
      data.items = await http_getAll(Task);
    };

    // handle http methods

    // Hàm callback được gọi trước khi component được mount (load)
    onBeforeMount(async () => {
      await refresh();
      console.log("task", data.items);
      console.log("cycle", cycles.cycle);
      console.log("employee", data.employee);
      console.log("customer", data.cus);
    });
    // onBeforeMount(async () => {
    //   data.items = await getAll(Task);
    //   data.cycles = await getAll(Cycle);
    //   data.cus = await getAll(Customer);
    //   data.employee = await getAll(Employee);
    //   console.log("task", data.items[0].Status_Task['status']);
    //   console.log("cycle", data.cycles);
    // });
    // watch

    // const task_status = ref("Status_Task['status']")
    return {
      data,
      setPages,
      create,
      update,
      deleteOne,
      edit,
      view,
      appointment,
      cycles,
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
          <Select :title="`Chu kỳ`" :entryValue="`Chu kỳ`" />
        </div>
        <div class="form-group w-100 ml-3">
          <Select :title="`Trạng thái`" :entryValue="`Trạng thái`" />
        </div>
        <div class="form-group w-100 ml-3">
          <Select :title="`Ngày bắt đầu`" :entryValue="`Ngày bắt đầu`" />
        </div>
        <div class="form-group w-100 ml-3">
          <Select :title="`Ngày kết thúc`" :entryValue="`Ngày kết thúc`" />
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
        />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Ngày bắt đầu',
        'Ngày kết thúc',
        'Nội dung chăm sóc',
        'Trạng thái',
      ]"
      :labels="['start_date', 'end_date', 'content']"
      @delete="(value) => deleteOne(value)"
      @edit="
        (value, value1) => (
          (data.editValue = value), (data.activeEdit = value1)
        )
      "
      @view="(value) => view(value)"
      @appointment="(value) => appointment(value)"
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
    :cycles="cycles.cycle"
    :cus="data.cus"
    :employee="data.employee"
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
</style>
