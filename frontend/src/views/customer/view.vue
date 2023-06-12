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
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#personal-info">
              Thông tin cá nhân
            </button>
            <div id="personal-info" class="collapse mx-2">
              <img :src="item.Customer.avatar" alt="" class="rounded-circle mx-auto d-block border border-dark" height="100">
              <div class="d-flex justify-content-around">
                <div>
                  <p><span class="font-weight-bold">Họ tên: </span> {{ item.Customer.name }}</p>
                  <p><span class="font-weight-bold">Email: </span> {{ item.Customer.email }}</p>
                  <p><span class="font-weight-bold">SDT: </span> {{ item.Customer.phone }}</p>
                </div>
                <div>
                  <p><span class="font-weight-bold">Ngày sinh: </span> {{ item.Customer.birthday }}</p>
                  <p><span class="font-weight-bold">Địa chỉ: </span> {{ item.Customer.address }}</p>
                  <p><span class="font-weight-bold">Loại: </span> {{ item.Customer_Type.name }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#customer-type">
              Loại khách hàng
            </button>
            <div id="customer-type" class="collapse mx-2">
              Lorem ipsum dolor text....
              {{ item.Customer_Type.name }}
            </div>
          </div> -->
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#customer-work">
              Công việc
            </button>
            <div id="customer-work" class="collapse mx-2">
              <div class="d-flex justify-content-around">
                <div>
                  <p><span class="font-weight-bold">Công việc hiện tại: </span> {{ item.current_workplace }}</p>
                  <p><span class="font-weight-bold">Vị trí hiện tại: </span> {{ item.current_position }}</p>
                </div>
                <div>
                  <p><span class="font-weight-bold">Nhiệm kỳ: </span> {{ item.work_temp }}</p>
                  <p><span class="font-weight-bold">Lịch sử làm việc: </span> {{ item.work_history }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#assignment">
              Danh sách chăm sóc khách hàng
            </button>
            <div id="assignment" class="collapse mx-2">
              <div v-for="(value, index) in item.Tasks" :key="index">
              <p> Ngày bắt đầu:  {{ value.start_date }}</p>
              <p> Ngày kết thúc: {{ value.end_date }}</p>
              <p> Nội dung: {{ value.content }}</p>
              </div>
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#event">
              Danh sách sự kiện
            </button>
            <div id="event" class="collapse mx-2">
              
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#habit">
              Danh sách thói quen khách hàng
            </button>
            <div id="habit" class="collapse mx-2">
              <div v-for="(value, index) in item.Habits" :key="index">
                <p class="text-center">
                {{ value.name }}
                </p>
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
  }
</style>



