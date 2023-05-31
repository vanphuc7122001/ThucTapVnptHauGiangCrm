<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <a
        @click="Data.activeMenu = 1"
        :class="[Data.activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
        href="./account"
        >Tài Khoản</a
      >
      <a
        @click="Data.activeMenu = 2"
        :class="[Data.activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        href="./rolelist"
        >Chức vụ</a
      >
      <a
        @click="Data.activeMenu = 3"
        :class="[Data.activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
        href="./permissionlist"
        >Phân Quyền</a
      >
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
            {
              name: 'All',
              value: 'All',
            },
          ]"
          @update:entryValue="(value) => (Data.entryValue = value)"
          :entryValue="Data.entryValue"
        />
        <Search
          class="ml-3"
          style="width: 300px"
          @update:searchText="(value) => (Data.searchText = value)"
        />
      </div>
      <div class="d-flex align-items-start">
        <button
          type="button"
          class="btn btn-danger mr-3"
          data-toggle="modal"
          data-target="#model-dlt-all-role"
        >
          <span id="delete-all" class="mx-2">Xóa Tất Cả</span>
        </button>
        <DeleteAllRole :items="Data.items" />
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#modal-addrole"
        >
          <span id="addrole" class="mx-2">Thêm</span>
        </button>
        <AddRole :item="Data.itemAdd" @create="create" />
      </div>
    </div>
    <!-- {{ Data.itemAdd }} -->
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Họ Tên',
        'Tên Đăng Nhập',
        'Email',
        'Chức Vụ',
      ]"
      :labels="[
        'fullname',
        'username',
        'email',
        'role',
      ]"
      @delete="(value) => deleteOne(value)"
      @edit="
        (value, value1) => (
          (Data.editValue = value), (Data.activeEdit = value1)
        )
      "
      @view="(value) => view(value)"
    />
    <!-- Pagination -->
    <Pagination
      :numberOfPages="Data.numberOfPages"
      :totalRow="Data.totalRow"
      :startRow="Data.startRow"
      :endRow="Data.endRow"
      :currentPage="Data.currentPage"
      @update:currentPage="(value) => Data.currentPage = value"
      class="mx-3"
    />
  <EditRole
    :item="Data.editValue"
    :class="[Data.activeEdit ? 'show-modal' : 'd-none']"
    @cancel="Data.activeEdit = false"
  />
  </div>
</template>

<script>
import Table from "../../components/table/table_duy.vue";
import Pagination from "../../components/table/pagination_duy.vue";
// import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Search from "../../components/form/search.vue";
import DeleteAllRole from "../../components/form/dlt_all_role.vue";
import AddRole from "./modal/AddRole.vue"
import EditRole from "./modal/EditRole.vue"
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
export default {
  components: {
    Table,
    Pagination,
    // Dropdown,
    Select,
    Search,
    AddRole,
    DeleteAllRole,
    EditRole
  },
  setup(ctx) {
    const Data = reactive({
      items: [
        {
          _id: "1",
          fullname: "Trương Thiết Long",
          username: "ttlong315",
          email: "ttlong315@gmail.com",
          role: "Admin",
        },
        {
          _id: "2",
          fullname: "Trần Tuyết Mỹ",
          username: "meimey113",
          email: "meimei113@gmail.com",
          role: "Admin",
        },
        {
          _id: "3",
          fullname: "Giang Văn Mít",
          username: "janeSmith",
          email: "janesmith@example.com",
          role: "abcdefg",
        },
        {
          _id: "4",
          fullname: "Nguyễn Thị Vân Anh",
          username: "vanh13",
          email: "vanh@gmail.com",
          role: "abcdefg",
        },
        {
          _id: "5",
          fullname: "Trần An Đông",
          username: "adong",
          email: "dong@gmail.com",
          role: "abcdefg",
        },
        {
          _id: "6",
          fullname: "Nguyễn Hải Yến",
          username: "hyen",
          email: "yen@gmail.com",
          role: "abcdefg",
        },
        {
          _id: "7",
          fullname: "Nguyễn Trung Tín",
          username: "ttin",
          email: "tin@gmail.com",
          role: "abcdefg",
        },
        {
          _id: "8",
          fullname: "Nguyễn Thị Hương",
          username: "huong.nguyen",
          email: "huong.nguyen@gmail.com",
          role: "abcdefg",
        },
        {
          _id: "9",
          fullname: "Phạm Văn Đức",
          username: "duc.pham",
          email: "duc.pham@gmail.com",
          role: "abcdefg",
        },
        {
          _id: "10",
          fullname: "Trần Minh An",
          username: "minhantran",
          email: "minhantran@gmail.com",
          role: "abcdefg",
        },
        {
          _id: "11",
          fullname: "Lê Thị Kim Anh",
          username: "kimanh.le",
          email: "kimanh.le@gmail.com",
          role: "abcdefg",
        },
        {
          _id: "12",
          fullname: "Võ Hoàng Nam",
          username: "nam.vo",
          email: "nam.vo@gmail.com",
          role: "abcdefg",
        },
        // Add more items as needed
      ],
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeMenu: 2,
      itemAdd: {
        fullname: "",
        username: "",
        email: "",
        role: "",
      },
      activeEdit: false,
      editValue: {
        _id: "",
        fullname: "",
        username: "",
        email: "",
        role: "",
      },

    });
    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return Data.items.map((value, index) => {
        return [value.fullname].join("").toLocaleLowerCase();
      });
    });
    const filter = computed(() => {
      return Data.items.filter((value, index) => {
        return toString.value[index].includes(
          Data.searchText.toLocaleLowerCase()
        );
      });
    });
    const filtered = computed(() => {
      if (!Data.searchText) {
        Data.totalRow = Data.items.length;
        return Data.items;
      } else {
        Data.totalRow = filter.value.length;
        return filter.value;
      }
    });
    const setNumberOfPages = computed(() => {
      return Math.ceil(filtered.value.length / Data.entryValue);
    });
    const setPages = computed(() => {
      if (setNumberOfPages.value == 0 || Data.entryValue == "All") {
        Data.entryValue = Data.items.length;
        Data.numberOfPages = 1;
      } else Data.numberOfPages = setNumberOfPages.value;
      Data.startRow = (Data.currentPage - 1) * Data.entryValue + 1;
      Data.endRow = Data.currentPage * Data.entryValue;
      console.log(Data);
      return filtered.value.filter((item, index) => {
        return (
          index + 1 > (Data.currentPage - 1) * Data.entryValue &&
          index + 1 <= Data.currentPage * Data.entryValue
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
      router.push({ name: "RoleList.view", params: { id: _id } });
    };
    return {
      Data,
      setPages,
      create,
      update,
      deleteOne,
      edit,
      view,
    };
  },
};
</script>

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
#addrole,
#delete-all {
  font-size: 14px;
}
.show-modal {
  display: block;
  opacity: 1;
  background-color: var(--dark);
  /* pointer-events: auto; */
  z-index: 1;
}
</style>
