<script>
export default {
  props: {
    item: {
      type: Object
    }
  },
  setup(props, context) {

  }
}
</script>


<template>
  <div class="modal" id="model-view">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Thông tin chi tiết khách hàng</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#personal-info">
              Thông tin cá nhân
            </button>
            <div id="personal-info" class="collapse mx-2">
              Lorem ipsum dolor text....
              {{ item.Customer.name }}
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#customer-type">
              Loại khách hàng
            </button>
            <div id="customer-type" class="collapse mx-2">
              Lorem ipsum dolor text....
              {{ item.Customer_Type.name }}
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#customer-work">
              Công việc
            </button>
            <div id="customer-work" class="collapse mx-2">
              Lorem ipsum dolor text....
              {{ item.current_workplace }}
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#assignment">
              Danh sách chăm sóc khách hàng
            </button>
            <div id="assignment" class="collapse mx-2">
              Nửa join bảng task thêm sau
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#event">
              Danh sách sự kiện
            </button>
            <div id="event" class="collapse mx-2">
              Lorem ipsum dolor text.... 
              <div v-for="(value, index) in item.Events" :key="index">
                {{ value.name }}
              </div>
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#habit">
              Danh sách thói quen khách hàng
            </button>
            <div id="habit" class="collapse mx-2">
              Lorem ipsum dolor text....
              <div v-for="(value, index) in item.Habits" :key="index">
                {{ value.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>




