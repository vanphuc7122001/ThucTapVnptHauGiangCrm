<script>
import Table from "../../components/table/table_duy.vue";
import Pagination from "../../components/table/pagination_duy.vue";
import { reactive, computed } from "vue";
export default {
  components: {
    Table,
    Pagination,
  },
  setup(ctx) {
    const data = reactive({
      items: [
        {
          name: "Tran Tuan Duy",
          birthday: "xx/xx/2001",
          address: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        {
          name: "Nguyen Lan Anh",
          birthday: "xx/xx/2001",
          address: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        {
          name: "Nguyen Thi Thanh Truc",
          birthday: "xx/xx/2001",
          address: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        {
          name: "Nguyen Ngoc Van Anh",
          birthday: "xx/xx/2001",
          address: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        {
          name: "Truong Thiet Long",
          birthday: "xx/xx/2001",
          address: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        {
          name: "Dang Van Phuc",
          birthday: "xx/xx/2001",
          address: "abc, def, xxxxxxxxxxxxxxxxxxxxxxxxx",
        },
      ],
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeMenu: 1,
    });

    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.name].join("");
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
      if (setNumberOfPages.value == 0) data.numberOfPages = 1;
      else data.numberOfPages = setNumberOfPages.value;
      data.startRow = (data.currentPage - 1) * data.entryValue + 1;
      data.endRow = data.currentPage * data.entryValue;
      console.log(data);
      return filtered.value.filter((item, index) => {
        return (
          index + 1 > (data.currentPage - 1) * data.entryValue &&
          index + 1 <= data.currentPage * data.entryValue
        );
      });
    });
    return {
      data,
      setPages,
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <a @click="data.activeMenu = 1" :class="[data.activeMenu == 1 ? 'active-menu' : 'none-active-menu']" href="#">Event</a>
      <a @click="data.activeMenu = 2" :class="[data.activeMenu == 2 ? 'active-menu' : 'none-active-menu']" href="#">Habit</a>
    </div>
    <Table
      :items="setPages"
      :fields="['Name', 'Birthday', 'Address']"
      :labels="['name', 'birthday', 'address']"
    />
    <Pagination
      :numberOfPages="data.numberOfPages"
      :totalRow="data.totalRow"
      :startRow="data.startRow"
      :endRow="data.endRow"
      v-model:currentPage="data.currentPage"
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
</style>
