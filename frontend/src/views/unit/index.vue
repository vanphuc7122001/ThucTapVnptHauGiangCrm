<script>
import Table from "./form_table/table_lananh.vue";
import Pagination from "./form_table/pagination_lananh.vue";
import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Search from "../../components/form/search.vue";
import DeleteAll from "./form_table/delete-all-level.vue";
import Add from "./form_table/add_update_level.vue";
import Form from "./form_table/formLevel.vue";
import showSwal from "./use/showSwal";
import { reactive, computed } from "vue";
import Swal from "./use/showSwal";
import swal from "sweetalert2";
export default {
  components: {
    Table,
    Pagination,
    Dropdown,
    Select,
    Search,
    Add,
    DeleteAll,
    Form,
  },
  setup(ctx) {
    const data = reactive({
      items: [
        { lev_id: 1, lev_name: "Tổng công ty VNPT " },
        { lev_id: 2, lev_name: "Phòng" },
        { lev_id: 3, lev_name: "Tổng công ty VNPT " },
        { lev_id: 4, lev_name: "Phòng" },
        { lev_id: 5, lev_name: "Tổng công ty VNPT " },
        { lev_id: 6, lev_name: "Tổng công ty VNPT " },
      ],
      entryValue: 2,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeMenu: 1,
      activeSelectAll: false,
    });
    const newData = reactive({
      lev_id: "",
      lev_name: "",
      lev: "",
    });
    const { showSuccess } = Swal();
    // computed
    const toString = computed(() => {
  
      return data.items.map((value, index) => {
        return [value.lev_name].join("").toLocaleLowerCase();
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
      // console.log(data);
      return filtered.value.filter((item, index) => {
        return (
          index + 1 > (data.currentPage - 1) * data.entryValue &&
          index + 1 <= data.currentPage * data.entryValue
        );
      });
    });

    const getLevel = async (value_id) => {
      document.getElementById("model-add").style.display = "block";
      newData.lev_id = value_id;
      newData.lev = "update";
    };
    const emptyNewData = () => {
      newData["lev_id"] = "";
      newData["lev_name"] = "";
      newData["lev"] = "";
    };
    const addOrUpdateLevel = () => {
      if (newData.lev == "update") {
   
        emptyNewData();
        document.getElementById("model-add").style.display = "none";
        showSuccess();
      } else {
       
        data.items.push({ lev_id: 8, lev_name: newData.lev_name });
        emptyNewData();
        showSuccess();
      }
    };
    const onDelete = (data) => {
      swal
        .fire({
          title: "Do you want to delete the level?",
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Delete",
          confirmButtonColor: "#cc0000",
        })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
          
            swal.fire("Deleted!", "", "success");
          }
        });
    };
    const detail = (data) => {
      // console.log("detail", data);
    };
    return {
      data,
      setPages,
      newData,
      addOrUpdateLevel,
      getLevel,
      onDelete,
      detail,
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->

    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <a
        @click="data.activeMenu = 1"
        :class="[data.activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
        href="#"
        >Cấp</a
      >

      <router-link
        :to="{ name: 'Unit' }"
        @click="data.activeMenu = 2"
        :class="[data.activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        >Đơn vị</router-link
      >
    </div>
    <!-- Filter -->
    <!-- Search -->
    <div class="border-hr mb-3"></div>
    <div class="d-flex justify-content-between mx-3 mb-3 row">
      <div class="d-flex justify-content-start col-5">
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
      <div class="d-flex align-items-start col-6 row justify-content-end">
        <button
          type="button"
          class="btn btn-danger mr-3"
          data-toggle="modal"
          data-target="#model-delete-all"
        >
          <span id="delete-all" class="mx-2">Xóa tất cả</span>
        </button>
        <DeleteAll :items="data.items" />
        <!-- Modal -->
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#model-add"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>

        <Add :newData="newData" @addorupdate="addOrUpdateLevel()" />
      </div>
    </div>
    <!-- Table -->
    <!-- @update="getLevel" -->
    <Table
      :items="setPages"
      :fields="['Mã cấp', 'Tên cấp']"
      :labels="['lev_id', 'lev_name']"
      @update="getLevel"
      @onDelete="onDelete"
      @detail="detail"
      :name_id="'lev_id'"
    />

    <!-- Pagination -->
    <Pagination
      :numberOfPages="data.numberOfPages"
      :totalRow="data.totalRow"
      :startRow="data.startRow"
      :endRow="data.endRow"
      @updateCurrentPage="(value) => (data.currentPage = value)"
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
@media screen and (max-width: 739px) {
  .mrt-2 {
    margin-top: 8px;
  }
}
</style>
