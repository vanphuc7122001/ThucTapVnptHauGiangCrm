<template>
    <div class="modal" id="model-dlt-all-permission">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title" style="font-size: 15px">Xóa Tất Cả</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>
          <!-- Modal body -->
          <div class="modal-body">
            <div class="d-flex justify-content-between mb-3">
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
                  v-if="data.activeSelectAll == false"
                  type="button"
                  class="btn btn-light"
                  @click="setDeleteAll(true), (data.activeSelectAll = true)"
                >
                  <span id="add" class="mx-2" style="font-size: 15px"
                    >Chọn Tất Cả</span
                  >
                </button>
                <button
                  v-if="data.activeSelectAll == true"
                  type="button"
                  class="btn btn-light"
                  @click="setDeleteAll(false), (data.activeSelectAll = false)"
                >
                  <span id="add" class="mx-2" style="font-size: 15px"
                    >Hủy Chọn</span
                  >
                </button>
                <button
                  type="button"
                  class="btn btn-danger ml-3"
                  data-toggle="modal"
                  data-target=""
                >
                  <span id="add" class="mx-2" style="font-size: 15px"
                    >Xóa Tất Cả</span
                  >
                </button>
              </div>
            </div>
            <Table
              :items="setPages"
              :fields="[
                'Họ Tên',
                'Tên Đăng Nhập',
                'Email',
                'Quyền',
              ]"
              :labels="[
                'fullname',
                'username',
                'email',
                'permission',
              ]"
              :activeAction="`false`"
              :borderTableAll="`true`"
              @update:delete="(value, index) => (setPages[index].delete = value)"
            />
            <Pagination
              :numberOfPages="data.numberOfPages"
              :totalRow="data.totalRow"
              :startRow="data.startRow"
              :endRow="data.endRow"
              :currentPage="data.currentPage"
      @update:currentPage="(value) => (data.currentPage = value)"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import Table from "../table/table-delete-all.vue";
  import Pagination from "../table/pagination_duy.vue";
  import Select from "../form/select.vue";
  import Search from "../form/search.vue";
  
  import { reactive, onMounted, computed } from "vue";
  export default {
    components: {
      Table,
      Select,
      Search,
      Pagination,
    },
    props: {
      items: {
        type: Array,
        default: [],
      },
    },
    setup(props) {
      const data = reactive({
        entryValue: 5,
        numberOfPages: 1,
        totalRow: 0,
        startRow: 0,
        endRow: 0,
        currentPage: 1,
        searchText: "",
        activeSelectAll: false,
      });
  
      // computed
      const toString = computed(() => {
        return props.items.map((value, index) => {
          return [value.fullname].join("").toLocaleLowerCase();
        });
      });
      const filter = computed(() => {
        return props.items.filter((value, index) => {
          return toString.value[index].includes(
            data.searchText.toLocaleLowerCase()
          );
        });
      });
      const filtered = computed(() => {
        if (!data.searchText) {
          data.totalRow = props.items.length;
          return props.items;
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
          data.entryValue = props.items.length;
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
  
      const setDeleteAll = (selectAll = false) => {
        if (props.items.length > 0) {
          for (let value of props.items) {
            if (selectAll == true) {
              value.delete = true;
            } else {
              value.delete = false;
            }
          }
        }
      };
      onMounted(() => {
        setDeleteAll();
      });
      return {
        data,
        setPages,
        setDeleteAll,
      };
    },
  };
  </script>
  <style scoped>
  .btn-light {
    border: 1px solid var(--gray);
  }
  </style>
  