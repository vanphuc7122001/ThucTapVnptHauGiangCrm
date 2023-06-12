<script>
export default {
  props: {
    viewValue: {
      type: Object,
      default: {},
    }
  },
  setup(ctx) {
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
              Thông tin phân công
            </button>
            <div id="personal-info" class="collapse mx-2">
               <ul style="font-size:16px">
                  <li>Khách hàng: {{ viewValue.Customer.name }}</li>
                  <li>Nhân viên phụ trách: {{ viewValue.Employee.name }}</li>
                  <li>Ngày bắt đầu: {{ viewValue.start_date }}</li>
                  <li>Ngày kết thúc: {{ viewValue.end_date }}</li>
                  <li>Chu kỳ chăm sóc: {{ viewValue.Cycle.name }}</li>
                  <li>Nội dung chăm sóc: {{ viewValue.content }}</li>
                  <li>Trạng thái: {{ viewValue.Status_Task.status }}</li>
                  <li>Nội dung trạng thái: {{ viewValue.Status_Task.reason }}</li>
               </ul>
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#customer-type">
              Thông tin khách hàng
            </button>
            <div id="customer-type" class="collapse mx-2">
              <ul style="font-size:16px">
                  <li>Khách hàng: {{ viewValue.Customer.name }}</li>
                  <li>Ngày sinh: {{ viewValue.Customer.birthday }}</li>
                  <li>Avatar: {{ viewValue.Customer.avatar }}</li>
                  <li>Địa chỉ: {{ viewValue.Customer.address }}</li>
                  <li>Số điện thoại: {{ viewValue.Customer.phone }}</li>
                  <li>Email: {{ viewValue.Customer.email }}</li>
               </ul>
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#customer-work">
              Nhân viên phụ trách
            </button>
            <div id="customer-work" class="collapse mx-2">
              <ul style="font-size:16px">
                  <li>Nhân viên: {{ viewValue.Employee.name }}</li>
                  <li>Ngày sinh: {{ viewValue.Employee.birthday }}</li>
                  <li>Địa chỉ: {{ viewValue.Employee.address }}</li>
                  <li>Số điện thoại: {{ viewValue.Employee.phone }}</li>
                  <li>Email: {{ viewValue.Employee.email }}</li>
               </ul>
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#assignment">
              Chi tiết lịch hẹn
            </button>
            <div id="assignment" class="collapse mx-2">
              Cập nhật sau
              <!-- <ul v-for="(item, index) in viewValue.Appoitment " style="font-size:16px">
                  <h2>{{ index + 1 }}</h2>
                  <li>Ngày hẹn: {{ item.date_time }}</li>
                  <li>Nội dung: {{ item.content }}</li>
               </ul> -->
            </div>
          </div>
          <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#event">
              Feeback
            </button>
            <div id="event" class="collapse mx-2">
              Cập nhật sau
            </div>
          </div>
          <!-- <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6" data-target="#habit">
              Danh sách thói quen khách hàng
            </button>
            <div id="habit" class="collapse mx-2">
              Lorem ipsum dolor text....
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
