<script>
import {
  Pagination,
  Dropdown,
  Select,
  Search,
  DeleteAll, 
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
  reactive, ref, onBeforeMount,
  Customer_Types,
  alert_success,
  alert_error,
  alert_delete,
  formatDateTime,
} from '../common/import.js'

import Table from '../../components/table/table_customer_types.vue'
import Add from "./add.vue";
import Edit from "./edit.vue";
// import service

import {
  isDeleteCustomer,
  isEditCustomer,
  isReadCustomer,
  isCreateCustomer,
} from '../../use/getSessionItem'


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
  setup(ctx) {

    // declare variables
    let data = reactive({
      items: [],
      activeEdit: false,
      editValue: {
        _id: "",
        name: "",
      },
    });

    const activeMenu = ref(2);

    // get data from emit 
    
    const EditEmit = (dataEdit, isEdit) => {
      data.editValue = dataEdit;
      data.activeEdit = isEdit;
    };


    // method
    const refresh = async () => {
      const res = await http_getAll(Customer_Types);
      data.items = res.documents;
    };


    const handleCreate = async (name) => {
      const res = await http_create(Customer_Types, {name})
      if(res.error) {
        alert_error(`Thêm loại khách hàng`, `${res.msg}`);
      }else{
        alert_success(
          `Thêm loại khách hàng`,
          `Loại khách hàng ${res.document.name} đã thêm vào lúc ${formatDateTime(
            new Date()
          )} đã được tạo thành công.`
        );
        refresh();
      }
    };

    const handleDelete = async (_id) => {
      const res = await http_getOne(Customer_Types, _id);
      const customerType = res.document
      const isConfirmed = await alert_delete(
        `Xoá loại khách hàng`,
        `Bạn có chắc chắn muốn xoá loại khách hàng ${customerType.name} không ?`
      );

      if(isConfirmed) {
        const result = await http_deleteOne(Customer_Types, _id);
        if(result.error) {
          alert_error('Lổi', result.msg)
        }else{
          alert_success(
          `Xoá loại khách hàng`,
          `Bạn đã xoá thành công loại khách hàng ${customerType.name} lúc ${formatDateTime(
            new Date()
          )}.`
        );
        refresh();
        }
        
      }
    };

    const handleUpdate = async (item) => {
      const rs = await http_update(Customer_Types, item._id, {...item})
      const doc = await http_getOne(Customer_Types, item._id);
      console.log(doc.document);
      if(rs.error) {
        alert_error('Sửa loại khách hàng', `${rs.msg}`);
        refresh();
      }else{
        alert_success(
          `Sửa loại khách hàng`,
          `Bạn đã sửa thành công loại khách hàng ${doc.document.name} lúc ${formatDateTime(
            new Date()
          )}.`
        );
        refresh();
      }
    }

    // life cycle
    onBeforeMount(async () => {
      refresh();
    });

    return {
      data,
      activeMenu,
      EditEmit,
      handleDelete,
      handleCreate,
      handleUpdate,
      // phân quyền
      isDeleteCustomer,
      isEditCustomer,
      isReadCustomer,
      isCreateCustomer,
    };
  },
};
</script>

<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link class="size-18"
        to="/customer"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
        >
        <span class="size-18">Khách hàng</span>
      </router-link>
      <router-link
      class="size-18"
        to="/customer_types"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        
        >
        <span class="size-18">
          Loại khách hàng
        </span>
      </router-link>
    </div>
    <!-- Filter -->
    <!-- Search -->
    <div class="border-hr mb-3"></div>
    <div class="d-flex justify-content-between mx-3 mb-3">
      <div class="d-flex justify-content-start">
        <h3>Loại khách hàng</h3>
      </div>
      <div class="d-flex align-items-start">
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#model-add"
          :disabled="isCreateCustomer() ? false: true"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <Add @add="handleCreate" />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="data.items"
      :fields="['Tên']"
      :labels="['name']"
      @delete="handleDelete"
      @edit="EditEmit"
      :showActionList="[false, 
        isEditCustomer() ? true : false
      , 
        isDeleteCustomer() ? true : false
      ]"
      :startRow="1"
    />
    <Edit
      :item="data.editValue"
      @update="handleUpdate"
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
</style>