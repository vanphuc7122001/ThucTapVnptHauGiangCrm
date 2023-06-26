<script>
import { ref } from 'vue'
import Table from '../../../../components/table/table_customer_types.vue'
import { formatDate } from '../../../common/import'
export default {
  components: {
    Table
  },
  props: {
    item: {
      type: Object
    }
    ,
    itemViewCareCus: {
      type: Array
    }
  },
  setup(props, context) {

    const isActive = ref(false)

    const handleActiveCus = () => {
      isActive.value = !isActive.value
    }
    
    return {
      isActive,
      handleActiveCus,
      formatDate
    }
  }
}
</script>


<template>
  <div class="modal" id="model-view">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Thông tin chi tiết nhân viên</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#employee"
              @click="handleActiveCus">
              Thông tin nhân viên 
            </button>
            <div v-if="isActive" id="employee" class="collapse mt-2" style="border: 1px solid #ccc; border-radius: 3px;">
              <div class="d-flex justify-content-around">
                <div class="mt-3">
                  <p>
                    <span class="font-weight-bold">Họ tên nhân viên:  </span> {{ item.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Ngày sinh: </span> {{ formatDate(item.birthday) }}
                  </p>
                  <p> 
                    <span class="font-weight-bold">Số điện thoại:  </span> {{ item.phone }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Địa chỉ: </span>  {{ item.address }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Email: </span> {{ item.email }}
                  </p>
                </div>
                <div class="mt-3">
                  <p>
                    <span class="font-weight-bold">Chức vụ: </span>  {{ item.Position.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Đơn vị: </span>   {{ item.Unit.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Phòng: </span>  {{ item.Unit.Department.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Trung tâm: </span>  {{ item.Unit.Department.Center.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .border-none {
    outline: none;
    border: none;
  }

  .border-all {
    border: 1px solid #ccc;
    border-radius: 5px;
  }
</style>