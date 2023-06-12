<template>
  <div class="row mx-2 justify-content-around">
    <!-- customer -->
    <div class="col-6 mb-4" @click="chartName('customer')">
      <div
        class="card border-left-primary shadow h-100 py-2"
        :class="{ 'box-active': name == 'customer' }"
      >
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-primary text-uppercase mb-1"
              >
                Khách hàng
              </div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">1000</div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined">groups</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff -->
    <!-- <div class="col-xl-3 col-md-6 col-6 mb-4" @click="showchart = 'staff'">
            <div
              class="card border-left-success shadow h-100 py-2"
              :class="{ 'box-active': showchart == 'staff' }"
            >
              <div class="card-body">
                <div class="row no-gutters align-items-center">
                  <div class="col mr-2">
                    <div
                      class="text-xs font-weight-bold text-success text-uppercase mb-1"
                    >
                      Nhân viên
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">20</div>
                  </div>
                  <div class="col-auto">
                    <span class="material-symbols-outlined">support_agent</span>
                  </div>
                </div>
              </div>
            </div>
          </div> -->

    <!-- Appointment -->
    <div class="col-6 mb-4" @click="chartName('appointment')">
      <div
        class="card border-left-info shadow h-100 py-2"
        :class="{ 'box-active': name == 'appointment' }"
      >
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-info text-uppercase mb-1"
              >
                Lịch hẹn
              </div>
              <div class="row no-gutters align-items-center">
                <div class="col-auto">
                  <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                    50%
                  </div>
                </div>
                <div class="col">
                  <!-- Thanh trạng thái % -->
                  <div class="progress progress-sm mr-2">
                    <div
                      class="progress-bar bg-info"
                      role="progressbar"
                      style="width: 50%"
                      aria-valuenow="50"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-auto">
              <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request -->
    <!-- <div class="col-xl-3 col-md-6 col-6 mb-4">
            <div class="card border-left-warning shadow h-100 py-2">
              <div class="card-body">
                <div class="row no-gutters align-items-center">
                  <div class="col mr-2">
                    <div
                      class="text-xs font-weight-bold text-warning text-uppercase mb-1"
                    >
                      Pending Requests
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">18</div>
                  </div>
                  <div class="col-auto">
                    <i class="fas fa-comments fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
  </div>
</template>
<script>
import { onMounted, ref } from "vue";
export default {
  name: "Box",
  props: ["showchart"],
  setup(props, ctx) {
    const name = ref();
    const chartName = (data) => {
      name.value = data;
      ctx.emit("Chart", data);
    };
    onMounted(() => {
      name.value = props.showchart;
    });
    return { chartName, name };
  },
};
</script>
<style>
.box-active {
  background: #fdf3f4;
}
</style>
