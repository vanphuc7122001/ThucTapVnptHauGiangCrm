<script>
import Table from "../../components/table/table_duy.vue";
import Pagination from "../../components/table/pagination_duy.vue";
import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Search from "../../components/form/search.vue";
import DeleteAll from "../../components/form/delete-all.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
import View from "./view.vue";
import { reactive, computed, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { test } from "../../assets/common.js";
import { toString, _filter } from "../../assets/js/pagination.js";
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
    View
  },
  setup(ctx) {
    const data = reactive({
      items: [
        {
          _id: "1",
          name: "sinh nhật",
          content: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
          duration: "15/5/2023",
        },
        {
          _id: "2",
          name: "sinh nhật",
          content: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
          duration: "15/5/2023",
        },
        {
          _id: "3",
          name: "sinh nhật",
          content: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
          duration: "15/5/2023",
        },
        {
          _id: "4",
          name: "sinh nhật",
          content: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
          duration: "15/5/2023",
        },
        {
          _id: "5",
          name: "sinh nhật",
          content: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
          duration: "15/5/2023",
        },
      ],
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
        duration: "",
      },
      activeEdit: false,
      editValue: {
        _id: "",
        name: "",
        content: "",
        duration: "2023-05-12",
      },
      a: 2,
    });
    const filtered = computed(() => {
      if (!data.searchText) {
        data.totalRow = data.items.length;
        return data.items;
      } else {
        data.totalRow = _filter(data.items, data.searchText).length;
        return _filter(data.items, data.searchText);
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
    const create = () => {
      console.log("creating");
    };
    const update = (item) => {
      console.log("updating", item);
    };
    const deleteOne = (_id) => {
      console.log("deleting", _id);
    };
    const edit = () => {
      console.log("edit");
    };

    const router = useRouter();

    const view = (_id) => {
      console.log("view", _id);
      router.push({ name: "Event.view", params: { id: _id } });
    };

    // watch
    const activeMenu = ref(1);
    watch(activeMenu, (newValue, oldValue) => {
      router.push({ name: "Habit" });
    });

    const test1 = () => {
      console.log("starting");
      data.a = test(data.a);
      console.log(data.a);
    };
    test1();
    return {
      data,
      setPages,
      activeMenu,
      create,
      update,
      deleteOne,
      edit,
      view,
      test1,
    };
  },
};
</script>

<template>
  {{ data.a }}
  <div class="border-box d-flex flex-column ml-2">
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
        <input
          style=""
          class="input px-2 form-group w-100 ml-3"
          type="date"
          name=""
          id=""
        />
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
        <DeleteAll :items="data.items" />
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
      :fields="['Tên', 'Nội dung', 'Thời gian']"
      :labels="['name', 'content', 'duration']"
      @delete="(value) => deleteOne(value)"
      @edit="
        (value, value1) => (
          (data.editValue = value), (data.activeEdit = value1)
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
