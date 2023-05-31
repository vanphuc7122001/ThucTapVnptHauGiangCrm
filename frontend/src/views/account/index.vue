<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <a
        @click="data.activeMenu = 1"
        :class="[data.activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
        href="./account"
        >Tài Khoản</a
      >
      <a
        @click="data.activeMenu = 2"
        :class="[data.activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        href="./rolelist"
        >Chức Vụ</a
      >
      <a
        @click="data.activeMenu = 3"
        :class="[data.activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
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
          <span id="delete-all" class="mx-2">Xóa Tất Cả</span>
        </button>
        <DeleteAll :items="data.items" />
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#model-addaccount"
        >
          <span id="addaccount" class="mx-2">Thêm</span>
        </button>
        <AddAccount :item="data.itemAdd" @create="create" />
      </div>
    </div>
    <!-- Table{{ data.itemAdd }} -->
    <Table
      :items="setPages"
      :fields="[
        'Họ Tên',
        'Tên Đăng Nhập',
        'Email',
        'Ngày Sinh',
        'Ngày Đăng Ký',
      ]"
      :labels="[
        'fullname',
        'username',
        'email',
        'birthday',
        'registrationdate',
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
  <Edit
    :item="data.editValue"
    :class="[data.activeEdit ? 'show-modal' : 'd-none']"
    @cancel="data.activeEdit = false"
  />
  </div>
</template>
<script>
import Table from "../../components/table/table_duy.vue";
import Pagination from "../../components/table/pagination_duy.vue";
// import Dropdown from "../../components/form/dropdown.vue";
import Select from "../../components/form/select.vue";
import Search from "../../components/form/search.vue";
import DeleteAll from "../../components/form/dlt_all_account.vue";
import AddAccount from "./modal/AddAccount.vue";
import Edit from "./modal/EditAccount.vue";
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
export default {
  components: {
    Table,
    Pagination,
    // Dropdown,
    Select,
    Search,
    AddAccount,
    DeleteAll,
    Edit,
  },
  setup(ctx) {
    const data = reactive({
      items: [
        {
          _id: "1",
          fullname: "Trương Thiết Long",
          username: "ttlong315",
          email: "ttlong315@gmail.com",
          birthday: "20/02/2001",
          registrationdate: "20/05/2023",
        },
        {
          _id: "2",
          fullname: "Trần Tuyết Mỹ",
          username: "meimey113",
          email: "meimei113@gmail.com",
          birthday: "11/03/2002",
          registrationdate: "20/05/2023",
        },
        {
          _id: "3",
          fullname: "Giang Văn Mít",
          username: "janeSmith",
          email: "janesmith@example.com",
          birthday: "15/04/2004",
          registrationdate: "18/05/2023",
        },
        {
          _id: "4",
          fullname: "Nguyễn Thị Vân Anh",
          username: "vanh13",
          email: "vanh@gmail.com",
          birthday: "12/04/2002",
          registrationdate: "21/05/2023",
        },
        {
          _id: "5",
          fullname: "Trần An Đông",
          username: "adong",
          email: "dong@gmail.com",
          birthday: "12/02/2001",
          registrationdate: "21/05/2023",
        },
        {
          _id: "6",
          fullname: "Nguyễn Hải Yến",
          username: "hyen",
          email: "yen@gmail.com",
          birthday: "09/02/2001",
          registrationdate: "21/05/2023",
        },
        {
          _id: "7",
          fullname: "Nguyễn Trung Tín",
          username: "ttin",
          email: "tin@gmail.com",
          birthday: "02/01/2001",
          registrationdate: "21/05/2023",
        },
        {
          _id: "8",
          fullname: "Nguyễn Thị Hương",
          username: "huong.nguyen",
          email: "huong.nguyen@gmail.com",
          birthday: "15/07/1995",
          registrationdate: "10/04/2023",
        },
        {
          _id: "9",
          fullname: "Phạm Văn Đức",
          username: "duc.pham",
          email: "duc.pham@gmail.com",
          birthday: "03/11/1988",
          registrationdate: "05/01/2023",
        },
        {
          _id: "10",
          fullname: "Trần Minh An",
          username: "minhantran",
          email: "minhantran@gmail.com",
          birthday: "27/09/1990",
          registrationdate: "15/03/2023",
        },
        {
          _id: "11",
          fullname: "Lê Thị Kim Anh",
          username: "kimanh.le",
          email: "kimanh.le@gmail.com",
          birthday: "09/12/1985",
          registrationdate: "22/02/2023",
        },
        {
          _id: "12",
          fullname: "Võ Hoàng Nam",
          username: "nam.vo",
          email: "nam.vo@gmail.com",
          birthday: "01/06/1992",
          registrationdate: "19/04/2023",
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
      activeMenu: 1,
      itemAdd: {
        fullname: "",
        username: "",
        email: "",
        birthday: "",
        registrationdate: "",
      },
      activeEdit: false,
      editValue: {
        _id: "",
        fullname: "",
        username: "",
        email: "",
        birthday: "",
        registrationdate: "",
      },
    });

    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.fullname].join("").toLocaleLowerCase();
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
      console.log("view", _id);
      router.push({ name: "AccountList.view", params: { id: _id } });
    };
    return {
      data,
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
#add,
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
