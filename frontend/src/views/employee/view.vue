<script>
import { watch, ref } from "vue";
import Table from "../../components/table/table_employee_task.vue";

export default {
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    Table,
  },
  setup(props, context) {
    const isActive = ref(false);

    const handleActiveCus = () => {
      isActive.value = !isActive.value;
    };
    return {
      isActive,
      handleActiveCus,
    };
  },
};
</script>

<template>
  <div class="modal" id="model-view">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Thông tin chi tiết nhân viên</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#personal-info"
              style="margin-bottom: 0"
              @click="handleActiveCus"
            >
              Thông tin cá nhân
            </button>
            <div v-if="isActive" id="personal-info" class="collapse my-3 border-all">
              <div class="d-flex justify-content-around row mx-3">
                <div class="mt-3 col-6">
                  <p>
                    <span class="font-weight-bold">Họ tên: </span>
                    {{ item.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Ngày sinh: </span>
                    {{ item.birthday }}
                  </p>
                  <p>
                    <span class="font-weight-bold">SĐT: </span>
                    {{ item.phone }}
                  </p>
                </div>
                <div class="mt-3 col-6">
                  <p>
                    <span class="font-weight-bold">Địa chỉ: </span>
                    {{ item.address }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Email: </span>
                    {{ item.email }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <button
              data-toggle="collapse"
              class="py-2 h6 border-none"
              data-target="#customer-type"
              @click="handleActiveCus"
            >
              Công việc
            </button>
            <div v-if="isActive" id="customer-type" class="collapse border-all mt-2 mb-3">
              <div
                class="d-flex justify-content-around align-items-center"
                style="height: 100px"
              >
                <div>
                  <p>
                    <span class="font-weight-bold">Chức vụ: </span>
                    {{ item.Position.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Trung tâm: </span>
                    {{ item.Unit.Department.Center_VNPTHG.name }}
                  </p>
                </div>
                <div>
                  <p>
                    <span class="font-weight-bold">Phòng: </span>
                    {{ item.Unit.Department.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Đơn vị: </span>
                    {{ item.Unit.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <button
              style="margin-bottom: 0px"
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#assignment"
              @click="handleActiveCus"
            >
              Danh sách chăm sóc khách hàng
            </button>
            <div v-if="isActive" id="assignment" class="collapse my-3">
              <div class="table-responsive">
                <Table
                  :items="item.Tasks"
                  :fields="[
                    'Khách hàng',
                    'Bắt đầu',
                    'Kết thúc',
                    'Nội dung chăm sóc',
                    'Chu kỳ',
                    'Trạng thái',
                  ]"
                  :labels="['start_date', 'end_date', 'content']"
                  :borderTableAll="true"
                  :showActionList="[false, false, false]"
                  :activeAction="false"
                  :isActiveCheckbox="false"
                />
              </div>
              <!-- <div v-for="(value, index) in item.Tasks" :key="index">
              <p> Ngày bắt đầu:  {{ value.start_date }}</p>
              <p> Ngày kết thúc: {{ value.end_date }}</p>
              <p> Nội dung: {{ value.content }}</p>
              </div> -->
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
