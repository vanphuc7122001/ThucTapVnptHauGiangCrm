<template>
  <div class="row mx-2 justify-content-around">
    <!-- customer -->
    <div class="col-md-4 col-12 mb-4" @click="chartName('customer')">
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
              <div class="h5 mb-0 font-weight-bold text-gray-800">
                {{ customer }}
              </div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined">groups</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment -->
    <div class="col-md-4 col-12 mb-4" @click="chartName('appointment')">
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
                Trạng thái chăm sóc
              </div>
              <div class="row no-gutters align-items-center">
                <div class="col-auto">
                  <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                    {{ progress }}%
                  </div>
                </div>
                <div class="col">
                  <!-- Thanh trạng thái % -->
                  <div class="progress progress-sm mr-2">
                    <div
                      class="progress-bar bg-info"
                      role="progressbar"
                      :style="`width: ${progress}%`"
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
    <!-- customer care cycle-->
    <div class="col-md-4 col-12 mb-4" @click="chartName('customerCycle')">
      <div
        class="card border-left-success shadow h-100 py-2"
        :class="{ 'box-active': showchart == 'customerCycle' }"
      >
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-success text-uppercase mb-1"
              >
                Khách hàng gần tới chu kỳ chăm sóc
              </div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">
                {{ customerCare }}
              </div>
            </div>
            <div class="col-auto">
              <span class="material-symbols-outlined">support_agent</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request -->
    <!-- <div
      class="col-xl-3 col-md-6 col-6 mb-4"
      @click="chartName('customeCycle')"
    >
      <div class="card border-left-warning shadow h-100 py-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-warning text-uppercase mb-1"
              >
                Khách hàng chưa chăm sóc
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
  props: ["showchart", "customer", "progress", "customerCare"],
  setup(props, ctx) {
    const name = ref();
    const customer = ref(0);
    const prog = ref(0);

    prog.value = props.progress;
    const chartName = (data) => {
      name.value = data;
      ctx.emit("Chart", data);
    };
    onMounted(() => {
      name.value = props.showchart;
    });
    return { chartName, name, prog };
  },
};
</script>
<style>
.box-active {
  border: 2px solid #17a2b8;
}
.card {
  background-color: var(--light);
}
</style>
