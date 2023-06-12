<script>
import { watch, ref } from "vue";
export default {
  props: {
    item: {
      type: Object,
    },
  },
  setup(props, context) {},
};
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
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6"
              data-target="#personal-info"
            >
              Thông tin cá nhân
            </button>
            <div id="personal-info" class="collapse mx-2">
              <div class="row">
                <div class="col-md-4">Tên:</div>
                <div>{{ item.name }}</div>
              </div>
              <div class="row">
                <div class="col-md-4">Ngày sinh:</div>
                <div>{{ item.birthday }}</div>
              </div>
              <!-- <div class="row">
                <div class="col-md-4">Avatar:</div>
                <div>{{ item.avatar }}</div>
              </div> -->
              <div class="row">
                <div class="col-md-4">Địa chỉ:</div>
                <div>{{ item.address }}</div>
              </div>
              <div class="row">
                <div class="col-md-4">Sđt:</div>
                <div>{{ item.phone }}</div>
              </div>
              <div class="row">
                <div class="col-md-4">Email:</div>
                <div>{{ item.email }}</div>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6"
              data-target="#customer-type"
            >
              Công việc
            </button>
            <div id="customer-type" class="collapse mx-2">
              <div class="row">
                <div class="col-md-4">Chức vụ:</div>
                <div>{{ item.Position.name }}</div>
              </div>
              <div class="row">
                <div class="col-md-4">Trung tâm:</div>
                <div>{{ item.Unit.Department.Center_VNPTHG.name }}</div>
              </div>
              <div class="row">
                <div class="col-md-4">Phòng:</div>
                <div>{{ item.Unit.Department.name }}</div>
              </div>
              <div class="row">
                <div class="col-md-4">Đơn vị:</div>
                <div>{{ item.Unit.name }}</div>
              </div>
            </div>
          </div>

          <!-- <div class="mt-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6"
              data-target="#assignment"
            >
              Danh sách chăm sóc khách hàng
            </button>
            <div id="assignment" class="collapse mx-2">
              Lorem ipsum dolor text....
            </div>
          </div>
          <div class="mt-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6"
              data-target="#event"
            >
              Danh sách sự kiện
            </button>
            <div id="event" class="collapse mx-2">
              Lorem ipsum dolor text....
            </div>
          </div>
          <div class="mt-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6"
              data-target="#habit"
            >
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
