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
  },
  setup(ctx) {
    const data = reactive({
      items: [
        {
          _id: 1,
          name: "Dang Van Phuc",
          birthdate: "5/11/2001",
          address: "Dong Thap",
          phone: "039977732",
          email: "phuc@gmail.com",
          type: "VIP",
          avatar:
            "https://i.pinimg.com/736x/ed/80/f7/ed80f704afb25270ea9dac456da6407a.jpg",
          wor_current_workplace: "CTU",
          wor_work_history: "VNPT",
          wor_current_position: "Student",
          wor_work_temp: "2022-2023",
          companyKH: "Cong ty ABC",
        },
        {
          _id: 2,
          name: "Pham Thanh Phong",
          birthdate: "5/11/2001",
          address: "Dong Thap",
          phone: "039977732",
          email: "phuc@gmail.com",
          type: "VIP",
          avatar:
            "https://i.pinimg.com/736x/ed/80/f7/ed80f704afb25270ea9dac456da6407a.jpg",
          wor_current_workplace: "CTU",
          wor_work_history: "VNPT",
          wor_current_position: "Student",
          wor_work_temp: "2022-2023",
          companyKH: "Cong ty ABC",
        },
        {
          _id: 3,
          name: "Nguyen Anh Nam",
          birthdate: "5/11/2001",
          address: "Dong Thap",
          phone: "039977732",
          email: "phuc@gmail.com",
          type: "VIP",
          avatar:
            "https://i.pinimg.com/736x/ed/80/f7/ed80f704afb25270ea9dac456da6407a.jpg",
          wor_current_workplace: "CTU",
          wor_work_history: "VNPT",
          wor_current_position: "Student",
          wor_work_temp: "2022-2023",
          companyKH: "Cong ty ABC",
        },
        {
          _id: 4,
          name: "Le Quoc Thinh",
          birthdate: "5/11/2001",
          address: "Dong Thap",
          phone: "039977732",
          email: "phuc@gmail.com",
          type: "VIP",
          avatar:
            "https://i.pinimg.com/736x/ed/80/f7/ed80f704afb25270ea9dac456da6407a.jpg",
          wor_current_workplace: "CTU",
          wor_work_history: "VNPT",
          wor_current_position: "Student",
          wor_work_temp: "2022-2023",
          companyKH: "Cong ty ABC",
        },
        {
          _id: 5,
          name: "Vo Van Thach",
          birthdate: "5/11/2001",
          address: "Dong Thap",
          phone: "039977732",
          email: "phuc@gmail.com",
          type: "VIP",
          avatar:
            "https://i.pinimg.com/736x/ed/80/f7/ed80f704afb25270ea9dac456da6407a.jpg",
          wor_current_workplace: "CTU",
          wor_work_history: "VNPT",
          wor_current_position: "Student",
          wor_work_temp: "2022-2023",
          companyKH: "Cong ty ABC",
        },
        {
          _id: 6,
          name: "Tran Minh Sang",
          birthdate: "5/11/2001",
          address: "Dong Thap",
          phone: "039977732",
          email: "phuc@gmail.com",
          type: "VIP",
          avatar:
            "https://i.pinimg.com/736x/ed/80/f7/ed80f704afb25270ea9dac456da6407a.jpg",
          wor_current_workplace: "CTU",
          wor_work_history: "VNPT",
          wor_current_position: "Student",
          wor_work_temp: "2022-2023",
          companyKH: "Cong ty ABC",
        },
        {
          _id: 7,
          name: "Nguyen Hoang Trong Tien",
          birthdate: "5/11/2001",
          address: "Dong Thap",
          phone: "039977732",
          email: "phuc@gmail.com",
          type: "VIP",
          avatar:
            "https://i.pinimg.com/736x/ed/80/f7/ed80f704afb25270ea9dac456da6407a.jpg",
          wor_current_workplace: "CTU",
          wor_work_history: "VNPT",
          wor_current_position: "Student",
          wor_work_temp: "2022-2023",
          companyKH: "Cong ty ABC",
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
      router.push({ name: "Event.view", params: { id: _id } });
    };

    // watch
    const activeMenu = ref(1);
    watch(activeMenu, (newValue, oldValue) => {
      router.push({ name: "Customer_Types" });
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
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <!-- <div class="d-flex menu my-3 mx-3 justify-content-end">
      <a
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Khách hàng</a
      >
      <a
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Loại khách hàng</a
      >
    </div> -->
    <!-- Filter -->
    <!-- <div class="border-hr mb-3"></div>s -->
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
      :fields="[
        'Tên',
        'Email',
        'Địa chỉ',
        'Công việc',
        'Công ty',
        'Loại khách hàng',
      ]"
      :labels="[
        'name',
        'email',
        'address',
        'wor_current_position',
        'companyKH',
        'type',
      ]"
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
</style>
